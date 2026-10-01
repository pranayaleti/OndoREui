import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

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
