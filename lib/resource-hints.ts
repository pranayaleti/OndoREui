import {
  ALPHANUM_ID_PATTERN,
  GA_ID_PATTERN,
  GTM_ID_PATTERN,
  NUMERIC_ID_PATTERN,
  sanitizeTrackingId,
} from "@/lib/tracking-ids"

/**
 * Connection hints for the root layout's <head>.
 *
 * Every hint runs on every page: dns-prefetch costs a DNS lookup, preconnect a full TLS
 * handshake. So a host only gets one when pages will actually contact it. Fonts are
 * self-hosted by next/font, and a tracker without a configured ID never loads, so
 * neither earns a hint.
 */
export type ResourceHint = {
  rel: "preconnect" | "dns-prefetch"
  href: string
  crossOrigin?: "anonymous"
}

type HintEnv = Record<string, string | undefined>

function originOf(raw: string | undefined): string | null {
  const value = raw?.trim()
  if (!value) return null
  try {
    const { origin, hostname, protocol } = new URL(value)
    if (protocol !== "https:" && protocol !== "http:") return null
    // .env.example placeholders such as https://your-project.supabase.co
    if (/^your-/i.test(hostname)) return null
    return origin
  } catch {
    return null
  }
}

export function resourceHints(env: HintEnv): ResourceHint[] {
  const hints: ResourceHint[] = []

  // The API serves listings, lead forms and the assistant. A lookup is cheap; most pages
  // never call it on load, so a full preconnect everywhere would be wasted.
  const apiOrigins = new Set(
    [env["NEXT_PUBLIC_BACKEND_BASE_URL"], env["NEXT_PUBLIC_SUPABASE_URL"]]
      .map(originOf)
      .filter((origin): origin is string => Boolean(origin)),
  )
  for (const origin of apiOrigins) hints.push({ rel: "dns-prefetch", href: origin })

  const googleTag =
    sanitizeTrackingId(env["NEXT_PUBLIC_GTM_ID"], GTM_ID_PATTERN) ??
    sanitizeTrackingId(env["NEXT_PUBLIC_GA_MEASUREMENT_ID"], GA_ID_PATTERN)
  if (googleTag) {
    hints.push({ rel: "preconnect", href: "https://www.googletagmanager.com" })
    hints.push({ rel: "dns-prefetch", href: "https://www.google-analytics.com" })
  }

  if (sanitizeTrackingId(env["NEXT_PUBLIC_HUBSPOT_PORTAL_ID"], NUMERIC_ID_PATTERN)) {
    hints.push({ rel: "dns-prefetch", href: "https://js.hs-scripts.com" })
  }

  if (sanitizeTrackingId(env["NEXT_PUBLIC_REB2B_KEY"], ALPHANUM_ID_PATTERN)) {
    hints.push({ rel: "dns-prefetch", href: "https://ddwl4m2hdecbv.cloudfront.net" })
  }

  return hints
}
