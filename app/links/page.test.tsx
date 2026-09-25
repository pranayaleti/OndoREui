import { describe, it, expect, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_SOCIAL_LINKS: [
    { url: "https://www.instagram.com/OnDoRealEstate", live: true },
    { url: "https://www.facebook.com/OnDoRealEstate", live: false },
  ],
}))

import LinksPage from "./page"

describe("/links page", () => {
  it("names the business in the page's one h1", () => {
    render(<LinksPage />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ondo Real Estate")
  })

  it("groups links under headings screen readers can jump between", () => {
    render(<LinksPage />)
    const heading = screen.getByRole("heading", { level: 2, name: "Own a rental?" })
    const group = heading.closest("section")!
    expect(within(group).getByRole("link", { name: /see what it should rent for/i })).toHaveAttribute(
      "href",
      "/whats-my-home-worth/",
    )
  })

  it("tags every button with its analytics id", () => {
    render(<LinksPage />)
    expect(screen.getByRole("link", { name: /book a free 30-minute call/i })).toHaveAttribute(
      "data-links-id",
      "book-call",
    )
    expect(screen.getByRole("link", { name: /buy a home in utah/i })).toHaveAttribute("data-links-id", "buy")
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

  it("offers email, a phone call, and each live social profile", () => {
    render(<LinksPage />)
    expect(screen.getByRole("link", { name: "Email Ondo" })).toHaveAttribute(
      "href",
      "mailto:info@ondorealestate.com",
    )
    expect(screen.getByRole("link", { name: "Call Ondo" })).toHaveAttribute("href", "tel:+14085380420")
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
