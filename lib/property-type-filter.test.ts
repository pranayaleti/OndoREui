import { describe, expect, it } from "vitest"
import {
  PROPERTY_TYPE_FILTER_OPTIONS,
  matchesPropertyTypeFilter,
  normalizePropertyType,
} from "./property-type-filter"

describe("normalizePropertyType", () => {
  it("maps the API's labels onto the filter vocabulary", () => {
    expect(normalizePropertyType("Apartment")).toBe("apartment")
    expect(normalizePropertyType("Single Family")).toBe("house")
    expect(normalizePropertyType("single-family")).toBe("house")
    expect(normalizePropertyType("Duplex")).toBe("multi-family")
    expect(normalizePropertyType("Condo")).toBe("condo")
    expect(normalizePropertyType("Townhome")).toBe("townhouse")
  })

  it("passes unknown labels through lowercased", () => {
    expect(normalizePropertyType("  Cabin ")).toBe("cabin")
    expect(normalizePropertyType(null)).toBe("")
  })
})

describe("matchesPropertyTypeFilter", () => {
  it("matches every homepage type link against the API's casing", () => {
    expect(matchesPropertyTypeFilter("Apartment", "apartment")).toBe(true)
    expect(matchesPropertyTypeFilter("Single Family", "house")).toBe(true)
    expect(matchesPropertyTypeFilter("Condo", "condo")).toBe(true)
    expect(matchesPropertyTypeFilter("Duplex", "multi-family")).toBe(true)
  })

  it("accepts a deep link written in the API's casing", () => {
    expect(matchesPropertyTypeFilter("Apartment", "Apartment")).toBe(true)
  })

  it("rejects other types and keeps 'any' open", () => {
    expect(matchesPropertyTypeFilter("Apartment", "house")).toBe(false)
    expect(matchesPropertyTypeFilter("Duplex", "house")).toBe(false)
    expect(matchesPropertyTypeFilter("Duplex", "any")).toBe(true)
  })

  it("offers every vocabulary value in the select", () => {
    const values = PROPERTY_TYPE_FILTER_OPTIONS.map((o) => o.value)
    expect(values).toEqual(expect.arrayContaining(["apartment", "house", "townhouse", "condo", "studio", "multi-family"]))
  })
})
