/**
 * Marketing pixel / analytics ID validation.
 *
 * `.env.example` used to ship fake IDs such as `GTM-XXXXXXX` and `0000000`.
 * Those strings match the vendor format regexes, so a copied `.env` would
 * load GTM, Meta, and LinkedIn on every page and fill the Network tab with
 * failed or blocked requests. Reject placeholders here so tags stay a no-op
 * until a real ID is set.
 */

export const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/i
export const GA_ID_PATTERN = /^G-[A-Z0-9]+$/i
export const NUMERIC_ID_PATTERN = /^\d+$/
export const ALPHANUM_ID_PATTERN = /^[A-Za-z0-9_-]+$/

function isPlaceholderTrackingId(id: string): boolean {
  if (/^your-/i.test(id)) return true
  const body = id.replace(/^(GTM-|G-)/i, "")
  if (!body) return true
  if (/^x+$/i.test(body)) return true
  if (/^0+$/.test(body)) return true
  return false
}

export function sanitizeTrackingId(
  raw: string | undefined,
  pattern: RegExp,
): string | null {
  const id = raw?.trim()
  if (!id || !pattern.test(id) || isPlaceholderTrackingId(id)) return null
  return id
}

/**
 * Routes whose last path segment is a bearer token (co-applicant invites,
 * showing and visit links, tenant onboarding, rental application resume).
 * Anyone holding the URL can act on the record, so no third-party tag may
 * ever see it: a tag that loads here records the full URL in its page view.
 */
const TOKEN_ROUTE_ROOTS = new Set(["visit", "invite", "tenantonboarding"])

export function isTokenRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const segments = pathname.toLowerCase().split("/").filter(Boolean)
  const root = segments[0]
  if (!root) return false
  if (TOKEN_ROUTE_ROOTS.has(root)) return segments.length > 1
  // /apply/ and /apply/start/<propertyId>/ carry no token; /apply/<token>/ and /apply/co/<token>/ do.
  if (root === "apply") return segments.length > 1 && segments[1] !== "start"
  return false
}

/** Placeholder that replaces the token segment in a templated path. */
export const TOKEN_PATH_PLACEHOLDER = "[token]"

/**
 * The same path with its bearer-token segment replaced by "[token]", so a token
 * URL can be recorded (attribution, analytics) without the credential:
 * "/apply/co/abc123/" becomes "/apply/co/[token]/". Other paths come back unchanged.
 */
export function templateTokenPath(pathname: string): string {
  if (!isTokenRoute(pathname)) return pathname
  const parts = pathname.split("/")
  const segmentIndexes = parts.flatMap((part, index) => (part ? [index] : []))
  const lower = segmentIndexes.map((index) => (parts[index] ?? "").toLowerCase())
  // Number of fixed segments before the token: /apply/co/<t>, /visit/schedule/<t>,
  // /visit/confirm/<t> have two; /apply/<t>, /invite/<t>, /tenantOnboarding/<t> have one.
  const fixed =
    (lower[0] === "apply" && lower[1] === "co") ||
    (lower[0] === "visit" && (lower[1] === "schedule" || lower[1] === "confirm"))
      ? 2
      : 1
  const tokenIndex = segmentIndexes[fixed]
  if (tokenIndex === undefined) return pathname
  parts[tokenIndex] = TOKEN_PATH_PLACEHOLDER
  return parts.join("/")
}
