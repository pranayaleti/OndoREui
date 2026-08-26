import { describe, expect, it } from "vitest"
import { buildRenterSearchPrefill, DEFAULT_RENT_FILTER_RANGE } from "./renter-search-prefill"

describe("buildRenterSearchPrefill", () => {
  it("returns a generic leasing note when no filters are set", () => {
    const message = buildRenterSearchPrefill({
      searchQuery: "",
      bedrooms: "any",
      bathrooms: "any",
      propertyType: "any",
      priceRange: DEFAULT_RENT_FILTER_RANGE,
    })
    expect(message).toMatch(/Ondo-managed rental/)
    expect(message).toMatch(/showing/)
    expect(message).not.toMatch(/quality/i)
    expect(message).not.toMatch(/family|occupant|children/i)
  })

  it("includes city search, beds, and a custom max rent", () => {
    const message = buildRenterSearchPrefill({
      searchQuery: "Lehi",
      bedrooms: "3",
      bathrooms: "any",
      propertyType: "house",
      priceRange: [500, 2000],
    })
    expect(message).toContain("area: Lehi")
    expect(message).toContain("3 bedroom")
    expect(message).toContain("house")
    expect(message).toContain("budget up to $2,000/mo")
  })

  it("describes studio and 4+ bedroom filters without inventing occupant type", () => {
    expect(
      buildRenterSearchPrefill({ bedrooms: "studio" }),
    ).toContain("studio")
    expect(
      buildRenterSearchPrefill({ bedrooms: "4+" }),
    ).toContain("4 or more bedrooms")
  })

  it("prefers a specific listing over filter chips when a title is present", () => {
    const message = buildRenterSearchPrefill({
      searchQuery: "Sandy",
      bedrooms: "2",
      listingTitle: "Daybreak townhome",
      listingAddress: "Lehi, UT",
    })
    expect(message).toBe(
      "I'd like to tour Daybreak townhome at Lehi, UT. Please send available showing times.",
    )
    expect(message).not.toContain("Sandy")
  })
})
