import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const sdk = vi.hoisted(() => ({
  loaded: vi.fn(),
  init: vi.fn(),
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  flush: vi.fn(async () => true),
}))

vi.mock("@sentry/react", () => {
  sdk.loaded()
  return {
    init: sdk.init,
    captureException: sdk.captureException,
    addBreadcrumb: sdk.addBreadcrumb,
    flush: sdk.flush,
  }
})

async function loadModule() {
  vi.resetModules()
  return import("./sentry")
}

beforeEach(() => {
  Object.values(sdk).forEach((fn) => fn.mockClear())
})
afterEach(() => {
  vi.unstubAllEnvs()
})

describe("sentry (lazy SDK)", () => {
  it("never loads the SDK when no DSN is configured, and every helper is a no-op", async () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "")
    const s = await loadModule()

    s.initSentry()
    s.captureException(new Error("boom"))
    s.addBreadcrumb("route")
    await s.flushSentry()
    await new Promise((r) => setTimeout(r, 10))

    expect(sdk.loaded).not.toHaveBeenCalled()
    expect(sdk.init).not.toHaveBeenCalled()
    expect(sdk.captureException).not.toHaveBeenCalled()
    expect(sdk.flush).not.toHaveBeenCalled()
  })

  it("loads and initialises the SDK once when a DSN is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://key@example.ingest.sentry.io/1")
    vi.stubEnv("NEXT_PUBLIC_SENTRY_SAMPLE_RATE", "0.5")
    const s = await loadModule()

    s.initSentry()
    s.initSentry()
    await s.flushSentry()

    expect(sdk.loaded).toHaveBeenCalledTimes(1)
    expect(sdk.init).toHaveBeenCalledTimes(1)
    expect(sdk.init.mock.calls[0]![0]).toMatchObject({
      dsn: "https://key@example.ingest.sentry.io/1",
      tracesSampleRate: 0.5,
    })
  })

  it("delivers captures made while the SDK is still loading, in order", async () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://key@example.ingest.sentry.io/1")
    const s = await loadModule()
    const err = new Error("early")

    s.initSentry()
    // Called synchronously, before the dynamic import has resolved.
    s.addBreadcrumb("navigated", { to: "/buy" })
    s.captureException(err, { componentStack: "stack" })
    expect(sdk.captureException).not.toHaveBeenCalled()

    await s.flushSentry(500)

    expect(sdk.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({ message: "navigated", data: { to: "/buy" } }),
    )
    expect(sdk.captureException).toHaveBeenCalledWith(err, { extra: { componentStack: "stack" } })
    expect(sdk.flush).toHaveBeenCalledWith(500)
  })

  it("drops AbortError events", async () => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", "https://key@example.ingest.sentry.io/1")
    const s = await loadModule()
    s.initSentry()
    await s.flushSentry()

    const { beforeSend } = sdk.init.mock.calls[0]![0] as {
      beforeSend: (e: object, h: { originalException?: unknown }) => object | null
    }
    expect(beforeSend({}, { originalException: { name: "AbortError" } })).toBeNull()
    expect(beforeSend({ id: 1 }, { originalException: new Error("x") })).toEqual({ id: 1 })
  })
})
