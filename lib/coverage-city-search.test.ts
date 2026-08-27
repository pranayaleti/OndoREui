import { describe, expect, it } from "vitest"
import { utahCitiesFromNorthOgdenToNephi } from "./utah-cities"
import {
  DEFAULT_COVERAGE_CITY,
  filterCoverageCities,
  resolveCoverageCityName,
} from "./coverage-city-search"

describe("filterCoverageCities", () => {
  it("matches city name or county without requiring an exact string", () => {
    const lehi = filterCoverageCities(utahCitiesFromNorthOgdenToNephi, "lehi")
    expect(lehi.map((city) => city.name)).toEqual(["Lehi"])

    const utahCounty = filterCoverageCities(utahCitiesFromNorthOgdenToNephi, "Utah")
    expect(utahCounty.some((city) => city.name === "Lehi")).toBe(true)
    expect(utahCounty.every((city) => city.county === "Utah")).toBe(true)
  })

  it("returns the full list for an empty query", () => {
    expect(filterCoverageCities(utahCitiesFromNorthOgdenToNephi, "  ")).toHaveLength(
      utahCitiesFromNorthOgdenToNephi.length,
    )
  })
})

describe("resolveCoverageCityName", () => {
  it("jumps to the first match while typing, and keeps the last city when nothing matches", () => {
    expect(resolveCoverageCityName(utahCitiesFromNorthOgdenToNephi, "", "Ogden")).toBe("Ogden")
    expect(resolveCoverageCityName(utahCitiesFromNorthOgdenToNephi, "leh", DEFAULT_COVERAGE_CITY)).toBe(
      "Lehi",
    )
    expect(resolveCoverageCityName(utahCitiesFromNorthOgdenToNephi, "zzz", "Ogden")).toBe("Ogden")
  })
})
