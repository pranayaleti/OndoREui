/**
 * Web Push Notification utilities for Ondo Real Estate PWA.
 *
 * Usage:
 *   import { isPushSupported, subscribeToPush, unsubscribeFromPush } from '@/lib/push-notifications'
 *
 * Requires NEXT_PUBLIC_VAPID_PUBLIC_KEY in your .env.local.
 */

import { backendUrl } from "@/lib/backend"

export interface PushSubscriptionPayload {
  endpoint: string
  expirationTime: number | null
  keys: {
    p256dh: string
    auth: string
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output
}

async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null
  try {
    return await navigator.serviceWorker.ready
  } catch {
    return null
  }
}

function serializeSubscription(sub: PushSubscription): PushSubscriptionPayload | null {
  const json = sub.toJSON()
  if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) return null
  return {
    endpoint: json.endpoint,
    expirationTime: json.expirationTime ?? null,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns true when the current browser supports web push notifications.
 * Safe to call on the server (returns false).
 */
export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
}

/**
 * Requests notification permission, subscribes to push via the service worker,
 * then POSTs the subscription object to the backend so the server can send
 * targeted pushes.
 *
 * Returns the serialised subscription on success, or null if the user denied
 * permission / the browser does not support push.
 */
export async function subscribeToPush(): Promise<PushSubscriptionPayload | null> {
  if (!isPushSupported()) return null

  const vapidKey = process.env["NEXT_PUBLIC_VAPID_PUBLIC_KEY"]
  if (!vapidKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("[push-notifications] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set — push notifications disabled.")
    }
    return null
  }

  // 1. Request permission
  const permission = await Notification.requestPermission()
  if (permission !== "granted") return null

  // 2. Get the active service worker registration
  const registration = await getServiceWorkerRegistration()
  if (!registration) return null

  // 3. Subscribe (or reuse existing subscription)
  let sub = await registration.pushManager.getSubscription()
  if (!sub) {
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    })
  }

  const payload = serializeSubscription(sub)
  if (!payload) return null

  // 4. Notify the backend so it can store the subscription
  try {
    await fetch(backendUrl("/api/notifications/push/subscribe"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    // Non-fatal: subscription is still valid locally
    console.warn("[push-notifications] Failed to register subscription with backend:", err)
  }

  return payload
}

/**
 * Unsubscribes from push notifications and notifies the backend to remove the
 * stored subscription so no further pushes are sent.
 *
 * Returns true if the unsubscription succeeded (or there was nothing to remove).
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false

  const registration = await getServiceWorkerRegistration()
  if (!registration) return false

  const sub = await registration.pushManager.getSubscription()
  if (!sub) return true // Already unsubscribed

  const payload = serializeSubscription(sub)

  // 1. Unsubscribe from the browser push service
  const success = await sub.unsubscribe()

  // 2. Tell the backend to discard the stored subscription
  if (success && payload) {
    try {
      await fetch(backendUrl("/api/notifications/push/unsubscribe"), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: payload.endpoint }),
      })
    } catch (err) {
      console.warn("[push-notifications] Failed to remove subscription from backend:", err)
    }
  }

  return success
}

/**
 * Returns the current Notification permission state, or 'unsupported' when
 * the browser does not expose the Notification API.
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported"
  return Notification.permission
}
