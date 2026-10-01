import type { ApiProperty } from "@/app/types/property"
import { backendUrl } from "@/lib/backend"

/** Emitted by generateStaticParams when the public list is empty or unreachable. */
export const PROPERTY_DETAIL_PLACEHOLDER_ID = "_placeholder"
export const LISTING_STATIC_SEGMENTS = ["compare", PROPERTY_DETAIL_PLACEHOLDER_ID] as const

export function listingDetailPath(publicId: string): string {
  return `/properties/${encodeURIComponent(publicId)}`
}

/** Existing PDP worksheet hash — not a second investor funnel. */
export function listingWorksheetPath(publicId: string): string {
  return `${listingDetailPath(publicId)}#underwrite`
}

export function listingComparePath(): string {
  return "/properties/compare"
}

/**
 * `/properties/{publicId}` under `output: "export"` + trailingSlash.
 * Null for the browse page, nested paths, and the build-time placeholder.
 */
export function publicIdFromPathname(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const match = /^\/properties\/([^/]+)$/.exec(normalized)
  if (!match?.[1]) return null
  let id = match[1]
  try {
    id = decodeURIComponent(id)
  } catch {
    return null
  }
  if (!id || (LISTING_STATIC_SEGMENTS as readonly string[]).includes(id)) {
    return null
  }
  return id
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/**
 * Public pages are rental-only: price renders as monthly rent and the call to
 * action is a rental application. A row the API marks as a sale is dropped
 * here, at the boundary, so no sale listing is ever shown as rent. If sale
 * support is added, thread `listingKind` through listingCostRows, the related
 * cards, the map popup and the Apply panel first.
 */
export function isSaleListingRow(value: unknown): boolean {
  return isRecord(value) && value.listingKind === "sale"
}

function isApiProperty(value: unknown): value is ApiProperty {
  if (!isRecord(value)) return false
  if (isSaleListingRow(value)) return false
  return typeof value.publicId === "string" && typeof value.title === "string"
}

function listingRows(body: unknown): ApiProperty[] {
  const raw = Array.isArray(body)
    ? body
    : isRecord(body) && Array.isArray(body.data)
      ? body.data
      : []
  return raw.filter(isApiProperty)
}

export function findPublicProperty(body: unknown, publicId: string): ApiProperty | null {
  return (
    listingRows(body).find((row) => row.publicId === publicId || row.id === publicId) ?? null
  )
}

export function listingRowsFromBody(body: unknown): ApiProperty[] {
  return listingRows(body)
}

/** Thrown by the paginated list fetch when the API answers with a non-OK status. */
export class PublicListingsHttpError extends Error {
  readonly status: number
  constructor(status: number) {
    super(`Public listings request failed: ${status}`)
    this.name = "PublicListingsHttpError"
    this.status = status
  }
}

/** The Edge route's maximum page size; its default is 20. */
export const PUBLIC_LISTINGS_PAGE_SIZE = 100
/** Safety stop so a misbehaving `hasMore` can never loop forever (2,000 listings). */
const PUBLIC_LISTINGS_MAX_PAGES = 20

function hasMorePages(body: unknown): boolean {
  if (!isRecord(body) || !isRecord(body.pagination)) return false
  return body.pagination.hasMore === true
}

/**
 * Every row of `/api/properties/public`, following `pagination.hasMore`.
 * The Edge route returns 20 rows by default, so a single un-paged request
 * silently drops listings past the 20th. Rows are returned as received
 * (unvalidated) so callers can map or filter them as they need.
 *
 * Rejects with `PublicListingsHttpError` on a non-OK status and with a plain
 * Error when the body is neither an array nor `{ data: [...] }`. An older Edge
 * build that ignores `page`/`limit` and sends no `pagination` stops after one request.
 */
export async function fetchAllPublicListingRows(
  fetchImpl: typeof fetch = fetch,
  init?: RequestInit,
): Promise<unknown[]> {
  const rows: unknown[] = []
  for (let page = 1; page <= PUBLIC_LISTINGS_MAX_PAGES; page += 1) {
    const url = backendUrl(
      `/api/properties/public?limit=${PUBLIC_LISTINGS_PAGE_SIZE}&page=${page}`,
    )
    const res = await fetchImpl(url, init)
    if (!res.ok) throw new PublicListingsHttpError(res.status)
    const body: unknown = await res.json()
    const raw = Array.isArray(body) ? body : isRecord(body) ? body.data : null
    if (!Array.isArray(raw)) throw new Error("Invalid response format. Please try again.")
    rows.push(...raw)
    if (raw.length === 0 || !hasMorePages(body)) break
  }
  return rows
}

/** Like fetchPublicPropertyList, but rejects when the list could not be loaded so callers can tell an outage from an empty market. */
export async function fetchPublicPropertyListOrThrow(
  fetchImpl: typeof fetch = fetch,
): Promise<ApiProperty[]> {
  return (await fetchAllPublicListingRows(fetchImpl)).filter(isApiProperty)
}

export async function fetchPublicPropertyList(
  fetchImpl: typeof fetch = fetch,
): Promise<ApiProperty[]> {
  try {
    return await fetchPublicPropertyListOrThrow(fetchImpl)
  } catch {
    return []
  }
}

export function publicIdsFromListBody(body: unknown): string[] {
  const raw = Array.isArray(body)
    ? body
    : isRecord(body) && Array.isArray(body.data)
      ? body.data
      : []
  const ids: string[] = []
  for (const row of raw) {
    if (!isRecord(row) || isSaleListingRow(row)) continue
    const id =
      (typeof row.publicId === "string" && row.publicId) ||
      (typeof row.public_id === "string" && row.public_id) ||
      (typeof row.id === "string" && row.id) ||
      ""
    if (id) ids.push(id)
  }
  return ids
}

/**
 * Resolve a public listing by publicId (or internal id).
 *
 * `GET /api/properties/public/:id` tries `public_id` then internal `id` for
 * approved vacant rows. Keep a list fallback for rollout (old Edge without
 * by-id) and transient by-id failures — it cannot invent a listing.
 */
export async function fetchPublicPropertyByPublicId(
  publicId: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ApiProperty | null> {
  if (!publicId || (LISTING_STATIC_SEGMENTS as readonly string[]).includes(publicId)) {
    return null
  }

  try {
    const detailRes = await fetchImpl(
      backendUrl(`/api/properties/public/${encodeURIComponent(publicId)}`),
    )
    if (detailRes.ok) {
      const body: unknown = await detailRes.json()
      if (isApiProperty(body)) return body
    }
  } catch {
    // Fall through to the public list.
  }

  try {
    const rows = (await fetchAllPublicListingRows(fetchImpl)).filter(isApiProperty)
    return rows.find((row) => row.publicId === publicId || row.id === publicId) ?? null
  } catch {
    return null
  }
}

export type ListingAvailability = "available" | "unavailable" | "unknown"

/**
 * Is this listing still on the public API? The detail page is prerendered at
 * build time, so a home that was rented or withdrawn since keeps its static
 * HTML until the next deploy. This is the browser-side re-check.
 *
 * "unavailable" only on a definite miss: the by-id endpoint answers 404 AND the
 * public list loads fine without the listing (older Edge builds have no by-id
 * route, which also 404s). Any network error, 5xx or bad body is "unknown", and
 * callers must leave the page unchanged.
 */
export async function checkListingAvailability(
  publicId: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ListingAvailability> {
  if (!publicId || (LISTING_STATIC_SEGMENTS as readonly string[]).includes(publicId)) {
    return "unknown"
  }
  try {
    const res = await fetchImpl(
      backendUrl(`/api/properties/public/${encodeURIComponent(publicId)}`),
      { cache: "no-store" },
    )
    if (res.ok) return "available"
    if (res.status !== 404) return "unknown"
    const rows = (await fetchAllPublicListingRows(fetchImpl, { cache: "no-store" })).filter(isApiProperty)
    return rows.some((row) => row.publicId === publicId || row.id === publicId)
      ? "available"
      : "unavailable"
  } catch {
    return "unknown"
  }
}
