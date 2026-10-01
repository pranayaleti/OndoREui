import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/components/page-banner", () => ({ PageBanner: () => null }))
vi.mock("@/components/seo", () => ({ default: () => null }))

import AccessibilityPage from "./page"
import { SITE_EMAILS, SITE_PHONE_TEL } from "@/lib/site"

describe("/accessibility page", () => {
  it("does not name a fictional coordinator or claim unverified compliance", () => {
    const { container } = render(<AccessibilityPage />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/Sarah Johnson/)
    expect(text).not.toMatch(/Section 508/)
    expect(text).not.toMatch(/ADA Compliance/)
    expect(text).not.toMatch(/fully compatible/i)
    expect(text).not.toMatch(/Voice control/i)
    expect(text).not.toMatch(/user testing with people/i)
  })

  it("states a target, known issues and a review date", () => {
    render(<AccessibilityPage />)
    expect(screen.getByText(/Our target is WCAG 2\.1 Level AA/)).toBeInTheDocument()
    expect(screen.getByText("Known Issues")).toBeInTheDocument()
    expect(screen.getByText(/September 30, 2026/)).toBeInTheDocument()
  })

  it("links the accessibility email and phone", () => {
    const { container } = render(<AccessibilityPage />)
    expect(container.querySelector(`a[href="mailto:${SITE_EMAILS.accessibility}"]`)).not.toBeNull()
    expect(container.querySelector(`a[href="tel:${SITE_PHONE_TEL}"]`)).not.toBeNull()
  })
})
