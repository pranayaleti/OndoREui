import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

const useReportWebVitals = vi.fn()
vi.mock("next/web-vitals", () => ({ useReportWebVitals: (fn: unknown) => useReportWebVitals(fn) }))

async function load(gaId: string | undefined) {
  vi.resetModules()
  if (gaId === undefined) vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "")
  else vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", gaId)
  return import("./web-vitals-reporter")
}

beforeEach(() => {
  useReportWebVitals.mockClear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  delete (window as { gtag?: unknown }).gtag
})

describe("WebVitalsReporter", () => {
  it("observes nothing when no GA measurement ID is configured", async () => {
    const { WebVitalsReporter } = await load(undefined)
    render(<WebVitalsReporter />)
    expect(useReportWebVitals).not.toHaveBeenCalled()
  })

  it("ignores placeholder GA IDs", async () => {
    const { WebVitalsReporter } = await load("G-XXXXXXX")
    render(<WebVitalsReporter />)
    expect(useReportWebVitals).not.toHaveBeenCalled()
  })

  it("subscribes to Next's web-vitals feed when GA is configured", async () => {
    const { WebVitalsReporter, reportWebVital } = await load("G-ABC123DEF4")
    render(<WebVitalsReporter />)
    expect(useReportWebVitals).toHaveBeenCalledWith(reportWebVital)
  })
})

describe("reportWebVital", () => {
  it("sends CLS scaled to an integer and other metrics as milliseconds", async () => {
    const gtag = vi.fn()
    ;(window as { gtag?: unknown }).gtag = gtag
    const { reportWebVital } = await load("G-ABC123DEF4")

    reportWebVital({ name: "CLS", value: 0.0734, rating: "good" })
    reportWebVital({ name: "INP", value: 212.6, rating: "needs-improvement" })

    expect(gtag).toHaveBeenNthCalledWith(1, "event", "CLS", {
      event_category: "Web Vitals",
      value: 73,
      event_label: "good",
      non_interaction: true,
    })
    expect(gtag).toHaveBeenNthCalledWith(2, "event", "INP", expect.objectContaining({ value: 213 }))
  })

  it("does nothing when gtag is not loaded", async () => {
    const { reportWebVital } = await load("G-ABC123DEF4")
    expect(() => reportWebVital({ name: "LCP", value: 1000 })).not.toThrow()
  })
})
