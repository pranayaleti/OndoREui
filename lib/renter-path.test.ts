import { describe, expect, it } from "vitest"
import { RENTER_PATH_STEPS, renterPathIntro } from "./renter-path"

describe("renterPathIntro", () => {
  it("keeps listings copy tour-first and never invites a public apply", () => {
    const listings = renterPathIntro("listings")
    expect(listings).toMatch(/tour first/i)
    expect(listings).not.toMatch(/apply online/i)
    expect(renterPathIntro("listing-detail")).toMatch(/request a showing/i)
  })
})

describe("RENTER_PATH_STEPS", () => {
  it("is a three-step sequence that ends in an invited application", () => {
    expect(RENTER_PATH_STEPS.map((step) => step.id)).toEqual(["find", "showing", "invite"])
    expect(RENTER_PATH_STEPS[1]?.href).toBe("#ask-leasing")
    expect(RENTER_PATH_STEPS.some((step) => /apply by invite/i.test(step.title))).toBe(true)
    expect(RENTER_PATH_STEPS.map((step) => `${step.title} ${step.body}`).join(" ")).not.toMatch(
      /apply online|schedule a tour|get notified|no bots/i,
    )
  })
})
