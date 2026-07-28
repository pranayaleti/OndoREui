import { backendUrl } from "@/lib/backend"
import { getCsrfToken, networkFirstGet, postJson } from "@/lib/api/http"

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

/** Public listing CTA from GET /properties/:id/screening-cta */
export interface ScreeningCta {
  enabled: boolean
  feeCents: number
  reuseDays: number
  applyPath: string | null
}

/** Tenant-shaped portable / list row from role shaper */
export interface PortableScreeningStatus {
  view: "status"
  id: string
  status: string
  completedAt: string | null
  expiresAt: string | null
  isPortable: boolean
}

export interface CreateFeeIntentResult {
  clientSecret: string
  paymentIntentId: string
  alreadySettled?: boolean
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function screeningFetch(path: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase()
  const csrf = ["POST", "PUT", "DELETE", "PATCH"].includes(method) ? getCsrfToken() : undefined
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  }
  if (csrf) headers["x-csrf-token"] = csrf
  return fetch(backendUrl(path), {
    ...init,
    headers,
    credentials: "include",
  })
}

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string }
    return body.message || fallback
  } catch {
    return fallback
  }
}

export function formatScreeningFeeCents(feeCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(feeCents / 100)
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

/**
 * Public CTA for Get Screened on property listings.
 * Returns null when the property is missing or the request fails.
 */
export async function getScreeningCta(propertyId: string): Promise<ScreeningCta | null> {
  try {
    const res = await fetch(backendUrl(`/api/properties/${propertyId}/screening-cta`), {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    })
    if (!res.ok) return null
    const body = (await res.json()) as { data?: ScreeningCta }
    return body.data ?? null
  } catch {
    return null
  }
}

/** Valid portable packages for the authenticated tenant. Empty when unauthenticated. */
export async function listPortableScreenings(): Promise<PortableScreeningStatus[]> {
  try {
    const res = await screeningFetch("/api/screening/portable")
    if (res.status === 401 || res.status === 403) return []
    if (!res.ok) return []
    const body = (await res.json()) as { screenings?: PortableScreeningStatus[] }
    return (body.screenings ?? []).filter((s) => s.view === "status" && s.isPortable)
  } catch {
    return []
  }
}

export async function sendPortableScreening(
  screeningId: string,
  payload: { propertyId: string; applicationId?: string }
): Promise<{ shareId: string }> {
  const res = await screeningFetch(`/api/screening/${screeningId}/send`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Could not send your screening package."))
  }
  const body = (await res.json()) as { shareId: string }
  return { shareId: body.shareId }
}

/**
 * Create (or reuse) a Stripe PaymentIntent for the screening fee.
 * Returns `{ alreadySettled: true }` when fee is paid / waived / not_required (409).
 */
export async function createScreeningFeeIntent(
  screeningId: string
): Promise<CreateFeeIntentResult> {
  const res = await screeningFetch(`/api/screening/${screeningId}/create-fee-intent`, {
    method: "POST",
    body: JSON.stringify({}),
  })

  if (res.status === 409) {
    return { clientSecret: "", paymentIntentId: "", alreadySettled: true }
  }

  if (!res.ok) {
    throw new Error(await readErrorMessage(res, "Could not start screening fee payment."))
  }

  const body = (await res.json()) as {
    clientSecret: string
    paymentIntentId: string
  }
  return {
    clientSecret: body.clientSecret,
    paymentIntentId: body.paymentIntentId,
  }
}

/**
 * Tenant list — used to find an invited screening that may need fee payment.
 * Returns status-shaped rows for tenants.
 */
export async function listTenantScreeningStatuses(
  page = 1,
  limit = 20
): Promise<PortableScreeningStatus[]> {
  try {
    const res = await screeningFetch(`/api/screening?page=${page}&limit=${limit}`)
    if (res.status === 401 || res.status === 403) return []
    if (!res.ok) return []
    const body = (await res.json()) as { screenings?: PortableScreeningStatus[] }
    return (body.screenings ?? []).filter((s) => s.view === "status")
  } catch {
    return []
  }
}
