import { describe, expect, it } from "vitest"
import {
  allCitySlugs,
  allZips,
  cityGuideLabel,
  findCitiesByZip,
  findCityByZip,
  ZIP_PRIMARY_CITY,
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

describe("findCityByZip", () => {
  it("sends a city's only ZIP to that city, not to Salt Lake City", () => {
    expect(findCityByZip("84121")?.name).toBe("Cottonwood Heights")
    expect(findCityByZip("84107")?.name).toBe("Murray")
    expect(findCityByZip("84117")?.name).toBe("Holladay")
    expect(findCityByZip("84129")?.name).toBe("Taylorsville")
    expect(findCityByZip("84003")?.name).toBe("American Fork")
    expect(findCityByZip("84015")?.name).toBe("Clearfield")
  })

  it("returns the only city for an unshared ZIP and nothing for an unknown ZIP", () => {
    expect(findCityByZip("84043")?.name).toBe("Lehi")
    expect(findCityByZip("90210")).toBeUndefined()
  })

  it("has an explicit primary city for every shared ZIP, and that city lists the ZIP", () => {
    const shared = allZips.filter((zip) => findCitiesByZip(zip).length > 1)
    expect(shared.sort()).toEqual(Object.keys(ZIP_PRIMARY_CITY).sort())
    for (const zip of shared) {
      expect(findCitiesByZip(zip).map((c) => c.name)).toContain(ZIP_PRIMARY_CITY[zip])
      expect(findCityByZip(zip)?.name).toBe(ZIP_PRIMARY_CITY[zip])
    }
  })
})

describe("cityGuideLabel", () => {
  it("does not repeat City for names that already end in it", () => {
    expect(cityGuideLabel("Salt Lake City")).toBe("Salt Lake City Guide")
    expect(cityGuideLabel("West Valley City")).toBe("West Valley City Guide")
    expect(cityGuideLabel("Lehi")).toBe("Lehi City Guide")
    expect(cityGuideLabel("Cityview")).toBe("Cityview City Guide")
  })
})
