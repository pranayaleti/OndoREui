import { describe, it, expect } from "vitest"
import {
  ALPHANUM_ID_PATTERN,
  GA_ID_PATTERN,
  GTM_ID_PATTERN,
  NUMERIC_ID_PATTERN,
  sanitizeTrackingId,
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
