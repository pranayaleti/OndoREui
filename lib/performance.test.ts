import { describe, it, expect } from "vitest"
import {
  performanceMonitor,
  imageOptimization,
  lazyLoading,
  bundleAnalysis,
} from "./performance"

describe("performance", () => {
  describe("performanceMonitor", () => {
    it("measurePageLoad returns object or null (jsdom may have no navigation entry)", () => {
      const result = performanceMonitor.measurePageLoad()
      expect(result === null || typeof result === "object").toBe(true)
      if (result && result !== null) {
        expect(
          "domContentLoaded" in result || "loadComplete" in result || "totalTime" in result
        ).toBe(true)
      }
    })
    it("measureWebVitals returns object or null", () => {
      const result = performanceMonitor.measureWebVitals()
      expect(result === null || typeof result === "object").toBe(true)
    })
    it("logMetrics returns metrics in development", () => {
      const env = process.env as Record<string, string | undefined>
      const orig = env['NODE_ENV']
      env['NODE_ENV'] = "development"
      const m = { lcp: 1 }
      expect(performanceMonitor.logMetrics(m)).toEqual(m)
      env['NODE_ENV'] = orig
    })
    it("logMetrics returns null in production", () => {
      const env = process.env as Record<string, string | undefined>
      const orig = env['NODE_ENV']
      env['NODE_ENV'] = "production"
      expect(performanceMonitor.logMetrics({})).toBeNull()
      env['NODE_ENV'] = orig
    })
  })

  describe("imageOptimization", () => {
    it("getResponsiveSizes returns array of width/media", () => {
      const sizes = imageOptimization.getResponsiveSizes(1920)
      expect(Array.isArray(sizes)).toBe(true)
      expect(sizes.length).toBeGreaterThan(0)
      expect(sizes[sizes.length - 1].width).toBe(1920)
      expect(sizes[0]).toEqual(expect.objectContaining({ width: expect.any(Number), media: expect.any(String) }))
    })
    it("generateSrcSet returns comma-separated srcset", () => {
      const srcSet = imageOptimization.generateSrcSet("/img.jpg", [640, 1024])
      expect(srcSet).toContain("/img.jpg?w=640 640w")
      expect(srcSet).toContain("/img.jpg?w=1024 1024w")
    })
  })

  describe("lazyLoading", () => {
    it("createObserver returns IntersectionObserver or null", () => {
      const obs = lazyLoading.createObserver(() => {})
      expect(obs === null || typeof obs?.observe === "function").toBe(true)
    })
    it("lazyLoadImage sets src from data-src", () => {
      const img = document.createElement("img")
      img.dataset.src = "https://example.com/img.jpg"
      lazyLoading.lazyLoadImage(img)
      expect(img.src).toContain("example.com/img.jpg")
      expect(img.dataset.src).toBeUndefined()
    })
    it("lazyLoadImage does nothing when no data-src", () => {
      const img = document.createElement("img")
      img.src = "initial.jpg"
      lazyLoading.lazyLoadImage(img)
      expect(img.src).toContain("initial")
    })
  })

  describe("bundleAnalysis", () => {
    it("getBundleInfo returns object or null", () => {
      const info = bundleAnalysis.getBundleInfo()
      expect(info === null || typeof info === "object").toBe(true)
      if (info) {
        expect("jsFiles" in info && "cssFiles" in info).toBe(true)
      }
    })
  })
})
