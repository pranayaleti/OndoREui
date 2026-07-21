import { describe, it, expect } from "vitest"
import { neighborhoodsByCity } from "./neighborhood-content"

describe("neighborhood center coordinates", () => {
  it("every neighborhood has a plausible Utah lat/lng", () => {
    const all = Object.values(neighborhoodsByCity).flat()
    expect(all.length).toBeGreaterThan(0)
    for (const hood of all) {
      // Utah's Wasatch Front spans roughly 40.1°N-41.3°N, -112.1°W--111.5°W
      expect(hood.centerLat).toBeGreaterThan(40.0)
      expect(hood.centerLat).toBeLessThan(41.5)
      expect(hood.centerLng).toBeGreaterThan(-112.2)
      expect(hood.centerLng).toBeLessThan(-111.4)
    }
  })

  it("Sugar House and The Avenues have distinct coordinates (sanity check against copy-paste)", () => {
    const slc = neighborhoodsByCity["Salt Lake City"]
    const sugarHouse = slc.find((h) => h.name === "Sugar House")!
    const avenues = slc.find((h) => h.name === "The Avenues")!
    expect(sugarHouse.centerLat).not.toBeCloseTo(avenues.centerLat, 2)
  })
})
