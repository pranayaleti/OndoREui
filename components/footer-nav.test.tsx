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

const COLUMNS = ["Rent", "Buy", "Sell", "Manage", "Loans", "Notary", "Tools", "Company"]
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

  it("puts the glossary and service areas under Tools and the company pages under Company", () => {
    render(<Footer />)
    expect(hrefsIn("Tools")).toEqual(expect.arrayContaining(["/glossary", "/locations", "/calculators"]))
    expect(hrefsIn("Company")).toEqual(expect.arrayContaining(["/about", "/licensing", "/contact"]))
  })

  it("gives every service column its own page links", () => {
    render(<Footer />)
    expect(hrefsIn("Manage")).toEqual(expect.arrayContaining(["/property-management", "/pricing", "/faq/owner-faqs"]))
    expect(hrefsIn("Notary")).toEqual(expect.arrayContaining(["/notary", "/notary/on-demand", "/faq/notary-faqs"]))
    expect(hrefsIn("Rent")).toEqual(expect.arrayContaining(["/properties", "/faq/tenant-faqs"]))
  })

  it("does not link the sweepstakes page", () => {
    render(<Footer />)
    expect(screen.queryByRole("link", { name: /sweepstakes/i })).not.toBeInTheDocument()
  })
})
