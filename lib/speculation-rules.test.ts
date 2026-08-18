import { describe, it, expect } from "vitest"
import {
  PRERENDER_URLS,
  EAGER_PREFETCH_URLS,
  MODERATE_PREFETCH_URLS,
  CONSERVATIVE_PREFETCH_URLS,
  getSpeculationRulesJson,
} from "./speculation-rules"

describe("speculation-rules", () => {
  describe("URL arrays", () => {
    it("prerender includes safe static pages", () => {
      expect(PRERENDER_URLS).toContain("/")
      expect(PRERENDER_URLS).toContain("/buy")
      expect(PRERENDER_URLS).toContain("/contact")
    })
    it("eager includes main nav pages", () => {
      expect(EAGER_PREFETCH_URLS).toContain("/properties")
      expect(EAGER_PREFETCH_URLS).toContain("/loans")
      expect(EAGER_PREFETCH_URLS).toContain("/about")
    })
    it("moderate includes secondary pages", () => {
      expect(MODERATE_PREFETCH_URLS).toContain("/resources")
      expect(MODERATE_PREFETCH_URLS).toContain("/blog")
    })
    it("conservative includes calculator slugs", () => {
      expect(CONSERVATIVE_PREFETCH_URLS).toContain("/calculators/mortgage-payment")
    })
  })

  describe("getSpeculationRulesJson", () => {
    it("returns valid JSON", () => {
      const json = getSpeculationRulesJson()
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it("includes prerender rules", () => {
      const parsed = JSON.parse(getSpeculationRulesJson())
      expect(parsed.prerender).toBeDefined()
      expect(Array.isArray(parsed.prerender)).toBe(true)
      expect(parsed.prerender.length).toBeGreaterThan(0)
      expect(parsed.prerender[0].source).toBe("list")
      expect(parsed.prerender[0].urls.length).toBeGreaterThan(0)
    })

    it("includes prefetch with list and document sources", () => {
      const parsed = JSON.parse(getSpeculationRulesJson())
      expect(parsed.prefetch).toBeDefined()
      expect(Array.isArray(parsed.prefetch)).toBe(true)

      const listRules = parsed.prefetch.filter((p: { source: string }) => p.source === "list")
      const docRules = parsed.prefetch.filter((p: { source: string }) => p.source === "document")
      expect(listRules.length).toBe(3)
      expect(docRules.length).toBe(1)

      const eagernesses = listRules.map((p: { eagerness: string }) => p.eagerness)
      expect(eagernesses).toContain("eager")
      expect(eagernesses).toContain("moderate")
      expect(eagernesses).toContain("conservative")
    })

    it("document rule excludes user-specific paths", () => {
      const parsed = JSON.parse(getSpeculationRulesJson())
      const docRule = parsed.prefetch.find((p: { source: string }) => p.source === "document")
      expect(docRule).toBeDefined()
      expect(docRule.where).toBeDefined()
    })

    it("list entries have urls arrays", () => {
      const parsed = JSON.parse(getSpeculationRulesJson())
      const listRules = [
        ...parsed.prefetch.filter((r: { source: string }) => r.source === "list"),
        ...parsed.prerender.filter((r: { source: string }) => r.source === "list"),
      ]
      for (const rule of listRules) {
        expect(Array.isArray(rule.urls)).toBe(true)
      }
    })
  })
})
