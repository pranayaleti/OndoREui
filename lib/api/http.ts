import { backendUrl } from "@/lib/backend"
import { cacheGet, cacheSet, TTL } from "@/lib/cache/idb-cache"

const API_CACHE_PREFIX = "ondo:api-cache:"
const DEFAULT_TIMEOUT_MS = 30_000

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer))
}

interface RequestOptions {
  fallbackCacheKey?: string
  init?: RequestInit
}

async function readFromCache<T>(cacheKey: string): Promise<T | null> {
  return cacheGet<T>(`${API_CACHE_PREFIX}${cacheKey}`)
}

async function writeToCache<T>(cacheKey: string, value: T): Promise<void> {
  await cacheSet(`${API_CACHE_PREFIX}${cacheKey}`, value, TTL.MEDIUM)
}

export async function networkFirstGet<T>(path: string, cacheKey: string): Promise<T> {
  try {
    const response = await fetchWithTimeout(backendUrl(path), { method: "GET", cache: "no-store" })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    const data = (await response.json()) as T
    await writeToCache(cacheKey, data)
    return data
  } catch (error) {
    const fallback = await readFromCache<T>(cacheKey)
    if (fallback) return fallback
    throw error
  }
}

export async function postJson<TResponse = unknown, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions
): Promise<TResponse> {
  try {
    const response = await fetchWithTimeout(backendUrl(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...options?.init,
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    const contentType = response.headers.get("content-type") ?? ""
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse
    }

    return {} as TResponse
  } catch (error) {
    if (!options?.fallbackCacheKey) {
      throw error
    }
    const fallback = await readFromCache<TResponse>(options.fallbackCacheKey)
    if (fallback) return fallback
    throw error
  }
}

export async function putJson<TResponse = unknown, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions
): Promise<TResponse> {
  const response = await fetchWithTimeout(backendUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options?.init,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) return (await response.json()) as TResponse
  return {} as TResponse
}

export async function deleteJson<TResponse = unknown>(
  path: string,
  options?: RequestInit
): Promise<TResponse> {
  const response = await fetchWithTimeout(backendUrl(path), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) return (await response.json()) as TResponse
  return {} as TResponse
}
