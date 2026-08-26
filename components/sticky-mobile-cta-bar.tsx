"use client"

/**
 * Sticky mobile conversion bar.
 *
 * Mirrors the always-visible "Call" + "Free rental analysis" pattern used by
 * high-converting Utah PM sites. Mobile-only; hidden on portal/auth routes
 * and on the rental-analysis page itself so we never self-link.
 *
 * Layout note: the WhatsApp and public assistant floats are lifted on
 * mobile via CSS on those components; this bar owns the bottom edge.
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Calculator } from "lucide-react"
import { SITE_PHONE } from "@/lib/site"
import { analytics } from "@/lib/analytics"

const HIDDEN_PREFIXES = [
  "/login",
  "/auth",
  "/owner",
  "/tenant",
  "/dashboard",
  "/apply",
  "/invite",
  "/chat",
  "/tenantOnboarding",
] as const

const ANALYSIS_PATH = "/whats-my-home-worth"

function isHiddenRoute(pathname: string | null): boolean {
  if (!pathname) return false
  return HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function StickyMobileCtaBar() {
  const pathname = usePathname()
  if (isHiddenRoute(pathname)) return null

  const onAnalysisPage =
    pathname === ANALYSIS_PATH || pathname?.startsWith(`${ANALYSIS_PATH}/`)

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="Quick contact"
    >
      <div className={`grid ${onAnalysisPage ? "grid-cols-1" : "grid-cols-2"} gap-2 p-2`}>
        <a
          href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}
          onClick={() =>
            analytics.trackEvent("mobile_cta_call", "engagement", "sticky_mobile_bar")
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Call Ondo RE at ${SITE_PHONE}`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call
        </a>
        {!onAnalysisPage && (
          <Link
            href={ANALYSIS_PATH}
            onClick={() =>
              analytics.trackEvent(
                "mobile_cta_rental_analysis",
                "engagement",
                "sticky_mobile_bar"
              )
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Free rental analysis
          </Link>
        )}
      </div>
    </div>
  )
}

export default StickyMobileCtaBar
