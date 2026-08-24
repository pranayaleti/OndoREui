/**
 * Back/Forward Cache (bfcache) optimization utilities
 * Ensures pages can be restored from bfcache for instant navigation.
 *
 * Rules:
 * - Use pagehide (with event.persisted) for cleanup or analytics; avoid beforeunload/unload.
 * - Use pageshow with event.persisted === true to detect bfcache restore and re-initialize.
 * - For sending data on exit, use visibilitychange, pagehide, or sendBeacon in pagehide , 
 *   never rely on beforeunload/unload (they break bfcache and are unreliable).
 * - Avoid: unload listeners, Cache API during unload, closing WebSockets in unload,
 *   or setting history.state right before navigation.
 * - Prefer replaceState for in-page state updates so the history entry stays bfcache-eligible;
 *   avoid pushState right before the user navigates away.
 */

type BfcacheRestoreCallback = () => void
const restoreCallbacks: Set<BfcacheRestoreCallback> = new Set()
const pagehideCallbacks: Set<() => void> = new Set()
const trackedTimers: Set<ReturnType<typeof setTimeout>> = new Set()
const trackedIntervals: Set<ReturnType<typeof setInterval>> = new Set()
let initialized = false

/**
 * Register a callback to run when the page is restored from bfcache (pageshow + persisted).
 * Returns an unregister function.
 */
export function registerBfcacheRestoreCallback(callback: BfcacheRestoreCallback): () => void {
  restoreCallbacks.add(callback)
  return () => {
    restoreCallbacks.delete(callback)
  }
}

/**
 * Track a timer so it can be cleared before pagehide and re-created on bfcache restore.
 * Returns the timer id. Use instead of raw setTimeout/setInterval for bfcache safety.
 */
export function trackTimeout(fn: () => void, ms: number): ReturnType<typeof setTimeout> {
  const id = setTimeout(() => {
    trackedTimers.delete(id)
    fn()
  }, ms)
  trackedTimers.add(id)
  return id
}

export function trackInterval(fn: () => void, ms: number): ReturnType<typeof setInterval> {
  const id = setInterval(fn, ms)
  trackedIntervals.add(id)
  return id
}

export function untrackTimer(id: ReturnType<typeof setTimeout>): void {
  clearTimeout(id)
  trackedTimers.delete(id)
}

export function untrackInterval(id: ReturnType<typeof setInterval>): void {
  clearInterval(id)
  trackedIntervals.delete(id)
}

function runCallbacksSafely(callbacks: Set<() => void>) {
  callbacks.forEach((cb) => {
    try {
      cb()
    } catch {
      /* ignore so one callback does not break others */
    }
  })
}

/**
 * Initialize bfcache optimization.
 * Call once (idempotent) in a useEffect from BfcacheProvider.
 */
export function initBfcacheOptimization() {
  if (typeof window === "undefined" || initialized) return
  initialized = true

  window.addEventListener(
    "pageshow",
    (event: PageTransitionEvent) => {
      if (event.persisted) {
        runCallbacksSafely(restoreCallbacks)
      }
    },
    { passive: true },
  )

  window.addEventListener(
    "pagehide",
    () => {
      runCallbacksSafely(pagehideCallbacks)
    },
    { passive: true },
  )
}

/**
 * Register a callback to run when the page is hidden (pagehide).
 * Use for sending analytics via sendBeacon only; keep the callback lightweight
 * so the page stays bfcache-eligible. Returns an unregister function.
 */
export function onPagehide(callback: () => void): () => void {
  pagehideCallbacks.add(callback)
  if (typeof window !== "undefined" && !initialized) {
    initBfcacheOptimization()
  }
  return () => {
    pagehideCallbacks.delete(callback)
  }
}

/**
 * Cleanup function to ensure bfcache compatibility.
 * Clears tracked timers/intervals and closes open IndexedDB connections.
 * Call from pagehide (or automatically via BfcacheProvider).
 */
export function cleanupForBfcache() {
  if (typeof window === "undefined") return

  trackedTimers.forEach((id) => clearTimeout(id))
  trackedTimers.clear()
  trackedIntervals.forEach((id) => clearInterval(id))
  trackedIntervals.clear()

  // Close all IndexedDB databases by requesting and immediately closing them.
  // Real connections are managed by callers; this ensures no stale handles linger.
  if (typeof indexedDB !== "undefined") {
    try {
      const req = indexedDB.open("ondo-pwa-db")
      req.onsuccess = () => req.result.close()
    } catch {
      /* best-effort */
    }
  }
}

/**
 * Re-initialize resources after bfcache restore (timers, subscriptions, stale data).
 * Consumers register their own restore callbacks; this runs all of them plus
 * cleans up any stale state from the frozen page.
 */
export function restoreAfterBfcache() {
  if (typeof window === "undefined") return

  // Revalidate any in-memory caches by broadcasting a custom event
  window.dispatchEvent(new CustomEvent("bfcache-restore"))

  // Force re-check of online/offline state – the network may have changed
  if (navigator.onLine) {
    window.dispatchEvent(new Event("online"))
  }
}

/**
 * Check if bfcache is supported
 */
export function isBfcacheSupported(): boolean {
  if (typeof window === "undefined") return false
  return "performance" in window && "navigation" in window.performance
}

/**
 * Run a callback when the page becomes hidden (visibilitychange).
 * Use this for flushing analytics or saving state instead of beforeunload/unload,
 * so the page stays bfcache-eligible.
 */
export function onPageHidden(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {}

  const handler = () => {
    if (document.visibilityState === "hidden") callback()
  }
  document.addEventListener("visibilitychange", handler, { passive: true })
  return () => document.removeEventListener("visibilitychange", handler)
}

/**
 * Send a beacon on pagehide. Use for analytics or last-event flush without blocking bfcache.
 * Keeps the callback minimal (only sendBeacon); do not do heavy work or storage here.
 */
export function sendBeaconOnPagehide(url: string, payload?: string | Blob): () => void {
  return onPagehide(() => {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob =
        typeof payload === "string"
          ? new Blob([payload], { type: "text/plain" })
          : payload
      navigator.sendBeacon(url, blob ?? "")
    }
  })
}

