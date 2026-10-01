"use client"

import { useReportWebVitals } from "next/web-vitals"
import { GA_ID_PATTERN, sanitizeTrackingId } from "@/lib/tracking-ids"

/**
 * Reports Core Web Vitals (LCP, INP, CLS, FCP, TTFB) to Google Analytics.
 *
 * Measurement comes from the `web-vitals` library that ships with Next
 * (useReportWebVitals), which handles INP and CLS windowing and reports each
 * metric once its value is final. Nothing is observed unless a GA measurement
 * ID is configured, so builds without GA pay no main-thread cost.
 *
 * GA is consent-gated and loaded lazily, so a metric that fires before
 * window.gtag exists is dropped rather than queued.
 *
 * Mount once in the root layout. Does not render any DOM.
 */

interface WebVitalMetric {
  name: string
  value: number
  rating?: string
}

const GA_ID = sanitizeTrackingId(process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"], GA_ID_PATTERN)

export function reportWebVital(metric: WebVitalMetric) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return

  window.gtag("event", metric.name, {
    event_category: "Web Vitals",
    // CLS is a unitless score (0.1 is the "good" limit); GA event values are integers.
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    event_label: metric.rating,
    non_interaction: true,
  })
}

function GaWebVitals() {
  useReportWebVitals(reportWebVital)
  return null
}

export function WebVitalsReporter() {
  if (!GA_ID) return null
  return <GaWebVitals />
}
