import { describe, it, expect, afterEach } from "vitest"
import { isMarketingRestrictedRegion } from "./region"

describe("isMarketingRestrictedRegion", () => {
  const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions

  afterEach(() => {
    Intl.DateTimeFormat.prototype.resolvedOptions = originalResolvedOptions
  })

  it("returns true during SSR (no window)", () => {
    const windowBackup = globalThis.window
    // @ts-expect-error — simulate SSR
    delete globalThis.window
    expect(isMarketingRestrictedRegion()).toBe(true)
    globalThis.window = windowBackup
  })

  it("returns true for European time zones", () => {
    Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions() {
      return { timeZone: "Europe/Berlin" } as Intl.ResolvedDateTimeFormatOptions
    }
    expect(isMarketingRestrictedRegion()).toBe(true)
  })

  it("returns true for EEA zones outside Europe/ prefix", () => {
    Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions() {
      return { timeZone: "Atlantic/Reykjavik" } as Intl.ResolvedDateTimeFormatOptions
    }
    expect(isMarketingRestrictedRegion()).toBe(true)
  })

  it("returns false for US time zones", () => {
    Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions() {
      return { timeZone: "America/Denver" } as Intl.ResolvedDateTimeFormatOptions
    }
    expect(isMarketingRestrictedRegion()).toBe(false)
  })

  it("returns true when Intl throws", () => {
    Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions() {
      throw new Error("blocked")
    }
    expect(isMarketingRestrictedRegion()).toBe(true)
  })
})
