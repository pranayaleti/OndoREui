import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const submitContactLead = vi.fn()
vi.mock("@/lib/leads-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/leads-api")>()),
  submitContactLead: (...args: unknown[]) => submitContactLead(...args),
}))

import { RateWatchForm } from "./rate-watch-form"

function fillContact() {
  fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: "Grace Hopper" } })
  fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "grace@example.com" } })
}

describe("RateWatchForm", () => {
  beforeEach(() => {
    submitContactLead.mockReset().mockResolvedValue({ success: true, message: "ok" })
  })

  it("adds the owner to the watch list with their current and target rate", async () => {
    render(<RateWatchForm />)
    fillContact()
    fireEvent.change(screen.getByLabelText(/current interest rate/i), { target: { value: "7.25" } })
    fireEvent.change(screen.getByLabelText(/worth it/i), { target: { value: "6.25" } })
    fireEvent.click(screen.getByRole("button", { name: /add me/i }))

    await waitFor(() => expect(submitContactLead).toHaveBeenCalledTimes(1))
    const payload = submitContactLead.mock.calls[0]![0]
    expect(payload).toMatchObject({ email: "grace@example.com", inquiryType: "other" })
    expect(payload.message).toContain("Current rate: 7.25%")
    expect(payload.message).toContain("Target rate: 6.25%")
  })

  it("needs the current rate to know when to call", () => {
    render(<RateWatchForm />)
    fillContact()
    expect(screen.getByRole("button", { name: /add me/i })).toBeDisabled()
  })
})
