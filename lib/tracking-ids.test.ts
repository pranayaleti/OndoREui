import { describe, it, expect } from "vitest"
import {
  ALPHANUM_ID_PATTERN,
  GA_ID_PATTERN,
  GTM_ID_PATTERN,
  NUMERIC_ID_PATTERN,
  isTokenRoute,
  sanitizeTrackingId,
  templateTokenPath,
} from "./tracking-ids"

describe("sanitizeTrackingId", () => {
  it("rejects .env.example placeholders that would fire failing pixel requests", () => {
    expect(sanitizeTrackingId("GTM-XXXXXXX", GTM_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("G-XXXXXXXXXX", GA_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("000000000000000", NUMERIC_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("XXXXXXXXXXXXXXXXXXXX", ALPHANUM_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("0000000", NUMERIC_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("your-portal-id", NUMERIC_ID_PATTERN)).toBeNull()
  })

  it("keeps well-formed production IDs", () => {
    expect(sanitizeTrackingId("GTM-N6ZJ2P8", GTM_ID_PATTERN)).toBe("GTM-N6ZJ2P8")
    expect(sanitizeTrackingId("G-ABC123XYZ", GA_ID_PATTERN)).toBe("G-ABC123XYZ")
    expect(sanitizeTrackingId("123456789012345", NUMERIC_ID_PATTERN)).toBe(
      "123456789012345",
    )
  })

  it("rejects empty or whitespace-only values", () => {
    expect(sanitizeTrackingId(undefined, GTM_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("", GTM_ID_PATTERN)).toBeNull()
    expect(sanitizeTrackingId("   ", GTM_ID_PATTERN)).toBeNull()
  })
})

describe("isTokenRoute", () => {
  it("flags every route whose last segment is a bearer token", () => {
    for (const path of [
      "/apply/co/sampletoken123/",
      "/apply/sampletoken123/",
      "/visit/schedule/sampletoken456/",
      "/visit/confirm/sampletoken789",
      "/invite/abc/",
      "/tenantOnboarding/abc/",
    ]) {
      expect(isTokenRoute(path), path).toBe(true)
    }
  })

  it("leaves ordinary pages and token-free application routes alone", () => {
    for (const path of ["/", "/apply/", "/apply/start/prop-1/", "/visit/", "/invite/", "/buy/", "/applications/", "/rental/apply/"]) {
      expect(isTokenRoute(path), path).toBe(false)
    }
    expect(isTokenRoute(null)).toBe(false)
    expect(isTokenRoute("")).toBe(false)
  })
})

describe("templateTokenPath", () => {
  it("replaces only the token segment", () => {
    expect(templateTokenPath("/apply/co/sampletoken123/")).toBe("/apply/co/[token]/")
    expect(templateTokenPath("/apply/sampletoken123/")).toBe("/apply/[token]/")
    expect(templateTokenPath("/visit/schedule/tok456/")).toBe("/visit/schedule/[token]/")
    expect(templateTokenPath("/visit/confirm/tok789")).toBe("/visit/confirm/[token]")
    expect(templateTokenPath("/invite/abc/")).toBe("/invite/[token]/")
    expect(templateTokenPath("/tenantOnboarding/abc/")).toBe("/tenantOnboarding/[token]/")
  })

  it("leaves paths without a token unchanged", () => {
    for (const path of ["/", "/apply/", "/apply/start/prop-1/", "/visit/", "/buy/"]) {
      expect(templateTokenPath(path)).toBe(path)
    }
  })
})
