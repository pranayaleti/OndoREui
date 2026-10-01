import { describe, expect, it } from "vitest"
import { propertyManagementFee } from "./rental-expenses"

describe("propertyManagementFee", () => {
  it("reads the input as a percent of gross rent, so 10 means 10%", () => {
    expect(propertyManagementFee(30000, 10)).toBe(3000)
  })

  it("does not treat a small whole-number percent as dollars", () => {
    expect(propertyManagementFee(30000, 0.5)).toBe(150)
    expect(propertyManagementFee(24000, 8)).toBe(1920)
  })

  it("is zero for no rent, no fee, or bad input", () => {
    expect(propertyManagementFee(0, 10)).toBe(0)
    expect(propertyManagementFee(30000, 0)).toBe(0)
    expect(propertyManagementFee(30000, -5)).toBe(0)
    expect(propertyManagementFee(Number.NaN, 10)).toBe(0)
  })
})
