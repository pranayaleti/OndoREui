import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitContactLead: (...args: unknown[]) => submitContactLead(...args),
}))

import { BrochureRequestForm } from "./brochure-request-form"

function fill(email = "jane@example.com") {
  fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Jane" } })
  fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Smith" } })
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: email } })
}

describe("BrochureRequestForm", () => {
  beforeEach(() => {
    submitContactLead.mockReset().mockResolvedValue({ success: true, message: "ok" })
  })

  it("sends an inquiry the team can act on and tracks it as one conversion", async () => {
    render(<BrochureRequestForm />)
    fill()
    fireEvent.click(screen.getByRole("button", { name: /request the overview/i }))
    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    const [payload, options] = submitContactLead.mock.calls[0]!
    expect(payload).toMatchObject({ name: "Jane Smith", email: "jane@example.com", inquiryType: "other" })
    expect(payload.message).toMatch(/investor inquiry/i)
    expect(options).toEqual({ formName: "brochure_request" })
  })

  it("does not promise an automatic email or a file, since none exists", async () => {
    render(<BrochureRequestForm />)
    expect(screen.queryByText(/email you|email me/i)).not.toBeInTheDocument()
    fill()
    fireEvent.click(screen.getByRole("button", { name: /request the overview/i }))
    const done = await screen.findByText(/our team will send the investor overview/i)
    expect(done).toHaveTextContent("jane@example.com")
  })

  it("announces errors", async () => {
    render(<BrochureRequestForm />)
    fill("not-an-email")
    fireEvent.click(screen.getByRole("button", { name: /request the overview/i }))
    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i)
    expect(submitContactLead).not.toHaveBeenCalled()
  })
})
