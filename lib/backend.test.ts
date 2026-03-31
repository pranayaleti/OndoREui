import { describe, it, expect, vi, beforeAll, afterAll } from "vitest"

const TEST_BASE = "https://example.supabase.co/functions/v1/api"

describe("backendUrl (external base)", () => {
  let backendUrl: (pathname: string) => string

  beforeAll(async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", TEST_BASE)
    vi.resetModules()
    const mod = await import("./backend")
    backendUrl = mod.backendUrl
  })

  afterAll(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("strips /api prefix and appends path to base", () => {
    const url = backendUrl("/api/leads/submit")
    expect(url).toBe(`${TEST_BASE}/leads/submit`)
  })
  it("returns base + path when no /api prefix", () => {
    const url = backendUrl("/health")
    expect(url).toBe(`${TEST_BASE}/health`)
  })
  it("returns valid URL", () => {
    const url = backendUrl("/api/blacklist/check")
    expect(() => new URL(url)).not.toThrow()
  })
})

describe("backendUrl (empty base, same-origin Next API)", () => {
  let backendUrl: (pathname: string) => string

  beforeAll(async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "")
    vi.resetModules()
    const mod = await import("./backend")
    backendUrl = mod.backendUrl
  })

  afterAll(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("preserves /api prefix for Next.js route handlers", () => {
    expect(backendUrl("/api/properties/public")).toBe("/api/properties/public")
  })
})

describe("backendUrl (localhost origin without /api path)", () => {
  let backendUrl: (pathname: string) => string

  beforeAll(async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3000")
    vi.resetModules()
    const mod = await import("./backend")
    backendUrl = mod.backendUrl
  })

  afterAll(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("does not strip /api so Next route handlers resolve", () => {
    expect(backendUrl("/api/properties/public")).toBe(
      "http://localhost:3000/api/properties/public"
    )
  })
})
