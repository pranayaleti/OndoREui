"use client"

/**
 * Sticky mobile conversion bar.
 *
 * Always-visible "Call" plus one route-aware second button (lib/sticky-cta.ts):
 * landlord pages get the rental analysis, buyers, sellers, borrowers and renters
 * get an offer that fits them. Mobile-only; hidden on portal/auth/form routes,
 * and the second button drops out on its own destination so we never self-link.
 *
 * Layout note: the WhatsApp and public assistant floats are lifted on
 * mobile via CSS on those components; this bar owns the bottom edge.
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone, Calculator, Calendar } from "lucide-react"
import { SITE_PHONE } from "@/lib/site"
import { analytics } from "@/lib/analytics"
import { publicIdFromPathname } from "@/lib/public-property"
import { isStickyBarVisible, stickyCtaForPath } from "@/lib/sticky-cta"

/** Same clearance the homepage fee radios use so focus/scroll sits above this bar. */
export const STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS =
  "scroll-mb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:scroll-mb-0"

function isOnPath(pathname: string | null, target: string): boolean {
  if (!pathname) return false
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  return path === target || path.startsWith(`${target}/`)
}

export function StickyMobileCtaBar() {
  const pathname = usePathname()
  if (!isStickyBarVisible(pathname)) return null

  const cta = stickyCtaForPath(pathname)
  // Never link a page to itself: the second button drops out on its own destination.
  const onCtaTarget = isOnPath(pathname, cta.href)
  const onListingDetail = Boolean(pathname && publicIdFromPathname(pathname))

  return (
    <div
      data-fixed-bottom-bar
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      role="region"
      aria-label="Quick contact"
    >
      <div className={`grid ${onCtaTarget && !onListingDetail ? "grid-cols-1" : "grid-cols-2"} gap-2 p-2`}>
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
        {onListingDetail ? (
          <a
            href="#listing-inquire"
            onClick={() =>
              analytics.trackEvent(
                "mobile_cta_request_showing",
                "engagement",
                "sticky_mobile_bar",
              )
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Request a showing
          </a>
        ) : null}
        {!onCtaTarget && !onListingDetail ? (
          <Link
            href={cta.href}
            onClick={() =>
              analytics.trackEvent(cta.event, "engagement", "sticky_mobile_bar")
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            {cta.label}
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export default StickyMobileCtaBar
