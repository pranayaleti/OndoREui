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

  it("highlights stay Fair Housing-safe: housing stock, amenities, and location, not who should live there", () => {
    const steering =
      /young professionals|healthcare workers|byu families|families with kids|young families|families wanting|nightlife lovers|museum lovers|history buffs|urban professionals|tech workers|tech professionals|first-time buyers|foodie|\bstudents\b|\bfamilies\b|\bexecutives\b|\bartists\b/i
    for (const hood of Object.values(neighborhoodsByCity).flat()) {
      expect(hood.highlights.length).toBeGreaterThan(0)
      for (const chip of hood.highlights) {
        expect(chip, `${hood.name}: "${chip}"`).not.toMatch(steering)
      }
      expect(hood.character, hood.name).not.toMatch(/family-friendly|family-oriented|family-first|family-centric|family address|who (should )?live/i)
    }
  })
})
