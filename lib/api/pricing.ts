import { networkFirstGet } from "@/lib/api/http"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SuggestedRentResult {
  currentRent: number | null
  suggestedRent: number
  avgAreaRent: number
  pricePerSqft: number
  comparableCount: number
  percentile: number
}

export interface ComparableProperty {
  id: string
  address: string
  city: string
  bedrooms: number
  bathrooms: number
  sqft: number
  monthlyRent: number
}

export interface RentTrendEntry {
  month: string
  amountCents: number
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

export async function getSuggestedRent(
  propertyId: string
): Promise<SuggestedRentResult> {
  const res = await networkFirstGet<{ data: SuggestedRentResult }>(
    `/api/pricing/suggested/${propertyId}`,
    `pricing-suggested-${propertyId}`
  )
  return res.data
}

export async function getComparables(
  propertyId: string,
  limit = 10
): Promise<ComparableProperty[]> {
  const res = await networkFirstGet<{ data: ComparableProperty[] }>(
    `/api/pricing/comparables/${propertyId}?limit=${limit}`,
    `pricing-comparables-${propertyId}`
  )
  return res.data
}

export async function getRentTrends(
  propertyId: string
): Promise<RentTrendEntry[]> {
  const res = await networkFirstGet<{ data: RentTrendEntry[] }>(
    `/api/pricing/trends/${propertyId}`,
    `pricing-trends-${propertyId}`
  )
  return res.data
}
