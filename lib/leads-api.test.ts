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

  it("accepts buyer and seller inquiry types on the client payload", async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "abc" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    vi.resetModules()
    const { submitContactLead } = await import("./leads-api")

    await submitContactLead({
      name: "Buyer Jane",
      email: "buyer@example.com",
      source: "website",
      inquiryType: "buyer",
    })

    const [, init] = fetchMock.mock.calls[0]
    expect(JSON.parse(String(init.body)).inquiryType).toBe("buyer")
  })

  it("passes the five public help-audience values through to the backend", async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "abc" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    vi.resetModules()
    const { submitContactLead } = await import("./leads-api")

    await submitContactLead({
      name: "Pat Tenant",
      email: "pat@example.com",
      source: "website",
      inquiryType: "tenant_looking_to_rent",
    })

    const [, init] = fetchMock.mock.calls[0]
    expect(JSON.parse(String(init.body)).inquiryType).toBe("tenant_looking_to_rent")
  })

  it("maps audience query params onto the public radios", async () => {
    vi.resetModules()
    const { publicAudienceFromQuery } = await import("./leads-api")
    expect(publicAudienceFromQuery("renter")).toBe("tenant_looking_to_rent")
    expect(publicAudienceFromQuery("owner")).toBe("owner_rental_services")
    expect(publicAudienceFromQuery("agent")).toBe("agent_referrals")
    expect(publicAudienceFromQuery("vendor")).toBe("vendor_maintenance")
    expect(publicAudienceFromQuery("current_client")).toBe("current_resident")
    expect(publicAudienceFromQuery("buyer")).toBe("buyer")
    expect(publicAudienceFromQuery("seller")).toBe("seller")
    // Borrowers and notary clients have no type of their own: they send "other".
    expect(publicAudienceFromQuery("loan")).toBe("other")
    expect(publicAudienceFromQuery("notary")).toBe("other")
    expect(publicAudienceFromQuery("nonsense")).toBeUndefined()
    expect(publicAudienceFromQuery(null)).toBeUndefined()
  })

  it("only offers radio values the backend accepts", async () => {
    vi.resetModules()
    const { PUBLIC_CONTACT_INQUIRY_TYPES, CONTACT_INQUIRY_TYPES } = await import("./leads-api")
    const { CONTACT_AUDIENCE_OPTIONS } = await import("./contact-audiences")
    for (const type of PUBLIC_CONTACT_INQUIRY_TYPES) {
      expect(CONTACT_INQUIRY_TYPES).toContain(type)
    }
    expect(CONTACT_AUDIENCE_OPTIONS.map((o) => o.value)).toEqual([...PUBLIC_CONTACT_INQUIRY_TYPES])
    expect(PUBLIC_CONTACT_INQUIRY_TYPES).toEqual(expect.arrayContaining(["buyer", "seller", "other"]))
  })
})

describe("buildLeadMessage", () => {
  it("lists labelled details, drops empty ones, then appends the visitor's note", async () => {
    const { buildLeadMessage } = await import("./leads-api")
    expect(
      buildLeadMessage(
        [
          ["Service", "Loan Signing"],
          ["Timeline", ""],
          ["Budget", undefined],
          ["Preferred time", " Today "],
        ],
        "  Two signers.  ",
      ),
    ).toBe("Service: Loan Signing\nPreferred time: Today\n\nTwo signers.")
  })

  it("returns only the note when there are no details", async () => {
    const { buildLeadMessage } = await import("./leads-api")
    expect(buildLeadMessage([], "Hello")).toBe("Hello")
  })

  it("never exceeds the backend message limit", async () => {
    const { buildLeadMessage, LEAD_MESSAGE_MAX_LENGTH } = await import("./leads-api")
    const msg = buildLeadMessage([["Service", "Notary"]], "x".repeat(5000))
    expect(msg.length).toBe(LEAD_MESSAGE_MAX_LENGTH)
    expect(msg.startsWith("Service: Notary")).toBe(true)
  })
})

describe("submitContactLead conversion tracking", () => {
  const trackFormSubmission = vi.fn()
  const trackLeadGeneration = vi.fn()

  async function load(fetchImpl: ReturnType<typeof vi.fn>) {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    vi.stubGlobal("fetch", fetchImpl)
    vi.resetModules()
    vi.doMock("@/lib/analytics", () => ({ analytics: { trackFormSubmission, trackLeadGeneration } }))
    return import("./leads-api")
  }

  const payload = { name: "Pat", email: "pat@example.com", source: "website", propertyId: "prop-1" } as const

  afterEach(() => {
    trackFormSubmission.mockReset()
    trackLeadGeneration.mockReset()
    vi.doUnmock("@/lib/analytics")
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("fires one lead conversion when a named form is saved", async () => {
    const { submitContactLead } = await load(
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "ok", leadId: "l1" }) }),
    )
    await submitContactLead(payload, { formName: "listing_inquiry" })
    expect(trackLeadGeneration).toHaveBeenCalledTimes(1)
    expect(trackLeadGeneration).toHaveBeenCalledWith("listing_inquiry", "prop-1")
    expect(trackFormSubmission).toHaveBeenCalledWith("listing_inquiry", true)
  })

  it("reports an API rejection as a form error and no lead", async () => {
    const { submitContactLead } = await load(
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Validation failed" }) }),
    )
    await submitContactLead(payload, { formName: "contact_form" })
    expect(trackLeadGeneration).not.toHaveBeenCalled()
    expect(trackFormSubmission).toHaveBeenCalledWith("contact_form", false)
  })

  it("reports a network failure as a form error and no lead", async () => {
    const { submitContactLead } = await load(vi.fn().mockRejectedValue(new TypeError("Failed to fetch")))
    await submitContactLead(payload, { formName: "contact_form" })
    expect(trackLeadGeneration).not.toHaveBeenCalled()
    expect(trackFormSubmission).toHaveBeenCalledWith("contact_form", false)
  })

  it("tracks nothing when the caller does not name the form (it tracks the result itself)", async () => {
    const { submitContactLead } = await load(
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "ok", leadId: "l1" }) }),
    )
    await submitContactLead(payload)
    expect(trackLeadGeneration).not.toHaveBeenCalled()
    expect(trackFormSubmission).not.toHaveBeenCalled()
  })

  it("keeps the formName out of the request body", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "ok", leadId: "l1" }) })
    const { submitContactLead } = await load(fetchMock)
    await submitContactLead(payload, { formName: "contact_form" })
    expect(String(fetchMock.mock.calls[0]![1].body)).not.toContain("contact_form")
  })
})
