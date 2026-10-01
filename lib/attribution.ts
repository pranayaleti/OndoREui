/**
 * Marketing attribution (UTMs + common click ids) for static marketing site.
 *
 * - **Google Analytics 4**: When `gtag` loads, campaign data from the landing URL is
 *   attributed automatically for that session, no extra code required for basic reports.
 * - **HubSpot** (if `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` is set): tracks page views and forms
 *   with standard cookie-based attribution.
 * - **This module**: Persists first- and last-touch params in `localStorage` (90 days) and sends them
 *   with contact form submissions to the API, which stores JSON in Supabase `website_leads.attribution`.
 */

import { templateTokenPath } from "@/lib/tracking-ids"

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

/** First touch is kept for 90 days, then a new visit starts a fresh record. */
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000

/**
 * Field limits enforced by the Edge `marketingAttributionSchema` (.strict()). One value over
 * its limit, or one unknown key, makes the API reject the whole lead, so every touch is cut
 * down to these before it is stored or sent.
 */
const MAX_PARAM_LENGTH = 256
const MAX_PATH_LENGTH = 1024
const MAX_HREF_LENGTH = 2048
const MAX_RECORDED_AT_LENGTH = 64

const SEARCH_ENGINE_HOSTS = ["google.", "bing.", "duckduckgo.", "yahoo.", "ecosia.", "brave.", "baidu.", "yandex."]

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

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : undefined
}

/** Keep only the keys the API accepts, each within its length limit. Returns null if unusable. */
function sanitizeTouch(raw: unknown): MarketingTouch | null {
  if (!raw || typeof raw !== "object") return null
  const t = raw as Record<string, unknown>
  const touch: MarketingTouch = {
    path: clip(t["path"], MAX_PATH_LENGTH) ?? "/",
    href: clip(t["href"], MAX_HREF_LENGTH) ?? "",
    recorded_at: clip(t["recorded_at"], MAX_RECORDED_AT_LENGTH) ?? new Date().toISOString(),
  }
  for (const k of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const v = clip(t[k], MAX_PARAM_LENGTH)
    if (v) touch[k] = v
  }
  return touch
}

function sanitizeAttribution(raw: unknown): MarketingAttribution | null {
  if (!raw || typeof raw !== "object") return null
  const a = raw as Record<string, unknown>
  const first = sanitizeTouch(a["first"])
  const last = sanitizeTouch(a["last"])
  if (!first && !last) return null
  return { first, last }
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
  return hasAnyMarketingField(touch) ? sanitizeTouch(touch) : null
}

/**
 * Touch for a visit with no campaign params: the landing page, plus the referring site when
 * it is another host. The API schema has no referrer field, so a referrer is carried as
 * utm_source (its hostname) and utm_medium ("organic" for search engines, else "referral").
 */
function parseTouchFromReferrer(referrer: string, currentHost: string, path: string, href: string): MarketingTouch {
  const touch: MarketingTouch = { path, href, recorded_at: new Date().toISOString() }
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "")
    if (host && host !== currentHost.replace(/^www\./, "")) {
      touch.utm_source = host
      touch.utm_medium = SEARCH_ENGINE_HOSTS.some((engine) => host.includes(engine)) ? "organic" : "referral"
    }
  } catch {
    // No referrer, or not a URL: this is a direct visit.
  }
  return sanitizeTouch(touch) as MarketingTouch
}

function isExpired(a: MarketingAttribution): boolean {
  const recordedAt = Date.parse(a.first?.recorded_at ?? a.last?.recorded_at ?? "")
  return Number.isFinite(recordedAt) && Date.now() - recordedAt > ATTRIBUTION_TTL_MS
}

function readFrom(storage: () => Storage): MarketingAttribution | null {
  try {
    const raw = storage().getItem(MARKETING_ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = sanitizeAttribution(JSON.parse(raw))
    return parsed && !isExpired(parsed) ? parsed : null
  } catch {
    return null
  }
}

/**
 * Stored in `localStorage` so every tab and later visit shares one record. Falls back to
 * `sessionStorage` for records written before this moved.
 */
export function readMarketingAttribution(): MarketingAttribution | null {
  if (typeof window === "undefined") return null
  return readFrom(() => localStorage) ?? readFrom(() => sessionStorage)
}

/** Payload for `POST /api/leads/contact`, omit when nothing was captured. */
export function getAttributionPayloadForApi(): MarketingAttribution | undefined {
  const a = readMarketingAttribution()
  if (!a) return undefined
  if (a.first == null && a.last == null) return undefined
  return a
}

/**
 * On each navigation (full page load), call once from the client.
 * - **first**: set once (kept 90 days) from the first visit seen: campaign params when
 *   present, otherwise the referrer and landing page.
 * - **last**: updated whenever the URL has marketing params.
 */
export function captureMarketingAttributionFromWindow(): void {
  if (typeof window === "undefined") return
  // Token URLs (co-applicant, showing, visit, invite) are recorded with the token replaced by
  // "[token]": attribution is sent with leads to the CRM, and the token is a working credential.
  const path = templateTokenPath(window.location.pathname)
  const campaignTouch = parseTouchFromSearch(
    window.location.search,
    path,
    `${window.location.origin}${path}${window.location.search}`
  )

  const prev = readMarketingAttribution()
  // Nothing new to learn: later page views without params must not rewrite the record.
  if (!campaignTouch && prev) return

  // A visit without campaign params records the landing page without its query string or hash:
  // there is nothing to attribute there, and it can hold invite or application tokens.
  const touch =
    campaignTouch ??
    parseTouchFromReferrer(
      document.referrer,
      window.location.hostname,
      path,
      `${window.location.origin}${path}`,
    )
  const next: MarketingAttribution = {
    first: prev?.first ?? touch,
    last: campaignTouch ?? prev?.last ?? touch,
  }
  try {
    localStorage.setItem(MARKETING_ATTRIBUTION_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage full or disabled
  }

  if (campaignTouch && typeof window.gtag === "function") {
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
