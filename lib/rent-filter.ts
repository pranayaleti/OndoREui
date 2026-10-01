import { DEFAULT_RENT_FILTER_RANGE } from "@/lib/renter-search-prefill"

/** Ends of the Monthly rent slider. They are also the "no limit" positions. */
export const RENT_SLIDER_MIN = DEFAULT_RENT_FILTER_RANGE[0]
export const RENT_SLIDER_MAX = DEFAULT_RENT_FILTER_RANGE[1]

/**
 * The slider ends mean "no limit", not a hard $500 / $5,000 cutoff. An
 * untouched slider therefore shows every listing, a $4,200 or $5,800 home is
 * never hidden by default, and dragging only the lower handle does not drop
 * everything above $5,000.
 */
export function matchesRentRange(price: number, range: readonly [number, number]): boolean {
  const [low, high] = range
  if (low > RENT_SLIDER_MIN && price < low) return false
  if (high < RENT_SLIDER_MAX && price > high) return false
  return true
}
