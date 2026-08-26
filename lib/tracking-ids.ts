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
