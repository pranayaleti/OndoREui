import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { EmailCaptureSection } from "./email-capture-section"

vi.mock("@/lib/leads-api", () => ({
  submitContactLead: vi.fn(),
}))

vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackFormSubmission: vi.fn(),
    trackLeadGeneration: vi.fn(),
  },
}))

import { submitContactLead } from "@/lib/leads-api"

describe("EmailCaptureSection", () => {
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
