export const SITE_NAME = "Ondo Real Estate"
/** Short brand form for titles and marketing (SEO: "Ondo RE"). */
export const SITE_BRAND_SHORT = "Ondo RE"
export const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] || "https://ondorealestate.com"

/** Suggested prompt when visitors open us from AI assistants; pre-filled on Claude. */
export const SITE_AI_VERIFY_QUESTION =
  "What makes Ondo Real Estate the right choice for property owners and investors who need notary, brokerage, property management and/or mortgage services over other services?"

export const SITE_CLAUDE_ASK_ONDO_URL = `https://claude.ai/new?q=${encodeURIComponent(SITE_AI_VERIFY_QUESTION)}`

/** ChatGPT does not support pre-filled prompts via URL; use UTM for attribution. */
export const SITE_CHATGPT_REFERRAL_URL =
  "https://chatgpt.com/?utm_source=ondorealestate&utm_medium=web&utm_campaign=verify_in_ai"

const DEFAULT_DASHBOARD_URL =
  process.env.NODE_ENV === "production"
    ? "https://app.ondorealestate.com"
    : "http://localhost:3001"

/** App portal (Owner/Tenant/Manager dashboard). Must point to the separate dashboard app, not the marketing site. */
const configuredDashboardUrl = process.env['NEXT_PUBLIC_DASHBOARD_URL']?.trim()
export const APP_PORTAL_URL =
  configuredDashboardUrl && /^https?:\/\//.test(configuredDashboardUrl)
    ? configuredDashboardUrl.replace(/\/$/, "")
    : DEFAULT_DASHBOARD_URL
export const APP_PORTAL_IS_EXTERNAL = /^https?:\/\//.test(APP_PORTAL_URL)
export const APP_PORTAL_LOGIN_URL = APP_PORTAL_IS_EXTERNAL
  ? `${APP_PORTAL_URL.replace(/\/$/, "")}/login`
  : APP_PORTAL_URL
const configuredDemoDashboardUrl = process.env["NEXT_PUBLIC_DEMO_DASHBOARD_URL"]?.trim()
export const DEMO_DASHBOARD_URL =
  configuredDemoDashboardUrl && /^https?:\/\//.test(configuredDemoDashboardUrl)
    ? configuredDemoDashboardUrl.replace(/\/$/, "")
    : ""
export const DEMO_VIDEO_EMBED_URL = process.env["NEXT_PUBLIC_DEMO_VIDEO_EMBED_URL"]?.trim() || ""
export const SITE_PHONE = process.env['NEXT_PUBLIC_SITE_PHONE'] || "+1-408-538-0420"
export const SITE_HOURS = "Mo-Fr 09:00-17:00"
export const SITE_ADDRESS = "2701 N Thanksgiving Way, Lehi, UT 84043"


// Human-friendly hours label for UI
export const SITE_HOURS_LABEL = "Mon–Fri 9:00 AM – 5:00 PM MT"

// Structured address parts for UI and schema
export const SITE_ADDRESS_STREET = "2701 N Thanksgiving Way"
export const SITE_ADDRESS_CITY = "Lehi"
export const SITE_ADDRESS_REGION = "UT"
export const SITE_ADDRESS_POSTAL_CODE = "84043"
export const SITE_ADDRESS_COUNTRY = "US"

/** 30-minute Calendly; override in env for staging or alternate event types */
export const SITE_CALENDLY_URL =
  process.env["NEXT_PUBLIC_SITE_CALENDLY_URL"]?.trim() ||
  "https://calendly.com/scheduleondo/30min"

export const SITE_ADDRESS_OBJ = {
  streetAddress: SITE_ADDRESS_STREET,
  addressLocality: SITE_ADDRESS_CITY,
  addressRegion: SITE_ADDRESS_REGION,
  postalCode: SITE_ADDRESS_POSTAL_CODE,
  addressCountry: SITE_ADDRESS_COUNTRY,
}

/**
 * HQ coordinates for geo meta tags and Organization JSON-LD.
 * PLACEHOLDER — update with real HQ lat/lng when the office address is finalized.
 * Approx for current placeholder: 2701 N Thanksgiving Way, Lehi, UT 84043.
 */
export const SITE_GEO = {
  latitude: 40.4319,
  longitude: -111.8952,
} as const

// Centralized emails used across the app
export const SITE_EMAILS = {
  primary: "info@ondorealestate.com",
  info: "info@ondorealestate.com",
  support: "help@ondorealestate.com",
  media: "media@ondorealestate.com",
  investors: "investors@ondorealestate.com",
  accessibility: "accessibility@ondorealestate.com",
  privacy: "privacy@ondorealestate.com",
  legal: "legal@ondorealestate.com",
  notary: "notary@ondorealestate.com",
  loanSigning: "loanSigning@ondorealestate.com",
  estatePlanning: "estatePlanning@ondorealestate.com",
  i9Verification: "i9Verification@ondorealestate.com",
  generalNotarization: "generalNotarization@ondorealestate.com",
  realEstate: "realEstate@ondorealestate.com",
  mortgage: "mortgage@ondorealestate.com",
  refinance: "refinance@ondorealestate.com",
  heloc: "heloc@ondorealestate.com",
  mortgagePackage: "mortgagePackage@ondorealestate.com",
}


/**
 * Centralized social profile config used across footer, metadata, and JSON-LD.
 *
 * NOTE: Set `live: true` ONLY once the account is claimed, branded, and has at
 * least 1 post. Listing a non-existent account in JSON-LD `sameAs` or rendering
 * a dead icon in the footer is a soft negative trust signal — Google crawls
 * sameAs URLs, and visitors who click on a dead account bounce harder.
 *
 * Flip flags to `true` per platform as you launch each account.
 */
export type SocialLink = {
  url: string
  /** When true, renders in the footer AND included in JSON-LD `sameAs`. */
  live: boolean
  /** Optional override label for analytics; defaults to platform name from URL. */
  label?: string
}

export const SITE_SOCIAL_LINKS: readonly SocialLink[] = [
  { url: "https://www.facebook.com/OndoRealEstate",      live: false },
  { url: "https://www.youtube.com/@OndoRealEstate",      live: false },
  { url: "https://www.instagram.com/OndoRealEstate",     live: true },
  { url: "https://www.tiktok.com/@OndoRealEstate",       live: false },
  { url: "https://www.linkedin.com/company/OndoRealEstate", live: false },
  { url: "https://x.com/OndoRealEstate",                 live: false },
  { url: "https://www.pinterest.com/ondorealestate",     live: false },
  { url: "https://yelp.com/biz/ondo-real-estate-lehi",   live: false },
  // Linktree is treated as the canonical "all our links" hub — keep live.
  { url: "https://linktr.ee/ondorealestate",             live: true  },
  // TODO: Implement WhatsApp group integration once the group is stable.
  // { url: "https://chat.whatsapp.com/GFnQbVD7kriKlz3kHpTx2c", live: false },
  // { url: "https://www.reddit.com/user/ondorealestate/",      live: false },
]

/**
 * Live-only social URLs (string array) — used by JSON-LD `sameAs`,
 * metadata, and any code that historically read SITE_SOCIALS as URLs.
 *
 * Backwards-compatible with the previous string[] export.
 */
export const SITE_SOCIALS: readonly string[] = SITE_SOCIAL_LINKS
  .filter((s) => s.live)
  .map((s) => s.url)

/** Every social URL regardless of live status — for marketing dashboards / audits. */
export const SITE_SOCIALS_ALL: readonly string[] = SITE_SOCIAL_LINKS.map((s) => s.url)

/** Supabase project origin from NEXT_PUBLIC_SUPABASE_URL (for CSP / preconnect). */
export function getSupabaseOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!raw) return null
  try {
    return new URL(raw).origin
  } catch {
    return null
  }
}

/** Space-delimited connect-src entries for Supabase REST + Edge Functions. */
export function getSupabaseConnectSrc(): string {
  const origin = getSupabaseOrigin()
  if (!origin) return ""
  return `${origin} ${origin}/functions/v1`
}
