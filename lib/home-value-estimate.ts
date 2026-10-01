import { CITY_MARKET_AS_OF, cityMarketData } from "./city-market-data"

/**
 * Small bedroom nudge vs a ~3-bed home. Size is carried by the square-foot factor
 * (the two are correlated), so this must stay small to avoid counting size twice.
 */
export const BEDROOM_MULTIPLIERS: Record<number, number> = {
  1: 0.95,
  2: 0.97,
  3: 1.0,
  4: 1.03,
  5: 1.05,
}

export const ESTIMATE_DATA_DISCLOSURE =
  `Ondo city medians used on this site, bedroom-adjusted (as of ${CITY_MARKET_AS_OF} — verify). Not an MLS pull, appraisal, BPO, or CMA.`

export const BASELINE_SQFT = 1800

/** Accepted square-foot range. Below the minimum there is no estimate; above the maximum is capped. */
export const MIN_SQFT = 400
export const MAX_SQFT = 10_000

const SIZE_EXPONENT = 0.6
const SIZE_FACTOR_MIN = 0.6
const SIZE_FACTOR_MAX = 1.8

/**
 * One clamped size signal: (sqft / 1800) ^ 0.6, held to 0.6 to 1.8.
 * Price grows slower than floor area, so a 2x larger home is about 1.5x the median.
 */
export function sqftAdjustment(sqft: number): number {
  const ratio = Math.min(Math.max(sqft, MIN_SQFT), MAX_SQFT) / BASELINE_SQFT
  return Math.min(SIZE_FACTOR_MAX, Math.max(SIZE_FACTOR_MIN, Math.pow(ratio, SIZE_EXPONENT)))
}

export type HomeValueEstimate = {
  rentLow: number
  rentHigh: number
  saleLow: number
  saleHigh: number
  rentBase: number
  saleBase: number
}

export function estimateHomeValue(
  city: string,
  bedrooms: number,
  sqft: number,
): HomeValueEstimate | null {
  const data = cityMarketData[city]
  if (!data) return null
  if (!Number.isFinite(sqft) || sqft < MIN_SQFT) return null

  const bedroomMult = BEDROOM_MULTIPLIERS[bedrooms] ?? 1.0
  const sqftMult = sqftAdjustment(sqft)

  const rentBase = Math.round(data.medianRent * bedroomMult * sqftMult)
  const rentLow = Math.round(rentBase * 0.9)
  const rentHigh = Math.round(rentBase * 1.1)

  const saleBase = Math.round(data.medianHomePrice * bedroomMult * sqftMult)
  const saleLow = Math.round(saleBase * 0.9)
  const saleHigh = Math.round(saleBase * 1.1)

  return { rentLow, rentHigh, saleLow, saleHigh, rentBase, saleBase }
}
