import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import config, { validateConfig } from "./config"

describe("config", () => {
  const origEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...origEnv }
  })

  afterEach(() => {
    process.env = origEnv
  })

  describe("config object", () => {
    it("site has name, url, phone, email", () => {
      expect(config.site.name).toBeDefined()
      expect(config.site.url).toMatch(/^https?:\/\//)
      expect(config.site.phone).toBeDefined()
      expect(config.site.email).toBeDefined()
    })
    it("analytics has vercel and google", () => {
      expect(config.analytics.vercel).toBeDefined()
      expect(typeof config.analytics.vercel.enabled).toBe("boolean")
      expect(config.analytics.google).toBeDefined()
    })
    it("api has realEstate and googleMaps", () => {
      expect(config.api.realEstate).toBeDefined()
      expect(config.api.googleMaps).toBeDefined()
    })
    it("env has isDevelopment, isProduction, isTest", () => {
      expect(typeof config.env.isDevelopment).toBe("boolean")
      expect(typeof config.env.isProduction).toBe("boolean")
      expect(typeof config.env.isTest).toBe("boolean")
    })
  })

  describe("validateConfig", () => {
    it("returns true when NEXT_PUBLIC_SITE_URL is set", () => {
      process.env['NEXT_PUBLIC_SITE_URL'] = "https://example.com"
      const result = validateConfig()
      expect(result).toBe(true)
    })
    it("throws in development when NEXT_PUBLIC_SITE_URL is missing", () => {
      const env = process.env as Record<string, string | undefined>
      const nodeEnv = env['NODE_ENV']
      env['NODE_ENV'] = "development"
      delete process.env['NEXT_PUBLIC_SITE_URL']
      expect(() => validateConfig()).toThrow(/Missing required environment variables/)
      env['NODE_ENV'] = nodeEnv
    })
  })
})
