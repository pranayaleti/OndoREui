"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Maps the current route to likely next navigations so the browser can
 * warm them in the background. Works alongside Speculation Rules by
 * injecting <link rel="prefetch"> for routes the user is statistically
 * most likely to visit next given where they already are.
 *
 * Only targets same-origin, public pages. Avoids user-specific routes.
 */

const ROUTE_GRAPH: Record<string, string[]> = {
  "/": ["/buy", "/sell", "/properties", "/contact", "/loans"],
  "/buy": ["/properties", "/calculators/mortgage-payment", "/calculators/affordability", "/buy/first-time", "/loans"],
  "/sell": ["/contact", "/calculators/home-sale", "/properties"],
  "/properties": ["/contact", "/buy", "/calculators/mortgage-payment"],
  "/contact": ["/properties", "/buy", "/sell"],
  "/loans": ["/calculators/mortgage-payment", "/calculators/affordability", "/loans/conventional", "/loans/fha", "/loans/va"],
  "/calculators": ["/calculators/mortgage-payment", "/calculators/affordability", "/calculators/refinance", "/calculators/closing-cost"],
  "/about": ["/about/team", "/about/history", "/contact", "/about/careers"],
  "/faq": ["/faq/general-faqs", "/faq/payments-faqs", "/contact"],
  "/platform": ["/platform/properties", "/platform/contact"],
  "/platform/properties": ["/platform/contact", "/platform"],
}

function prefetchUrl(href: string) {
  if (typeof document === "undefined") return
  if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) return
  const link = document.createElement("link")
  link.rel = "prefetch"
  link.href = href
  link.as = "document"
  document.head.appendChild(link)
}

export function RoutePrefetch() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname === "/") return

    const targets = ROUTE_GRAPH[pathname]
    if (!targets) return

    // Give LCP-critical work plenty of room before warming likely next pages.
    const id = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return
      targets.slice(0, 2).forEach(prefetchUrl)
    }, 4000)

    return () => clearTimeout(id)
  }, [pathname])

  return null
}
