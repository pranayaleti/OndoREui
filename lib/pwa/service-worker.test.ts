// @vitest-environment node
import { readFileSync } from "node:fs"
import { join } from "node:path"
import vm from "node:vm"
import { describe, expect, it, vi } from "vitest"

const sw = readFileSync(join(__dirname, "..", "..", "public", "sw.js"), "utf8")
const ORIGIN = "https://ondorealestate.com"

type Listener = (event: Record<string, unknown>) => void

interface FakeCaches {
  keys: string[]
  puts: string[]
  deleted: string[]
}

/** Evaluates public/sw.js against a fake worker scope and returns its listeners. */
function loadWorker(options: { existingCaches?: string[]; clients?: { url: string; focus: () => unknown }[] } = {}) {
  const listeners: Record<string, Listener> = {}
  const state: FakeCaches = { keys: options.existingCaches ?? [], puts: [], deleted: [] }
  const openWindow = vi.fn()
  const fetchMock = vi.fn(async () => ({ ok: true, clone: () => ({}) }))
  const fakeCache = {
    match: async () => undefined,
    put: async (request: unknown) => {
      state.puts.push(typeof request === "string" ? request : (request as Request).url)
    },
    keys: async () => [],
    addAll: async () => undefined,
    delete: async () => true,
  }
  const scope: Record<string, unknown> = {
    addEventListener: (type: string, fn: Listener) => {
      listeners[type] = fn
    },
    caches: {
      open: async () => fakeCache,
      keys: async () => state.keys,
      delete: async (key: string) => {
        state.deleted.push(key)
        return true
      },
      match: async () => undefined,
    },
    clients: { matchAll: async () => options.clients ?? [], openWindow, claim: async () => undefined },
    registration: { showNotification: vi.fn() },
    location: { origin: ORIGIN },
    fetch: fetchMock,
    URL,
    Response,
    Promise,
    indexedDB: {},
  }
  scope["self"] = scope
  vm.runInNewContext(sw, scope)
  return { listeners, state, openWindow, fetchMock }
}

function fetchEvent(url: string, init: { method?: string; cache?: string; headers?: Record<string, string>; mode?: string } = {}) {
  const respondWith = vi.fn()
  const request = {
    url,
    method: init.method ?? "GET",
    cache: init.cache ?? "default",
    mode: init.mode ?? "cors",
    headers: new Headers(init.headers),
  }
  return { event: { request, respondWith, preloadResponse: Promise.resolve(undefined) }, respondWith }
}

describe("service worker: no API or cross-origin caching", () => {
  const handled = [
    `${ORIGIN}/_next/static/chunks/main.js`,
    `${ORIGIN}/styles.css`,
    `${ORIGIN}/favicon.svg`,
  ]
  it.each(handled)("still handles same-origin static asset %s", (url) => {
    const { listeners } = loadWorker()
    const { event, respondWith } = fetchEvent(url)
    listeners["fetch"]!(event)
    expect(respondWith).toHaveBeenCalledTimes(1)
  })

  it("still handles same-origin navigations", () => {
    const { listeners } = loadWorker()
    const { event, respondWith } = fetchEvent(`${ORIGIN}/buy/`, { mode: "navigate" })
    listeners["fetch"]!(event)
    expect(respondWith).toHaveBeenCalledTimes(1)
  })

  const bypassed: [string, string, Parameters<typeof fetchEvent>[1]?][] = [
    ["a same-origin /api/ GET", `${ORIGIN}/api/properties/public`],
    ["the Supabase edge API", "https://lpklmquhxgbpavjngbby.supabase.co/functions/v1/api/properties/public"],
    ["another API host", "https://api.ondorealestate.com/properties"],
    ["a cross-origin script", "https://www.googletagmanager.com/gtm.js?id=GTM-X"],
    ["a cross-origin image", "https://images.example.test/photo.webp"],
    ["a no-store request", `${ORIGIN}/data/listings.json`, { cache: "no-store" }],
    ["a request with an Authorization header", `${ORIGIN}/data/me.json`, { headers: { Authorization: "Bearer t" } }],
  ]
  it.each(bypassed)("does not intercept %s", (_label, url, init) => {
    const { listeners, fetchMock } = loadWorker()
    const { event, respondWith } = fetchEvent(url, init)
    listeners["fetch"]!(event)
    expect(respondWith).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("ignores non-GET requests", () => {
    const { listeners } = loadWorker()
    const { event, respondWith } = fetchEvent(`${ORIGIN}/api/leads/contact`, { method: "POST" })
    listeners["fetch"]!(event)
    expect(respondWith).not.toHaveBeenCalled()
  })

  it("purges the old API cache and every older versioned cache on activate", async () => {
    const { listeners, state } = loadWorker({
      existingCaches: ["ondo-api-v3", "ondo-runtime-v3", "ondo-static-v3", "ondo-static-v4", "ondo-runtime-v4"],
    })
    let pending: Promise<unknown> = Promise.resolve()
    listeners["activate"]!({ waitUntil: (p: Promise<unknown>) => (pending = p) })
    await pending
    expect(state.deleted.sort()).toEqual(["ondo-api-v3", "ondo-runtime-v3", "ondo-static-v3"])
  })
})

describe("service worker: notification click target", () => {
  async function click(url: string, clients: { url: string; focus: () => unknown }[] = []) {
    const { listeners, openWindow } = loadWorker({ clients })
    let pending: Promise<unknown> = Promise.resolve()
    listeners["notificationclick"]!({
      notification: { close: vi.fn(), data: { url } },
      waitUntil: (p: Promise<unknown>) => (pending = p),
    })
    await pending
    return openWindow
  }

  it("opens a same-site path in a new window", async () => {
    const openWindow = await click("/platform/properties/12/")
    expect(openWindow).toHaveBeenCalledWith(`${ORIGIN}/platform/properties/12/`)
  })

  it("opens a same-origin absolute URL", async () => {
    const openWindow = await click(`${ORIGIN}/contact/`)
    expect(openWindow).toHaveBeenCalledWith(`${ORIGIN}/contact/`)
  })

  it.each(["https://evil.example.test/login", "//evil.example.test/", "javascript:alert(1)", "data:text/html,hi", "http://[bad"])(
    "falls back to the home page for %s",
    async (url) => {
      const openWindow = await click(url)
      expect(openWindow).toHaveBeenCalledWith(`${ORIGIN}/`)
    },
  )

  it("focuses an open window only on an exact origin and path match", async () => {
    const focusExact = vi.fn()
    const focusLoose = vi.fn()
    const openWindow = await click("/contact/", [
      { url: `https://evil.example.test/contact/`, focus: focusLoose },
      { url: `${ORIGIN}/contact/extra/`, focus: focusLoose },
      { url: `${ORIGIN}/contact/?utm=1#form`, focus: focusExact },
    ])
    expect(focusLoose).not.toHaveBeenCalled()
    expect(focusExact).toHaveBeenCalledTimes(1)
    expect(openWindow).not.toHaveBeenCalled()
  })

  it("does not focus a window whose URL merely contains the target", async () => {
    const focus = vi.fn()
    const openWindow = await click("/", [{ url: "https://evil.example.test/?r=" + ORIGIN + "/", focus }])
    expect(focus).not.toHaveBeenCalled()
    expect(openWindow).toHaveBeenCalledTimes(1)
  })
})
