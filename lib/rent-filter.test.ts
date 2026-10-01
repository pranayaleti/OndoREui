import { describe, expect, it } from "vitest"
import { RENT_SLIDER_MAX, RENT_SLIDER_MIN, matchesRentRange } from "./rent-filter"

describe("matchesRentRange", () => {
  const untouched: [number, number] = [RENT_SLIDER_MIN, RENT_SLIDER_MAX]

  it("shows listings above and below the slider ends when the slider is untouched", () => {
    expect(matchesRentRange(450, untouched)).toBe(true)
    expect(matchesRentRange(4200, untouched)).toBe(true)
    expect(matchesRentRange(6800, untouched)).toBe(true)
  })

  it("applies a lower bound the user set, but keeps the top open", () => {
    expect(matchesRentRange(900, [1000, RENT_SLIDER_MAX])).toBe(false)
    expect(matchesRentRange(1000, [1000, RENT_SLIDER_MAX])).toBe(true)
    expect(matchesRentRange(7000, [1000, RENT_SLIDER_MAX])).toBe(true)
  })

  it("applies an upper bound the user set, but keeps the bottom open", () => {
    expect(matchesRentRange(2500, [RENT_SLIDER_MIN, 2000])).toBe(false)
    expect(matchesRentRange(2000, [RENT_SLIDER_MIN, 2000])).toBe(true)
    expect(matchesRentRange(300, [RENT_SLIDER_MIN, 2000])).toBe(true)
  })
})
