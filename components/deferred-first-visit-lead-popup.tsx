"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// The popup (dialog, form, anti-spam, lead API client) does not show for 25 seconds at the
// earliest, so it has no business on the startup path. Import it once the page has settled.
const FirstVisitLeadPopup = dynamic(
  () => import("@/components/first-visit-lead-popup").then((m) => m.FirstVisitLeadPopup),
  { ssr: false },
)

/** Latest the chunk is requested if the browser never reports an idle period. */
const IDLE_TIMEOUT_MS = 3_000

export function DeferredFirstVisitLeadPopup() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: IDLE_TIMEOUT_MS })
      return () => window.cancelIdleCallback(id)
    }
    // Safari has no requestIdleCallback.
    const id = window.setTimeout(() => setReady(true), IDLE_TIMEOUT_MS)
    return () => window.clearTimeout(id)
  }, [])

  return ready ? <FirstVisitLeadPopup /> : null
}
