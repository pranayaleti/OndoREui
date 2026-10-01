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

import Footer from "./footer"

beforeAll(() => {
  // jsdom has no IntersectionObserver; the footer lazy-mounts its Calendly embed with one.
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
    const buying = screen.getAllByRole("heading", { level: 3, name: "Buying a Home" })
    expect(buying).toHaveLength(2)
    expect(container.querySelector("h3 > button[aria-expanded]")).not.toBeNull()
    // No heading in the footer is deeper than h3 without an h2 before it.
    const order = Array.from(container.querySelectorAll("h2,h3")).map((h) => h.tagName)
    expect(order.indexOf("H3")).toBeGreaterThan(order.indexOf("H2"))
  })
})
