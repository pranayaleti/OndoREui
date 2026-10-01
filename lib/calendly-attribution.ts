import { readMarketingAttribution, type MarketingTouch } from "@/lib/attribution"
import { SITE_CALENDLY_URL } from "@/lib/site"

/** The campaign parameters Calendly forwards to the booking record. */
const CALENDLY_UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const

type UtmValues = Partial<Record<(typeof CALENDLY_UTM_KEYS)[number], string>>

function utmsFrom(source: URLSearchParams | MarketingTouch | null | undefined): UtmValues {
  const found: UtmValues = {}
  if (!source) return found
  for (const key of CALENDLY_UTM_KEYS) {
    const value = (source instanceof URLSearchParams ? source.get(key) : source[key])?.trim()
    if (value) found[key] = value
  }
  return found
}

/**
 * The Calendly link with the visitor's campaign attached, so a booking made from an Instagram
 * bio, a QR code or an ad shows that source in Calendly instead of "direct".
 *
 * Order of preference: UTMs on the current page URL (on /links the landing URL carries them),
 * then the stored last touch, then the stored first touch. Only utm_source, utm_medium,
 * utm_campaign, utm_content and utm_term are added. utm_content falls back to `contentLabel`
 * (the page or button) when the campaign did not set one. A visitor with no campaign gets the
 * plain link, so organic bookings are not tagged with a source they do not have.
 *
 * Call it on the client, after mount or at click time. Server renders and structured data keep
 * the plain SITE_CALENDLY_URL.
 */
export function calendlyUrlWithAttribution(contentLabel: string, base: string = SITE_CALENDLY_URL): string {
  if (typeof window === "undefined") return base
  const stored = readMarketingAttribution()
  const utms =
    [new URLSearchParams(window.location.search), stored?.last, stored?.first]
      .map(utmsFrom)
      .find((found) => Object.keys(found).length > 0) ?? {}
  if (!utms.utm_source && !utms.utm_medium && !utms.utm_campaign) return base
  try {
    const url = new URL(base)
    for (const key of CALENDLY_UTM_KEYS) {
      const value = key === "utm_content" ? (utms.utm_content ?? contentLabel) : utms[key]
      if (value) url.searchParams.set(key, value)
    }
    return url.toString()
  } catch {
    return base
  }
}
