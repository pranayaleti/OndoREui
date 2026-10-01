import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { EmailCaptureSection } from "./email-capture-section"

vi.mock("@/lib/leads-api", () => ({
  submitContactLead: vi.fn(),
}))

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))

vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackFormSubmission: vi.fn(),
    trackLeadGeneration: vi.fn(),
  },
}))

import { submitContactLead } from "@/lib/leads-api"
import { analytics } from "@/lib/analytics"

function submitWith(email: string, firstName?: string) {
  if (firstName) fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: firstName } })
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: email } })
  fireEvent.click(screen.getByRole("button", { name: /get updates/i }))
}

describe("EmailCaptureSection", () => {
  beforeEach(() => {
    vi.mocked(submitContactLead).mockReset()
    vi.mocked(analytics.trackLeadGeneration).mockReset()
  })

  it("does not promise a checklist file and links privacy and unsubscribe", () => {
    render(<EmailCaptureSection />)
    expect(document.body.textContent).not.toMatch(/checklist materials|\bPDF\b/i)
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute("href", "/privacy-policy/")
    expect(screen.getByRole("link", { name: /how to unsubscribe/i })).toHaveAttribute("href", "/unsubscribe/")
  })

  it("rejects an invalid email without sending a lead", () => {
    render(<EmailCaptureSection />)
    submitWith("not-an-email")
    expect(screen.getByRole("alert")).toHaveTextContent(/valid email/i)
    expect(submitContactLead).not.toHaveBeenCalled()
  })

  it("sends the typed first name, tags the lead as an owner signup and tracks one conversion", async () => {
    vi.mocked(submitContactLead).mockResolvedValue({ success: true, message: "ok", leadId: "l1" })
    render(<EmailCaptureSection />)
    submitWith("pat.smith@example.com", "Pat")
    expect(await screen.findByRole("status")).toHaveTextContent(/follow up at your email/i)
    expect(submitContactLead).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Pat", email: "pat.smith@example.com", inquiryType: "owner", source: "website" }),
    )
    expect(analytics.trackLeadGeneration).toHaveBeenCalledTimes(1)
  })

  it("sends the email address as the name rather than inventing one when no first name is given", async () => {
    vi.mocked(submitContactLead).mockResolvedValue({ success: true, message: "ok", leadId: "l1" })
    render(<EmailCaptureSection />)
    submitWith("pat.smith@example.com")
    await screen.findByRole("status")
    expect(vi.mocked(submitContactLead).mock.calls[0]![0].name).toBe("pat.smith@example.com")
  })

  it("shows the API error and tracks no conversion when the lead is rejected", async () => {
    vi.mocked(submitContactLead).mockResolvedValue({ error: "Validation failed" })
    render(<EmailCaptureSection />)
    submitWith("pat@example.com")
    expect(await screen.findByRole("alert")).toHaveTextContent("Validation failed")
    expect(analytics.trackLeadGeneration).not.toHaveBeenCalled()
  })

  it("shows an error and re-enables the form when the lead request throws", async () => {
    vi.mocked(submitContactLead).mockRejectedValue(new TypeError("Failed to fetch"))

    render(<EmailCaptureSection />)
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.click(screen.getByRole("button", { name: /get updates/i }))

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /get updates/i })).toBeEnabled()
    expect(screen.queryByRole("button", { name: /sending/i })).not.toBeInTheDocument()
  })
})
