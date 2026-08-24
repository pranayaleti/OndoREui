/**
 * IndexedDB-backed cache utility
 * Replaces localStorage for API responses, financial data, and large objects.
 *
 * Features:
 * - Async (non-blocking, no quota errors)
 * - TTL-based expiry per entry
 * - Versioned schema (bump DB_VERSION to wipe on breaking changes)
 * - Falls back gracefully when IDB is unavailable (SSR / private browsing)
 */

const DB_NAME = 'ondore-cache';
const DB_VERSION = 1;
const STORE_NAME = 'cache';

interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: number; // Unix ms
}

let _db: IDBDatabase | null = null;

async function openDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return null; // SSR guard
  if (_db) return _db;

  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('expiresAt', 'expiresAt');
      }
    };
    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result;
      resolve(_db);
    };
    req.onerror = () => resolve(null); // Fail gracefully
  });
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlMs: number = 5 * 60 * 1000 // default 5 minutes
): Promise<void> {
  const db = await openDB();
  if (!db) return;

  const entry: CacheEntry<T> = { key, value, expiresAt: Date.now() + ttlMs };
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve(); // Fail gracefully
  });
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const db = await openDB();
  if (!db) return null;

  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => {
      const entry = req.result as CacheEntry<T> | undefined;
      if (!entry) return resolve(null);
      if (Date.now() > entry.expiresAt) {
        // Stale, delete async and return null
        cacheDelete(key).catch(() => {});
        return resolve(null);
      }
      resolve(entry.value);
    };
    req.onerror = () => resolve(null);
  });
}

export async function cacheDelete(key: string): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

export async function cacheClear(): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

/** Delete all entries where expiresAt < now. Run on app init. */
export async function cachePurgeExpired(): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const index = tx.objectStore(STORE_NAME).index('expiresAt');
    const range = IDBKeyRange.upperBound(Date.now());
    const req = index.openCursor(range);
    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

/** TTL constants for common use cases */
export const TTL = {
  SHORT: 2 * 60 * 1000,     // 2 min, live prices, urgent data
  MEDIUM: 5 * 60 * 1000,    // 5 min, property lists, stats
  LONG: 30 * 60 * 1000,     // 30 min, calculator inputs, preferences
  DAY: 24 * 60 * 60 * 1000, // 24 hr, static reference data
} as const;
