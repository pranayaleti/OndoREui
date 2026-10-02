import { existsSync } from "node:fs"
import { join } from "node:path"
import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import { SITE_INDEX_NOT_LISTED } from "@/lib/site-index"
import { describe, it, expect, vi, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({ usePathname: () => "/buy/" }))

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_SOCIAL_LINKS: [
    { url: "https://www.instagram.com/OnDoRealEstate", live: true },
    { url: "https://www.facebook.com/OnDoRealEstate", live: false },
    { url: "https://x.com/OnDoRealEstate", live: true },
  ],
}))

import Footer, { FOOTER_COLUMNS } from "./footer"

beforeAll(() => {
  // jsdom has no IntersectionObserver; kept so any lazy child in the footer tree can mount.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})

describe("Footer", () => {
  it("links each live social profile by platform name and skips the rest", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/OnDoRealEstate",
    )
    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute("href", "https://x.com/OnDoRealEstate")
    expect(screen.queryByRole("link", { name: "Facebook" })).not.toBeInTheDocument()
  })

  it("reports taps on footer social icons as social_click with the platform", () => {
    render(<Footer />)
    const instagram = screen.getByRole("link", { name: "Instagram" })
    expect(instagram).toHaveAttribute("data-analytics-event", "social_click")
    expect(instagram).toHaveAttribute("data-analytics-category", "footer")
    expect(instagram).toHaveAttribute("data-analytics-label", "instagram")
  })

  it("offers a Book a free call link to /contact/ instead of an inline Calendly embed", () => {
    const { container } = render(<Footer />)
    const book = screen.getByRole("link", { name: "Book a free call" })
    expect(book).toHaveAttribute("href", "/contact/#book-a-call")
    expect(book).toHaveAttribute("data-analytics-event", "book_call_click")
    expect(container.querySelector("iframe")).toBeNull()
    expect(container.querySelector(".calendly-inline-widget")).toBeNull()
  })

  it("sends the all-links QR to /links/ on our own domain", () => {
    render(<Footer />)
    expect(screen.getByRole("link", { name: /all ondo links/i })).toHaveAttribute("href", "/links/")
  })

  it("labels the phone block plainly and shows no REALTOR or MLS marks or servicing label", () => {
    const { container } = render(<Footer />)
    const text = container.textContent ?? ""
    expect(text).toContain("Call or visit Ondo")
    expect(text).not.toMatch(/Loan Servicing Help Center/)
    expect(text).not.toMatch(/REALTOR|Multiple Listing Service/)
    // Licensing is off by default, so no lender strip yet.
    expect(text).not.toMatch(/Equal Housing Lender/)
  })

  it("labels the link groups with an sr-only h2 and keeps each group heading as an h3", () => {
    const { container } = render(<Footer />)
    const siteLinks = screen.getByRole("heading", { level: 2, name: "Site links" })
    expect(siteLinks).toHaveClass("sr-only")
    // Desktop heading link and mobile accordion button are separate h3s, one hidden per breakpoint.
    const buying = screen.getAllByRole("heading", { level: 3, name: "Buy a Home" })
    expect(buying).toHaveLength(2)
    expect(container.querySelector("h3 > button[aria-expanded]")).not.toBeNull()
    // No heading in the footer is deeper than h3 without an h2 before it.
    const order = Array.from(container.querySelectorAll("h2,h3")).map((h) => h.tagName)
    expect(order.indexOf("H3")).toBeGreaterThan(order.indexOf("H2"))
  })
})

describe("footer columns", () => {
  // Two even rows of four on desktop: a column that grows past the others is the clutter this guards against.
  it("has eight columns of six links each", () => {
    expect(FOOTER_COLUMNS).toHaveLength(8)
    for (const column of FOOTER_COLUMNS) expect(column.links, column.label).toHaveLength(6)
  })

  it("leads with buying, selling and home loans", () => {
    expect(FOOTER_COLUMNS.slice(0, 3).map((column) => column.label)).toEqual(["Buy a Home", "Sell a Home", "Home Loans"])
  })

  it("links only to pages that exist and are not hidden from the site index", () => {
    const root = join(__dirname, "..")
    for (const { href } of FOOTER_COLUMNS.flatMap((column) => [column, ...column.links])) {
      const route = href.replace(/^\/+|\/+$/g, "")
      const calculator = /^calculators\/([^/]+)$/.exec(route)?.[1]
      const exists = calculator ? calculator in CALCULATOR_CATALOG : existsSync(join(root, "app", route, "page.tsx"))
      expect(exists, `${href} has no page`).toBe(true)
      expect(SITE_INDEX_NOT_LISTED.has(href), `${href} is hidden from the site index`).toBe(false)
    }
  })
})
