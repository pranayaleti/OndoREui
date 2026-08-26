import { describe, it, expect } from "vitest"
import { cityContentByName } from "./city-content"
import { getCityOwnerOpsPatterns } from "./city-owner-ops"

function stripHousingTypes(text: string): string {
  return text
    .replace(/single-family/gi, "SFH")
    .replace(/multi-family/gi, "MFH")
    .replace(/multifamily/gi, "MFH")
}

const STEERING =
  /family-oriented|family-first|family-friendly|family-centric|family-focused|family-paced|family-lifestyle|young professionals?|empty nesters?|immigrant families|byu families|great for families|best for families|who is .+ best for|safe neighborhood|crime-free|quiet community|ideal for couples|working-class character|blue-collar workers|ethnically diverse|tenant quality|young families|military families|quality tenants/i

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
        expect(text, `${city}: ${op.title}`).not.toMatch(STEERING)
        expect(stripHousingTypes(text), `${city}: ${op.title}`).not.toMatch(
          /\bfamilies\b|\bkids\b|\bchildren\b|who should live/i,
        )
        expect(text, `${city}: ${op.title}`).not.toMatch(CRIME_CHARACTERIZATION)
      }
    }
  })
})
