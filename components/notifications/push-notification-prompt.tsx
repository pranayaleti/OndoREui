"use client"

import { useEffect, useState } from "react"
import {
  isPushSupported,
  subscribeToPush,
  getNotificationPermission,
} from "@/lib/push-notifications"

const DISMISSED_KEY = "ondo:push-prompt-dismissed"

/**
 * A small, non-intrusive banner that appears once to ask the user whether they
 * want to enable push notifications.
 *
 * Behaviour:
 * - Renders nothing on the server (client-only).
 * - Hidden if the browser does not support push, permission is already granted
 *   or denied, or the user has previously dismissed the banner.
 * - Dismissal is stored in localStorage so it persists across sessions.
 */
export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    // Only show if the browser supports push and permission is not yet decided
    if (!isPushSupported()) return
    const permission = getNotificationPermission()
    if (permission !== "default") return

    // Only show if the user has not already dismissed this prompt
    try {
      if (localStorage.getItem(DISMISSED_KEY)) return
    } catch {
      // localStorage may be unavailable in some private-browsing contexts
    }

    // Small delay so it does not pop up immediately on page load
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1")
    } catch {
      // ignore
    }
    setVisible(false)
  }

  async function handleEnable() {
    setSubscribing(true)
    try {
      const sub = await subscribeToPush()
      if (sub) {
        // Successfully subscribed — hide the banner
        setVisible(false)
        try {
          localStorage.setItem(DISMISSED_KEY, "1")
        } catch {
          // ignore
        }
      } else {
        // Permission denied or error — just dismiss so we don't prompt again
        dismiss()
      }
    } finally {
      setSubscribing(false)
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Enable push notifications"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm"
    >
      <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-card px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-card">
        {/* Bell icon */}
        <span className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
            <path
              fillRule="evenodd"
              d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Stay updated
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Get notified about new listings and updates.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleEnable}
            disabled={subscribing}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {subscribing ? "Enabling…" : "Enable"}
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss notification prompt"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-muted dark:text-gray-400 dark:hover:bg-card focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
