import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ContactLeadForm } from "./contact-lead-form"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ success: true, message: "ok", leadId: "1" })) }
})

import { submitContactLead } from "@/lib/leads-api"

describe("ContactLeadForm", () => {
  it("renders with an empty message field when used without props (backward-compatible default)", () => {
    render(<ContactLeadForm />)
    expect(screen.getByLabelText(/message/i)).toHaveValue("")
  })

  it("seeds the message textarea from prefillMessage", () => {
    render(<ContactLeadForm prefillMessage="I'm interested in Sugar House, Salt Lake City." />)
    expect(screen.getByLabelText(/message/i)).toHaveValue("I'm interested in Sugar House, Salt Lake City.")
  })

  // The anti-spam submit-time gate (lib/anti-spam.ts) rejects submits that
  // arrive within minDwellMs (2500ms default) of mount, so we advance
  // Date.now() between render and submit to clear the gate.
  it("submits with source='website' by default", async () => {
    const base = 1_700_000_000_000
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(base)
    render(<ContactLeadForm />)
    nowSpy.mockReturnValue(base + 3_000)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Jane Doe" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /send/i }))
    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(expect.objectContaining({ source: "website" }))
    nowSpy.mockRestore()
  })

  it("submits with the given source prop", async () => {
    const base = 1_700_000_000_000
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(base)
    render(<ContactLeadForm source="popup" />)
    nowSpy.mockReturnValue(base + 3_000)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Jane Doe" } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "jane@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: /send/i }))
    await waitFor(() => expect(submitContactLead).toHaveBeenCalled())
    expect(submitContactLead).toHaveBeenCalledWith(expect.objectContaining({ source: "popup" }))
    nowSpy.mockRestore()
  })
})
