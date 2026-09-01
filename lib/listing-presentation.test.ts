import { describe, expect, it } from "vitest"
import {
  availabilityBadge,
  bathsLabel,
  bedsLabel,
  formatAmenityLabel,
  formatCapRate,
  formatListedCents,
  formatMonthlyRent,
  formatPropertyType,
  formatSqft,
  groupAmenities,
  listingCardChips,
  listingCityGuideHref,
  listingCompareFieldValue,
  listingCostRows,
  listingEmbedFromUrl,
  listingHighlights,
  listingLocationFacts,
  listingMarketStatus,
  listingMetricRows,
  listingInquiryDraftMessage,
  listingPetPolicyRows,
  listingPublicDocuments,
  listingSpecRows,
  petNotesFromAmenities,
  pickRelatedListings,
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

  it("maps approved vacant listings to For Lease, not For Sale", () => {
    expect(listingMarketStatus({ status: "approved" })).toEqual({
      label: "For Lease",
      tone: "lease",
    })
    expect(listingMarketStatus({ status: "pending" })?.label).toBe("Pending")
    expect(listingMarketStatus({ status: "occupied" })?.label).toBe("Leased")
    expect(listingMarketStatus({ status: "approved", listingKind: "sale" })?.label).toBe("For Sale")
  })

  it("omits spec rows and metrics that were not on the listing", () => {
    const rows = listingSpecRows({
      price: 2195,
      type: "house",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1600,
    })
    expect(rows.map((r) => r.id)).toEqual(["price", "type", "beds", "baths", "sqft"])
    expect(listingMetricRows({ price: 2195, sqft: 1600 }).map((r) => r.id)).toEqual(["priceSf"])
    expect(listingMetricRows({ price: 2195, sqft: 0 })).toEqual([])
    expect(formatCapRate(0)).toBeNull()
  })

  it("ranks related homes by type and city instead of padding at random", () => {
    const current = {
      publicId: "a",
      type: "house",
      city: "Lehi",
      state: "UT",
      price: 2000,
      sqft: 1600,
    }
    const related = pickRelatedListings(current, [
      { publicId: "a", type: "house", city: "Lehi", state: "UT", price: 2000, sqft: 1600 },
      { publicId: "b", type: "house", city: "Lehi", state: "UT", price: 2100, sqft: 1500 },
      { publicId: "c", type: "condo", city: "Ogden", state: "WY", price: 900, sqft: 700 },
    ])
    expect(related.map((r) => r.publicId)).toEqual(["b"])
  })

  it("embeds YouTube or Matterport URLs and ignores ordinary websites", () => {
    expect(listingEmbedFromUrl("https://www.youtube.com/watch?v=dQw4w9wgccc")?.kind).toBe("youtube")
    expect(listingEmbedFromUrl("https://my.matterport.com/show/?m=abc")?.kind).toBe("matterport")
    expect(listingEmbedFromUrl("https://ondorealestate.com")).toBeNull()
    expect(listingPublicDocuments([{ id: "1", title: "Flyer", type: "flyer", url: "not-a-url" }])).toEqual([])
    expect(
      listingPublicDocuments([
        { id: "1", title: "Flyer", type: "flyer", url: "https://cdn.example/flyer.pdf" },
      ]),
    ).toHaveLength(1)
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

  it("drafts an inquiry from the real address and stays quiet without one", () => {
    expect(listingInquiryDraftMessage("333 Main St, Park City, UT, 84060")).toBe(
      "I'm interested in 333 Main St, Park City, UT, 84060.",
    )
    expect(listingInquiryDraftMessage("  ")).toBe("")
  })

  it("labels studio vs beds without inventing a bedroom count", () => {
    expect(bedsLabel(0)).toBe("Studio")
    expect(bedsLabel(3)).toBe("3 beds")
    expect(bathsLabel(2.5)).toBe("2.5 baths")
  })

  it("puts pet-friendly and amenity chips on cards only from listing facts", () => {
    expect(listingCardChips({ amenities: [] })).toEqual([])
    const chips = listingCardChips({
      amenities: ["laundry", "pet_friendly", "parking"],
    })
    expect(chips.map((c) => c.label)).toEqual(["Pets allowed", "Laundry", "Parking"])
    expect(
      listingCardChips({
        amenities: ["laundry", "pet_friendly"],
        petPolicy: {
          petsAllowed: false,
          allowedSpecies: [],
          maxPets: null,
          maxWeightLbs: null,
          monthlyPetRentCents: null,
          petDepositCents: null,
        },
      }).map((c) => c.label),
    ).toEqual(["Laundry"])
  })

  it("shows listed pet fees and omits zeros", () => {
    expect(formatListedCents(0)).toBeNull()
    expect(formatListedCents(2500)).toBe("$25.00")
    const rows = listingPetPolicyRows({
      petsAllowed: true,
      allowedSpecies: ["dog", "cat"],
      maxPets: 2,
      maxWeightLbs: 40,
      monthlyPetRentCents: 2500,
      petDepositCents: 30000,
    })
    expect(rows.map((r) => r.id)).toEqual(["allowed", "species", "maxPets", "weight", "rent", "deposit"])
    expect(listingPetPolicyRows(null)).toEqual([])
  })

  it("builds location facts from address parts without neighborhood scores", () => {
    const facts = listingLocationFacts({
      addressLine1: "123 E St",
      addressLine2: null,
      city: "Lehi",
      state: "UT",
      zipcode: "84043",
    })
    expect(facts.map((f) => f.id)).toEqual(["street", "city", "state", "zip"])
    expect(listingCityGuideHref("Lehi")).toBe("/locations/lehi/")
    expect(listingCityGuideHref("Atlantis")).toBeNull()
    expect(listingCompareFieldValue({
      id: "location",
      price: 2195,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 0,
      city: "Lehi",
      state: "UT",
    })).toBe("Lehi, UT")
    expect(listingCompareFieldValue({
      id: "sqft",
      price: 2195,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 0,
    })).toBe("Not listed")
  })
})
