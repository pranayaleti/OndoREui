import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

let mockPathname = "/"
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}))

import { analytics } from "@/lib/analytics"
import { StickyMobileCtaBar } from "./sticky-mobile-cta-bar"

describe("StickyMobileCtaBar", () => {
  beforeEach(() => {
    mockPathname = "/"
  })

  it("renders Call and the owner offer on the homepage", () => {
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).not.toBeNull()
    expect(screen.getByRole("link", { name: /call ondo re/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /free home estimate/i }).getAttribute("href")).toMatch(
      /^\/whats-my-home-worth\/?$/,
    )
  })

  it.each(["/property-management/", "/pricing/", "/solutions/landlords/"])(
    "keeps the rental analysis on landlord page %s",
    (pathname) => {
      mockPathname = pathname
      render(<StickyMobileCtaBar />)
      expect(screen.getByRole("link", { name: /free home estimate/i })).toBeInTheDocument()
    },
  )

  it.each([
    ["/buy/", /start the buyer quiz/i, "/buy/quiz"],
    ["/buy/first-time/", /start the buyer quiz/i, "/buy/quiz"],
    ["/sell/", /what's my home worth/i, "/whats-my-home-worth"],
    ["/loans/", /talk with a loan officer/i, "/qualify"],
    ["/refinance/cash-out/", /talk with a loan officer/i, "/qualify"],
    ["/properties/", /book a call/i, "/contact"],
    ["/about/", /what's my home worth/i, "/whats-my-home-worth"],
  ])("shows an audience-fit second button on %s, not the landlord offer", (pathname, name, href) => {
    mockPathname = pathname
    render(<StickyMobileCtaBar />)
    expect(screen.getByRole("link", { name }).getAttribute("href")?.replace(/\/$/, "")).toBe(href)
    expect(screen.queryByRole("link", { name: /free home estimate/i })).not.toBeInTheDocument()
  })

  it("tracks the route-specific event name on click", () => {
    const trackEvent = vi.spyOn(analytics, "trackEvent").mockImplementation(() => undefined)
    mockPathname = "/loans/"
    render(<StickyMobileCtaBar />)
    fireEvent.click(screen.getByRole("link", { name: /talk with a loan officer/i }))
    expect(trackEvent).toHaveBeenCalledWith("mobile_cta_loan_inquiry", "engagement", "sticky_mobile_bar")
    trackEvent.mockRestore()
  })

  it("keeps the rental analysis event name for the rental analysis button", () => {
    const trackEvent = vi.spyOn(analytics, "trackEvent").mockImplementation(() => undefined)
    mockPathname = "/pricing/"
    render(<StickyMobileCtaBar />)
    fireEvent.click(screen.getByRole("link", { name: /free home estimate/i }))
    expect(trackEvent).toHaveBeenCalledWith("mobile_cta_rental_analysis", "engagement", "sticky_mobile_bar")
    trackEvent.mockRestore()
  })

  it("hides itself on the loan inquiry form so the CTA never points at the page it is on", () => {
    mockPathname = "/qualify/"
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).toBeNull()
  })

  it("hides itself on portal/auth routes", () => {
    mockPathname = "/login"
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).toBeNull()
  })

  it("hides itself on the homebuyer quiz so a rental-owner CTA doesn't cover a buyer's form", () => {
    mockPathname = "/buy/quiz/"
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).toBeNull()
  })

  it.each(["/loans/second-look/", "/refinance/watch/"])("hides itself on the loan form %s", (pathname) => {
    mockPathname = pathname
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).toBeNull()
  })

  it("hides itself on the service matcher quiz so it doesn't cover the answer options", () => {
    mockPathname = "/get-matched/"
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).toBeNull()
  })

  it("hides itself on tokenized apply flow", () => {
    mockPathname = "/apply/abc123"
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).toBeNull()
  })

  it("hides the analysis link (but keeps Call) on /whats-my-home-worth", () => {
    mockPathname = "/whats-my-home-worth"
    render(<StickyMobileCtaBar />)
    expect(screen.getByRole("link", { name: /call ondo re/i })).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /home worth|home estimate/i })).not.toBeInTheDocument()
  })

  it("uses a tel: href for the Call button", () => {
    render(<StickyMobileCtaBar />)
    const call = screen.getByRole("link", { name: /call ondo re/i })
    expect(call.getAttribute("href")).toMatch(/^tel:/)
  })

  it("swaps rental analysis for request a showing on a listing detail", () => {
    mockPathname = "/properties/c2e653bf-1b6a-4f0c-9654-82a4896cb137/"
    render(<StickyMobileCtaBar />)
    const showing = screen.getByRole("link", { name: /request a showing/i })
    expect(showing).toHaveAttribute("href", "#listing-inquire")
    expect(screen.queryByRole("link", { name: /free home estimate/i })).not.toBeInTheDocument()
  })

  it("does not offer a landlord analysis on the listings browse page", () => {
    mockPathname = "/properties"
    render(<StickyMobileCtaBar />)
    expect(screen.queryByRole("link", { name: /free home estimate/i })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: /book a call/i })).toBeInTheDocument()
  })
})
