import { describe, expect, it } from "vitest"
import {
  allCitySlugs,
  groupUtahCitiesByCounty,
  toCitySlug,
  utahCitiesFromNorthOgdenToNephi,
} from "./utah-cities"

describe("groupUtahCitiesByCounty", () => {
  it("includes every city exactly once", () => {
    const grouped = groupUtahCitiesByCounty()
    const names = grouped.flatMap((g) => g.cities.map((c) => c.name))
    expect(names.sort()).toEqual([...utahCitiesFromNorthOgdenToNephi.map((c) => c.name)].sort())
  })

  it("keeps Weber before Juab", () => {
    const counties = groupUtahCitiesByCounty().map((g) => g.county)
    expect(counties.indexOf("Weber")).toBeLessThan(counties.indexOf("Juab"))
  })
})

describe("toCitySlug", () => {
  it("matches published buy-sell city paths", () => {
    expect(toCitySlug("West Valley City")).toBe("west-valley-city")
    expect(toCitySlug("Taylorsville")).toBe("taylorsville")
    expect(allCitySlugs).toContain("west-valley-city")
    expect(allCitySlugs).toContain("lehi")
  })
})
