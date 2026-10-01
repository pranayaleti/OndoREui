import { fireEvent, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: ({ fill: _fill, priority: _priority, ...props }: Record<string, unknown>) => <img {...props} />,
}))

import BlogPage from "./page-client"

describe("blog index cards", () => {
  it("renders each post title as an h3 containing the only link to that post", () => {
    render(<BlogPage />)
    const latest = screen.getByRole("heading", { level: 2, name: "Latest Articles" })
    const grid = latest.nextElementSibling as HTMLElement
    const headings = within(grid).getAllByRole("heading", { level: 3 })
    expect(headings.length).toBeGreaterThan(1)
    for (const h of headings) {
      const link = within(h).getByRole("link")
      expect(link).toHaveAccessibleName(h.textContent ?? "")
      expect(link.getAttribute("href")).toMatch(/^\/blog\/[a-z0-9-]+\/?$/)
    }
    // One link per card, so the accessible name is the title, not the whole card.
    expect(within(grid).getAllByRole("link")).toHaveLength(headings.length)
    expect(grid.querySelectorAll("img:not([alt=''])")).toHaveLength(0)
  })

  it("names the featured link after the article", () => {
    render(<BlogPage />)
    const featuredSection = screen.getByRole("heading", { level: 2, name: "Featured Article" }).parentElement as HTMLElement
    const featured = within(featuredSection).getByRole("heading", { level: 3 })
    const link = screen.getAllByRole("link").find((a) => /^Read More/.test(a.textContent ?? ""))
    expect(link).toBeDefined()
    expect(link).toHaveAccessibleName(expect.stringContaining(featured.textContent ?? ""))
  })

  it("keeps the closing CTA readable in the light theme", () => {
    render(<BlogPage />)
    const cta = screen.getByRole("heading", { name: "Ready to Make Your Real Estate Move?" }).closest("section")
    expect(cta?.className).toContain("text-foreground")
    expect(cta?.className).not.toContain("text-white")
  })
})

describe("blog index newsletter and filters", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/")
  })

  it("sends newsletter clicks to /subscribe/ with blog attribution, not the contact form", () => {
    render(<BlogPage />)
    const links = screen.getAllByRole("link", { name: "Subscribe to Newsletter" })
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      const href = link.getAttribute("href") ?? ""
      expect(href.startsWith("/subscribe/")).toBe(true)
      expect(href).toContain("utm_source=blog")
      expect(link).toHaveAttribute("data-analytics-event", "subscribe_click")
    }
  })

  it("moves the filter column above the article list on mobile only", () => {
    render(<BlogPage />)
    const sidebar = screen.getByText("Categories").closest("div.order-first")
    expect(sidebar).not.toBeNull()
    expect(sidebar?.className).toContain("lg:order-none")
  })

  it("shows a no-results message with a way back when combined filters match nothing", () => {
    render(<BlogPage />)
    fireEvent.click(screen.getByRole("button", { name: /^Notary/ }))
    fireEvent.click(screen.getByRole("button", { name: "Lehi" }))
    expect(screen.getByText(/no articles match that category and city together/i)).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("0 articles shown")
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }))
    expect(screen.queryByText(/no articles match/i)).not.toBeInTheDocument()
    expect(screen.getByRole("status").textContent).toMatch(/^\d+ articles shown$/)
    expect(window.location.search).toBe("")
  })

  it("keeps the filter in the URL and restores it on load", () => {
    const { unmount } = render(<BlogPage />)
    fireEvent.click(screen.getByRole("button", { name: /^Refinance/ }))
    expect(window.location.search).toBe("?category=Refinance")
    unmount()

    render(<BlogPage />)
    expect(screen.getByRole("button", { name: /^Refinance/ })).toHaveAttribute("aria-pressed", "true")
  })

  it("lists the one Mortgage post under the Mortgages category", () => {
    render(<BlogPage />)
    expect(screen.queryByRole("button", { name: /^Mortgage \d/ })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^Mortgages/ })).toBeInTheDocument()
  })
})

