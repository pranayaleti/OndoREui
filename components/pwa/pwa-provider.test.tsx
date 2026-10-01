// @vitest-environment-options {"url": "https://ondorealestate.com/"}
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

vi.mock("@/lib/pwa/offline-queue", () => ({ flushQueueNow: vi.fn() }))
vi.mock("@/lib/pwa/install-context", () => ({
  PwaInstallProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { PwaProvider } from "./pwa-provider"

const register = vi.fn(async () => ({}))

function setReadyState(state: DocumentReadyState) {
  Object.defineProperty(document, "readyState", { configurable: true, get: () => state })
}

beforeEach(() => {
  register.mockClear()
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: { register, getRegistrations: vi.fn(async () => []) },
  })
})
afterEach(() => {
  cleanup()
  // Restore jsdom's own readyState getter.
  delete (document as unknown as Record<string, unknown>)["readyState"]
})

describe("PwaProvider service worker registration", () => {
  it("registers /sw.js at root scope once the page has loaded", async () => {
    setReadyState("complete")
    render(<PwaProvider>child</PwaProvider>)
    await vi.waitFor(() => expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/" }))
  })

  it("waits for the load event instead of competing with the page's own resources", async () => {
    setReadyState("loading")
    render(<PwaProvider>child</PwaProvider>)
    await new Promise((r) => setTimeout(r, 20))
    expect(register).not.toHaveBeenCalled()

    window.dispatchEvent(new Event("load"))
    await vi.waitFor(() => expect(register).toHaveBeenCalledTimes(1))
  })
})
