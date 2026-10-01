import { describe, expect, it } from "vitest"
import { CALCULATOR_SLUGS } from "@/lib/calculator-catalog"
import { articleFallbackFor, articleHubFor, isMortgageArticle } from "./article-fallback"

describe("articleHubFor", () => {
  it("uses the Learn hub for posts in the content graph", () => {
    expect(articleHubFor("/blog/appraisal-comes-in-low").href).toBe("/learn")
  })

  it("uses the Learn hub for mortgage categories outside the graph", () => {
    expect(articleHubFor("/blog/mortgage-rate-trends-2025", "Mortgage").href).toBe("/learn")
  })

  it("uses the blog index for landlord, neighborhood and developer posts", () => {
    expect(articleHubFor("/blog/best-neighborhoods-lehi-utah", "Neighborhood Guide")).toMatchObject({
      href: "/blog",
      label: "Blog",
    })
    expect(articleHubFor("/blog/dashboards-for-landlords", "Analytics").href).toBe("/blog")
    expect(articleHubFor("/blog/unknown")).toMatchObject({ href: "/blog" })
    expect(isMortgageArticle("/blog/unknown")).toBe(false)
  })
})

describe("articleFallbackFor", () => {
  it("always returns a call to action and links", () => {
    for (const category of [undefined, "Mortgage", "Property Management", "Notary", "Selling", "Strategy", "Utah", "Made Up"]) {
      const fallback = articleFallbackFor(category)
      expect(fallback.cta.href).toMatch(/^\//)
      expect(fallback.links.length).toBeGreaterThan(0)
    }
  })

  it("routes landlord and operations posts to property management", () => {
    expect(articleFallbackFor("Operations").cta.href).toBe("/property-management")
  })

  it("only links calculators that exist", () => {
    const slugs = new Set(CALCULATOR_SLUGS)
    for (const category of ["Strategy", "Selling", "Mortgage", "Property Management"]) {
      for (const link of [articleFallbackFor(category).cta, ...articleFallbackFor(category).links]) {
        const match = /^\/calculators\/([^/]+)/.exec(link.href)
        if (match) expect(slugs.has(match[1])).toBe(true)
      }
    }
  })
})
