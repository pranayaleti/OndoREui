import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { CONTACT_INQUIRY_TYPES, submitContactLead } from "@/lib/leads-api"
import { backendUrl, edgeFunctionUrl } from "@/lib/backend"
import { MARKETING_ATTRIBUTION_STORAGE_KEY, getAttributionPayloadForApi } from "@/lib/attribution"
import { sendQualificationMessage } from "@/lib/api/qualification"
import ConsultationModal from "@/components/ConsultationModal"
import { BrochureRequestForm } from "@/components/leads/brochure-request-form"
import {
  EDGE_INQUIRY_TYPES,
  edgeContactLeadSchema,
  edgeQualifyRequestSchema,
  parseContactLeadBody,
} from "@/test/edge-lead-schemas"

/**
 * Contract tests: the forms run with the real submitContactLead and only fetch is faked, so what
 * is parsed here is the body that would reach the Edge API. The form tests elsewhere mock
 * submitContactLead and cannot catch a request the API would reject.
 */

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => (opts?.phone ? `${key} ${String(opts.phone)}` : key),
  }),
}))

const NOW_BASE = 1_700_000_000_000
let nowSpy: ReturnType<typeof vi.spyOn>

function okFetch() {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: "ok", leadId: "1" }),
  })
}

function sentBody(fetchMock: ReturnType<typeof vi.fn>, call = 0): unknown {
  return JSON.parse(String(fetchMock.mock.calls[call]![1].body))
}

beforeEach(() => {
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
  nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
  localStorage.clear()
})

afterEach(() => {
  nowSpy.mockRestore()
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe("Edge schema parity copy", () => {
  it("lists the same inquiry types as the client", () => {
    expect([...EDGE_INQUIRY_TYPES].sort()).toEqual([...CONTACT_INQUIRY_TYPES].sort())
  })

  it("rejects what the API rejects", () => {
    const base = { name: "Jane", email: "jane@example.com" }
    expect(edgeContactLeadSchema.safeParse(base).success).toBe(true)
    expect(edgeContactLeadSchema.safeParse({ ...base, inquiryType: "loan" }).success).toBe(false)
    expect(edgeContactLeadSchema.safeParse({ ...base, phone: "" }).success).toBe(false)
    expect(edgeContactLeadSchema.safeParse({ ...base, message: "x".repeat(2001) }).success).toBe(false)
    expect(
      edgeContactLeadSchema.safeParse({ ...base, attribution: { first: { utm_source: "x".repeat(257) } } }).success,
    ).toBe(false)
    expect(edgeContactLeadSchema.safeParse({ ...base, attribution: { first: { referrer: "x" } } }).success).toBe(false)
  })
})

describe("submitContactLead request contract", () => {
  it("sends a body the Edge schema accepts, to the contact endpoint", async () => {
    const fetchMock = okFetch()
    vi.stubGlobal("fetch", fetchMock)

    await submitContactLead({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "(801) 555-0100",
      message: "Hello",
      source: "website",
      inquiryType: "owner_rental_services",
    })

    expect(fetchMock.mock.calls[0]![0]).toBe(backendUrl("/api/leads/contact"))
    expect(() => parseContactLeadBody(sentBody(fetchMock))).not.toThrow()
  })

  it("keeps stored attribution inside the Edge limits and drops unknown keys", async () => {
    const long = "x".repeat(5000)
    localStorage.setItem(
      MARKETING_ATTRIBUTION_STORAGE_KEY,
      JSON.stringify({
        first: {
          utm_source: long,
          utm_medium: "email",
          gclid: long,
          path: `/${long}`,
          href: `https://www.ondorealestate.com/${long}`,
          recorded_at: new Date(NOW_BASE).toISOString(),
          referrer: "https://example.com/",
          injected: "nope",
        },
        last: null,
      }),
    )
    const attribution = getAttributionPayloadForApi()
    expect(attribution).toBeDefined()
    const fetchMock = okFetch()
    vi.stubGlobal("fetch", fetchMock)

    await submitContactLead({ name: "Jane", email: "jane@example.com", attribution })

    expect(() => parseContactLeadBody(sentBody(fetchMock))).not.toThrow()
  })
})

describe("lead-qualify request contract", () => {
  it("posts the body the lead-qualify function expects, to the edge function URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ reply: "Hi", completed: false }) })
    vi.stubGlobal("fetch", fetchMock)

    await sendQualificationMessage("tok_123", "website", "I want to buy")

    expect(fetchMock.mock.calls[0]![0]).toBe(edgeFunctionUrl("lead-qualify"))
    expect(edgeQualifyRequestSchema.safeParse(sentBody(fetchMock)).success).toBe(true)
  })
})

describe("form request contracts", () => {
  it("ConsultationModal (notary) sends a valid lead with and without a phone", async () => {
    for (const phone of ["", "(801) 555-0100"]) {
      const fetchMock = okFetch()
      vi.stubGlobal("fetch", fetchMock)
      // The anti-spam dwell gate counts from mount, so mount at the base time each round.
      nowSpy.mockReturnValue(NOW_BASE)
      const { unmount } = render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
      nowSpy.mockReturnValue(NOW_BASE + 3_000)
      fireEvent.change(screen.getByLabelText("consultationModal.fields.name"), { target: { value: "Jane Doe" } })
      fireEvent.change(screen.getByLabelText("consultationModal.fields.email"), { target: { value: "Jane@Example.com" } })
      if (phone) fireEvent.change(screen.getByLabelText("consultationModal.fields.phone"), { target: { value: phone } })
      const service = screen.getByLabelText("consultationModal.fields.serviceTypeNotary")
      fireEvent.keyDown(service, { key: "Enter" })
      fireEvent.keyDown(screen.getByRole("option", { name: "Loan Signing (Real Estate)" }), { key: "Enter" })
      fireEvent.change(screen.getByLabelText("consultationModal.fields.messageNotary"), {
        target: { value: "Loan signing for two people. ".repeat(100) },
      })
      fireEvent.click(screen.getByRole("button", { name: "consultationModal.bookingNotary" }))

      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
      const body = parseContactLeadBody(sentBody(fetchMock))
      expect(body.message!.length).toBeLessThanOrEqual(2000)
      expect(body.phone).toBe(phone || undefined)
      unmount()
    }
  })

  it("BrochureRequestForm sends a valid lead", async () => {
    const fetchMock = okFetch()
    vi.stubGlobal("fetch", fetchMock)
    render(<BrochureRequestForm />)
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Smith" } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "jane@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /request the overview/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(parseContactLeadBody(sentBody(fetchMock)).inquiryType).toBe("other")
  })
})
