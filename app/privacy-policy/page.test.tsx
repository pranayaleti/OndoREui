import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import PrivacyPolicyPage from "./page"
import { SITE_EMAILS } from "@/lib/site"

describe("PrivacyPolicyPage", () => {
  it("is dated September 30, 2026", () => {
    render(<PrivacyPolicyPage />)
    expect(screen.getByText("September 30, 2026")).toBeInTheDocument()
  })

  it("describes the tracking, SMS, AI assistant and loan data the site uses", () => {
    render(<PrivacyPolicyPage />)
    for (const name of [
      /cookies, tracking and analytics/i,
      /text messages \(sms\)/i,
      /ai assistant and chat/i,
      /loan-related information/i,
      /service providers and third parties/i,
    ]) {
      expect(screen.getByText(name)).toBeInTheDocument()
    }
    for (const vendor of ["Supabase", "HubSpot", "Resend", "Stripe", "Calendly", "OpenStreetMap and Unsplash"]) {
      expect(screen.getByText(`${vendor}:`)).toBeInTheDocument()
    }
    expect(screen.getByText(/hubspotutk/)).toBeInTheDocument()
    expect(screen.getByText(/reply stop/i)).toBeInTheDocument()
  })

  it("gives a way to make a privacy request", () => {
    render(<PrivacyPolicyPage />)
    expect(screen.getByText(new RegExp(`email ${SITE_EMAILS.privacy}`, "i"))).toBeInTheDocument()
  })

  it("does not claim the raw email is stored in the browser", () => {
    const { container } = render(<PrivacyPolicyPage />)
    expect(container.textContent).not.toMatch(/ondo_lead_email/)
  })
})
