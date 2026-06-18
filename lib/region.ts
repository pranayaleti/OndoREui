/**
 * Client-side region heuristic for privacy-driven gating of marketing tags.
 *
 * The site is a static export (no server/edge runtime — deployed to GitHub
 * Pages), so there is no request-time geo header to read. Calling an IP-geo
 * API would add latency and, ironically, share the visitor's IP with yet
 * another third party. The browser's IANA time zone is a zero-network,
 * zero-PII signal that is good enough to withhold retargeting pixels from
 * privacy-strict regions.
 *
 * We deliberately OVER-block: every European time zone (EU/EEA/UK/Switzerland,
 * plus a few non-EEA European zones such as Russia/Turkey) is treated as
 * consent-required. Erring toward suppression is the safe direction for
 * GDPR/ePrivacy — the cost is some lost retargeting reach, never an
 * un-consented pixel.
 *
 * Accepted limitations of this no-banner approach: VPN users and travelers are
 * misclassified by time zone, and visitors with JavaScript disabled cannot be
 * geo-detected at all (their <noscript> fallbacks are therefore not gated).
 */

// EEA + UK + Switzerland share the "Europe/" IANA prefix, as do a handful of
// non-EEA European countries. Including the latter only means we also suppress
// marketing pixels for them — an acceptable, conservative over-block.
const EUROPEAN_TZ_PREFIX = "Europe/";

// EU/EEA territories that live under a non-"Europe/" prefix (island groups and
// French overseas departments where GDPR still applies).
const EEA_NON_EUROPE_ZONES = new Set<string>([
  "Atlantic/Reykjavik", // Iceland (EEA)
  "Atlantic/Canary", // Spain — Canary Islands
  "Atlantic/Madeira", // Portugal — Madeira
  "Atlantic/Azores", // Portugal — Azores
  "Indian/Reunion", // France (overseas department)
  "Indian/Mayotte", // France (overseas department)
  "America/Cayenne", // French Guiana
  "America/Martinique", // France (overseas department)
  "America/Guadeloupe", // France (overseas department)
]);

/**
 * Best-effort: is the visitor in a region where marketing pixels should be
 * withheld absent explicit consent? Returns `true` (restricted) whenever the
 * region cannot be determined — including during SSR/prerender — so the
 * default is always the privacy-safe one.
 */
export function isMarketingRestrictedRegion(): boolean {
  if (typeof window === "undefined") return true; // SSR/prerender → safe default

  let timeZone: string | undefined;
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return true; // no Intl / blocked → safe default
  }
  if (!timeZone) return true;

  return timeZone.startsWith(EUROPEAN_TZ_PREFIX) || EEA_NON_EUROPE_ZONES.has(timeZone);
}
