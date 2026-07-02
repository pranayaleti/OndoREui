/* eslint-disable no-restricted-globals */
const SW_VERSION = "v2"
const STATIC_CACHE = `ondo-static-${SW_VERSION}`
const RUNTIME_CACHE = `ondo-runtime-${SW_VERSION}`
const API_CACHE = `ondo-api-${SW_VERSION}`
const LAST_VIEWED_CACHE = `ondo-last-viewed-${SW_VERSION}`

const DB_NAME = "ondo-pwa-db"
const DB_VERSION = 1
const STORE_NAME = "syncQueue"

const APP_SHELL = [
  "/",
  "/platform",
  "/platform/properties",
  "/favicon.svg",
  "/manifest.json",
]

const WARM_ROUTES = [
  "/buy",
  "/sell",
  "/properties",
  "/contact",
  "/loans",
  "/calculators",
]

const API_CACHE_MAX_AGE_MS = 5 * 60 * 1000
const RUNTIME_CACHE_MAX_ENTRIES = 60
const API_CACHE_MAX_ENTRIES = 40

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
                  ![STATIC_CACHE, RUNTIME_CACHE, API_CACHE, LAST_VIEWED_CACHE].includes(key),
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

function isApiRequest(url) {
  return url.includes("/api/") || url.includes("supabase.co/functions/v1/api")
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
// Cache maintenance – enforce max entries & API staleness
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

  if (isStaticAsset(requestUrl)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  if (isApiRequest(request.url)) {
    event.respondWith(
      staleWhileRevalidate(request, API_CACHE).then((res) => {
        trimCache(API_CACHE, API_CACHE_MAX_ENTRIES)
        return (
          res ||
          new Response(JSON.stringify({ error: "Offline and no cached data available" }), {
            headers: { "Content-Type": "application/json" },
            status: 503,
          })
        )
      }),
    )
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
        caches.match("/platform").then((res) => res || caches.match("/")),
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

    request.onsuccess = () => resolve(request.result)
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

async function flushQueueByType(type) {
  const items = await getAllQueueItems()
  const filteredItems = items.filter((item) => item.type === type)

  for (const item of filteredItems) {
    try {
      const endpoint = item.endpoint.startsWith("http")
        ? item.endpoint
        : `https://lpklmquhxgbpavjngbby.supabase.co/functions/v1/api${item.endpoint}`
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item.payload),
      })
      if (response.ok) {
        await removeQueueItem(item.id)
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

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  if (event.notification.data?.url) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        const targetUrl = event.notification.data.url
        for (const client of windowClients) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus()
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }
        return null
      }),
    )
  }
})
