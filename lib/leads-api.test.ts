import { afterEach, describe, expect, it, vi } from "vitest"

describe("submitContactLead", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("returns an error object instead of throwing when fetch fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    vi.resetModules()
    const { submitContactLead } = await import("./leads-api")

    const result = await submitContactLead({
      name: "Test User",
      email: "test@example.com",
      source: "website",
      message: "Requested: Utah Landlord's Property Management Checklist (PDF lead magnet).",
    })

    expect(result).toEqual(
      expect.objectContaining({
        error: expect.stringMatching(/try again/i),
      }),
    )
  })

  it("passes inquiryType through to the backend so sales can route the lead", async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "abc" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    vi.resetModules()
    const { submitContactLead } = await import("./leads-api")

    await submitContactLead({
      name: "Owner Jane",
      email: "owner@example.com",
      source: "website",
      inquiryType: "owner",
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [, init] = fetchMock.mock.calls[0]
    const body = JSON.parse(String(init.body))
    expect(body.inquiryType).toBe("owner")
  })
})
