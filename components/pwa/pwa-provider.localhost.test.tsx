// jsdom's default URL is http://localhost:3000, which is the case under test here.
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

vi.mock("@/lib/pwa/offline-queue", () => ({ flushQueueNow: vi.fn() }))
vi.mock("@/lib/pwa/install-context", () => ({
  PwaInstallProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import { PwaProvider } from "./pwa-provider"

afterEach(cleanup)

describe("PwaProvider on localhost", () => {
  it("does not register the service worker in a local production preview", async () => {
    expect(window.location.hostname).toBe("localhost")
    const register = vi.fn(async () => ({}))
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { register, getRegistrations: vi.fn(async () => []) },
    })

    render(<PwaProvider>child</PwaProvider>)
    await new Promise((r) => setTimeout(r, 30))
    expect(register).not.toHaveBeenCalled()
  })
})
