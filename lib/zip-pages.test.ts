import { describe, expect, it } from "vitest"
import { SITE_URL } from "@/lib/site"
import { allZips, findCityBySlug } from "@/lib/utah-cities"
import { otherCitiesForZip, zipPageCanonical, zipsOwnedByOtherCities } from "./zip-pages"

describe("zipPageCanonical", () => {
  it("points a ZIP page at its primary city's service page", () => {
    expect(zipPageCanonical("property-management", "84043")).toBe(`${SITE_URL}/property-management/lehi/`)
    expect(zipPageCanonical("loans", "84121")).toBe(`${SITE_URL}/loans/cottonwood-heights/`)
    expect(zipPageCanonical("buy-sell", "84107")).toBe(`${SITE_URL}/buy-sell/murray/`)
  })

  it("resolves every generated ZIP to a city page", () => {
    for (const zip of allZips) {
      expect(zipPageCanonical("loans", zip), zip).not.toContain("/zip/")
    }
  })

  it("falls back to the ZIP's own URL when no city has it", () => {
    expect(zipPageCanonical("loans", "90210")).toBe(`${SITE_URL}/loans/zip/90210/`)
  })
})

describe("shared ZIP helpers", () => {
  it("lists the other cities that use a shared ZIP", () => {
    expect(otherCitiesForZip("84015").map((c) => c.name)).toEqual(["Clinton", "West Point", "Sunset"])
    expect(otherCitiesForZip("84043")).toEqual([])
  })

  it("flags the ZIPs a city lists but another city owns", () => {
    expect(zipsOwnedByOtherCities(findCityBySlug("salt-lake-city")!)).toContain("84121")
    expect(zipsOwnedByOtherCities(findCityBySlug("salt-lake-city")!)).not.toContain("84102")
    expect(zipsOwnedByOtherCities(findCityBySlug("cottonwood-heights")!)).toEqual([])
  })
})
