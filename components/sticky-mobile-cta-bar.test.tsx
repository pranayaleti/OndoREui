import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

let mockPathname = "/"
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}))

import { StickyMobileCtaBar } from "./sticky-mobile-cta-bar"

describe("StickyMobileCtaBar", () => {
  beforeEach(() => {
    mockPathname = "/"
  })

  it("renders Call and Free rental analysis on marketing pages", () => {
    const { container } = render(<StickyMobileCtaBar />)
    expect(container.firstChild).not.toBeNull()
    expect(screen.getByRole("link", { name: /call ondo re/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /free rental analysis/i })).toBeInTheDocument()
  })

  it("hides itself on portal/auth routes", () => {
    mockPathname = "/login"
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
    expect(
      screen.queryByRole("link", { name: /free rental analysis/i }),
    ).not.toBeInTheDocument()
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
    expect(screen.queryByRole("link", { name: /free rental analysis/i })).not.toBeInTheDocument()
  })

  it("keeps rental analysis on the listings browse page", () => {
    mockPathname = "/properties"
    render(<StickyMobileCtaBar />)
    expect(screen.getByRole("link", { name: /free rental analysis/i })).toBeInTheDocument()
  })
})
