import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanupForBfcache } from "./bfcache-optimization"

describe("cleanupForBfcache", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // Opening "ondo-pwa-db" with no version and no upgrade handler creates it empty, which broke
  // the offline queue (no object store) for every visitor who had navigated once.
  it("does not open IndexedDB", () => {
    const open = vi.fn()
    vi.stubGlobal("indexedDB", { open })
    cleanupForBfcache()
    expect(open).not.toHaveBeenCalled()
  })
})
