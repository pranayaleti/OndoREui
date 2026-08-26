/**
 * Illustrative owner-fee math for the homepage / pricing widget.
 *
 * These figures are not a quote. Management is a percentage of collected rent
 * (Starter 10% for 1–4 units, Growth 8% for 5–15). `monthlyRent` is **per
 * unit**. `units` only selects the published rate band — it does not multiply
 * the dollar ledger into a portfolio total. Leasing is a separate
 * one-time line (50% of first month’s rent) and is never rolled into the
 * monthly management fee.
 */

export const DEFAULT_EXAMPLE_MONTHLY_RENT = 2200
export const RENT_SLIDER_MIN = 1000
export const RENT_SLIDER_MAX = 4500
export const RENT_SLIDER_STEP = 50

export const STARTER_MAX_UNITS = 4
export const GROWTH_MIN_UNITS = 5
export const PORTFOLIO_MIN_UNITS = 16

export const STARTER_MGMT_RATE = 0.1
export const GROWTH_MGMT_RATE = 0.08
/** Advertised Wasatch Front full-service band. One range for every surface. */
export const TYPICAL_UTAH_PM_RATE_LOW = 0.08
export const TYPICAL_UTAH_PM_RATE_HIGH = 0.12
export const TYPICAL_UTAH_PM_RANGE_LABEL = "8–12%"
export const LEASING_FEE_RATE = 0.5
export const ADVERTISED_FLAT_MONTHLY = 159
export const FEE_COMPARISON_AS_OF = "Aug 2026"

export function typicalUtahPmRangeLabel(): string {
  return `Typical advertised ${TYPICAL_UTAH_PM_RANGE_LABEL} per unit`
}

export type ManagementBand = "starter" | "growth" | "portfolio"

export function managementBandForUnits(units: number): ManagementBand {
  if (!Number.isFinite(units) || units < GROWTH_MIN_UNITS) return "starter"
  if (units < PORTFOLIO_MIN_UNITS) return "growth"
  return "portfolio"
}

export function managementRateForBand(band: ManagementBand): number {
  switch (band) {
    case "starter":
      return STARTER_MGMT_RATE
    case "growth":
      return GROWTH_MGMT_RATE
    case "portfolio":
      // Custom quotes start from the Growth rate; the widget never pretends 16+ is priced.
      return GROWTH_MGMT_RATE
    default: {
      const _exhaustive: never = band
      return _exhaustive
    }
  }
}

export type FeeSnapshot = {
  monthlyRent: number
  units: number
  band: ManagementBand
  ondoRate: number
  ondoMonthlyFee: number
  typicalPmLow: number
  typicalPmHigh: number
  oneTimeLeasingFee: number
  advertisedFlatMonthly: number
}

function roundDollars(n: number): number {
  return Math.round(n)
}

export function buildFeeSnapshot(monthlyRent: number, units: number): FeeSnapshot {
  const rent = Number.isFinite(monthlyRent) && monthlyRent > 0 ? monthlyRent : 0
  const doorCount = Number.isFinite(units) && units > 0 ? units : 1
  const band = managementBandForUnits(doorCount)
  const ondoRate = managementRateForBand(band)

  return {
    monthlyRent: rent,
    units: doorCount,
    band,
    ondoRate,
    ondoMonthlyFee: roundDollars(rent * ondoRate),
    typicalPmLow: roundDollars(rent * TYPICAL_UTAH_PM_RATE_LOW),
    typicalPmHigh: roundDollars(rent * TYPICAL_UTAH_PM_RATE_HIGH),
    oneTimeLeasingFee: roundDollars(rent * LEASING_FEE_RATE),
    advertisedFlatMonthly: ADVERTISED_FLAT_MONTHLY,
  }
}

/** Rent at which `rate * rent` equals an advertised flat monthly fee. */
export function flatFeeCrossoverRent(
  rate: number,
  flatFee: number = ADVERTISED_FLAT_MONTHLY,
): number {
  if (!Number.isFinite(rate) || rate <= 0) return 0
  return Math.round(flatFee / rate)
}

export function formatUsd0(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

export function bandLabel(band: ManagementBand): string {
  switch (band) {
    case "starter":
      return "Starter · 10% of collected rent"
    case "growth":
      return "Growth · 8% of collected rent"
    case "portfolio":
      return "Portfolio · custom (illustrated at 8%)"
    default: {
      const _exhaustive: never = band
      return _exhaustive
    }
  }
}
