import { describe, it, expect } from "vitest"
import { backendUrl } from "./backend"

const TEST_BASE = "https://example.supabase.co/functions/v1/api"

// Set the env for this test module
process.env.NEXT_PUBLIC_BACKEND_BASE_URL = TEST_BASE

describe("backendUrl", () => {
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
