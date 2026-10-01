/**
 * Sentry initialization for the static-export Next.js site.
 *
 * Uses @sentry/react (not @sentry/nextjs) because the site runs as a fully
 * static export (next.config.mjs `output: "export"`), there's no Next.js
 * server runtime to wire server-side instrumentation into. The browser SDK
 * is lighter and avoids the Next.js webpack plugin that can complicate
 * static-export builds.
 *
 * Initialization is lazy and idempotent: callers can invoke initSentry()
 * from any client surface (root provider, error-boundary, etc.) without
 * worrying about double-init or missing DSN. No DSN -> every helper is a
 * no-op and the SDK is never downloaded, so dev/CI builds cost nothing.
 *
 * Env vars (NEXT_PUBLIC_* so they're inlined into the client bundle):
 *   NEXT_PUBLIC_SENTRY_DSN          required to actually send events
 *   NEXT_PUBLIC_SENTRY_ENVIRONMENT  defaults to NODE_ENV
 *   NEXT_PUBLIC_SENTRY_SAMPLE_RATE  performance traces, default 0.1
 */

type SentryModule = typeof import("@sentry/react")

/**
 * The SDK (~148KB min) is loaded with a dynamic import, and only when a DSN is configured, so it is
 * an async chunk that never reaches visitors while Sentry is off and never blocks first load when
 * it is on. `loading` is the single source of truth: null means "not configured / not started".
 */
let loading: Promise<SentryModule | null> | null = null

function readSampleRate(): number {
  const raw = process.env["NEXT_PUBLIC_SENTRY_SAMPLE_RATE"]
  if (!raw) return 0.1
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : 0.1
}

export function initSentry(): void {
  if (loading) return
  if (typeof window === "undefined") return // SSR/build-time, skip silently
  const dsn = process.env["NEXT_PUBLIC_SENTRY_DSN"]
  if (!dsn) return // No-op when not configured

  loading = import("@sentry/react")
    .then((Sentry) => {
      Sentry.init({
        dsn,
        environment:
          process.env["NEXT_PUBLIC_SENTRY_ENVIRONMENT"] ?? process.env.NODE_ENV ?? "production",
        tracesSampleRate: readSampleRate(),
        /**
         * Drop common noise: aborted fetches, network glitches, browser
         * extensions injecting errors. None of these are actionable bugs.
         */
        ignoreErrors: [
          "AbortError",
          "ResizeObserver loop limit exceeded",
          "ResizeObserver loop completed with undelivered notifications",
          // Common Safari / Chromium extension noise
          "Non-Error promise rejection captured",
        ],
        beforeSend(event, hint) {
          const err = hint.originalException as { name?: string } | undefined
          if (err?.name === "AbortError") return null
          return event
        },
      })
      return Sentry
    })
    .catch(() => null) // Monitoring must never break the page; every helper below no-ops on null.
}

/**
 * Forward an error to Sentry. No-op when not configured; if the SDK is still downloading, the
 * capture is delivered as soon as it has initialised.
 */
export function captureException(error: unknown, context?: Record<string, unknown>): void {
  void loading?.then((Sentry) => {
    Sentry?.captureException(error, context ? { extra: context } : undefined)
  })
}

/** Add a breadcrumb to all subsequent captures (e.g. route change). */
export function addBreadcrumb(message: string, data?: Record<string, unknown>): void {
  const timestamp = Date.now() / 1000
  void loading?.then((Sentry) => {
    Sentry?.addBreadcrumb({ message, data, timestamp })
  })
}

/** Wait for in-flight events to flush. Useful before page navigations. */
export async function flushSentry(timeoutMs = 2000): Promise<void> {
  if (!loading) return
  try {
    const Sentry = await loading
    await Sentry?.flush(timeoutMs)
  } catch {
    // best-effort; don't block UX on flush failure
  }
}
