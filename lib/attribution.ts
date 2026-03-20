/**
 * Marketing attribution (UTMs + common click ids) for static marketing site.
 *
 * - **Google Analytics 4**: When `gtag` loads, campaign data from the landing URL is
 *   attributed automatically for that session — no extra code required for basic reports.
 * - **HubSpot** (if `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` is set): tracks page views and forms
 *   with standard cookie-based attribution.
 * - **This module**: Persists first- and last-touch params in `sessionStorage` and sends them
 *   with contact form submissions to the API, which stores JSON in Supabase `website_leads.attribution`.
 */

export const MARKETING_ATTRIBUTION_STORAGE_KEY = "ondo.marketing_attribution.v1"

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
const CLICK_ID_KEYS = ["gclid", "fbclid", "msclkid"] as const

export type MarketingTouch = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
  /** Pathname when this touch was recorded (e.g. /property-management/) */
  path: string
  /** Full URL including query */
  href: string
  recorded_at: string
}

export type MarketingAttribution = {
  first: MarketingTouch | null
  last: MarketingTouch | null
}

function hasAnyMarketingField(t: MarketingTouch): boolean {
  return (
    !!t.utm_source ||
    !!t.utm_medium ||
    !!t.utm_campaign ||
    !!t.utm_term ||
    !!t.utm_content ||
    !!t.gclid ||
    !!t.fbclid ||
    !!t.msclkid
  )
}

function parseTouchFromSearch(search: string, path: string, href: string): MarketingTouch | null {
  const q = search.startsWith("?") ? search.slice(1) : search
  const params = new URLSearchParams(q)
  const touch: MarketingTouch = {
    path,
    href,
    recorded_at: new Date().toISOString(),
  }
  for (const k of UTM_KEYS) {
    const v = params.get(k)?.trim()
    if (v) touch[k] = v
  }
  for (const k of CLICK_ID_KEYS) {
    const v = params.get(k)?.trim()
    if (v) touch[k] = v
  }
  return hasAnyMarketingField(touch) ? touch : null
}

export function readMarketingAttribution(): MarketingAttribution | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(MARKETING_ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MarketingAttribution
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

/** Payload for `POST /api/leads/contact` — omit when nothing was captured. */
export function getAttributionPayloadForApi(): MarketingAttribution | undefined {
  const a = readMarketingAttribution()
  if (!a) return undefined
  if (a.first == null && a.last == null) return undefined
  return a
}

/**
 * On each navigation (full page load), call once from the client.
 * - **first**: set once per browser tab session when any marketing param first appears.
 * - **last**: updated whenever the URL has marketing params.
 */
export function captureMarketingAttributionFromWindow(): void {
  if (typeof window === "undefined") return
  const touch = parseTouchFromSearch(
    window.location.search,
    window.location.pathname,
    window.location.href
  )
  if (!touch) return

  const prev = readMarketingAttribution()
  const next: MarketingAttribution = {
    first: prev?.first ?? touch,
    last: touch,
  }
  try {
    sessionStorage.setItem(MARKETING_ATTRIBUTION_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage full or disabled
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "marketing_params_captured", {
      utm_source: touch.utm_source,
      utm_medium: touch.utm_medium,
      utm_campaign: touch.utm_campaign,
      non_interaction: true,
    })
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
