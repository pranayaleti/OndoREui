import { afterEach, describe, expect, it, vi } from "vitest"
import { getBackendConnectSrc } from "./site"

describe("getBackendConnectSrc", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("includes the local Express origin so lead POSTs are not blocked by CSP", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    vi.stubEnv("NEXT_PUBLIC_PUBLIC_ASSISTANT_URL", "")
    expect(getBackendConnectSrc()).toBe("http://localhost:3030")
  })

  it("includes a custom public-assistant origin when it differs from the API base", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "http://localhost:3030")
    vi.stubEnv(
      "NEXT_PUBLIC_PUBLIC_ASSISTANT_URL",
      "https://example.supabase.co/functions/v1/public-assistant",
    )
    const src = getBackendConnectSrc()
    expect(src.split(" ")).toEqual(
      expect.arrayContaining(["http://localhost:3030", "https://example.supabase.co"]),
    )
  })

  it("returns empty when no backend URL is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_BASE_URL", "")
    vi.stubEnv("NEXT_PUBLIC_PUBLIC_ASSISTANT_URL", "")
    expect(getBackendConnectSrc()).toBe("")
  })
})
