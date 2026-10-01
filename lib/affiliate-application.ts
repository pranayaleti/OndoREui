/**
 * Request shaping for POST /api/referrals/affiliate/apply.
 * The Edge schema (OndoREBackend referrals-public.ts) wants { name, email, website, audienceSize,
 * motivation } where website is a full URL or "". The form's field is "Website or Social Profile",
 * so people type bare domains and handles that the schema would reject with a bare 400.
 */

export type AffiliateFormInput = {
  name: string
  email: string
  website?: string
  audienceSize: string
  why?: string
}

export type AffiliateApplyPayload = {
  name: string
  email: string
  website: string
  audienceSize: string
  motivation?: string
}

/**
 * Splits what the person typed into a valid URL (or "") and, when it is not a link, the handle text.
 * "instagram.com/me" and "www.example.com" get https://. "@me" and "me" are kept as a handle, since
 * the platform is unknown and guessing one would point reviewers at the wrong profile.
 */
export function normalizeAffiliateWebsite(raw: string | undefined): { website: string; handle: string } {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) return { website: "", handle: "" }
  if (/\s/.test(trimmed) || trimmed.startsWith("@")) return { website: "", handle: trimmed }

  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
  if (hasScheme && !/^https?:\/\//i.test(trimmed)) return { website: "", handle: trimmed }

  const candidate = hasScheme ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(candidate)
    if (url.hostname.includes(".")) return { website: candidate, handle: "" }
  } catch {
    // Not a URL: fall through and keep it as text.
  }
  return { website: "", handle: trimmed }
}

export function buildAffiliatePayload(values: AffiliateFormInput): AffiliateApplyPayload {
  const { website, handle } = normalizeAffiliateWebsite(values.website)
  const motivation = [handle ? `Social profile: ${handle}` : "", (values.why ?? "").trim()]
    .filter(Boolean)
    .join("\n\n")
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    website,
    audienceSize: values.audienceSize,
    ...(motivation ? { motivation } : {}),
  }
}
