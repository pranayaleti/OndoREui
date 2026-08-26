import { describe, expect, it } from "vitest"
import {
  ADVERTISED_FLAT_MONTHLY,
  DEFAULT_EXAMPLE_MONTHLY_RENT,
  GROWTH_MGMT_RATE,
  LEASING_FEE_RATE,
  STARTER_MGMT_RATE,
  TYPICAL_UTAH_PM_RATE_HIGH,
  TYPICAL_UTAH_PM_RATE_LOW,
  buildFeeSnapshot,
  flatFeeCrossoverRent,
  formatUsd0,
  managementBandForUnits,
  managementRateForBand,
  type ManagementBand,
} from "./fee-comparison"

describe("managementBandForUnits", () => {
  it("maps 1–4 units to Starter", () => {
    expect(managementBandForUnits(1)).toBe("starter")
    expect(managementBandForUnits(4)).toBe("starter")
  })

  it("maps 5–15 units to Growth", () => {
    expect(managementBandForUnits(5)).toBe("growth")
    expect(managementBandForUnits(15)).toBe("growth")
  })

  it("maps 16+ units to Portfolio (custom)", () => {
    expect(managementBandForUnits(16)).toBe("portfolio")
  })
})

describe("managementRateForBand", () => {
  it("uses 10% for Starter and 8% for Growth", () => {
    expect(managementRateForBand("starter")).toBe(STARTER_MGMT_RATE)
    expect(managementRateForBand("growth")).toBe(GROWTH_MGMT_RATE)
    expect(STARTER_MGMT_RATE).toBe(0.1)
    expect(GROWTH_MGMT_RATE).toBe(0.08)
  })

  it("illustrates Portfolio at the Growth rate until a custom quote", () => {
    expect(managementRateForBand("portfolio")).toBe(GROWTH_MGMT_RATE)
  })

  it("exhausts every ManagementBand in the switch", () => {
    const bands: ManagementBand[] = ["starter", "growth", "portfolio"]
    for (const band of bands) {
      expect(managementRateForBand(band)).toBeGreaterThan(0)
    }
  })
})

describe("buildFeeSnapshot", () => {
  it("defaults the example rent to $2,200, not $3,000", () => {
    expect(DEFAULT_EXAMPLE_MONTHLY_RENT).toBe(2200)
  })

  it("charges Starter 10% of collected rent and keeps leasing off the monthly line", () => {
    const snap = buildFeeSnapshot(2200, 1)
    expect(snap.band).toBe("starter")
    expect(snap.ondoRate).toBe(0.1)
    expect(snap.ondoMonthlyFee).toBe(220)
    expect(snap.oneTimeLeasingFee).toBe(2200 * LEASING_FEE_RATE)
    expect(snap.ondoMonthlyFee).not.toBe(snap.ondoMonthlyFee + snap.oneTimeLeasingFee)
    expect(snap.ondoMonthlyFee).toBe(2200 * 0.1)
  })

  it("drops to Growth 8% at 5+ doors on the same rent", () => {
    const starter = buildFeeSnapshot(2200, 4)
    const growth = buildFeeSnapshot(2200, 5)
    expect(starter.ondoMonthlyFee).toBe(220)
    expect(growth.ondoMonthlyFee).toBe(176)
    expect(growth.ondoMonthlyFee).toBeLessThan(starter.ondoMonthlyFee)
  })

  it("does not fold the one-time leasing fee into the monthly management fee", () => {
    const snap = buildFeeSnapshot(2200, 5)
    expect(snap.ondoMonthlyFee).toBe(176)
    expect(snap.oneTimeLeasingFee).toBe(1100)
    expect(snap.ondoMonthlyFee).not.toEqual(snap.oneTimeLeasingFee)
  })

  it("uses one advertised 8–12% Utah PM band as context, not a 10–12% floor that puts Starter at or below market", () => {
    expect(TYPICAL_UTAH_PM_RATE_LOW).toBe(0.08)
    expect(TYPICAL_UTAH_PM_RATE_HIGH).toBe(0.12)
    const growth = buildFeeSnapshot(2200, 5)
    expect(growth.typicalPmLow).toBe(2200 * TYPICAL_UTAH_PM_RATE_LOW)
    expect(growth.typicalPmHigh).toBe(2200 * TYPICAL_UTAH_PM_RATE_HIGH)
    expect(growth.ondoMonthlyFee).toBe(176)
    expect(growth.ondoMonthlyFee).toBeLessThan(growth.typicalPmHigh)
    const starter = buildFeeSnapshot(2200, 1)
    expect(starter.ondoMonthlyFee).toBe(220)
    expect(starter.ondoMonthlyFee).toBeGreaterThan(starter.typicalPmLow)
    expect(starter.ondoMonthlyFee).toBeLessThan(starter.typicalPmHigh)
  })

  it("treats rent as collected-rent input: zero rent means zero monthly fee", () => {
    const snap = buildFeeSnapshot(0, 5)
    expect(snap.ondoMonthlyFee).toBe(0)
    expect(snap.oneTimeLeasingFee).toBe(0)
  })
})

describe("flatFeeCrossoverRent", () => {
  it("is ~$1,988 at the Growth 8% rate versus an advertised $159 flat", () => {
    expect(ADVERTISED_FLAT_MONTHLY).toBe(159)
    expect(flatFeeCrossoverRent(GROWTH_MGMT_RATE)).toBe(1988)
  })

  it("rises if the percentage rate is lower", () => {
    expect(flatFeeCrossoverRent(0.05)).toBeGreaterThan(flatFeeCrossoverRent(0.08))
  })
})

describe("formatUsd0", () => {
  it("formats whole dollars without cents", () => {
    expect(formatUsd0(176)).toBe("$176")
    expect(formatUsd0(1100)).toBe("$1,100")
  })
})
