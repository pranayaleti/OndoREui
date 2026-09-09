"use client"

import { useEffect } from "react"
import { flushQueueNow } from "@/lib/pwa/offline-queue"
import { PwaInstallProvider } from "@/lib/pwa/install-context"

async function registerServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

  /**
   * `public/sw.js` uses cache-first for `/_next/static/*`. In `next dev`, chunk
   * URLs and valid webpack runtime + module maps change on every rebuild/HMR,
   * but the SW can keep serving *stale* JS, producing obscure runtime errors
   * like `Cannot read properties of undefined (reading 'call')`.
   */
  if (process.env.NODE_ENV === "development") {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((r) => r.unregister()))
    } catch {
      /* best-effort */
    }
    return
  }

  try {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })
  } catch {
    // Service worker registration failure should not break app rendering.
  }
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void registerServiceWorker()

    // Retry queue flush whenever connectivity returns.
    const handleOnline = () => {
      void flushQueueNow()
    }

    window.addEventListener("online", handleOnline)
    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  // Deliberately NOT requesting notification permission here.
  //
  // This used to call Notification.requestPermission() from a bare mount effect,
  // so every first-time visitor got a native browser permission dialog on page
  // load without asking for it. Chrome treats an ungestured permission request
  // as abuse and can auto-deny it site-wide, which costs the permission for the
  // visitors who would actually have said yes.
  //
  // Re-enable only from a real user gesture -- a "Notify me" control the visitor
  // clicks -- not from a lifecycle effect.

  return (
    <PwaInstallProvider>
      {children}
    </PwaInstallProvider>
  )
}
