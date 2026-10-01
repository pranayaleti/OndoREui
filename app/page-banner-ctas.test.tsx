import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

// Client-only widgets that these server pages embed are not what is under test here.
vi.mock("@/components/ConsultationCTA", () => ({ default: () => null }))
vi.mock("@/components/buy/buy-lending-strip", () => ({ BuyLendingStrip: () => null }))
vi.mock("@/components/webmcp-mortgage-tool", () => ({ WebMCPMortgageTool: () => null }))
vi.mock("@/components/buy/webmcp-mortgage-tool", () => ({ WebMCPMortgageTool: () => null }))
vi.mock("@/components/leads/listing-packet-form", () => ({ ListingPacketForm: () => null }))

import PropertyManagementPage from "./property-management/page"
import SellPage from "./sell/page"
import BuyPage from "./buy/page"
import LoansPage from "./loans/page"
import RefinancePage from "./refinance/page"
import { SITE_PHONE_TEL } from "@/lib/site"

function bannerLink(name: string) {
  // A page may repeat the same label further down, so pick the banner's own link.
  const matches = screen
    .getAllByRole("link", { name })
    .filter((link) => link.getAttribute("data-analytics-category") === "page_banner")
  expect(matches).toHaveLength(1)
  return matches[0]!
}

describe("first-screen calls to action on the revenue pages", () => {
  it("property management offers the home estimate and a call, and links fees and service pages", () => {
    render(<PropertyManagementPage />)
    expect(bannerLink("Get a free home estimate")).toHaveAttribute("href", "/whats-my-home-worth/")
    expect(bannerLink("Call us")).toHaveAttribute("href", `tel:${SITE_PHONE_TEL}`)

    expect(screen.getByRole("heading", { name: "What management costs" })).toBeInTheDocument()
    expect(screen.getByText("10%", { selector: "p" })).toBeInTheDocument()
    expect(screen.getByText("8%", { selector: "p" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /see full pricing/i })).toHaveAttribute("href", "/pricing/")
    for (const href of [
      "/property-management/tenant-screening/",
      "/property-management/maintenance-coordination/",
      "/property-management/owner-reporting/",
    ]) {
      expect(document.querySelector(`a[href="${href}"]`)).not.toBeNull()
    }
  })

  it("sell offers the home value and jumps to the listing packet form", () => {
    render(<SellPage />)
    expect(bannerLink("Get my home value")).toHaveAttribute("href", "/whats-my-home-worth/")
    expect(bannerLink("Request listing packet")).toHaveAttribute("href", "#listing-packet-heading")
    expect(document.getElementById("listing-packet-heading")).not.toBeNull()
  })

  it("buy offers the affordability quiz in the first screen", () => {
    render(<BuyPage />)
    expect(bannerLink("See what you can afford")).toHaveAttribute("href", "/buy/quiz/")
  })

  it("loans and refinance send borrowers to the loan inquiry page", () => {
    const { unmount } = render(<LoansPage />)
    expect(bannerLink("Talk with a loan officer")).toHaveAttribute("href", "/qualify/")
    unmount()
    render(<RefinancePage />)
    expect(bannerLink("Talk with a loan officer")).toHaveAttribute("href", "/qualify/")
  })
})
