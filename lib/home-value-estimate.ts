import { CITY_MARKET_AS_OF, cityMarketData } from "./city-market-data"

/** Bedroom multipliers vs a ~3-bed Utah SFR / small-multifamily median. */
export const BEDROOM_MULTIPLIERS: Record<number, number> = {
  1: 0.7,
  2: 0.9,
  3: 1.0,
  4: 1.15,
  5: 1.3,
}

export const ESTIMATE_DATA_DISCLOSURE =
  `Ondo city medians used on this site, bedroom-adjusted (as of ${CITY_MARKET_AS_OF} — verify). Not an MLS pull, appraisal, BPO, or CMA.`

export const BASELINE_SQFT = 1800

/** Linear ±5% per 100 sqft from the 1800 sqft baseline. */
export function sqftAdjustment(sqft: number): number {
  const delta = (sqft - BASELINE_SQFT) / 100
  return 1 + delta * 0.05
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
