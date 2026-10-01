import { describe, expect, it } from "vitest"
import {
  allCitySlugs,
  findCitiesByZip,
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

describe("findCitiesByZip", () => {
  it("returns every city that shares a ZIP", () => {
    expect(findCitiesByZip("84015").map((c) => c.name)).toEqual(["Clinton", "West Point", "Sunset", "Clearfield"])
    expect(findCitiesByZip("84070").map((c) => c.name)).toEqual(["Midvale", "Sandy"])
  })

  it("returns one city for a unique ZIP and none for an unknown ZIP", () => {
    expect(findCitiesByZip("84043").map((c) => c.name)).toEqual(["Lehi"])
    expect(findCitiesByZip("90210")).toEqual([])
  })
})
