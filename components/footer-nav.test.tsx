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

const COLUMNS = ["Buy a Home", "Sell a Home", "Home Loans", "Refinance", "Property Management", "Calculators", "Learn", "About Ondo"]
const hrefsIn = (name: string) =>
  within(screen.getByRole("navigation", { name }))
    .getAllByRole("link")
    .map((a) => a.getAttribute("href")?.replace(/\/$/, ""))

describe("Footer navigation columns", () => {
  it("replaces the long About Us column with eight even groups", () => {
    render(<Footer />)
    expect(screen.queryByRole("navigation", { name: "About Us" })).not.toBeInTheDocument()
    for (const name of COLUMNS) {
      // The heading link plus six page links.
      expect(hrefsIn(name), name).toHaveLength(7)
    }
  })

  it("puts the area guides and glossary under Learn and About Ondo", () => {
    render(<Footer />)
    expect(hrefsIn("Learn")).toEqual(expect.arrayContaining(["/glossary", "/neighborhoods", "/why-utah"]))
    expect(hrefsIn("About Ondo")).toEqual(expect.arrayContaining(["/about", "/locations", "/contact"]))
  })

  it("links the owner, solutions and platform hubs that the hover-only header menus hide from crawlers", () => {
    render(<Footer />)
    expect(hrefsIn("Property Management")).toEqual(
      expect.arrayContaining(["/property-management", "/pricing", "/compare-utah-property-managers", "/solutions"]),
    )
    expect(hrefsIn("Learn")).toEqual(expect.arrayContaining(["/tour", "/why-utah"]))
  })

  it("does not link the sweepstakes page", () => {
    render(<Footer />)
    expect(screen.queryByRole("link", { name: /sweepstakes/i })).not.toBeInTheDocument()
  })
})
