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
})
