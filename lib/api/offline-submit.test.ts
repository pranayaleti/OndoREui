import { beforeEach, describe, expect, it, vi } from "vitest"
import { ApiRequestError } from "@/lib/api/http"

const postJson = vi.hoisted(() => vi.fn())
const enqueueSyncItem = vi.hoisted(() => vi.fn())
const triggerSync = vi.hoisted(() => vi.fn())

vi.mock("@/lib/api/http", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api/http")>("@/lib/api/http")
  return { ...actual, postJson }
})
vi.mock("@/lib/pwa/offline-queue", () => ({ enqueueSyncItem, triggerSync }))

import { submitOrQueue } from "./offline-submit"

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", { value, configurable: true })
}

describe("submitOrQueue", () => {
  beforeEach(() => {
    postJson.mockReset()
    enqueueSyncItem.mockReset().mockResolvedValue({})
    triggerSync.mockReset().mockResolvedValue(undefined)
    setOnline(true)
  })

  it("sends online submissions and queues nothing", async () => {
    postJson.mockResolvedValue({})
    await expect(submitOrQueue("propertyInquiry", "/api/leads/contact", { a: 1 })).resolves.toEqual({
      success: true,
      queued: false,
    })
    expect(postJson).toHaveBeenCalledWith("/api/leads/contact", { a: 1 })
    expect(enqueueSyncItem).not.toHaveBeenCalled()
  })

  it("throws a rejected request instead of queueing it, so the visitor is not told it was sent", async () => {
    postJson.mockRejectedValue(new ApiRequestError(400, "Validation failed"))
    await expect(submitOrQueue("propertyInquiry", "/api/leads/contact", {})).rejects.toMatchObject({
      status: 400,
      serverMessage: "Validation failed",
    })
    expect(enqueueSyncItem).not.toHaveBeenCalled()
    expect(triggerSync).not.toHaveBeenCalled()
  })

  it.each([
    ["a network failure", new TypeError("Failed to fetch")],
    ["a server error", new ApiRequestError(503)],
    ["rate limiting", new ApiRequestError(429)],
  ])("queues the submission after %s", async (_name, failure) => {
    postJson.mockRejectedValue(failure)
    await expect(submitOrQueue("maintenanceRequest", "/api/maintenance", { b: 2 })).resolves.toEqual({
      success: true,
      queued: true,
    })
    expect(enqueueSyncItem).toHaveBeenCalledWith("maintenanceRequest", "/api/maintenance", { b: 2 })
    expect(triggerSync).toHaveBeenCalledWith("maintenanceRequest")
  })

  it("queues without trying the network while offline", async () => {
    setOnline(false)
    await expect(submitOrQueue("propertyInquiry", "/api/leads/contact", {})).resolves.toMatchObject({ queued: true })
    expect(postJson).not.toHaveBeenCalled()
  })

  it("still reports queued when the background sync cannot start", async () => {
    postJson.mockRejectedValue(new TypeError("Failed to fetch"))
    triggerSync.mockRejectedValue(new Error("no service worker"))
    await expect(submitOrQueue("propertyInquiry", "/api/leads/contact", {})).resolves.toMatchObject({ queued: true })
  })

  it("does not claim success when the item could not be saved", async () => {
    setOnline(false)
    enqueueSyncItem.mockRejectedValue(new Error("Offline queue storage is unavailable"))
    await expect(submitOrQueue("propertyInquiry", "/api/leads/contact", {})).rejects.toThrow(/unavailable/)
  })
})
