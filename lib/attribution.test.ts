import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  ATTRIBUTION_TTL_MS,
  MARKETING_ATTRIBUTION_STORAGE_KEY as KEY,
  captureMarketingAttributionFromWindow,
  getAttributionPayloadForApi,
} from "./attribution"

function visit(url: string, referrer = "") {
  window.history.replaceState({}, "", url)
  vi.spyOn(document, "referrer", "get").mockReturnValue(referrer)
  captureMarketingAttributionFromWindow()
}

describe("marketing attribution", () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it("stores campaign params in localStorage so other tabs can read them", () => {
    visit("/links/?utm_source=facebook&utm_medium=social")
    expect(localStorage.getItem(KEY)).toContain("facebook")
    expect(sessionStorage.getItem(KEY)).toBeNull()
    expect(getAttributionPayloadForApi()?.first?.utm_source).toBe("facebook")
  })

  it("records the referrer and landing path when there are no campaign params", () => {
    visit("/buy/", "https://www.google.com/")
    const a = getAttributionPayloadForApi()
    expect(a?.first).toMatchObject({ path: "/buy/", utm_source: "google.com", utm_medium: "organic" })
    visit("/sell/", "https://example.org/post")
    // A later page view without params does not overwrite first or last.
    expect(getAttributionPayloadForApi()?.last?.path).toBe("/buy/")
  })

  it("labels a non-search referrer as referral and ignores the site's own host", () => {
    visit("/buy/", "https://example.org/post")
    expect(getAttributionPayloadForApi()?.first).toMatchObject({ utm_source: "example.org", utm_medium: "referral" })
    localStorage.clear()
    visit("/buy/", `${window.location.origin}/sell/`)
    const first = getAttributionPayloadForApi()?.first
    expect(first?.path).toBe("/buy/")
    expect(first?.utm_source).toBeUndefined()
  })

  it("drops the query string from a landing page with no campaign params, so invite tokens are not stored", () => {
    visit("/apply/co-applicant/?token=secret-invite-token#step-2", "https://example.org/")
    const first = getAttributionPayloadForApi()?.first
    expect(first?.path).toBe("/apply/co-applicant/")
    expect(first?.href).toBe(`${window.location.origin}/apply/co-applicant/`)
    expect(localStorage.getItem(KEY)).not.toContain("secret-invite-token")
  })

  it("keeps first touch and moves last touch when a later visit carries params", () => {
    visit("/a/?utm_source=facebook")
    visit("/b/?utm_source=google")
    const a = getAttributionPayloadForApi()
    expect(a?.first?.utm_source).toBe("facebook")
    expect(a?.last?.utm_source).toBe("google")
  })

  it("truncates values to the API limits before sending", () => {
    visit(`/links/?utm_source=a&utm_content=${"x".repeat(308)}`)
    localStorage.setItem(
      KEY,
      JSON.stringify({
        first: { utm_content: "y".repeat(400), path: "/p".repeat(800), href: "h".repeat(3000), recorded_at: new Date().toISOString(), bogus: "drop me" },
        last: null,
      }),
    )
    const first = getAttributionPayloadForApi()?.first as Record<string, string>
    expect(first["utm_content"]).toHaveLength(256)
    expect(first["path"]).toHaveLength(1024)
    expect(first["href"]).toHaveLength(2048)
    expect(first).not.toHaveProperty("bogus")
  })

  it("stores an over-long campaign value already truncated", () => {
    visit(`/links/?utm_content=${"x".repeat(308)}`)
    expect(getAttributionPayloadForApi()?.last?.utm_content).toHaveLength(256)
  })

  it("drops a record older than 90 days and starts a new one", () => {
    const old = new Date(Date.now() - ATTRIBUTION_TTL_MS - 1000).toISOString()
    localStorage.setItem(
      KEY,
      JSON.stringify({ first: { utm_source: "old", path: "/", href: "", recorded_at: old }, last: null }),
    )
    expect(getAttributionPayloadForApi()).toBeUndefined()
    visit("/buy/?utm_source=new")
    expect(getAttributionPayloadForApi()?.first?.utm_source).toBe("new")
  })

  it("still reads a record written to sessionStorage before the move", () => {
    sessionStorage.setItem(KEY, JSON.stringify({ first: { utm_source: "instagram" }, last: { utm_source: "instagram" } }))
    expect(getAttributionPayloadForApi()?.last?.utm_source).toBe("instagram")
  })
})
