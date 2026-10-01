/**
 * Sticky mobile conversion bar: which routes show it, and which second call to action each
 * route gets. Pure data and helpers so the bar, the layout padding and the floating widgets
 * all answer "is the bar on screen?" from one place (see useStickyBarVisible).
 */

import { usePathname } from "next/navigation"
import { isStandaloneRoute } from "@/lib/standalone-routes"

/** Routes where the bar is not rendered at all. */
export const STICKY_BAR_HIDDEN_PREFIXES = [
  "/login",
  "/auth",
  "/owner",
  "/tenant",
  "/dashboard",
  "/apply",
  "/invite",
  "/chat",
  "/tenantOnboarding",
  // Quiz and loan forms: the bar would cover the fields, and its CTA would point away from them.
  "/buy/quiz",
  "/get-matched",
  "/qualify",
  "/loans/second-look",
  "/refinance/watch",
  // These two render their own page-specific fixed bottom bar. Without this the
  // global bar stacks underneath theirs and the visitor loses that much viewport
  // to two competing CTAs.
  "/notary",
  "/calculators/cost-of-living",
] as const

export interface StickyCta {
  label: string
  href: string
  /** GA4 event name for the click. */
  event: string
}

/** Owner offer: the estimator returns a rent estimate as well as a sale estimate. Same label as the homepage hero; the event name stays mobile_cta_rental_analysis so reporting is continuous. */
export const RENTAL_ANALYSIS_CTA: StickyCta = {
  label: "Free home estimate",
  href: "/whats-my-home-worth",
  event: "mobile_cta_rental_analysis",
}

const HOME_WORTH_CTA: StickyCta = {
  label: "What's my home worth?",
  href: "/whats-my-home-worth",
  event: "mobile_cta_home_worth",
}

/** Used on routes with no entry in STICKY_CTA_ROUTES: the owner offer, labelled for its destination. */
export const DEFAULT_STICKY_CTA: StickyCta = HOME_WORTH_CTA

/**
 * Path prefix to second button. First match wins, so list more specific prefixes first.
 * Landlord pages keep the rental analysis; buyers, sellers, borrowers and renters get an
 * offer that fits what they came for.
 */
export const STICKY_CTA_ROUTES: ReadonlyArray<{ prefix: string; cta: StickyCta }> = [
  { prefix: "/property-management", cta: RENTAL_ANALYSIS_CTA },
  { prefix: "/pricing", cta: RENTAL_ANALYSIS_CTA },
  { prefix: "/solutions", cta: RENTAL_ANALYSIS_CTA },
  { prefix: "/compare-utah-property-managers", cta: RENTAL_ANALYSIS_CTA },
  { prefix: "/vs", cta: RENTAL_ANALYSIS_CTA },
  { prefix: "/buy", cta: { label: "Start the buyer quiz", href: "/buy/quiz", event: "mobile_cta_buyer_quiz" } },
  { prefix: "/sell", cta: HOME_WORTH_CTA },
  {
    prefix: "/loans",
    cta: { label: "Talk with a loan officer", href: "/qualify", event: "mobile_cta_loan_inquiry" },
  },
  {
    prefix: "/refinance",
    cta: { label: "Talk with a loan officer", href: "/qualify", event: "mobile_cta_loan_inquiry" },
  },
  { prefix: "/properties", cta: { label: "Book a call", href: "/contact", event: "mobile_cta_book_call" } },
]

function normalize(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

/** The homepage speaks mostly to owners, so it keeps the rental analysis. */
export function stickyCtaForPath(pathname: string | null | undefined): StickyCta {
  if (!pathname) return DEFAULT_STICKY_CTA
  const path = normalize(pathname)
  if (path === "/") return RENTAL_ANALYSIS_CTA
  return STICKY_CTA_ROUTES.find(({ prefix }) => matchesPrefix(path, prefix))?.cta ?? DEFAULT_STICKY_CTA
}

/** True when StickyMobileCtaBar renders on this route (before the md breakpoint hides it). */
export function isStickyBarVisible(pathname: string | null | undefined): boolean {
  if (!pathname) return true
  if (isStandaloneRoute(pathname)) return false
  const path = normalize(pathname)
  return !STICKY_BAR_HIDDEN_PREFIXES.some((prefix) => matchesPrefix(path, prefix))
}

/** Client hook so the layout padding and floating widgets lift only when the bar is really there. */
export function useStickyBarVisible(): boolean {
  return isStickyBarVisible(usePathname())
}
