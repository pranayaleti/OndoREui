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

describe("edgeFunctionUrl", () => {
  async function load(base: string) {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", base)
    vi.resetModules()
    return (await import("./backend")).edgeFunctionUrl
  }

  afterAll(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("swaps the trailing /api of the Supabase base for the function name", async () => {
    const edgeFunctionUrl = await load(TEST_BASE)
    expect(edgeFunctionUrl("lead-qualify")).toBe("https://example.supabase.co/functions/v1/lead-qualify")
  })

  it("tolerates a trailing slash on the base", async () => {
    const edgeFunctionUrl = await load(`${TEST_BASE}/`)
    expect(edgeFunctionUrl("lead-qualify")).toBe("https://example.supabase.co/functions/v1/lead-qualify")
  })

  it("appends the function to a base that has no /api segment", async () => {
    const edgeFunctionUrl = await load("http://localhost:3030")
    expect(edgeFunctionUrl("lead-qualify")).toBe("http://localhost:3030/lead-qualify")
  })

  it("stays relative when no base is set", async () => {
    const edgeFunctionUrl = await load("")
    expect(edgeFunctionUrl("lead-qualify")).toBe("/lead-qualify")
  })
})
