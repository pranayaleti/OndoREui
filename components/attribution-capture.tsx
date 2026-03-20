"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { captureMarketingAttributionFromWindow } from "@/lib/attribution"

/**
 * Persists UTMs / click ids from the URL into sessionStorage (first + last touch this tab).
 * Re-runs on client-side navigations when the query string changes.
 */
export function AttributionCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchKey = searchParams?.toString() ?? ""

  useEffect(() => {
    captureMarketingAttributionFromWindow()
  }, [pathname, searchKey])

  return null
}
