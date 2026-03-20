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
  "/sell",
  "/properties",
  "/contact",
]

/** Primary nav – prefetch eagerly as soon as the rule is seen. */
export const EAGER_PREFETCH_URLS: string[] = [
  "/property-management",
  "/loans",
  "/notary",
  "/calculators",
  "/about",
  "/faq",
  "/investments",
  "/investments/commercial-real-estate",
  "/investments/fractional",
  "/investments/opportunities",
]

/** Secondary nav and high-traffic pages – prefetch when link is visible (moderate). */
export const MODERATE_PREFETCH_URLS: string[] = [
  "/resources",
  "/news",
  "/blog",
  "/why-utah",
  "/founders-letter",
  "/refinance/process",
  "/sweepstakes",
  "/accessibility",
  "/privacy-policy",
  "/terms-of-service",
  "/sitemap",
  "/buy/first-time",
  "/buy/second-home",
  "/buy/fixed-rate",
  "/buy/rates",
  "/loans/conventional",
  "/about/history",
  "/about/team",
  "/about/careers",
  "/faq/general-faqs",
  "/faq/payments-faqs",
]

/**
 * Footer and secondary links – prefetch on hover or when visible (conservative).
 * Keeps bandwidth usage low while still speeding up likely next navigations.
 */
export const CONSERVATIVE_PREFETCH_URLS: string[] = [
  "/buy/30-year",
  "/buy/15-year",
  "/buy/adjustable-rate",
  "/loans/fha",
  "/loans/va",
  "/loans/usda",
  "/loans/heloc",
  "/loans/reverse",
  "/loans/jumbo",
  "/calculators/mortgage-payment",
  "/calculators/affordability",
  "/calculators/income",
  "/calculators/closing-cost",
  "/calculators/refinance",
  "/calculators/home-sale",
  "/calculators/buying-power",
  "/about/giving-back",
  "/about/news",
  "/about/investor-relations",
  "/about/testimonials",
  "/faq/tenant-faqs",
  "/faq/owner-faqs",
  "/faq/notary-faqs",
  "/faq/loans-faqs",
  "/faq/loan-payoffs-faqs",
  "/faq/hardship-faqs",
  "/faq/escrow-faqs",
  "/faq/disaster-faqs",
  "/faq/buying-selling-faqs",
]

/** Paths that must never be prefetched or prerendered (user-specific, auth, side effects). */
const EXCLUDED_PATH_PREFIXES = [
  "/platform/owner",
  "/platform/tenant",
  "/platform/admin",
  "/api/",
  "/auth/callback",
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
