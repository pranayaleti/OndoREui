import { describe, it, expect } from "vitest"
import { cityContentByName } from "./city-content"
import { getCityOwnerOpsPatterns } from "./city-owner-ops"
import { STEERING_COPY_RE } from "./fair-housing-steering"

function stripHousingTypes(text: string): string {
  return text
    .replace(/single-family/gi, "SFH")
    .replace(/multi-family/gi, "MFH")
    .replace(/multifamily/gi, "MFH")
}

const CRIME_CHARACTERIZATION =
  /elevated crime|higher crime|low crime|crime rates|crime statistics|crime concerns|crime perception|perfectly safe/i

describe("getCityOwnerOpsPatterns", () => {
  it("returns four operational patterns for Lehi from existing city content", () => {
    const ops = getCityOwnerOpsPatterns("Lehi")
    expect(ops).toHaveLength(4)
    const blob = ops.map((o) => `${o.title} ${o.body}`).join("\n")
    expect(blob).toMatch(/HOA/i)
    expect(blob).toMatch(/townhome|single-family|housing/i)
    expect(blob).not.toMatch(/\d+\s+freeze/i)
    expect(blob).not.toMatch(/\b2[-\s]?hours?\b/i)
  })

  it("returns four Fair Housing-safe patterns for every city with content", () => {
    for (const city of Object.keys(cityContentByName)) {
      const ops = getCityOwnerOpsPatterns(city)
      expect(ops, city).toHaveLength(4)
      for (const op of ops) {
        const text = `${op.title} ${op.body}`
        expect(text, `${city}: ${op.title}`).not.toMatch(STEERING_COPY_RE)
        expect(stripHousingTypes(text), `${city}: ${op.title}`).not.toMatch(
          /\bfamilies\b|\bkids\b|\bchildren\b|who should live/i,
        )
        expect(text, `${city}: ${op.title}`).not.toMatch(CRIME_CHARACTERIZATION)
      }
    }
  })
})
