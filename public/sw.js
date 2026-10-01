/* eslint-disable no-restricted-globals */
// v4: API responses are no longer cached. Bumping the version makes activate delete every older
// cache, including the ondo-api-v3 cache that held cookie-authenticated API answers.
const SW_VERSION = "v4"
const STATIC_CACHE = `ondo-static-${SW_VERSION}`
const RUNTIME_CACHE = `ondo-runtime-${SW_VERSION}`
const LAST_VIEWED_CACHE = `ondo-last-viewed-${SW_VERSION}`

const DB_NAME = "ondo-pwa-db"
// Keep in sync with lib/pwa/offline-queue.ts. Version 2 upgrades browsers an older build left
// with an empty version-1 database (no store); onupgradeneeded below creates the store.
const DB_VERSION = 2
const STORE_NAME = "syncQueue"
// Replays that got a retryable answer before an item is dropped. Keep in sync with lib/pwa/offline-queue.ts.
const MAX_SYNC_ATTEMPTS = 8

// Page URLs keep their trailing slash: GitHub Pages answers "/platform" with a 301, and a cached
// redirect cannot be served to a navigation (the page fails to load offline).
const APP_SHELL = [
  "/",
  "/platform/",
  "/platform/properties/",
  "/favicon.svg",
  "/manifest.json",
]

const WARM_ROUTES = [
  "/buy/",
  "/sell/",
  "/properties/",
  "/contact/",
  "/loans/",
  "/calculators/",
]

const RUNTIME_CACHE_MAX_ENTRIES = 60

// ---------------------------------------------------------------------------
// Install
// ---------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  )
})

// ---------------------------------------------------------------------------
// Activate – clean old caches + enable navigation preload
// ---------------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter(
                (key) =>
                  ![STATIC_CACHE, RUNTIME_CACHE, LAST_VIEWED_CACHE].includes(key),
              )
              .map((key) => caches.delete(key)),
          ),
        ),
      enableNavigationPreload(),
      warmCaches(),
    ]).then(() => self.clients.claim()),
  )
})

async function enableNavigationPreload() {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable()
  }
}

async function warmCaches() {
  const cache = await caches.open(RUNTIME_CACHE)
  const existing = await cache.keys()
  const existingUrls = new Set(existing.map((r) => new URL(r.url).pathname))
  const toFetch = WARM_ROUTES.filter((url) => !existingUrls.has(url))
  await Promise.allSettled(
    toFetch.map(async (url) => {
      try {
        const res = await fetch(url, { credentials: "same-origin" })
        if (res.ok) await cache.put(url, res)
      } catch (_) {
        /* best-effort */
      }
    }),
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
// This worker only handles this site's own pages and static files. It never caches another
// origin (analytics, Stripe, the API host) and never caches an API answer: those can be
// per-user (cookie or Authorization based) and must always come from the network. Offline
// fallback for API data is handled by the app's own IndexedDB cache and sync queue.
function shouldBypass(request, requestUrl) {
  return (
    requestUrl.origin !== self.location.origin ||
    isApiRequest(requestUrl) ||
    request.cache === "no-store" ||
    request.headers.has("Authorization")
  )
}

function isStaticAsset(requestUrl) {
  return (
    requestUrl.pathname.startsWith("/_next/static/") ||
    requestUrl.pathname.endsWith(".css") ||
    requestUrl.pathname.endsWith(".js") ||
    requestUrl.pathname.endsWith(".svg") ||
    requestUrl.pathname.endsWith(".png") ||
    requestUrl.pathname.endsWith(".jpg") ||
    requestUrl.pathname.endsWith(".jpeg") ||
    requestUrl.pathname.endsWith(".webp") ||
    requestUrl.pathname.endsWith(".woff2") ||
    requestUrl.pathname.endsWith(".woff")
  )
}

function isApiRequest(requestUrl) {
  return requestUrl.pathname.startsWith("/api/") || requestUrl.href.includes("supabase.co/functions/v1/api")
}

// ---------------------------------------------------------------------------
// Caching strategies
// ---------------------------------------------------------------------------

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response && response.ok) {
    await cache.put(request, response.clone())
  }
  return response
}

async function networkFirst(request, cacheName, fallbackResponse) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response && response.ok) {
      await cache.put(request, response.clone())
    }
    return response
  } catch (_error) {
    const cached = await cache.match(request)
    if (cached) return cached
    return fallbackResponse instanceof Promise ? await fallbackResponse : fallbackResponse
  }
}

/**
 * Stale-while-revalidate: return cached version immediately, then
 * update the cache in the background for next time.
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  return cached || (await fetchPromise)
}

/**
 * Network-first with navigation preload support.
 * Uses the preload response if available, avoiding a redundant fetch.
 */
async function networkFirstWithPreload(request, preloadResponse, cacheName, fallback) {
  const cache = await caches.open(cacheName)
  try {
    const response = (await preloadResponse) || (await fetch(request))
    if (response && response.ok) {
      await cache.put(request, response.clone())
    }
    return response
  } catch (_error) {
    const cached = await cache.match(request)
    if (cached) return cached
    return fallback instanceof Promise ? await fallback : fallback
  }
}

// ---------------------------------------------------------------------------
// Cache maintenance – enforce max entries
// ---------------------------------------------------------------------------
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length > maxEntries) {
    await Promise.all(keys.slice(0, keys.length - maxEntries).map((k) => cache.delete(k)))
  }
}

// ---------------------------------------------------------------------------
// Fetch handler
// ---------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const requestUrl = new URL(request.url)

  // Not handled: the browser fetches it as if no worker existed.
  if (shouldBypass(request, requestUrl)) return

  if (isStaticAsset(requestUrl)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  const isPropertyDetailsPage = requestUrl.pathname.startsWith("/platform/properties/")
  if (isPropertyDetailsPage) {
    event.respondWith(staleWhileRevalidate(request, LAST_VIEWED_CACHE))
    return
  }

  if (request.mode === "navigate") {
    event.respondWith(
      networkFirstWithPreload(
        request,
        event.preloadResponse,
        RUNTIME_CACHE,
        caches.match("/platform/").then((res) => res || caches.match("/")),
      ).then((res) => {
        trimCache(RUNTIME_CACHE, RUNTIME_CACHE_MAX_ENTRIES)
        return res
      }),
    )
    return
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE))
})

// ---------------------------------------------------------------------------
// IndexedDB helpers for offline sync queue
// ---------------------------------------------------------------------------
function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("createdAt", "createdAt", { unique: false })
      }
    }

    request.onsuccess = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close()
        reject(new Error("Offline queue storage is unavailable"))
        return
      }
      db.onversionchange = () => db.close()
      resolve(db)
    }
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"))
  })
}

async function getAllQueueItems() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => {
      resolve((request.result || []).sort((a, b) => a.createdAt.localeCompare(b.createdAt)))
    }
    request.onerror = () => reject(request.error || new Error("Failed to read queue"))
  })
}

async function removeQueueItem(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error("Failed to remove queue item"))
  })
}

async function putQueueItem(item) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).put(item)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error("Failed to update queue item"))
  })
}

// The page sends its CSRF token as a header read from the ondo_csrf cookie. A worker cannot read
// document.cookie, so use the Cookie Store API where it exists (Chromium, the same browsers that
// run Background Sync).
async function csrfHeaders() {
  try {
    const cookie = self.cookieStore ? await self.cookieStore.get("ondo_csrf") : null
    return cookie && cookie.value ? { "x-csrf-token": cookie.value } : {}
  } catch (_error) {
    return {}
  }
}

async function flushQueueByType(type) {
  const items = await getAllQueueItems()
  const filteredItems = items.filter((item) => item.type === type)

  for (const item of filteredItems) {
    try {
      // Items queued by this build carry the URL the page resolved with backendUrl(). Older
      // items only have the endpoint: the base already ends in /api (the Edge Function), so a
      // stored "/api/leads/contact" must lose its own /api prefix.
      const endpoint = item.url
        ? item.url
        : item.endpoint.startsWith("http")
          ? item.endpoint
          : `https://lpklmquhxgbpavjngbby.supabase.co/functions/v1/api${item.endpoint.replace(/^\/api(?=\/|$)/, "")}`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await csrfHeaders()) },
        credentials: "include",
        body: JSON.stringify(item.payload),
      })
      if (response.ok || (response.status < 500 && response.status !== 408 && response.status !== 429)) {
        // Saved, or rejected for good (a 4xx the same request will hit again): leave the queue.
        await removeQueueItem(item.id)
      } else {
        // A server error, timeout or rate limit stays for the next sync, up to a cap.
        const attempts = (item.attempts || 0) + 1
        if (attempts >= MAX_SYNC_ATTEMPTS) await removeQueueItem(item.id)
        else await putQueueItem({ ...item, attempts })
      }
    } catch (_error) {
      break
    }
  }
}

// ---------------------------------------------------------------------------
// Background Sync
// ---------------------------------------------------------------------------
self.addEventListener("sync", (event) => {
  if (event.tag === "propertyInquiry") {
    event.waitUntil(flushQueueByType("propertyInquiry"))
  } else if (event.tag === "maintenanceRequest") {
    event.waitUntil(flushQueueByType("maintenanceRequest"))
  }
})

// ---------------------------------------------------------------------------
// Push notifications
// ---------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? { title: "Ondo", body: "You have a new notification" }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: data.url ? { url: data.url } : undefined,
    }),
  )
})

// A push payload is data from outside this origin. Only a URL on this site may be opened:
// anything else (another origin, a javascript: or data: URL, an unparsable string) becomes "/".
function resolveNotificationTarget(rawUrl) {
  try {
    const target = new URL(String(rawUrl), self.location.origin)
    if (target.origin === self.location.origin) return target
  } catch {
    /* fall through to the home page */
  }
  return new URL("/", self.location.origin)
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  if (event.notification.data?.url) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        const target = resolveNotificationTarget(event.notification.data.url)
        for (const client of windowClients) {
          let clientUrl = null
          try {
            clientUrl = new URL(client.url)
          } catch {
            /* skip a client with an unparsable URL */
          }
          if (
            clientUrl &&
            clientUrl.origin === target.origin &&
            clientUrl.pathname === target.pathname &&
            "focus" in client
          ) {
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(target.href)
        }
        return null
      }),
    )
  }
})
