import { backendUrl } from "@/lib/backend"
import { cacheGet, cacheSet, TTL } from "@/lib/cache/idb-cache"

const API_CACHE_PREFIX = "ondo:api-cache:"
const DEFAULT_TIMEOUT_MS = 30_000

const CSRF_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"])

export function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined
  const prefix = "ondo_csrf="
  const row = document.cookie.split("; ").find((entry) => entry.startsWith(prefix))
  if (!row) return undefined
  const value = row.slice(prefix.length)
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** A non-2xx answer from the API: the HTTP status and the server's message, when it sent one. */
export class ApiRequestError extends Error {
  readonly status: number
  readonly serverMessage: string | undefined

  constructor(status: number, serverMessage?: string) {
    super(`Request failed: ${status}`)
    this.name = "ApiRequestError"
    this.status = status
    this.serverMessage = serverMessage
  }
}

/**
 * True for a status that retrying later can fix: server errors, a timeout (408) and rate
 * limiting (429). Every other 4xx means the request itself is wrong and will fail again.
 */
export function isRetryableStatus(status: number): boolean {
  return status >= 500 || status === 408 || status === 429
}

/**
 * Whether a failed request is worth saving for later: a network failure or timeout (no
 * response at all) or a retryable status. A rejected request (400, 404, 422...) is not.
 */
export function isRetryableRequestError(error: unknown): boolean {
  return error instanceof ApiRequestError ? isRetryableStatus(error.status) : true
}

/** The server's own message for a failed request, or undefined when there is none to show. */
export function requestErrorMessage(error: unknown): string | undefined {
  return error instanceof ApiRequestError ? error.serverMessage : undefined
}

async function failedRequest(response: Response): Promise<ApiRequestError> {
  const body = (await response.json().catch(() => null)) as { error?: unknown; message?: unknown } | null
  const message = [body?.error, body?.message].find((value): value is string => typeof value === "string" && value !== "")
  return new ApiRequestError(response.status, message)
}

/**
 * Combines header sets into a plain object. Accepts every HeadersInit form (object, tuple array,
 * Headers), so a caller's headers are kept instead of being dropped by an object spread. Later
 * sets win; names are matched case-insensitively and come out lower-cased.
 */
export function mergeHeaders(...sets: Array<HeadersInit | undefined>): Record<string, string> {
  const merged: Record<string, string> = {}
  for (const set of sets) {
    new Headers(set).forEach((value, name) => {
      merged[name] = value
    })
  }
  return merged
}

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const method = (init.method ?? "GET").toUpperCase()
  const csrf = CSRF_METHODS.has(method) ? getCsrfToken() : undefined
  const headers = csrf ? mergeHeaders(init.headers, { "x-csrf-token": csrf }) : init.headers
  return fetch(url, { ...init, headers, signal: controller.signal, credentials: "include" }).finally(() => clearTimeout(timer))
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
      throw await failedRequest(response)
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
      body: JSON.stringify(body),
      ...options?.init,
      headers: mergeHeaders({ "Content-Type": "application/json" }, options?.init?.headers),
    })

    if (!response.ok) {
      throw await failedRequest(response)
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
    body: JSON.stringify(body),
    ...options?.init,
    headers: mergeHeaders({ "Content-Type": "application/json" }, options?.init?.headers),
  })
  if (!response.ok) throw await failedRequest(response)
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
    ...options,
    headers: mergeHeaders({ "Content-Type": "application/json" }, options?.headers),
  })
  if (!response.ok) throw await failedRequest(response)
  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) return (await response.json()) as TResponse
  return {} as TResponse
}
