"use client"

import { useEffect } from "react"

/**
 * Service-worker registration. Mounted once at the root layout. Skipped in dev so
 * Next's HMR overlay isn't fighting a cached SW. The SW source is /public/sw.js.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV === "development") return
    if (window.location.hostname === "localhost") return

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((err) => {
          // Don't surface to user — fall back gracefully.
          if (process.env.NODE_ENV !== "production") {
            console.warn("[sw] registration failed", err)
          }
        })
    }

    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
  }, [])

  return null
}
