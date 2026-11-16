/** Same placeholder convention as apply generateStaticParams (`_`). */
export const RENTAL_STATIC_PLACEHOLDER = "_"

function lastSegment(pathname: string, prefix: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const match = new RegExp(`^${escaped}/([^/]+)$`).exec(normalized)
  if (!match?.[1]) return null
  let id = match[1]
  try {
    id = decodeURIComponent(id)
  } catch {
    return null
  }
  if (!id || id === RENTAL_STATIC_PLACEHOLDER) return null
  return id
}

export function applyStartPropertyIdFromPathname(pathname: string): string | null {
  return lastSegment(pathname, "/apply/start")
}

export function applyTokenFromPathname(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/"
  if (normalized.startsWith("/apply/start/") || normalized.startsWith("/apply/co/")) return null
  return lastSegment(pathname, "/apply")
}

export function coApplicantTokenFromPathname(pathname: string): string | null {
  return lastSegment(pathname, "/apply/co")
}

export function applicationIdFromPathname(pathname: string): string | null {
  return lastSegment(pathname, "/applications")
}

export type RentalClientRoute =
  | { kind: "apply-start"; propertyId: string }
  | { kind: "apply-token"; token: string }
  | { kind: "co-applicant"; token: string }
  | { kind: "application"; applicationId: string }

/** Used by the static-export 404 shell the same way listings use publicIdFromPathname. */
export function rentalClientRouteFromPathname(pathname: string): RentalClientRoute | null {
  const propertyId = applyStartPropertyIdFromPathname(pathname)
  if (propertyId) return { kind: "apply-start", propertyId }
  const coToken = coApplicantTokenFromPathname(pathname)
  if (coToken) return { kind: "co-applicant", token: coToken }
  const token = applyTokenFromPathname(pathname)
  if (token) return { kind: "apply-token", token }
  const applicationId = applicationIdFromPathname(pathname)
  if (applicationId) return { kind: "application", applicationId }
  return null
}

/**
 * True for a rental URL that the static export may not contain: apply links, co-applicant links
 * and saved applications carry a per-row token, so the only file that serves them is the 404
 * shell (app/not-found.tsx). /apply/start/<property> is exported only for listings that were
 * public at build time (just the "_" placeholder when that fetch failed), so a listing published
 * since the last deploy has none either. A next/link to such a path prefetches "<path>/index.txt",
 * gets a 404, and then hard-navigates anyway, so these links render as plain anchors. Same-origin
 * absolute URLs are matched by their path.
 */
export function isClientOnlyRentalPath(href: string): boolean {
  const pathname = href.replace(/^[a-z][a-z\d+.-]*:\/\/[^/?#]*/i, "").replace(/[?#].*$/, "")
  return rentalClientRouteFromPathname(pathname) !== null
}
