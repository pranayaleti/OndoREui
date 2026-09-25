"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

/**
 * One delegated listener for the whole site: any click inside an element carrying
 * `analyticsAttributes(...)` (data-analytics-event/category/label) becomes a GA4 event.
 * Capture phase, so an element's own handler cannot swallow the click first.
 */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const tagged = target?.closest<HTMLElement>("[data-analytics-event]")
      const name = tagged?.dataset.analyticsEvent
      if (!tagged || !name) return
      analytics.trackEvent(name, tagged.dataset.analyticsCategory ?? "click", tagged.dataset.analyticsLabel)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}
