/**
 * Lightweight public listing shortlist. Lives in sessionStorage so it does not
 * require an account or a backend. Cap is 3 — enough to scan, not a matrix engine.
 */

import { listingComparePath } from "@/lib/public-property"

export { listingComparePath }

export const LISTING_COMPARE_MAX = 3
export const LISTING_COMPARE_KEY = "ondo:listing-compare"
export const LISTING_COMPARE_EVENT = "ondo:listing-compare"

function canUseSession(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
}

function emit(ids: string[]): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(LISTING_COMPARE_EVENT, { detail: ids }))
}

export function readCompareIds(): string[] {
  if (!canUseSession()) return []
  try {
    const raw = window.sessionStorage.getItem(LISTING_COMPARE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((id): id is string => typeof id === "string" && id.trim().length > 0)
      .slice(0, LISTING_COMPARE_MAX)
  } catch {
    return []
  }
}

function writeCompareIds(ids: string[]): string[] {
  const next = ids.slice(0, LISTING_COMPARE_MAX)
  if (canUseSession()) {
    window.sessionStorage.setItem(LISTING_COMPARE_KEY, JSON.stringify(next))
  }
  emit(next)
  return next
}

export function isInCompare(publicId: string): boolean {
  return readCompareIds().includes(publicId)
}

export type ToggleCompareResult =
  | { ids: string[]; status: "added" | "removed" }
  | { ids: string[]; status: "full" }

export function toggleCompareId(publicId: string): ToggleCompareResult {
  const id = publicId.trim()
  if (!id) return { ids: readCompareIds(), status: "removed" }
  const current = readCompareIds()
  if (current.includes(id)) {
    return { ids: writeCompareIds(current.filter((item) => item !== id)), status: "removed" }
  }
  if (current.length >= LISTING_COMPARE_MAX) {
    return { ids: current, status: "full" }
  }
  return { ids: writeCompareIds([...current, id]), status: "added" }
}

export function removeCompareId(publicId: string): string[] {
  return writeCompareIds(readCompareIds().filter((id) => id !== publicId))
}

export function clearCompareIds(): string[] {
  return writeCompareIds([])
}
