"use client"

import { useEffect } from "react"
import { flushQueueNow } from "@/lib/pwa/offline-queue"
import { PwaInstallProvider } from "@/lib/pwa/install-context"

async function registerServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

  /**
   * `public/sw.js` uses cache-first for `/_next/static/*`. In `next dev`, chunk
   * URLs and valid webpack runtime + module maps change on every rebuild/HMR,
   * but the SW can keep serving *stale* JS — producing obscure runtime errors
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

async function requestPushPermission(): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return
  if (Notification.permission !== "default") return

  try {
    await Notification.requestPermission()
  } catch {
    // Ignore push permission errors in unsupported environments.
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

  useEffect(() => {
    void requestPushPermission()
  }, [])

  return (
    <PwaInstallProvider>
      {children}
    </PwaInstallProvider>
  )
}
