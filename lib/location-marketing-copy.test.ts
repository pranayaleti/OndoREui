import { readFileSync } from "fs"
import { join } from "path"
import { describe, it, expect } from "vitest"

/** Location / neighborhood / compare marketing sources in this Fair Housing pass. */
const LOCATION_COPY_FILES = [
  "app/blog/best-neighborhoods-lehi-utah/page.tsx",
  "app/blog/best-neighborhoods-draper-utah/page.tsx",
  "app/blog/best-neighborhoods-invest-utah-real-estate/page.tsx",
  "app/blog/provo-orem-rental-market-guide/page.tsx",
  "app/blog/salt-lake-city-rental-market-report/page.tsx",
  "app/blog/cost-of-living-draper-utah/page.tsx",
  "app/blog/property-management-guide-lehi-investors/page.tsx",
  "app/blog/why-utah-best-real-estate-investment/page.tsx",
  "app/compare-utah-property-managers/page.tsx",
  "lib/utah-pm-comparison.ts",
] as const

function stripHousingTypes(text: string): string {
  return text
    .replace(/single-family/gi, "SFH")
    .replace(/multi-family/gi, "MFH")
    .replace(/multifamily/gi, "MFH")
}

const STEERING =
  /family-oriented|family-first|family-friendly|family-centric|family-focused|family-paced|family-lifestyle|young professionals?|empty nesters?|immigrant families|byu families|great for families|best for families|who is .+ best for|safe neighborhood|crime-free|quiet community|ideal for couples|working-class character|working-class value|blue-collar workers|ethnically diverse|tenant quality|young families|military families|family tenants|family housing|quality tenants|high-quality tenants/i

const CRIME_CHARACTERIZATION =
  /elevated crime|higher crime|low crime|crime rates|crime statistics|crime concerns|crime perception|perfectly safe/i

const FAMILIAL_STEERING =
  /\bfamilies\b|\bkids\b|\bchildren\b|who should live/i

describe("location marketing Fair Housing", () => {
  const sources = LOCATION_COPY_FILES.map((rel) => ({
    rel,
    text: readFileSync(join(process.cwd(), rel), "utf8"),
  }))

  it("covers the blog and compare sources in this pass", () => {
    expect(sources).toHaveLength(LOCATION_COPY_FILES.length)
    for (const row of sources) {
      expect(row.text.length, row.rel).toBeGreaterThan(400)
    }
  })

  it("does not steer with familial-status, class, or “who lives here” copy", () => {
    for (const row of sources) {
      expect(row.text, row.rel).not.toMatch(STEERING)
      const withoutHousing = stripHousingTypes(row.text)
      expect(withoutHousing, row.rel).not.toMatch(FAMILIAL_STEERING)
    }
  })

  it("does not characterize neighborhoods by crime or safety", () => {
    for (const row of sources) {
      expect(row.text, row.rel).not.toMatch(CRIME_CHARACTERIZATION)
    }
  })

  it("keeps BYU-approved housing as an occupancy product rule", () => {
    const provo = sources.find((s) => s.rel.includes("provo-orem-rental-market-guide"))
    expect(provo?.text).toMatch(/BYU-approved housing/)
    expect(provo?.text).not.toMatch(/BYU families|Church Educational System/i)
  })

  it("compare page uses ownerFit, not occupant “best for”", () => {
    const compare = sources.find((s) => s.rel.includes("compare-utah-property-managers"))
    const table = sources.find((s) => s.rel.includes("utah-pm-comparison"))
    expect(table?.text).toContain("ownerFit:")
    expect(compare?.text).toContain('row("Owner fit"')
    expect(compare?.text).not.toMatch(/\bbestFor:/)
    expect(table?.text).not.toMatch(/\bbestFor:/)
    expect(compare?.text).not.toMatch(/\{row\("Best for"/)
  })
})
