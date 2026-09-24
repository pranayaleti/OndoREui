"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

/**
 * Sends a GA4 `links_click` event, labeled with the tapped element's
 * `data-links-id`, for every /links button. One delegated listener keeps the
 * page itself a server component; capture phase means a link's own handler
 * cannot swallow the event before it is counted.
 */
export function LinkClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const id = target?.closest("[data-links-id]")?.getAttribute("data-links-id")
      if (id) analytics.trackEvent("links_click", "links_page", id)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}
