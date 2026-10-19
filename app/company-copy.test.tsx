import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import AboutPage from "./about/page"
import { NotaryBooking } from "@/components/notary-booking"
import { SITE_ADDRESS } from "@/lib/site"

vi.mock("@/components/ConsultationModal", () => ({ default: () => null }))

const INTERNAL_PHRASES = /outbound sales engine|pipeline from zero|go-to-market|placeholder|coming[- ]soon|course upsell/i

describe("company page copy", () => {
  it("about page names the founder, the Lehi office and licensing instead of sales-team language", () => {
    const { container } = render(<AboutPage />)
    expect(container.textContent).not.toMatch(INTERNAL_PHRASES)
    expect(screen.getByRole("heading", { name: "Who runs Ondo" })).toBeTruthy()
    expect(container.textContent).toContain("Pranay Reddy Aleti")
    expect(container.textContent).toContain(SITE_ADDRESS)
    expect(screen.getByRole("link", { name: /Licensing and disclosures/ }).getAttribute("href")).toBe("/licensing/")
  })

  it("remote-only notary booking does not invite mobile calls", () => {
    const { container } = render(<NotaryBooking />)
    expect(container.textContent).toContain("For urgent remote requests")
    expect(container.textContent).not.toMatch(/mobile/i)
  })
})
