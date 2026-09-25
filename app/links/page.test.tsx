import { describe, it, expect, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_SOCIAL_LINKS: [
    { url: "https://www.instagram.com/OnDoRealEstate", live: true },
    { url: "https://www.facebook.com/OnDoRealEstate", live: false },
  ],
}))

import { PROPERTIES_MANAGED, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"
import LinksPage from "./page"

describe("/links page", () => {
  it("names the business in the page's one h1", () => {
    render(<LinksPage />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ondo Real Estate")
  })

  // Visitors arrive from a video of the founder, so who he is comes before the links.
  it("introduces the founder in his own words before the first link section", () => {
    render(<LinksPage />)
    const intro = screen.getByRole("heading", { level: 2, name: /hi, i'm pranay/i })
    const firstSection = screen.getByRole("heading", { level: 2, name: "Start here" })
    expect(intro.compareDocumentPosition(firstSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(intro.closest("section")).toHaveTextContent(/own and manage rental property myself/i)
  })

  it("shows the same service-area and portfolio numbers as the homepage", () => {
    render(<LinksPage />)
    expect(screen.getByText(`${UTAH_CITIES_SERVED}+ Utah cities`)).toBeInTheDocument()
    expect(screen.getByText(`${PROPERTIES_MANAGED}+ properties managed`)).toBeInTheDocument()
  })

  it("offers the founder's story and the company background in one place", () => {
    render(<LinksPage />)
    const heading = screen.getByRole("heading", { level: 2, name: "Get to know me" })
    const group = heading.closest("section")!
    expect(within(group).getByRole("link", { name: /read my story/i })).toHaveAttribute("href", "/founders-letter/")
    expect(within(group).getByRole("link", { name: /about ondo real estate/i })).toHaveAttribute("href", "/about/")
  })

  it("groups links under headings screen readers can jump between", () => {
    render(<LinksPage />)
    const heading = screen.getByRole("heading", { level: 2, name: "Rental owners" })
    const group = heading.closest("section")!
    expect(within(group).getByRole("link", { name: /free rent estimate/i })).toHaveAttribute(
      "href",
      "/whats-my-home-worth/",
    )
  })

  // ClickTracker (app/layout.tsx) turns these attributes into GA4 events.
  it("tags every button, social profile and contact tap for analytics", () => {
    render(<LinksPage />)
    const booking = screen.getByRole("link", { name: /book a free 30-minute call/i })
    expect(booking).toHaveAttribute("data-analytics-event", "links_click")
    expect(booking).toHaveAttribute("data-analytics-category", "links_page")
    expect(booking).toHaveAttribute("data-analytics-label", "book-call")
    expect(screen.getByRole("link", { name: /buy a home in utah/i })).toHaveAttribute("data-analytics-label", "buy")
    const instagram = screen.getByRole("link", { name: "Ondo on Instagram" })
    expect(instagram).toHaveAttribute("data-analytics-event", "social_click")
    expect(instagram).toHaveAttribute("data-analytics-label", "instagram")
    const text = screen.getByRole("link", { name: "Text Ondo" })
    expect(text).toHaveAttribute("data-analytics-event", "contact_click")
    expect(text).toHaveAttribute("data-analytics-label", "text")
  })

  it("opens outside links in a new tab without handing them this window", () => {
    render(<LinksPage />)
    const booking = screen.getByRole("link", { name: /book a free 30-minute call/i })
    expect(booking).toHaveAttribute("href", "https://calendly.com/scheduleondo/30min")
    expect(booking).toHaveAttribute("target", "_blank")
    expect(booking).toHaveAttribute("rel", "noopener noreferrer")
  })

  // AttributionCapture keeps UTMs in sessionStorage, which a noopener tab does not inherit.
  it("keeps site links in the same tab so social attribution carries into lead forms", () => {
    render(<LinksPage />)
    const buy = screen.getByRole("link", { name: /buy a home in utah/i })
    expect(buy).toHaveAttribute("href", "/buy/")
    expect(buy).not.toHaveAttribute("target")
  })

  // Owner's call: profiles sit up top like a Linktree header, before any link section.
  it("shows the social profiles above the first link section", () => {
    render(<LinksPage />)
    const instagram = screen.getByRole("link", { name: "Ondo on Instagram" })
    const firstSection = screen.getByRole("heading", { level: 2, name: "Start here" })
    expect(instagram.compareDocumentPosition(firstSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it("offers email, a call, a text, and each live social profile", () => {
    render(<LinksPage />)
    expect(screen.getByRole("link", { name: "Email Ondo" })).toHaveAttribute(
      "href",
      "mailto:info@ondorealestate.com",
    )
    expect(screen.getByRole("link", { name: "Call Ondo" })).toHaveAttribute("href", "tel:+14085380420")
    expect(screen.getByRole("link", { name: "Text Ondo" })).toHaveAttribute("href", "sms:+14085380420")
    expect(screen.getByRole("link", { name: "Ondo on Instagram" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/OnDoRealEstate",
    )
    expect(screen.queryByRole("link", { name: "Ondo on Facebook" })).not.toBeInTheDocument()
  })

  // The page advertises loans and drops the global footer, so it carries its own disclosures.
  it("carries the lending and fair housing disclosures the global footer normally provides", () => {
    render(<LinksPage />)
    expect(screen.getByText(/equal housing opportunity/i)).toBeInTheDocument()
    expect(screen.getByText(/nmls id on file/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /licensing/i })).toHaveAttribute("href", "/licensing/")
  })
})
