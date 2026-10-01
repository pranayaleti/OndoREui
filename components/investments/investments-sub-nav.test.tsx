import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const pathnameMock = vi.fn<() => string>()
vi.mock("next/navigation", () => ({ usePathname: () => pathnameMock() }))

import { InvestmentsSubNav, isInvestmentsLinkActive } from "./investments-sub-nav"

describe("InvestmentsSubNav", () => {
  beforeEach(() => pathnameMock.mockReset())

  it("marks Overview current on /investments/ (trailing slash)", () => {
    pathnameMock.mockReturnValue("/investments/")
    render(<InvestmentsSubNav />)
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Fractional" })).not.toHaveAttribute("aria-current")
  })

  it("marks the matching section current with or without a trailing slash", () => {
    pathnameMock.mockReturnValue("/investments/fractional/")
    const { unmount } = render(<InvestmentsSubNav />)
    expect(screen.getByRole("link", { name: "Fractional" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current")
    unmount()

    pathnameMock.mockReturnValue("/investments/opportunity-zones")
    render(<InvestmentsSubNav />)
    expect(screen.getByRole("link", { name: "Opportunity Zones" })).toHaveAttribute("aria-current", "page")
  })

  it("is not sticky, so it cannot slide under the sticky site header", () => {
    pathnameMock.mockReturnValue("/investments/")
    render(<InvestmentsSubNav />)
    expect(screen.getByRole("navigation", { name: /investment section/i }).className).not.toMatch(/sticky/)
  })

  it("does not treat a sibling path with the same prefix as active", () => {
    expect(isInvestmentsLinkActive("/investments/fractional", "/investments/fractional-extra/")).toBe(false)
    expect(isInvestmentsLinkActive("/investments", "/investments/fractional/")).toBe(false)
  })
})
