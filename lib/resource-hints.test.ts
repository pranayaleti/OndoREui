import { describe, it, expect } from "vitest"
import { resourceHints } from "@/lib/resource-hints"

const hrefs = (env: Record<string, string | undefined>) => resourceHints(env).map((hint) => `${hint.rel} ${hint.href}`)

describe("resourceHints", () => {
  it("adds nothing when no API or tracker is configured, since fonts are self-hosted", () => {
    expect(resourceHints({})).toEqual([])
  })

  it("looks up the API host the static export calls", () => {
    expect(hrefs({ NEXT_PUBLIC_BACKEND_BASE_URL: "https://abc.supabase.co/functions/v1/api" })).toEqual([
      "dns-prefetch https://abc.supabase.co",
    ])
  })

  it("lists a Supabase project once when the API runs on the same host", () => {
    expect(
      hrefs({
        NEXT_PUBLIC_BACKEND_BASE_URL: "https://abc.supabase.co/functions/v1/api",
        NEXT_PUBLIC_SUPABASE_URL: "https://abc.supabase.co",
      }),
    ).toEqual(["dns-prefetch https://abc.supabase.co"])
  })

  it("skips placeholder and malformed URLs copied from .env.example", () => {
    expect(hrefs({ NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co" })).toEqual([])
    expect(hrefs({ NEXT_PUBLIC_BACKEND_BASE_URL: "not a url" })).toEqual([])
  })

  it("warms up Google only when a real GA4 or GTM ID is set", () => {
    expect(hrefs({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-XXXXXXX" })).toEqual([])
    expect(hrefs({ NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-ABC123DEF4" })).toEqual([
      "preconnect https://www.googletagmanager.com",
      "dns-prefetch https://www.google-analytics.com",
    ])
    expect(hrefs({ NEXT_PUBLIC_GTM_ID: "GTM-ABC123" })).toContain("preconnect https://www.googletagmanager.com")
  })

  it("looks up HubSpot and rb2b only when their IDs are set", () => {
    expect(hrefs({ NEXT_PUBLIC_HUBSPOT_PORTAL_ID: "245076632" })).toEqual(["dns-prefetch https://js.hs-scripts.com"])
    expect(hrefs({ NEXT_PUBLIC_REB2B_KEY: "ABC123" })).toEqual(["dns-prefetch https://ddwl4m2hdecbv.cloudfront.net"])
  })
})
