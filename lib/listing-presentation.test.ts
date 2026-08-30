import { describe, expect, it } from "vitest"
import {
  availabilityBadge,
  bathsLabel,
  bedsLabel,
  formatAmenityLabel,
  formatMonthlyRent,
  formatPropertyType,
  formatSqft,
  groupAmenities,
  listingCostRows,
  listingHighlights,
  petNotesFromAmenities,
} from "./listing-presentation"

describe("listing presentation", () => {
  it("formats listed rent without inventing cents", () => {
    expect(formatMonthlyRent(2195)).toBe("$2,195")
  })

  it("omits square footage when the listing did not provide it", () => {
    expect(formatSqft(0)).toBeNull()
    expect(formatSqft(1600)).toBe("1,600 sq ft")
  })

  it("titles property types from slug-like API values", () => {
    expect(formatPropertyType("townhouse")).toBe("Townhouse")
    expect(formatPropertyType("  ")).toBeNull()
  })

  it("maps known amenity keys to housing-safe labels", () => {
    expect(formatAmenityLabel("pet_friendly")).toBe("Pets allowed")
    expect(formatAmenityLabel("laundry")).toBe("Laundry Facilities")
    expect(formatAmenityLabel("Washer/Dryer")).toBe("Washer/Dryer")
  })

  it("groups amenities and hides empty categories", () => {
    const groups = groupAmenities(["laundry", "parking", "pool", "mystery perk"])
    expect(groups.map((g) => g.id)).toEqual(["interior", "outdoor", "parking", "other"])
    expect(groups.find((g) => g.id === "pets")).toBeUndefined()
  })

  it("derives highlights only from listing facts", () => {
    const highlights = listingHighlights({
      amenities: ["laundry", "pet_friendly", "parking"],
      type: "house",
      sqft: 1600,
      leaseTerms: "12 months",
    })
    const labels = highlights.map((h) => h.label).join(" | ")
    expect(labels).toMatch(/Laundry/)
    expect(labels).toMatch(/Pets allowed/)
    expect(labels).toMatch(/Parking/)
    expect(labels).not.toMatch(/family|safe neighborhood|schools|young professional|exclusive/i)
    expect(highlights.length).toBeLessThanOrEqual(6)
  })

  it("does not invent highlights when the listing has no supporting fields", () => {
    expect(listingHighlights({ amenities: [], type: null, sqft: 0, leaseTerms: null })).toEqual([])
  })

  it("does not restate type, size, or lease terms as highlights", () => {
    expect(
      listingHighlights({
        amenities: [],
        type: "duplex",
        sqft: 2400,
        leaseTerms: "12 months",
      }),
    ).toEqual([])
  })

  it("surfaces pet notes only when the listing mentioned pets", () => {
    expect(petNotesFromAmenities(["laundry", "parking"])).toEqual([])
    expect(petNotesFromAmenities(["pet_friendly"]).map((n) => n.label)).toEqual(["Pets allowed"])
  })

  it("treats a past or today available-on date as available now", () => {
    const now = new Date(2026, 7, 30)
    expect(availabilityBadge("2026-08-01", now)).toEqual({
      label: "Available now",
      tone: "now",
    })
    expect(availabilityBadge("now", now).tone).toBe("now")
  })

  it("formats a future available-on date without inventing a sooner one", () => {
    const now = new Date(2026, 7, 30)
    expect(availabilityBadge("2026-10-15", now)).toEqual({
      label: "Available Oct 15, 2026",
      tone: "upcoming",
    })
  })

  it("does not claim available now when move-in was not listed", () => {
    expect(availabilityBadge(null)).toEqual({
      label: "Ask leasing for move-in",
      tone: "ask",
    })
  })

  it("shows listed fees and lease terms only when present", () => {
    expect(listingCostRows({ price: 2195, fees: null, leaseTerms: null }).map((r) => r.id)).toEqual([
      "rent",
    ])
    const withFees = listingCostRows({
      price: 2195,
      fees: "Application fee listed with leasing",
      leaseTerms: "12 months",
    })
    expect(withFees.map((r) => r.id)).toEqual(["rent", "fees", "lease"])
    expect(withFees.every((r) => r.source === "listing")).toBe(true)
  })

  it("labels studio vs beds without inventing a bedroom count", () => {
    expect(bedsLabel(0)).toBe("Studio")
    expect(bedsLabel(3)).toBe("3 beds")
    expect(bathsLabel(2.5)).toBe("2.5 baths")
  })
})
