// lib/notary-cities.test.ts
import { describe, expect, it } from "vitest"
import {
  NOTARY_CITIES,
  getNotaryCity,
  getNotaryCitiesByStateSlug,
  getAllNotaryCityParams,
  getAllNotaryStateParams,
  notaryCityPath,
  notaryStatePath,
} from "./notary-cities"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "./utah-cities"
import { isReservedNotarySegment } from "./notary-ron-states"

describe("notary-cities", () => {
  it("builds hundreds of cities, not tens of thousands", () => {
    expect(NOTARY_CITIES.length).toBeGreaterThan(200)
    expect(NOTARY_CITIES.length).toBeLessThan(2000)
  })

  it("uses nested URL helpers", () => {
    expect(notaryStatePath("california")).toBe("/notary/california/")
    expect(notaryCityPath("california", "los-angeles")).toBe("/notary/california/los-angeles/")
  })

  it("resolves curated cities and 404s unknowns via undefined", () => {
    expect(getNotaryCity("california", "los-angeles")?.name).toBe("Los Angeles")
    expect(getNotaryCity("california", "not-a-real-city")).toBeUndefined()
  })

  it("includes all Wasatch Front Utah cities", () => {
    const ut = getNotaryCitiesByStateSlug("utah")
    for (const c of utahCitiesFromNorthOgdenToNephi) {
      expect(ut.some((x) => x.slug === toCitySlug(c.name))).toBe(true)
    }
    expect(ut.length).toBeGreaterThan(10)
  })

  it("caps non-Utah states at 10 cities", () => {
    const byState = new Map<string, number>()
    for (const c of NOTARY_CITIES) {
      byState.set(c.stateSlug, (byState.get(c.stateSlug) ?? 0) + 1)
    }
    for (const [slug, count] of byState) {
      if (slug === "utah") continue
      expect(count).toBeLessThanOrEqual(10)
    }
  })

  it("static params never include reserved segments", () => {
    for (const { state } of getAllNotaryStateParams()) {
      expect(isReservedNotarySegment(state)).toBe(false)
    }
    expect(getAllNotaryCityParams().every((p) => p.state && p.city)).toBe(true)
  })

  it("has unique state+city slug pairs", () => {
    const keys = NOTARY_CITIES.map((c) => `${c.stateSlug}/${c.slug}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe("notary-cities nearby links", () => {
  const find = (stateSlug: string, slug: string) =>
    NOTARY_CITIES.find((c) => c.stateSlug === stateSlug && c.slug === slug)

  it("only links to other cities in the same state, never itself or twice", () => {
    for (const city of NOTARY_CITIES) {
      const nearby = city.nearbyCitySlugs ?? []
      expect(new Set(nearby).size).toBe(nearby.length)
      expect(nearby).not.toContain(city.slug)
      for (const slug of nearby) {
        expect(find(city.stateSlug, slug), `${city.stateSlug}/${city.slug} -> ${slug}`).toBeDefined()
      }
    }
  })

  // Only Utah cities carry coordinates, so only Utah can be checked for real distance.
  // The ceiling is the width of the Wasatch Front list (Nephi to North Ogden is about 111 miles).
  it("keeps Utah nearby links within the Wasatch Front, by great-circle distance", () => {
    const miles = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
      const rad = (d: number) => (d * Math.PI) / 180
      const h =
        Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
        Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
      return 2 * 3958.8 * Math.asin(Math.sqrt(h))
    }
    for (const city of getNotaryCitiesByStateSlug("utah")) {
      expect(city.lat, `${city.name} has coordinates`).toBeDefined()
      for (const slug of city.nearbyCitySlugs ?? []) {
        const other = find("utah", slug)!
        expect(miles({ lat: city.lat!, lng: city.lng! }, { lat: other.lat!, lng: other.lng! })).toBeLessThan(120)
      }
    }
  })
})
