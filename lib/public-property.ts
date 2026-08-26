import type { ApiProperty } from "@/app/types/property"
import { backendUrl } from "@/lib/backend"

/** Emitted by generateStaticParams when the public list is empty or unreachable. */
export const PROPERTY_DETAIL_PLACEHOLDER_ID = "_placeholder"

export function listingDetailPath(publicId: string): string {
  return `/properties/${encodeURIComponent(publicId)}`
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
  if (!id || id === PROPERTY_DETAIL_PLACEHOLDER_ID) return null
  return id
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isApiProperty(value: unknown): value is ApiProperty {
  if (!isRecord(value)) return false
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

export function publicIdsFromListBody(body: unknown): string[] {
  const raw = Array.isArray(body)
    ? body
    : isRecord(body) && Array.isArray(body.data)
      ? body.data
      : []
  const ids: string[] = []
  for (const row of raw) {
    if (!isRecord(row)) continue
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
 * `GET /api/properties/public/:id` treats UUID-shaped publicIds as internal
 * `properties.id`, so a live publicId often 404s even though the same row is
 * on `GET /api/properties/public`. Fall back to the list rather than inventing
 * a listing.
 */
export async function fetchPublicPropertyByPublicId(
  publicId: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ApiProperty | null> {
  if (!publicId || publicId === PROPERTY_DETAIL_PLACEHOLDER_ID) return null

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
    const listRes = await fetchImpl(backendUrl("/api/properties/public"))
    if (!listRes.ok) return null
    const body: unknown = await listRes.json()
    return findPublicProperty(body, publicId)
  } catch {
    return null
  }
}
