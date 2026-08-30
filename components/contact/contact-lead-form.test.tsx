import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import enCommon from "@/public/locales/en/common.json"
import { ContactLeadForm } from "./contact-lead-form"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ success: true, message: "ok", leadId: "1" })) }
})

const push = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}))

// react-i18next is not initialized in the vitest setup, so useTranslation()
// falls back to returning the key. Mock it to walk the actual en/common.json
// tree so audience radio labels resolve to real English (which the tests
// then match by regex).
vi.mock("react-i18next", () => {
  function translate(key: string, opts?: Record<string, unknown>): string {
    const path = key.split(".")
    let node: unknown = enCommon
    for (const segment of path) {
      if (node && typeof node === "object" && segment in (node as object)) {
        node = (node as Record<string, unknown>)[segment]
      } else {
        return key
      }
    }
    if (typeof node !== "string") return key
    if (!opts) return node
    return node.replace(/\{\{(.*?)\}\}/g, (_, name: string) =>
      String(opts[name.trim()] ?? ""),
    )
  }
  return { useTranslation: () => ({ t: translate, i18n: {} }) }
})

import { submitContactLead } from "@/lib/leads-api"

/**
 * The anti-spam gate stores Date.now() at mount time (via useRef) and rejects
 * submits that arrive within minDwellMs (2500ms). We mock Date.now BEFORE
 * render so mountedAt is deterministic, then advance it before submit to
 * clear the dwell gate.
 */
const NOW_BASE = 1_700_000_000_000
let nowSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
  vi.mocked(submitContactLead).mockClear()
  push.mockClear()
})

afterEach(() => {
  nowSpy.mockRestore()
})

function advancePastAntiSpamDwell() {
  nowSpy.mockReturnValue(NOW_BASE + 3_000)
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Jane Doe" } })
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane@example.com" } })
}

describe("ContactLeadForm", () => {
  it("exposes declarative WebMCP attributes on the form", () => {
    const { container } = render(<ContactLeadForm />)
    const form = container.querySelector("form")
    expect(form).toHaveAttribute("toolname", "submit_contact_lead")
    expect(form).toHaveAttribute("tooldescription")
    expect(form).not.toHaveAttribute("toolautosubmit")
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("toolparamdescription")
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("toolparamdescription")
  })

  it("renders with an empty message field when used without props (backward-compatible default)", () => {
    render(<ContactLeadForm />)
    expect(screen.getByLabelText(/message/i)).toHaveValue("")
  })

  it("seeds the message textarea from prefillMessage", () => {
    render(<ContactLeadForm prefillMessage="I'm interested in Sugar House, Salt Lake City." />)
    expect(screen.getByLabelText(/message/i)).toHaveValue("I'm interested in Sugar House, Salt Lake City.")
  })

  it("shows every audience option and requires one before submitting", async () => {
    render(<ContactLeadForm />)
    expect(screen.getByRole("heading", { name: /get the help you need/i })).toBeInTheDocument()
    expect(screen.getByText(/how can we help you/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tenant looking for a home to rent/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/real estate agent/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/rental property/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/vendor, offering maintenance/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/current resident/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/I'm buying a home/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Something else/i)).not.toBeInTheDocument()

    advancePastAntiSpamDwell()
    fillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /send/i }))

    expect(await screen.findByRole("alert")).toHaveTextContent(/which one describes you/i)
    expect(submitContactLead).not.toHaveBeenCalled()
  })

  it("submits with the selected inquiryType and source='website' by default", async () => {
    render(<ContactLeadForm />)
    advancePastAntiSpamDwell()
    fireEvent.click(screen.getByLabelText(/rental property/i))
    fillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /send/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(
      expect.objectContaining({ source: "website", inquiryType: "owner_rental_services" }),
    )
  })

  it("submits with the given source prop", async () => {
    render(<ContactLeadForm source="popup" />)
    advancePastAntiSpamDwell()
    fireEvent.click(screen.getByLabelText(/rental property/i))
    fillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /send/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(expect.objectContaining({ source: "popup" }))
  })

  it("hides the audience question when defaultInquiryType is set, and tags the submit with it", async () => {
    render(<ContactLeadForm defaultInquiryType="renter" />)
    expect(screen.queryByLabelText(/rental property/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: /get the help you need/i })).not.toBeInTheDocument()
    advancePastAntiSpamDwell()
    fillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /send/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(
      expect.objectContaining({ inquiryType: "renter" }),
    )
  })

  it("submits each public help-audience value", async () => {
    const cases = [
      [/tenant looking for a home to rent/i, "tenant_looking_to_rent"],
      [/real estate agent/i, "agent_referrals"],
      [/vendor, offering maintenance/i, "vendor_maintenance"],
      [/current resident/i, "current_resident"],
    ] as const
    for (const [label, inquiryType] of cases) {
      vi.mocked(submitContactLead).mockClear()
      nowSpy.mockReturnValue(NOW_BASE)
      const { unmount } = render(<ContactLeadForm />)
      advancePastAntiSpamDwell()
      fireEvent.click(screen.getByLabelText(label))
      fillRequiredFields()
      fireEvent.click(screen.getByRole("button", { name: /send/i }))
      await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
      expect(submitContactLead).toHaveBeenCalledWith(
        expect.objectContaining({ inquiryType }),
      )
      unmount()
    }
  })

  it("pre-selects initialInquiryType without hiding the audience radios", async () => {
    render(<ContactLeadForm initialInquiryType="owner_rental_services" />)
    const owner = screen.getByLabelText(/rental property/i)
    expect(owner).toBeChecked()
    expect(screen.getByLabelText(/tenant looking for a home to rent/i)).toBeInTheDocument()
    advancePastAntiSpamDwell()
    fillRequiredFields()
    fireEvent.click(screen.getByRole("button", { name: /send/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(
      expect.objectContaining({ inquiryType: "owner_rental_services" }),
    )
  })

  it("routes tenants to /properties after a successful submit when routeAfterSubmit is on", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    // Re-establish the Date.now spy on top of fake timers, since useFakeTimers
    // installs its own mock. Order matters: fake timers first, then our spy.
    nowSpy.mockRestore()
    nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
    try {
      render(<ContactLeadForm routeAfterSubmit />)
      advancePastAntiSpamDwell()
      fireEvent.click(screen.getByLabelText(/tenant looking for a home to rent/i))
      fillRequiredFields()
      fireEvent.click(screen.getByRole("button", { name: /send/i }))

      await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
      await vi.advanceTimersByTimeAsync(1200)
      expect(push).toHaveBeenCalledWith("/properties")
    } finally {
      vi.useRealTimers()
    }
  })

  it("routes buyers to /get-matched after a successful submit when defaultInquiryType is buyer", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    nowSpy.mockRestore()
    nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
    try {
      render(<ContactLeadForm routeAfterSubmit defaultInquiryType="buyer" />)
      advancePastAntiSpamDwell()
      fillRequiredFields()
      fireEvent.click(screen.getByRole("button", { name: /send/i }))

      await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
      await vi.advanceTimersByTimeAsync(1200)
      expect(push).toHaveBeenCalledWith("/get-matched")
    } finally {
      vi.useRealTimers()
    }
  })

  it("does not route after submit by default", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    nowSpy.mockRestore()
    nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
    try {
      render(<ContactLeadForm />)
      advancePastAntiSpamDwell()
      fireEvent.click(screen.getByLabelText(/tenant looking for a home to rent/i))
      fillRequiredFields()
      fireEvent.click(screen.getByRole("button", { name: /send/i }))

      await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
      await vi.advanceTimersByTimeAsync(2000)
      expect(push).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })
})
