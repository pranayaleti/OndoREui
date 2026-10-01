import { afterEach, describe, expect, it, vi } from "vitest"

// jsdom has no IndexedDB, so the real cache is a no-op. A Map stands in so the fallback rules can be tested.
const cache = vi.hoisted(() => new Map<string, unknown>())
vi.mock("@/lib/cache/idb-cache", () => ({
  TTL: { MEDIUM: 1, LONG: 2 },
  cacheGet: async (key: string) => cache.get(key) ?? null,
  cacheSet: async (key: string, value: unknown) => {
    cache.set(key, value)
  },
}))
import {
  ApiRequestError,
  deleteJson,
  getCsrfToken,
  isRetryableRequestError,
  mergeHeaders,
  networkFirstGet,
  postJson,
  putJson,
  requestErrorMessage,
} from "./http"

describe("getCsrfToken", () => {
  afterEach(() => {
    document.cookie = "ondo_csrf=; Max-Age=0; path=/"
  })

  it("returns undefined when cookie is absent", () => {
    expect(getCsrfToken()).toBeUndefined()
  })

  it("reads a plain token value", () => {
    document.cookie = "ondo_csrf=abc123; path=/"
    expect(getCsrfToken()).toBe("abc123")
  })

  it("decodes URI-encoded token values", () => {
    document.cookie = "ondo_csrf=abc%2Fdef%3D; path=/"
    expect(getCsrfToken()).toBe("abc/def=")
  })

  it("preserves tokens that contain equals signs", () => {
    document.cookie = "ondo_csrf=part1%3Dpart2; path=/"
    expect(getCsrfToken()).toBe("part1=part2")
  })
})

describe("postJson failures", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("throws an error carrying the status and the server's message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: "Validation failed" }) }),
    )
    const error = await postJson("/api/leads/contact", {}).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiRequestError)
    expect((error as ApiRequestError).status).toBe(400)
    expect(requestErrorMessage(error)).toBe("Validation failed")
    expect((error as Error).message).toBe("Request failed: 400")
  })

  it("still throws when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new SyntaxError("Unexpected token <")
        },
      }),
    )
    const error = await postJson("/api/x", {}).catch((e: unknown) => e)
    expect((error as ApiRequestError).status).toBe(502)
    expect(requestErrorMessage(error)).toBeUndefined()
  })
})

describe("isRetryableRequestError", () => {
  it("retries network failures, timeouts, 5xx and rate limits", () => {
    expect(isRetryableRequestError(new TypeError("Failed to fetch"))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(500))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(503))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(408))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(429))).toBe(true)
  })

  it("does not retry a request the API rejected", () => {
    for (const status of [400, 401, 403, 404, 409, 422]) {
      expect(isRetryableRequestError(new ApiRequestError(status))).toBe(false)
    }
  })
})

describe("mergeHeaders", () => {
  it("merges object, tuple and Headers inputs, later sets winning case-insensitively", () => {
    expect(
      mergeHeaders(
        { "Content-Type": "application/json", "X-A": "1" },
        [["x-a", "2"]],
        new Headers({ Authorization: "Bearer t" }),
        undefined,
      ),
    ).toEqual({ "content-type": "application/json", "x-a": "2", authorization: "Bearer t" })
  })
})

describe("request helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("keeps the JSON content type when a caller adds its own headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, headers: new Headers(), json: async () => ({}) })
    vi.stubGlobal("fetch", fetchMock)
    await postJson("/api/x", {}, { init: { headers: new Headers({ "X-Trace": "1" }) } })
    await putJson("/api/x", {}, { init: { headers: { "X-Trace": "1" } } })
    await deleteJson("/api/x", { headers: [["X-Trace", "1"]] })
    for (const call of fetchMock.mock.calls) {
      expect(call[1].headers).toMatchObject({ "content-type": "application/json", "x-trace": "1" })
    }
  })

  it("throws ApiRequestError with status and server message from put, delete and network-first get", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 409, json: async () => ({ message: "Already exists" }) }),
    )
    for (const call of [
      () => putJson("/api/x", {}),
      () => deleteJson("/api/x"),
      () => networkFirstGet("/api/x", "k"),
    ]) {
      const error = await call().catch((e: unknown) => e)
      expect(error).toBeInstanceOf(ApiRequestError)
      expect((error as ApiRequestError).status).toBe(409)
      expect(requestErrorMessage(error)).toBe("Already exists")
      expect((error as Error).message).toBe("Request failed: 409")
    }
  })
})

describe("networkFirstGet", () => {
  const CACHE_KEY = "ondo:api-cache:listings"

  afterEach(() => {
    vi.unstubAllGlobals()
    cache.clear()
  })

  it("returns the network answer and stores it for later", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ items: [1] }) }))
    await expect(networkFirstGet("/api/properties", "listings")).resolves.toEqual({ items: [1] })
    expect(cache.get(CACHE_KEY)).toEqual({ items: [1] })
  })

  it("prefers a fresh network answer over a cached one", async () => {
    cache.set(CACHE_KEY, { items: ["old"] })
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ items: ["new"] }) }))
    await expect(networkFirstGet("/api/properties", "listings")).resolves.toEqual({ items: ["new"] })
  })

  it("falls back to the cached copy when the network fails", async () => {
    cache.set(CACHE_KEY, { items: ["cached"] })
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    await expect(networkFirstGet("/api/properties", "listings")).resolves.toEqual({ items: ["cached"] })
  })

  it("falls back to the cached copy when the server answers with an error status", async () => {
    cache.set(CACHE_KEY, { items: ["cached"] })
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }))
    await expect(networkFirstGet("/api/properties", "listings")).resolves.toEqual({ items: ["cached"] })
  })

  it("throws the original error when the network fails and nothing is cached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({ error: "Not found" }) }))
    const error = await networkFirstGet("/api/properties", "listings").catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiRequestError)
    expect(error).toMatchObject({ status: 404, serverMessage: "Not found" })
  })

  it("does not write a failed answer to the cache", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }))
    await networkFirstGet("/api/properties", "listings").catch(() => undefined)
    expect(cache.has(CACHE_KEY)).toBe(false)
  })
})
