import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))

import { getSchedule, getVisitByToken, isLinkNotFoundError, SiteVisitHttpError } from "./site-visits"

const originalFetch = global.fetch
afterEach(() => {
  global.fetch = originalFetch
})

function respondWith(status: number) {
  global.fetch = vi.fn(async () => ({ ok: status >= 200 && status < 300, status, json: async () => ({}) })) as unknown as typeof fetch
}

describe("site visit link lookups", () => {
  it.each([
    ["getSchedule", getSchedule],
    ["getVisitByToken", getVisitByToken],
  ])("%s throws a typed 404 for a dead link", async (_name, fn) => {
    respondWith(404)
    const error = await fn("tok").catch((e: unknown) => e)
    expect(error).toBeInstanceOf(SiteVisitHttpError)
    expect(isLinkNotFoundError(error)).toBe(true)
  })

  it.each([500, 503])("treats a %i as an outage, not an invalid link", async (status) => {
    respondWith(status)
    const error = await getSchedule("tok").catch((e: unknown) => e)
    expect((error as SiteVisitHttpError).status).toBe(status)
    expect(isLinkNotFoundError(error)).toBe(false)
  })

  it("treats network failures and timeouts as non-404", () => {
    expect(isLinkNotFoundError(new TypeError("Failed to fetch"))).toBe(false)
    expect(isLinkNotFoundError(new DOMException("timeout", "TimeoutError"))).toBe(false)
  })
})
