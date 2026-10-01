import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Real http.ts and offline-submit.ts run here; only the network and the IndexedDB queue are faked.
const enqueueSyncItem = vi.hoisted(() => vi.fn())
const triggerSync = vi.hoisted(() => vi.fn())
vi.mock("@/lib/pwa/offline-queue", () => ({ enqueueSyncItem, triggerSync }))

import { submitLead } from "./leads"
import { submitPropertyInquiry } from "./inquiries"
import { ApiRequestError } from "./http"

function respond(status: number, body: unknown = {}) {
  const ok = status >= 200 && status < 300
  return vi.fn().mockResolvedValue({
    ok,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => body,
  })
}

const inquiry = { propertyId: "p1", fullName: "Pat", email: "pat@example.com", phone: "", message: "Still available?" }

beforeEach(() => {
  enqueueSyncItem.mockReset().mockResolvedValue({})
  triggerSync.mockReset().mockResolvedValue(undefined)
  Object.defineProperty(window.navigator, "onLine", { value: true, configurable: true })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("submitLead over the wire", () => {
  it.each([
    [400, "Validation failed"],
    [404, "Not found"],
    [500, "Server error"],
  ])("resolves false and does not queue anything on a %s", async (status, error) => {
    vi.stubGlobal("fetch", respond(status, { error }))
    expect(await submitLead({ email: "a@b.co", source: "ROI" })).toBe(false)
    expect(enqueueSyncItem).not.toHaveBeenCalled()
  })

  it("resolves true on a 200", async () => {
    vi.stubGlobal("fetch", respond(200, { success: true, message: "ok", leadId: "1" }))
    expect(await submitLead({ email: "a@b.co", source: "ROI" })).toBe(true)
  })
})

describe("submitPropertyInquiry over the wire", () => {
  it("queues nothing and throws the server's message when the API rejects it with a 400", async () => {
    vi.stubGlobal("fetch", respond(400, { error: "Validation failed" }))
    const error = await submitPropertyInquiry(inquiry).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiRequestError)
    expect(error).toMatchObject({ status: 400, serverMessage: "Validation failed" })
    expect(enqueueSyncItem).not.toHaveBeenCalled()
  })

  it("shows an error, not a queued success, when the route is missing (404)", async () => {
    vi.stubGlobal("fetch", respond(404, { error: "Not found" }))
    await expect(submitPropertyInquiry(inquiry)).rejects.toMatchObject({ status: 404 })
    expect(enqueueSyncItem).not.toHaveBeenCalled()
  })

  it("queues the inquiry for later when the server fails with a 503", async () => {
    vi.stubGlobal("fetch", respond(503))
    await expect(submitPropertyInquiry(inquiry)).resolves.toEqual({ success: true, queued: true })
    expect(enqueueSyncItem).toHaveBeenCalledWith(
      "propertyInquiry",
      "/api/leads/contact",
      expect.objectContaining({ email: "pat@example.com", propertyId: "p1" }),
    )
  })

  it("queues the inquiry when the network is down", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    await expect(submitPropertyInquiry(inquiry)).resolves.toMatchObject({ queued: true })
  })
})
