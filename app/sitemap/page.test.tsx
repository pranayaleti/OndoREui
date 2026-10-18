import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import SitemapPage from "./page"

describe("/sitemap/ page", () => {
  it("lists every link in the ItemList JSON-LD without per-item descriptions", () => {
    const { container } = render(<SitemapPage />)
    const blocks = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap(
      (node) => {
        const parsed = JSON.parse(node.textContent ?? "null")
        return Array.isArray(parsed) ? parsed : [parsed]
      },
    )
    const itemList = blocks.find((block) => block?.["@type"] === "ItemList")
    expect(itemList).toBeDefined()
    expect(itemList.itemListElement.length).toBe(itemList.numberOfItems)
    expect(itemList.itemListElement.length).toBeGreaterThan(50)
    for (const item of itemList.itemListElement) {
      expect(item.url).toMatch(/^https?:\/\//)
      expect(item.name).toBeTruthy()
      expect(item).not.toHaveProperty("description")
    }
  })

  it("lets the browser skip rendering off-screen sections", () => {
    const { container } = render(<SitemapPage />)
    const sections = container.querySelectorAll("nav[aria-label='Site index'] > section")
    expect(sections.length).toBeGreaterThan(3)
    sections.forEach((section) => expect(section.className).toContain("content-visibility:auto"))
  })

  it("keeps cards a fixed height and scrolls each link list inside its card", () => {
    const { container } = render(<SitemapPage />)
    const cards = container.querySelectorAll("nav[aria-label='Site index'] > section > div")
    expect(cards.length).toBeGreaterThan(3)
    cards.forEach((card) => {
      expect(card.className).toContain("h-80")
      expect(card.querySelector("ul")?.parentElement?.className).toContain("overflow-y-auto")
    })
  })
})
