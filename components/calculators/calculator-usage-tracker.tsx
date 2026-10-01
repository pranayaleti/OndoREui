"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

/**
 * Fires one `use_calculator` event per page view, on the first edit inside the page's
 * <main>. Mounted once by app/calculators/[slug]/page.tsx so all calculators report the
 * same way without each one wiring analytics. Header search, footer and chat inputs sit
 * outside <main>, so they do not count.
 */
export function CalculatorUsageTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const onEdit = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element) || !target.closest("main")) return
      analytics.trackCalculatorUsage(slug, {})
      document.removeEventListener("input", onEdit, true)
      document.removeEventListener("change", onEdit, true)
    }
    document.addEventListener("input", onEdit, true)
    document.addEventListener("change", onEdit, true)
    return () => {
      document.removeEventListener("input", onEdit, true)
      document.removeEventListener("change", onEdit, true)
    }
  }, [slug])

  return null
}
