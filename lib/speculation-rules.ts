/**
 * Speculation Rules API – prefetch and prerender rules for same-origin navigation.
 * Used in root layout to improve perceived performance (instant navigations).
 *
 * Rules:
 * - Only public, same-origin URLs; no auth/dashboard/owner/tenant (user-specific).
 * - Prerender only for static, side-effect-free pages (no analytics that must fire once).
 * - Eager: above-the-fold / primary CTAs. Moderate: visible/near-viewport links.
 * - Conservative: prefetch on hover or when link becomes visible (footer, secondary).
 * - Document-level rules catch any same-origin <a> href not covered by explicit lists.
 */

/** Pages safe for full prerender (static, no side effects, no auth state). */
export const PRERENDER_URLS: string[] = [
  "/",
  "/buy",
  "/contact",
]

/** Primary nav – prefetch eagerly as soon as the rule is seen. */
export const EAGER_PREFETCH_URLS: string[] = [
  "/loans",
  "/about",
]

/** Secondary nav and high-traffic pages – prefetch when link is visible (moderate). */
export const MODERATE_PREFETCH_URLS: string[] = [
  "/resources",
  "/blog",
]

/**
 * Footer and secondary links – prefetch on hover or when visible (conservative).
 * Keeps bandwidth usage low while still speeding up likely next navigations.
 */
export const CONSERVATIVE_PREFETCH_URLS: string[] = [
  "/calculators/mortgage-payment",
]

/** Paths that must never be prefetched or prerendered (user-specific, auth, side effects). */
const EXCLUDED_PATH_PREFIXES = [
  // /platform is the entire post-login app shell. Per the prefetch/bfcache
  // rules, anything that may set cookies, reflect auth state, or trigger
  // side effects on first paint must not be prefetched/prerendered.
  "/platform",
  "/api/",
  "/auth/callback",
  "/auth/login",
  "/auth/signup",
  "/login",
  "/signup",
  "/logout",
  // Token-bearing paths must not be prefetched — every visit consumes the token
  // exactly once (apply, invite, onboarding, visit confirmation).
  "/apply/",
  "/invite/",
  "/tenantOnboarding/",
  "/visit/confirm/",
]

interface SpeculationRule {
  source: "list" | "document"
  urls?: string[]
  eagerness: "eager" | "moderate" | "conservative" | "immediate"
  where?: Record<string, unknown>
}

interface SpeculationRules {
  prefetch: SpeculationRule[]
  prerender: SpeculationRule[]
}

/**
 * Build speculation rules JSON for script type="speculationrules".
 *
 * - Prerender: top-level static pages for instant navigation (eager).
 * - Prefetch (list): explicit URLs at eager/moderate/conservative eagerness.
 * - Prefetch (document): catch-all for any same-origin <a> not in the lists,
 *   excluding user-specific/auth paths. Uses moderate eagerness so links are
 *   prefetched when they scroll into the viewport.
 */
export function getSpeculationRulesJson(): string {
  const rules: SpeculationRules = {
    prerender: [
      { source: "list", urls: PRERENDER_URLS, eagerness: "moderate" },
    ],
    prefetch: [
      { source: "list", urls: EAGER_PREFETCH_URLS, eagerness: "eager" },
      { source: "list", urls: MODERATE_PREFETCH_URLS, eagerness: "moderate" },
      { source: "list", urls: CONSERVATIVE_PREFETCH_URLS, eagerness: "conservative" },
      {
        source: "document",
        eagerness: "conservative",
        where: {
          and: [
            { href_matches: "/*" },
            { not: { href_matches: EXCLUDED_PATH_PREFIXES.map((p) => `${p}*`) } },
            { not: { selector_matches: "[data-no-prefetch]" } },
          ],
        },
      },
    ],
  }
  return JSON.stringify(rules)
}
