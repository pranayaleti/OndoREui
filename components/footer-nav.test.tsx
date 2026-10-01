import { describe, it, expect, vi, beforeAll } from "vitest"
import { render, screen, within } from "@testing-library/react"

vi.mock("next/navigation", () => ({ usePathname: () => "/buy/" }))

import Footer from "./footer"

beforeAll(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

const MAX_LINKS_PER_COLUMN = 10

describe("Footer navigation columns", () => {
  it("splits the old About Us column into Company, Learn and Areas", () => {
    render(<Footer />)
    expect(screen.queryByRole("navigation", { name: "About Us" })).not.toBeInTheDocument()
    for (const name of ["Company", "Learn", "Areas"]) {
      expect(screen.getByRole("navigation", { name })).toBeInTheDocument()
    }
  })

  it("keeps every column short enough to scan", () => {
    render(<Footer />)
    for (const name of ["Buying a Home", "Refinance", "Mortgage Loans", "Calculators", "Company", "Learn", "Areas", "Help Center", "Owners & Investors"]) {
      const links = within(screen.getByRole("navigation", { name })).getAllByRole("listitem")
      expect(links.length, name).toBeLessThanOrEqual(MAX_LINKS_PER_COLUMN)
    }
  })

  it("puts the glossary and academy under Learn and the area guides under Areas", () => {
    render(<Footer />)
    const learn = within(screen.getByRole("navigation", { name: "Learn" }))
    expect(learn.getByRole("link", { name: "Real estate glossary" })).toHaveAttribute("href", expect.stringMatching(/^\/glossary\/?$/))
    expect(learn.getByRole("link", { name: "Academy" })).toHaveAttribute("href", expect.stringMatching(/^\/academy\/?$/))
    const areas = within(screen.getByRole("navigation", { name: "Areas" }))
    for (const href of ["/locations", "/market-reports", "/neighborhoods", "/schools"]) {
      expect(areas.getAllByRole("link").some((a) => a.getAttribute("href")?.replace(/\/$/, "") === href), href).toBe(true)
    }
  })

  it("links the owner, solutions and platform hubs that the hover-only header menus hide from crawlers", () => {
    render(<Footer />)
    const owners = within(screen.getByRole("navigation", { name: "Owners & Investors" }))
    const hrefs = owners.getAllByRole("link").map((a) => a.getAttribute("href")?.replace(/\/$/, ""))
    for (const href of [
      "/property-management",
      "/pricing",
      "/compare-utah-property-managers",
      "/compare",
      "/solutions",
      "/solutions/landlords",
      "/solutions/investors",
      "/solutions/property-managers",
      "/solutions/tenants",
    ]) {
      expect(hrefs, href).toContain(href)
    }
    const learn = within(screen.getByRole("navigation", { name: "Learn" }))
    for (const href of ["/tour", "/why-utah"]) {
      expect(learn.getAllByRole("link").some((a) => a.getAttribute("href")?.replace(/\/$/, "") === href), href).toBe(true)
    }
  })

  it("does not link the sweepstakes page", () => {
    render(<Footer />)
    expect(screen.queryByRole("link", { name: /sweepstakes/i })).not.toBeInTheDocument()
  })
})
