import { networkFirstGet, postJson } from "@/lib/api/http"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Screening {
  id: string
  tenantEmail: string
  tenantName: string
  propertyId: string
  status: string
  initiatedBy: string
  result: ScreeningResult | null
  createdAt: string
  updatedAt: string
}

export interface ScreeningResult {
  overallScore: number
  recommendation: string
  backgroundCheck: {
    status: string
    criminalRecords: number
    evictionRecords: number
  } | null
  creditCheck: {
    score: number
    status: string
  } | null
  rentalHistory: {
    status: string
    previousLandlordRating: number | null
  } | null
}

export interface InitiateScreeningInput {
  tenantEmail: string
  tenantName: string
  propertyId: string
  landlordEmail?: string
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

export async function initiateScreening(
  input: InitiateScreeningInput
): Promise<{ screeningId: string; status: string }> {
  const res = await postJson<{ screeningId: string; status: string }>(
    "/api/screening/initiate",
    input
  )
  return res
}

export async function getScreening(
  screeningId: string
): Promise<{ screening: Screening }> {
  const res = await networkFirstGet<{ screening: Screening }>(
    `/api/screening/${screeningId}`,
    `screening-${screeningId}`
  )
  return res
}

export async function listScreenings(
  page = 1,
  limit = 20
): Promise<{ screenings: Screening[]; pagination: { page: number; limit: number; count: number } }> {
  const res = await networkFirstGet<{
    screenings: Screening[]
    pagination: { page: number; limit: number; count: number }
  }>(
    `/api/screening?page=${page}&limit=${limit}`,
    `screenings-${page}-${limit}`
  )
  return res
}
