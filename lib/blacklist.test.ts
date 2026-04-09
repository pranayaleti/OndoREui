/**
 * Client blacklist helpers are stubs (see blacklist.ts). Moderation is enforced server-side.
 * These tests lock in stub behavior so refactors do not accidentally reintroduce broken fetch logic.
 */
import { describe, it, expect } from "vitest"
import {
  checkUserBlacklist,
  checkPropertyBlacklist,
  checkIPBlacklist,
  clearBlacklistCache,
  getClientIP,
  validateContent,
} from "./blacklist"

describe("blacklist (client stubs)", () => {
  it("checkUserBlacklist always returns not blacklisted", async () => {
    const result = await checkUserBlacklist("uid", "user@example.com")
    expect(result).toEqual({ isBlacklisted: false, type: "user" })
  })

  it("checkPropertyBlacklist always returns not blacklisted", async () => {
    const result = await checkPropertyBlacklist(123)
    expect(result).toEqual({ isBlacklisted: false, type: "property" })
  })

  it("checkIPBlacklist always returns not blacklisted", async () => {
    const result = await checkIPBlacklist("1.2.3.4")
    expect(result).toEqual({ isBlacklisted: false, type: "ip" })
  })

  it("clearBlacklistCache is safe to call (no-op)", () => {
    expect(() => clearBlacklistCache()).not.toThrow()
  })

  it("getClientIP returns null (IP resolved on server)", () => {
    const req = new Request("https://example.com", {
      headers: { "x-forwarded-for": "1.2.3.4" },
    })
    expect(getClientIP(req)).toBe(null)
  })

  it("validateContent always allows content in the stub", async () => {
    const result = await validateContent("any string including spam")
    expect(result.isValid).toBe(true)
    expect(result.blockedPattern).toBeUndefined()
  })
})
