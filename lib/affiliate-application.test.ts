import { describe, expect, it } from "vitest"
import { buildAffiliatePayload, normalizeAffiliateWebsite } from "./affiliate-application"

describe("normalizeAffiliateWebsite", () => {
  it.each([
    ["", "", ""],
    ["   ", "", ""],
    ["https://example.com", "https://example.com", ""],
    ["http://example.com/me", "http://example.com/me", ""],
    ["www.example.com", "https://www.example.com", ""],
    ["instagram.com/myhandle", "https://instagram.com/myhandle", ""],
    ["  example.com  ", "https://example.com", ""],
    ["@myhandle", "", "@myhandle"],
    ["myhandle", "", "myhandle"],
    ["my handle on tiktok", "", "my handle on tiktok"],
    ["ftp://example.com", "", "ftp://example.com"],
    ["javascript:alert(1)", "", "javascript:alert(1)"],
  ])("%j -> website %j, handle %j", (input, website, handle) => {
    expect(normalizeAffiliateWebsite(input)).toEqual({ website, handle })
  })
})

describe("buildAffiliatePayload", () => {
  it("sends the why answer as motivation, which the Edge schema stores", () => {
    const payload = buildAffiliatePayload({
      name: " Sam ",
      email: "sam@example.com",
      website: "example.com",
      audienceSize: "100_500",
      why: " I run a rental blog ",
    })
    expect(payload).toEqual({
      name: "Sam",
      email: "sam@example.com",
      website: "https://example.com",
      audienceSize: "100_500",
      motivation: "I run a rental blog",
    })
    expect(payload).not.toHaveProperty("why")
  })

  it("keeps a handle in the motivation text and sends no website", () => {
    const payload = buildAffiliatePayload({
      name: "Sam",
      email: "sam@example.com",
      website: "@sam",
      audienceSize: "under_100",
      why: "Local landlord",
    })
    expect(payload.website).toBe("")
    expect(payload.motivation).toBe("Social profile: @sam\n\nLocal landlord")
  })

  it("omits motivation when there is nothing to send", () => {
    const payload = buildAffiliatePayload({ name: "Sam", email: "s@example.com", audienceSize: "under_100" })
    expect(payload).not.toHaveProperty("motivation")
    expect(payload.website).toBe("")
  })
})
