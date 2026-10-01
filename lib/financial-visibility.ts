"use client"

import { useCallback, useSyncExternalStore } from "react"

const STORAGE_KEY = "ondo-financial-visibility"

/**
 * Show/hide amounts is one preference per browser, so every consumer on the page reads the same
 * store: hiding amounts on one investment card hides them on all of them, and nothing is written
 * to storage until the visitor actually toggles.
 */
const listeners = new Set<() => void>()
// Only set when localStorage is unavailable, so the toggle still works for the rest of the visit.
let memoryValue: boolean | null = null

function readStored(): boolean | null {
  if (memoryValue !== null) return memoryValue
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === null ? null : stored === "true"
  } catch {
    return null
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Other tabs change the preference through the storage event.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function useFinancialVisibility(defaultVisible = true) {
  const getSnapshot = useCallback(() => readStored() ?? defaultVisible, [defaultVisible])
  const getServerSnapshot = useCallback(() => defaultVisible, [defaultVisible])
  const showValues = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next = !(readStored() ?? defaultVisible)
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next))
      memoryValue = null
    } catch {
      memoryValue = next
    }
    emit()
  }, [defaultVisible])

  return { showValues, toggle }
}
