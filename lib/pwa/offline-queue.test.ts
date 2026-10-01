import { readFileSync } from "node:fs"
import { join } from "node:path"
import vm from "node:vm"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { MAX_SYNC_ATTEMPTS } from "./offline-queue"

/** Just enough of IndexedDB for the queue: one database, one store, requests that resolve async. */
function installFakeIndexedDb(options: { storeExists: boolean }) {
  const rows = new Map<string, Record<string, unknown>>()
  const opened: { name: string; version: number | undefined }[] = []
  let storeExists = options.storeExists

  const done = <T,>(request: Record<string, unknown>, result: T) => {
    queueMicrotask(() => {
      request["result"] = result
      ;(request["onsuccess"] as (() => void) | undefined)?.()
    })
    return request
  }

  const db = {
    objectStoreNames: { contains: () => storeExists },
    close: vi.fn(),
    onversionchange: null as null | (() => void),
    createObjectStore: () => {
      storeExists = true
      return { createIndex: () => undefined }
    },
    transaction: () => {
      const tx: Record<string, unknown> = {}
      tx["objectStore"] = () => ({
        put: (item: { id: string }) => {
          rows.set(item.id, item as unknown as Record<string, unknown>)
          queueMicrotask(() => (tx["oncomplete"] as (() => void) | undefined)?.())
        },
        delete: (id: string) => {
          rows.delete(id)
          queueMicrotask(() => (tx["oncomplete"] as (() => void) | undefined)?.())
        },
        getAll: () => done({}, [...rows.values()]),
      })
      return tx
    },
  }

  vi.stubGlobal("indexedDB", {
    open: (name: string, version?: number) => {
      opened.push({ name, version })
      const request: Record<string, unknown> = { result: db }
      queueMicrotask(() => {
        if (!storeExists) (request["onupgradeneeded"] as (() => void) | undefined)?.()
        ;(request["onsuccess"] as (() => void) | undefined)?.()
      })
      return request
    },
  })
  return { rows, opened, db }
}

describe("offline queue", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it("creates the store when it upgrades a database an older build left empty", async () => {
    const fake = installFakeIndexedDb({ storeExists: false })
    const { enqueueSyncItem, getQueuedSyncItems } = await import("./offline-queue")
    await enqueueSyncItem("propertyInquiry", "/api/leads/contact", { a: 1 })
    expect(fake.rows.size).toBe(1)
    expect(await getQueuedSyncItems()).toHaveLength(1)
    // Version 2 is what makes the browser run the upgrade on an existing version-1 database.
    expect(fake.opened.every((o) => o.name === "ondo-pwa-db" && o.version === 2)).toBe(true)
  })

  it("refuses to use a database that still has no store, instead of throwing deep in a transaction", async () => {
    const fake = installFakeIndexedDb({ storeExists: true })
    fake.db.objectStoreNames.contains = () => false
    fake.db.createObjectStore = () => ({ createIndex: () => undefined })
    const { enqueueSyncItem } = await import("./offline-queue")
    await expect(enqueueSyncItem("propertyInquiry", "/api/leads/contact", {})).rejects.toThrow(/unavailable/)
    expect(fake.db.close).toHaveBeenCalled()
  })

  describe("flushQueueNow", () => {
    async function flushWith(statuses: number[]) {
      const fake = installFakeIndexedDb({ storeExists: true })
      const { enqueueSyncItem, flushQueueNow } = await import("./offline-queue")
      for (const [index] of statuses.entries()) {
        await enqueueSyncItem("propertyInquiry", "/api/leads/contact", { index })
      }
      const fetchMock = vi.fn()
      for (const status of statuses) fetchMock.mockResolvedValueOnce({ ok: status < 300, status })
      vi.stubGlobal("fetch", fetchMock)
      await flushQueueNow()
      return { fake, fetchMock }
    }

    it("removes sent items and posts to the Edge API path without a doubled /api", async () => {
      const { fake, fetchMock } = await flushWith([200])
      expect(fake.rows.size).toBe(0)
      expect(fetchMock.mock.calls[0]![0]).toBe("http://localhost:3030/api/leads/contact")
    })

    it("drops an item the API rejects for good, so it is not retried forever", async () => {
      const { fake } = await flushWith([400])
      expect(fake.rows.size).toBe(0)
    })

    it("stores the resolved URL at enqueue time and replays it with credentials", async () => {
      const { fake, fetchMock } = await flushWith([200])
      expect(fake.rows.size).toBe(0)
      expect(fetchMock.mock.calls[0]![1]).toMatchObject({ credentials: "include" })
      const { enqueueSyncItem } = await import("./offline-queue")
      const item = await enqueueSyncItem("propertyInquiry", "/api/leads/contact", {})
      expect(item.url).toBe("http://localhost:3030/api/leads/contact")
    })

    it("sends the CSRF token cookie as a header", async () => {
      document.cookie = "ondo_csrf=tok%20en"
      const { fetchMock } = await flushWith([200])
      expect(fetchMock.mock.calls[0]![1].headers).toMatchObject({ "x-csrf-token": "tok en" })
      document.cookie = "ondo_csrf=; max-age=0"
    })

    it("drops an item after too many retryable failures", async () => {
      const fake = installFakeIndexedDb({ storeExists: true })
      const { enqueueSyncItem, flushQueueNow, MAX_SYNC_ATTEMPTS } = await import("./offline-queue")
      await enqueueSyncItem("propertyInquiry", "/api/leads/contact", {})
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }))
      for (let i = 1; i < MAX_SYNC_ATTEMPTS; i++) {
        await flushQueueNow()
        expect(fake.rows.size).toBe(1)
      }
      await flushQueueNow()
      expect(fake.rows.size).toBe(0)
    })

    it("keeps an item after a server error or rate limit for the next flush", async () => {
      expect((await flushWith([503])).fake.rows.size).toBe(1)
      vi.resetModules()
      expect((await flushWith([429])).fake.rows.size).toBe(1)
    })
  })

  describe("public/sw.js", () => {
    const sw = readFileSync(join(__dirname, "..", "..", "public", "sw.js"), "utf8")
    const queue = readFileSync(join(__dirname, "offline-queue.ts"), "utf8")
    const version = (source: string) => /const DB_VERSION = (\d+)/.exec(source)?.[1]

    it("opens the same database version as the page", () => {
      expect(version(sw)).toBeDefined()
      expect(version(sw)).toBe(version(queue))
    })

    it("keeps the attempt cap in step with the page", () => {
      expect(/const MAX_SYNC_ATTEMPTS = (\d+)/.exec(sw)?.[1]).toBe(String(MAX_SYNC_ATTEMPTS))
    })

    describe("background sync replay", () => {
      /** Run sw.js in a stubbed worker scope, fire a sync event and return what it fetched. */
      async function runSync(item: Record<string, unknown>, response: { ok: boolean; status: number }, cookie?: string) {
        const rows = new Map<string, Record<string, unknown>>([[item["id"] as string, item]])
        const listeners: Record<string, (event: unknown) => void> = {}
        const fetchMock = vi.fn().mockResolvedValue(response)
        const request = (result: unknown) => {
          const r: Record<string, unknown> = {}
          queueMicrotask(() => {
            r["result"] = result
            ;(r["onsuccess"] as () => void)()
          })
          return r
        }
        const db = {
          objectStoreNames: { contains: () => true },
          close: () => undefined,
          transaction: () => {
            const tx: Record<string, unknown> = {}
            const done = () => queueMicrotask(() => (tx["oncomplete"] as () => void)())
            tx["objectStore"] = () => ({
              getAll: () => request([...rows.values()]),
              put: (row: { id: string }) => {
                rows.set(row.id, row)
                done()
              },
              delete: (id: string) => {
                rows.delete(id)
                done()
              },
            })
            return tx
          },
        }
        const scope: Record<string, unknown> = {
          addEventListener: (name: string, fn: (event: unknown) => void) => {
            listeners[name] = fn
          },
          indexedDB: {
            open: () => {
              const r: Record<string, unknown> = { result: db }
              queueMicrotask(() => (r["onsuccess"] as () => void)())
              return r
            },
          },
          cookieStore: { get: async () => (cookie ? { value: cookie } : null) },
          fetch: fetchMock,
          caches: {},
          clients: {},
          registration: {},
          location: { origin: "https://ondorealestate.com" },
        }
        scope["self"] = scope
        vm.runInNewContext(sw, scope)
        let pending: Promise<unknown> = Promise.resolve()
        listeners["sync"]!({ tag: item["type"], waitUntil: (p: Promise<unknown>) => (pending = p) })
        await pending
        return { rows, fetchMock }
      }
      const queued = (extra: Record<string, unknown> = {}) => ({
        id: "propertyInquiry-1",
        type: "propertyInquiry",
        endpoint: "/api/leads/contact",
        payload: { a: 1 },
        createdAt: "2026-09-30T00:00:00.000Z",
        ...extra,
      })

      it("posts to the URL stored at enqueue time, with credentials and the CSRF header", async () => {
        const { rows, fetchMock } = await runSync(queued({ url: "https://api.example.test/leads/contact" }), { ok: true, status: 200 }, "abc")
        expect(fetchMock).toHaveBeenCalledWith(
          "https://api.example.test/leads/contact",
          expect.objectContaining({ credentials: "include", headers: { "Content-Type": "application/json", "x-csrf-token": "abc" } }),
        )
        expect(rows.size).toBe(0)
      })

      it("rebuilds the URL for items queued before the URL was stored, without a doubled /api", async () => {
        const { fetchMock } = await runSync(queued(), { ok: true, status: 200 })
        expect(fetchMock.mock.calls[0]![0]).toMatch(/\/functions\/v1\/api\/leads\/contact$/)
      })

      it("drops a 4xx, keeps a 5xx with a counted attempt, and drops after the cap", async () => {
        expect((await runSync(queued(), { ok: false, status: 422 })).rows.size).toBe(0)
        const kept = await runSync(queued(), { ok: false, status: 503 })
        expect(kept.rows.get("propertyInquiry-1")).toMatchObject({ attempts: 1 })
        const last = await runSync(queued({ attempts: MAX_SYNC_ATTEMPTS - 1 }), { ok: false, status: 503 })
        expect(last.rows.size).toBe(0)
      })
    })
  })
})
