import { describe, it, expect } from "vitest"
import { generateRealEstateBusinessJsonLd } from "./seo"
import { getTestimonialKind, testimonials } from "./testimonials"

/**
 * Guards the rule testimonials.ts states but the schema layer used to ignore:
 * "Do not present composites as Google reviews."
 */
describe("business JSON-LD never publishes composite testimonials as reviews", () => {
  const jsonLd = generateRealEstateBusinessJsonLd() as Record<string, unknown>

  const realReviews = testimonials.filter(
    (t) => typeof t.rating === "number" && t.rating > 0 && getTestimonialKind(t) === "review",
  )

  it("omits aggregateRating entirely when no permissioned reviews exist", () => {
    if (realReviews.length === 0) {
      expect(jsonLd['aggregateRating']).toBeUndefined()
      expect(jsonLd['review']).toBeUndefined()
    } else {
      expect(jsonLd['aggregateRating']).toBeDefined()
    }
  })

  it("never counts more reviews than it has genuine ones", () => {
    const agg = jsonLd['aggregateRating'] as { reviewCount?: number } | undefined
    if (!agg) return
    expect(agg.reviewCount).toBeLessThanOrEqual(realReviews.length)
  })

  it("never names a composite author in a Review node", () => {
    const reviews = (jsonLd['review'] ?? []) as Array<{ author?: { name?: string } }>
    const compositeNames = new Set(
      testimonials.filter((t) => getTestimonialKind(t) === "composite").map((t) => t.name),
    )
    const leaked = reviews
      .map((r) => r.author?.name)
      .filter((name): name is string => Boolean(name) && compositeNames.has(name))
    expect(leaked, "composite testimonial names must not appear as review authors").toEqual([])
  })

  it("still emits the business entity itself", () => {
    // The fix must remove the review claims, not the LocalBusiness node.
    expect(jsonLd['name']).toBeTruthy()
    expect(jsonLd['address']).toBeDefined()
  })
})
