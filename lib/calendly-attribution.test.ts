import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { MARKETING_ATTRIBUTION_STORAGE_KEY } from "@/lib/attribution"
import { calendlyUrlWithAttribution } from "@/lib/calendly-attribution"
import { SITE_CALENDLY_URL } from "@/lib/site"

function setSearch(search: string) {
  window.history.replaceState({}, "", `/links/${search}`)
}

function store(touch: Record<string, string>, which: "first" | "last" = "last") {
  const base = { path: "/", href: "https://x.test/", recorded_at: new Date().toISOString() }
  localStorage.setItem(
    MARKETING_ATTRIBUTION_STORAGE_KEY,
    JSON.stringify({ first: null, last: null, [which]: { ...base, ...touch } }),
  )
}

describe("calendlyUrlWithAttribution", () => {
  beforeEach(() => {
    localStorage.clear()
    setSearch("")
  })
  afterEach(() => {
    localStorage.clear()
    setSearch("")
  })

  it("returns the plain link when the visitor has no campaign", () => {
    expect(calendlyUrlWithAttribution("links_page")).toBe(SITE_CALENDLY_URL)
  })

  it("uses the UTMs on the current page URL and labels the button as utm_content", () => {
    setSearch("?utm_source=instagram&utm_medium=bio&utm_campaign=fall")
    const url = new URL(calendlyUrlWithAttribution("links_page"))
    expect(url.searchParams.get("utm_source")).toBe("instagram")
    expect(url.searchParams.get("utm_medium")).toBe("bio")
    expect(url.searchParams.get("utm_campaign")).toBe("fall")
    expect(url.searchParams.get("utm_content")).toBe("links_page")
    expect(url.origin + url.pathname).toBe(new URL(SITE_CALENDLY_URL).origin + new URL(SITE_CALENDLY_URL).pathname)
  })

  it("keeps a utm_content the campaign already set", () => {
    setSearch("?utm_source=tiktok&utm_content=reel-3")
    expect(new URL(calendlyUrlWithAttribution("links_page")).searchParams.get("utm_content")).toBe("reel-3")
  })

  it("falls back to the stored last touch, then the first touch", () => {
    store({ utm_source: "google", utm_medium: "cpc" }, "first")
    expect(new URL(calendlyUrlWithAttribution("quiz")).searchParams.get("utm_source")).toBe("google")
    store({ utm_source: "facebook", utm_medium: "social" }, "last")
    expect(new URL(calendlyUrlWithAttribution("quiz")).searchParams.get("utm_source")).toBe("facebook")
  })

  it("prefers the page URL over stored attribution", () => {
    store({ utm_source: "facebook" })
    setSearch("?utm_source=qr&utm_medium=print")
    expect(new URL(calendlyUrlWithAttribution("links_page")).searchParams.get("utm_source")).toBe("qr")
  })

  it("never forwards click ids", () => {
    setSearch("?utm_source=ig&gclid=abc&fbclid=def")
    const url = new URL(calendlyUrlWithAttribution("links_page"))
    expect(url.searchParams.has("gclid")).toBe(false)
    expect(url.searchParams.has("fbclid")).toBe(false)
  })

  it("keeps parameters already on the base URL", () => {
    setSearch("?utm_source=ig")
    const url = new URL(calendlyUrlWithAttribution("embed", "https://calendly.com/x/30min?embed_type=Inline"))
    expect(url.searchParams.get("embed_type")).toBe("Inline")
    expect(url.searchParams.get("utm_source")).toBe("ig")
  })
})
