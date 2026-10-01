import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { hasLeadBeenCaptured, markLeadCaptured, submitLead } from "./leads"
import { backendUrl } from "@/lib/backend"
import { analytics } from "@/lib/analytics"

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("submitLead", () => {
  it("posts through /api/leads/contact, the route production serves", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "1" }),
    })
    vi.stubGlobal("fetch", fetchMock)

    const saved = await submitLead({ email: " a@b.co ", source: "Mortgage Payment", calculatorSlug: "mortgage-payment" })

    expect(saved).toBe(true)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(backendUrl("/api/leads/contact"))
    expect(String(url)).not.toContain("/leads/capture")
    const body = JSON.parse(String(init.body))
    expect(body).toMatchObject({ email: "a@b.co", source: "website", inquiryType: "other" })
    expect(body.message).toContain("Calculator: Mortgage Payment")
    expect(body.message).toContain("Calculator slug: mortgage-payment")
  })

  it("counts a saved calculator lead once, named for the calculator", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "ok", leadId: "1" }) }))
    const lead = vi.spyOn(analytics, "trackLeadGeneration").mockImplementation(() => {})
    const form = vi.spyOn(analytics, "trackFormSubmission").mockImplementation(() => {})

    await submitLead({ email: "a@b.co", source: "ROI", calculatorSlug: "roi" })

    expect(lead).toHaveBeenCalledTimes(1)
    expect(lead).toHaveBeenCalledWith("calculator_roi", undefined)
    expect(form).toHaveBeenCalledWith("calculator_roi", true)
    lead.mockRestore()
    form.mockRestore()
  })

  it("reports a failed calculator lead as a form error, not a lead", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "nope" }) }))
    const lead = vi.spyOn(analytics, "trackLeadGeneration").mockImplementation(() => {})
    const form = vi.spyOn(analytics, "trackFormSubmission").mockImplementation(() => {})

    await submitLead({ email: "a@b.co", source: "ROI", calculatorSlug: "roi" })

    expect(lead).not.toHaveBeenCalled()
    expect(form).toHaveBeenCalledWith("calculator_roi", false)
    lead.mockRestore()
    form.mockRestore()
  })

  it("resolves false when the API rejects the lead or cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Not found" }) }))
    expect(await submitLead({ email: "a@b.co", source: "ROI" })).toBe(false)

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    expect(await submitLead({ email: "a@b.co", source: "ROI" })).toBe(false)
  })
})

describe("lead captured flag", () => {
  it("is off until a lead is marked captured", () => {
    expect(hasLeadBeenCaptured()).toBe(false)
    markLeadCaptured()
    expect(hasLeadBeenCaptured()).toBe(true)
  })

  it("keeps only the flag: no email is written, and a legacy stored email is cleared", () => {
    localStorage.setItem("ondo_lead_email", "old@b.co")
    markLeadCaptured()
    expect(localStorage.getItem("ondo_lead_email")).toBeNull()
    expect(Object.values({ ...localStorage })).toEqual(["true"])
  })
})

describe("lead storage when the browser blocks it", () => {
  it("treats a throwing localStorage as not captured instead of throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError")
    })
    vi.spyOn(console, "warn").mockImplementation(() => undefined)
    expect(hasLeadBeenCaptured()).toBe(false)
    expect(() => markLeadCaptured()).not.toThrow()
    vi.restoreAllMocks()
  })
})
