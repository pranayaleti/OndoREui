import { describe, expect, it } from "vitest"
import { RENTER_PATH_STEPS, RENTER_PATH_STEPS_LISTINGS, renterPathIntro } from "./renter-path"

describe("renterPathIntro", () => {
  it("describes review-then-apply without promising approval", () => {
    const listings = renterPathIntro("listings")
    expect(listings).toMatch(/requirements/i)
    expect(listings).toMatch(/apply/i)
    expect(renterPathIntro("listing-detail")).toMatch(/application requirements/i)
  })
})

describe("RENTER_PATH_STEPS", () => {
  it("is a three-step sequence that ends in tour or apply", () => {
    expect(RENTER_PATH_STEPS.map((step) => step.id)).toEqual(["find", "review", "apply"])
    expect(RENTER_PATH_STEPS[1]?.href).toBe("#listing-apply")
    expect(RENTER_PATH_STEPS.some((step) => /tour or apply/i.test(step.title))).toBe(true)
    expect(RENTER_PATH_STEPS_LISTINGS[2]?.href).toBe("#ask-leasing")
  })
})
