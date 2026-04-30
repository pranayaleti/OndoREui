import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest"

// Set the env var BEFORE importing the module so the top-level const picks it up
const TEST_GA_ID = "G-TEST123"
beforeAll(() => {
  process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] = TEST_GA_ID
})

// Use dynamic import so the env var is set before the module evaluates
let analytics: typeof import("./analytics")["analytics"]
let performanceTracking: typeof import("./analytics")["performanceTracking"]
let ecommerceTracking: typeof import("./analytics")["ecommerceTracking"]

beforeAll(async () => {
  const mod = await import("./analytics")
  analytics = mod.analytics
  performanceTracking = mod.performanceTracking
  ecommerceTracking = mod.ecommerceTracking
})

describe("analytics", () => {
  beforeEach(() => {
    vi.stubGlobal("window", globalThis.window)
    ;(globalThis.window as { gtag?: (a: string, b: string, c?: object) => void }).gtag = vi.fn()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe("trackPageView", () => {
    it("calls gtag when window.gtag exists", () => {
      analytics.trackPageView("/page", "Title")
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "config",
        TEST_GA_ID,
        { page_title: "Title", page_location: "/page" }
      )
    })
  })

  describe("trackEvent", () => {
    it("calls gtag with action, category, label", () => {
      analytics.trackEvent("click", "nav", "header")
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "click",
        expect.objectContaining({ event_category: "nav", event_label: "header" })
      )
    })
  })

  describe("trackFormSubmission", () => {
    it("tracks success by default", () => {
      analytics.trackFormSubmission("contact")
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "form_submit_success",
        expect.any(Object)
      )
    })
    it("tracks error when success false", () => {
      analytics.trackFormSubmission("contact", false)
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "form_submit_error",
        expect.any(Object)
      )
    })
  })

  describe("trackPropertyView", () => {
    it("calls trackEvent with view_property", () => {
      analytics.trackPropertyView("1", "House")
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "view_property",
        expect.objectContaining({ event_label: "House" })
      )
    })
  })

  describe("trackSearch", () => {
    it("calls trackEvent with search and value", () => {
      analytics.trackSearch("utah", 10)
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "search",
        expect.objectContaining({ value: 10 })
      )
    })
  })

  describe("trackLeadGeneration", () => {
    it("calls trackEvent and optionally property_lead", () => {
      analytics.trackLeadGeneration("contact", "prop-1")
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "generate_lead",
        expect.objectContaining({ event_label: "contact" })
      )
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "property_lead",
        expect.objectContaining({ event_label: "prop-1" })
      )
    })
  })

  describe("trackCalculatorUsage", () => {
    it("calls trackEvent with use_calculator", () => {
      analytics.trackCalculatorUsage("mortgage", { rate: 5 })
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "use_calculator",
        expect.any(Object)
      )
    })
  })

  describe("trackEngagement", () => {
    it("calls trackEvent with user_engagement", () => {
      analytics.trackEngagement("click", "cta")
      expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
        "event",
        "click",
        expect.objectContaining({ event_category: "user_engagement" })
      )
    })
  })
})

describe("performanceTracking", () => {
  beforeEach(() => {
    ;(globalThis.window as { gtag?: (a: string, b: string, c?: object) => void }).gtag = vi.fn()
  })

  it("trackWebVitals calls gtag with rounded value for CLS", () => {
    performanceTracking.trackWebVitals({
      name: "CLS",
      id: "id1",
      value: 0.05,
    })
    expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
      "event",
      "CLS",
      expect.objectContaining({ value: 50, non_interaction: true })
    )
  })

  it("trackPageLoad calls gtag with rounded load time", () => {
    performanceTracking.trackPageLoad(1234.56)
    expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
      "event",
      "page_load_time",
      expect.objectContaining({ value: 1235, non_interaction: true })
    )
  })
})

describe("ecommerceTracking", () => {
  beforeEach(() => {
    ;(globalThis.window as { gtag?: (a: string, b: string, c?: object) => void }).gtag = vi.fn()
  })

  it("trackPropertyInterest calls gtag with view_item", () => {
    ecommerceTracking.trackPropertyInterest("1", "House", 300000)
    expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
      "event",
      "view_item",
      expect.objectContaining({
        currency: "USD",
        value: 300000,
        items: expect.any(Array),
      })
    )
  })

  it("trackLeadConversion calls gtag with purchase", () => {
    ecommerceTracking.trackLeadConversion("1", "House", 5000)
    expect((window as { gtag?: (a: string, b: string, c?: object) => void }).gtag).toHaveBeenCalledWith(
      "event",
      "purchase",
      expect.objectContaining({
        value: 5000,
        currency: "USD",
        transaction_id: expect.stringContaining("lead_"),
      })
    )
  })
})
