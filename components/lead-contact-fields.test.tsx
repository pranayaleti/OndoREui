import { describe, it, expect } from "vitest"
import { useState } from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import {
  LeadContactFields,
  EMPTY_CONTACT,
  contactErrors,
  type ContactValues,
} from "./lead-contact-fields"
import { withConsentRecord } from "@/lib/text-consent"

let latest: ContactValues = EMPTY_CONTACT

function Harness({ errors }: { errors?: Parameters<typeof LeadContactFields>[0]["errors"] }) {
  const [value, setValue] = useState<ContactValues>(EMPTY_CONTACT)
  latest = value
  return <LeadContactFields value={value} onChange={setValue} topic="your loan" errors={errors} />
}

describe("LeadContactFields text consent", () => {
  it("shows the full consent wording with Privacy and Terms links, unchecked by default", () => {
    render(<Harness />)
    const box = screen.getByRole("checkbox", { name: /text and call you at this number about your loan/i })
    expect(box).not.toBeChecked()
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy/")
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute("href", "/terms-of-service/")
    expect(screen.getByText(/not a condition of any purchase or service/i)).toBeInTheDocument()
    expect(screen.getByText(/Reply STOP to cancel or HELP for help/)).toBeInTheDocument()
  })

  it("records the wording and a timestamp when checked and clears them when unchecked", () => {
    render(<Harness />)
    const box = screen.getByRole("checkbox")
    fireEvent.click(box)
    expect(latest.textConsent).toBe(true)
    expect(latest.consentText).toContain("Ondo Real Estate may text and call you")
    expect(latest.consentAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    fireEvent.click(box)
    expect(latest.textConsent).toBe(false)
    expect(latest.consentText).toBeUndefined()
    expect(latest.consentAt).toBeUndefined()
  })

  it("keeps the consent record in the lead message only when there is a phone number", () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole("checkbox"))
    expect(withConsentRecord("msg", latest)).toBe("msg")
    fireEvent.change(screen.getByLabelText(/^phone/i), { target: { value: "801-555-0100" } })
    expect(withConsentRecord("msg", latest)).toContain("Text consent given:")
  })
})

describe("contactErrors", () => {
  it("asks for a phone number when texting consent is given without one", () => {
    const base = { ...EMPTY_CONTACT, name: "Ada", email: "ada@example.com" }
    expect(contactErrors(base)).toEqual({})
    expect(contactErrors({ ...base, textConsent: true }).phone).toMatch(/phone number/i)
    expect(contactErrors({ ...base, textConsent: true, phone: "801-555-0100" })).toEqual({})
  })

  it("marks the phone field invalid and describes the error", () => {
    render(<Harness errors={{ phone: "Enter your phone number so we can text you." }} />)
    const phone = screen.getByLabelText(/^phone/i)
    expect(phone).toHaveAttribute("aria-invalid", "true")
    expect(phone).toHaveAccessibleDescription("Enter your phone number so we can text you.")
  })
})
