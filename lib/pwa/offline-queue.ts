import { backendUrl } from "@/lib/backend"
import { getCsrfToken, isRetryableStatus } from "@/lib/api/http"

export type SyncQueueType = "propertyInquiry" | "maintenanceRequest"

export interface SyncQueueItem<TPayload = unknown> {
  id: string
  type: SyncQueueType
  endpoint: string
  /**
   * The full URL, resolved with backendUrl() when the item was queued. The service worker
   * replays this instead of rebuilding a URL from its own copy of the backend host.
   */
  url?: string
  payload: TPayload
  createdAt: string
  /** Replays that reached the server and got a retryable answer (5xx, 408, 429). */
  attempts?: number
}

/** After this many failed replays an item is dropped. Keep in sync with public/sw.js. */
export const MAX_SYNC_ATTEMPTS = 8

const DB_NAME = "ondo-pwa-db"
// Version 2: browsers that an older build left with an empty version-1 database (no store)
// upgrade, and onupgradeneeded below creates the store. Keep in sync with public/sw.js.
const DB_VERSION = 2
const STORE_NAME = "syncQueue"

function openDb(): Promise<IDBDatabase> {
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
      // Let a later schema upgrade (another tab, or the service worker) proceed.
      db.onversionchange = () => db.close()
      resolve(db)
    }
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"))
  })
}

function createQueueItem<TPayload>(
  type: SyncQueueType,
  endpoint: string,
  payload: TPayload
): SyncQueueItem<TPayload> {
  return {
    id: `${type}-${crypto.randomUUID()}`,
    type,
    endpoint,
    url: backendUrl(endpoint),
    payload,
    createdAt: new Date().toISOString(),
  }
}

export async function enqueueSyncItem<TPayload>(
  type: SyncQueueType,
  endpoint: string,
  payload: TPayload
): Promise<SyncQueueItem<TPayload>> {
  const db = await openDb()
  const item = createQueueItem(type, endpoint, payload)

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).put(item)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Failed to enqueue sync item"))
  })

  return item
}

export async function getQueuedSyncItems(): Promise<SyncQueueItem[]> {
  const db = await openDb()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const request = tx.objectStore(STORE_NAME).getAll()
    request.onsuccess = () => {
      const items = (request.result as SyncQueueItem[]).sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      )
      resolve(items)
    }
    request.onerror = () => reject(request.error ?? new Error("Failed to read sync queue"))
  })
}

export async function removeQueuedSyncItem(id: string): Promise<void> {
  const db = await openDb()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Failed to remove sync item"))
  })
}

async function updateQueuedSyncItem(item: SyncQueueItem): Promise<void> {
  const db = await openDb()

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).put(item)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("Failed to update sync item"))
  })
}

export async function triggerSync(tag: SyncQueueType): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  const registration = await navigator.serviceWorker.ready

  if ("sync" in registration) {
    try {
      await (registration as unknown as { sync: { register(tag: string): Promise<void> } }).sync.register(tag)
      return
    } catch {
      // Fallback below for browsers without Background Sync support.
    }
  }

  await flushQueueNow()
}

export async function flushQueueNow(): Promise<void> {
  const queuedItems = await getQueuedSyncItems()

  for (const item of queuedItems) {
    try {
      const csrf = getCsrfToken()
      const response = await fetch(item.url ?? backendUrl(item.endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(csrf && { "x-csrf-token": csrf }),
        },
        credentials: "include",
        body: JSON.stringify(item.payload),
      })

      if (response.ok || !isRetryableStatus(response.status)) {
        // Saved, or rejected for good (a 4xx the same request will hit again): either way it
        // leaves the queue.
        await removeQueuedSyncItem(item.id)
      } else {
        // A server error or rate limit stays for the next flush, up to a cap.
        const attempts = (item.attempts ?? 0) + 1
        if (attempts >= MAX_SYNC_ATTEMPTS) await removeQueuedSyncItem(item.id)
        else await updateQueuedSyncItem({ ...item, attempts })
      }
    } catch {
      break
    }
  }
}
