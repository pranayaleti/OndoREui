import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import ConsultationModal from "./ConsultationModal"
import { backendUrl } from "@/lib/backend"
import { SITE_PHONE } from "@/lib/site"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => (opts?.phone ? `${key} ${String(opts.phone)}` : key),
  }),
}))

const NOW_BASE = 1_700_000_000_000
let nowSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  // jsdom gaps that Radix Select and Dialog touch.
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
  nowSpy = vi.spyOn(Date, "now").mockReturnValue(NOW_BASE)
})

afterEach(() => {
  nowSpy.mockRestore()
  vi.unstubAllGlobals()
})

/** Pick an option in a Radix Select the way a keyboard user does: open the trigger, then press Enter on the option. */
function chooseOption(trigger: HTMLElement, optionName: string) {
  fireEvent.keyDown(trigger, { key: "Enter" })
  fireEvent.keyDown(screen.getByRole("option", { name: optionName }), { key: "Enter" })
}

function fillAndSubmit(phone = "") {
  nowSpy.mockReturnValue(NOW_BASE + 3_000)
  fireEvent.change(screen.getByLabelText("consultationModal.fields.name"), { target: { value: "Jane Doe" } })
  fireEvent.change(screen.getByLabelText("consultationModal.fields.email"), { target: { value: "Jane@Example.com" } })
  if (phone) fireEvent.change(screen.getByLabelText("consultationModal.fields.phone"), { target: { value: phone } })
  chooseOption(screen.getByLabelText("consultationModal.fields.serviceTypeNotary"), "Loan Signing (Real Estate)")
  fireEvent.change(screen.getByLabelText("consultationModal.fields.messageNotary"), {
    target: { value: "Loan signing for two people." },
  })
  fireEvent.click(screen.getByRole("button", { name: "consultationModal.bookingNotary" }))
}

describe("ConsultationModal submit", () => {
  it("posts a notary request to /api/leads/contact, not the rental-inquiry endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "1" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)

    fillAndSubmit()

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(backendUrl("/api/leads/contact"))
    expect(String(url)).not.toContain("/leads/submit")
    const body = JSON.parse(String(init.body))
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "Jane@Example.com",
      source: "website",
      inquiryType: "other",
    })
    expect(body.message).toContain("Request: Notary booking request")
    expect(body.message).toContain("Loan signing for two people.")
    // No placeholder property or fake tenant fields.
    for (const key of ["publicId", "tenantPhone", "tenantName", "monthlyBudget", "moveInDate"]) {
      expect(body).not.toHaveProperty(key)
    }
    // Phone is optional: a blank phone is omitted rather than sent as "".
    expect(body).not.toHaveProperty("phone")
    expect(await screen.findByText("consultationModal.successTitle")).toBeInTheDocument()
  })

  it("sends the phone when one is given", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "ok", leadId: "1" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)

    fillAndSubmit("(801) 555-0100")

    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
    expect(JSON.parse(String(fetchMock.mock.calls[0][1].body)).phone).toBe("(801) 555-0100")
  })

  it("shows the error with the phone number when the API rejects the lead", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Validation failed" }),
    })
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)

    fillAndSubmit()

    const alert = await screen.findByRole("alert")
    expect(alert).toHaveTextContent(`consultationModal.errorMessage ${SITE_PHONE}`)
    expect(screen.queryByText("consultationModal.successTitle")).not.toBeInTheDocument()
  })
})

describe("ConsultationModal contact notice", () => {
  it("tells people how their details are used and links Privacy and Terms", () => {
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    expect(screen.getByText(/will use your details to answer this request/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy/")
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms-of-service/")
  })
})

describe("ConsultationModal dialog semantics", () => {
  it("is a named, described dialog", () => {
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    const dialog = screen.getByRole("dialog", { name: "consultationModal.titleNotary" })
    expect(dialog).toHaveAccessibleDescription("consultationModal.subtitleNotary")
  })

  it("renders nothing while closed", () => {
    render(<ConsultationModal isOpen={false} onClose={() => {}} />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("moves focus into the dialog when it opens", () => {
    render(<ConsultationModal isOpen onClose={() => {}} />)
    expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement)
  })

  it("closes on Escape and from the Cancel button", () => {
    const onClose = vi.fn()
    render(<ConsultationModal isOpen onClose={onClose} />)
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole("button", { name: "consultationModal.cancel" }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it("gives every select an accessible name from its label", () => {
    render(<ConsultationModal isOpen onClose={() => {}} />)
    for (const name of [
      "consultationModal.fields.serviceTypeDefault",
      "consultationModal.fields.propertyType",
      "consultationModal.fields.timelineDefault",
      "consultationModal.fields.budget",
      "consultationModal.fields.preferredTime",
    ]) {
      expect(screen.getByRole("combobox", { name })).toBeInTheDocument()
    }
  })

  it("uses ids that do not collide with a form behind it", () => {
    const { baseElement } = render(
      <>
        <input id="name" />
        <ConsultationModal isOpen onClose={() => {}} />
      </>,
    )
    expect(baseElement.querySelectorAll("#name")).toHaveLength(1)
    expect(screen.getByLabelText("consultationModal.fields.name")).not.toHaveAttribute("id", "name")
  })
})

describe("ConsultationModal validation", () => {
  it("sends nothing, names each missing field and focuses the first one", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    nowSpy.mockReturnValue(NOW_BASE + 3_000)

    fireEvent.click(screen.getByRole("button", { name: "consultationModal.bookingNotary" }))

    expect(fetchMock).not.toHaveBeenCalled()
    const name = screen.getByLabelText("consultationModal.fields.name")
    const email = screen.getByLabelText("consultationModal.fields.email")
    const service = screen.getByRole("combobox", { name: "consultationModal.fields.serviceTypeNotary" })
    const message = screen.getByLabelText("consultationModal.fields.messageNotary")
    for (const [field, text] of [
      [name, "consultationModal.errors.nameRequired"],
      [email, "consultationModal.errors.emailRequired"],
      [service, "consultationModal.errors.serviceRequired"],
      [message, "consultationModal.errors.messageRequired"],
    ] as const) {
      expect(field).toHaveAttribute("aria-invalid", "true")
      expect(field).toHaveAccessibleDescription(text)
    }
    await waitFor(() => expect(name).toHaveFocus())
  })

  it("does not accept an empty service type", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    nowSpy.mockReturnValue(NOW_BASE + 3_000)
    fireEvent.change(screen.getByLabelText("consultationModal.fields.name"), { target: { value: "Jane Doe" } })
    fireEvent.change(screen.getByLabelText("consultationModal.fields.email"), { target: { value: "jane@example.com" } })
    fireEvent.change(screen.getByLabelText("consultationModal.fields.messageNotary"), { target: { value: "Hello" } })

    fireEvent.click(screen.getByRole("button", { name: "consultationModal.bookingNotary" }))

    expect(fetchMock).not.toHaveBeenCalled()
    const service = screen.getByRole("combobox", { name: "consultationModal.fields.serviceTypeNotary" })
    await waitFor(() => expect(service).toHaveFocus())
    expect(service).toHaveAccessibleDescription("consultationModal.errors.serviceRequired")
  })

  it("rejects a malformed email and clears the error once the field is edited", () => {
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    nowSpy.mockReturnValue(NOW_BASE + 3_000)
    const email = screen.getByLabelText("consultationModal.fields.email")
    fireEvent.change(email, { target: { value: "not-an-email" } })
    fireEvent.click(screen.getByRole("button", { name: "consultationModal.bookingNotary" }))
    expect(email).toHaveAccessibleDescription("consultationModal.errors.emailInvalid")

    fireEvent.change(email, { target: { value: "jane@example.com" } })
    expect(email).not.toHaveAttribute("aria-invalid")
    expect(screen.queryByText("consultationModal.errors.emailInvalid")).not.toBeInTheDocument()
  })
})

describe("ConsultationModal result message", () => {
  it("announces success in a status region next to the submit button", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, message: "ok", leadId: "1" }) }),
    )
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    fillAndSubmit()

    const success = await screen.findByText("consultationModal.successTitle")
    const status = success.closest('[role="status"]') as HTMLElement
    expect(status).not.toBeNull()
    // Same form, after the fields and before the submit button.
    const submit = screen.getByRole("button", { name: "consultationModal.bookingNotary" })
    expect(status.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(screen.getByRole("dialog")).getByRole("alert")).toBeEmptyDOMElement()
  })

  it("does not promise a booked time", () => {
    render(<ConsultationModal isOpen onClose={() => {}} variant="notary" />)
    const text = document.body.textContent ?? ""
    expect(text).not.toMatch(/booked successfully|calendar invite/i)
  })
})
