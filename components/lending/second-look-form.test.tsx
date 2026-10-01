import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitContactLead: (...args: unknown[]) => submitContactLead(...args),
}))

import { SecondLookForm } from "./second-look-form"

function fillContact() {
  fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Ada Lovelace" } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "ada@example.com" } })
}

describe("SecondLookForm", () => {
  beforeEach(() => {
    submitContactLead.mockReset().mockResolvedValue({ success: true, message: "ok" })
  })

  it("sends the Loan Estimate numbers with the buyer lead", async () => {
    render(<SecondLookForm />)
    fillContact()
    fireEvent.change(screen.getByLabelText(/closing date/i), { target: { value: "2026-10-30" } })
    fireEvent.change(screen.getByLabelText(/^interest rate/i), { target: { value: "6.875" } })
    fireEvent.change(screen.getByLabelText(/^points/i), { target: { value: "$2,100" } })
    fireEvent.click(screen.getByRole("button", { name: /second look/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    const payload = submitContactLead.mock.calls[0]![0]
    expect(payload).toMatchObject({ name: "Ada Lovelace", email: "ada@example.com", inquiryType: "buyer" })
    expect(payload.message).toContain("Closing date: 2026-10-30")
    expect(payload.message).toContain("Interest rate: 6.875%")
    expect(payload.message).toContain("Points: $2,100")
    expect(await screen.findByRole("status")).toHaveTextContent(/reach out within one business day/i)
  })

  it("asks for a closing date, since that sets how fast we need to move, instead of disabling Send", () => {
    render(<SecondLookForm />)
    fillContact()
    const send = screen.getByRole("button", { name: /second look/i })
    expect(send).toBeEnabled()
    fireEvent.click(send)
    const closing = screen.getByLabelText(/closing date/i)
    expect(closing).toHaveAttribute("aria-invalid", "true")
    expect(closing).toHaveAccessibleDescription("Choose your closing date.")
    expect(submitContactLead).not.toHaveBeenCalled()
  })

  it("says what is wrong with a missing name and a bad email", () => {
    render(<SecondLookForm />)
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "review-test" } })
    fireEvent.click(screen.getByRole("button", { name: /second look/i }))
    expect(screen.getByLabelText(/^name/i)).toHaveAccessibleDescription("Enter your name.")
    expect(screen.getByLabelText(/^email/i)).toHaveAccessibleDescription(/valid email/i)
    expect(screen.getByLabelText(/^name/i)).toBeRequired()
  })
})
