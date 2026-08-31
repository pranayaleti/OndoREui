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
