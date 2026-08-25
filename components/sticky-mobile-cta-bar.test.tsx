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
})
