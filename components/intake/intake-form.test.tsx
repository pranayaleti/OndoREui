import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { parseIntakeLeadBody } from "@/test/edge-lead-schemas"

const submitIntakeLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitIntakeLead: (...args: unknown[]) => submitIntakeLead(...args),
}))

// The 2.5 s dwell gate would treat a test's instant submit as a bot.
vi.mock("@/lib/anti-spam", () => ({
  useAntiSpam: () => ({
    honeypotProps: { type: "text", name: "fax_alt", autoComplete: "off", tabIndex: -1, "aria-hidden": true, value: "", onChange: () => {}, style: {} },
    gate: { isLikelyBot: () => false, recordAttempt: () => {} },
  }),
}))

import { IntakeForm } from "./intake-form"

const pick = (name: string | RegExp) => fireEvent.click(screen.getByRole("radio", { name }))
/** The type picker is a set of plain buttons (each click navigates), not radios. */
const chooseType = (name: RegExp) => fireEvent.click(screen.getByRole("button", { name }))
const check = (name: string) => fireEvent.click(screen.getByRole("checkbox", { name }))
const type = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
const next = () => fireEvent.click(screen.getByRole("button", { name: /continue/i }))

function fillContact() {
  type(/first name/i, "Ada")
  type(/last name/i, "Lovelace")
  fireEvent.change(screen.getByRole("textbox", { name: /^email/i }), { target: { value: "ada@example.com" } })
  type(/best phone number/i, "8015550100")
  pick("Mobile")
  pick("Text")
  pick("Google search")
  next()
}

describe("IntakeForm", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    window.history.replaceState(null, "", "/intake/")
    submitIntakeLead.mockReset().mockResolvedValue({ success: true, message: "ok", leadId: "lead-1" })
  })

  it("starts on the type picker", () => {
    render(<IntakeForm />)
    expect(screen.getByRole("heading", { name: /what can we help you with/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /find a rental/i })).toBeInTheDocument()
  })

  it("blocks Continue until required contact answers are in", () => {
    render(<IntakeForm />)
    chooseType(/sell a home/i)
    next()
    expect(screen.getByRole("alert")).toHaveTextContent(/answers need attention/i)
    expect(screen.getByRole("heading", { name: /how to reach you/i })).toBeInTheDocument()
  })

  it("skips the picker for a ?type= link and sends a renter questionnaire the API accepts", async () => {
    window.history.replaceState(null, "", "/intake/?type=tenant&utm_source=gmail")
    render(<IntakeForm />)
    expect(await screen.findByRole("heading", { name: /how to reach you/i })).toBeInTheDocument()
    fillContact()

    type(/ideal move-in date/i, "2026-11-01")
    pick("12 months")
    pick("$2,000 to $2,500")
    fireEvent.click(screen.getAllByRole("radio", { name: "2" })[0]!)
    fireEvent.click(screen.getAllByRole("radio", { name: "2" })[1]!)
    check("House")
    check("Lehi")
    next()

    pick("3")
    pick("Dog")
    type(/tell us about your pets/i, "Lab, 60 lb")
    fireEvent.click(screen.getByRole("checkbox", { name: /text and call you/i }))
    fireEvent.click(screen.getByRole("button", { name: /send my answers/i }))

    await waitFor(() => expect(submitIntakeLead).toHaveBeenCalledTimes(1))
    const body = parseIntakeLeadBody(JSON.parse(JSON.stringify(submitIntakeLead.mock.calls[0]![0])))
    expect(body).toMatchObject({
      intakeType: "tenant",
      firstName: "Ada",
      phone: "(801) 555-0100",
      preferredContact: "Text",
      textConsent: true,
      answers: { lease_length: "12 months", pets: "Dog", pet_details: "Lab, 60 lb", cities: ["Lehi"] },
    })
    expect(body.consentText).toContain("finding a rental")
    expect(body.consentText).toContain("Consent is not a condition of any purchase or service")
    expect(await screen.findByRole("heading", { name: /answers sent/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /pick a time to talk/i })).toBeInTheDocument()
  })

  it("sends without text consent when the box is left unticked", async () => {
    window.history.replaceState(null, "", "/intake/?type=owner")
    render(<IntakeForm />)
    await screen.findByRole("heading", { name: /how to reach you/i })
    fillContact()

    type(/property address/i, "1 Main St, Lehi")
    pick("Single family")
    type(/number of units/i, "1")
    type(/beds and baths/i, "3 bed, 2 bath")
    pick("Vacant and ready to rent")
    next()
    pick("I do")
    check("A rent estimate")
    pick("Within 30 days")
    fireEvent.click(screen.getByRole("button", { name: /send my answers/i }))

    await waitFor(() => expect(submitIntakeLead).toHaveBeenCalledTimes(1))
    const payload = submitIntakeLead.mock.calls[0]![0] as { textConsent: boolean; consentText?: string }
    expect(payload.textConsent).toBe(false)
    expect(payload.consentText).toBeUndefined()
  })

  it("returns to the contact step when the server rejects a contact field", async () => {
    submitIntakeLead.mockResolvedValue({ error: "Validation failed", details: { email: ["Invalid email"] } })
    window.history.replaceState(null, "", "/intake/?type=seller")
    render(<IntakeForm />)
    await screen.findByRole("heading", { name: /how to reach you/i })
    fillContact()

    type(/property address/i, "1 Main St, Lehi")
    pick("Townhome")
    fireEvent.click(screen.getAllByRole("radio", { name: "3" })[0]!)
    fireEvent.click(screen.getAllByRole("radio", { name: "2" })[1]!)
    pick("I do")
    pick("Move-in ready")
    next()
    pick("1 to 3 months")
    pick("Not yet")
    pick("No")
    fireEvent.click(screen.getByRole("button", { name: /send my answers/i }))

    expect(await screen.findByRole("heading", { name: /how to reach you/i })).toBeInTheDocument()
    expect(screen.getByText("Invalid email")).toBeInTheDocument()
  })
})
