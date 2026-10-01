import { describe, it, expect } from "vitest"
import { cityContentByName, type CityContent } from "./city-content"
import { STEERING_COPY_RE } from "./fair-housing-steering"

function collectCopy(): { city: string; field: string; text: string }[] {
  const rows: { city: string; field: string; text: string }[] = []
  for (const [city, content] of Object.entries(cityContentByName)) {
    const c = content as CityContent
    rows.push({ city, field: "overview", text: c.overview })
    if (c.lifestyleDescription) {
      rows.push({ city, field: "lifestyleDescription", text: c.lifestyleDescription })
    }
    for (const [i, n] of (c.neighborhoods ?? []).entries()) {
      rows.push({ city, field: `neighborhoods[${i}]`, text: n })
    }
    for (const [i, h] of (c.highlights ?? []).entries()) {
      rows.push({ city, field: `highlights[${i}]`, text: h })
    }
    for (const [i, faq] of (c.faq ?? []).entries()) {
      rows.push({ city, field: `faq[${i}].q`, text: faq.q })
      rows.push({ city, field: `faq[${i}].a`, text: faq.a })
    }
  }
  return rows
}

/** Housing-stock tokens that legitimately contain “family”. */
function stripHousingTypes(text: string): string {
  return text
    .replace(/single-family/gi, "SFH")
    .replace(/multi-family/gi, "MFH")
    .replace(/multifamily/gi, "MFH")
}

const CRIME_CHARACTERIZATION =
  /elevated crime|higher crime|low crime|crime rates|crime statistics|crime concerns|crime perception|perfectly safe/i

const FAMILIAL_STEERING =
  /\bfamilies\b|\bkids\b|\bchildren\b|who should live/i

describe("city-content Fair Housing", () => {
  const copy = collectCopy()

  it("covers the Wasatch Front city set", () => {
    expect(Object.keys(cityContentByName).length).toBeGreaterThanOrEqual(50)
    expect(copy.length).toBeGreaterThan(200)
  })

  it("does not steer with familial-status, class, or “who lives here” copy", () => {
    for (const row of copy) {
      const label = `${row.city} ${row.field}`
      expect(row.text, label).not.toMatch(STEERING_COPY_RE)
      const withoutHousing = stripHousingTypes(row.text)
      expect(withoutHousing, label).not.toMatch(FAMILIAL_STEERING)
    }
  })

  it("does not characterize neighborhoods by crime or safety", () => {
    for (const row of copy) {
      expect(row.text, `${row.city} ${row.field}`).not.toMatch(CRIME_CHARACTERIZATION)
    }
  })

  it("keeps source-of-income inclusion language (does not advertise voucher exclusion)", () => {
    const westValley = cityContentByName["West Valley City"]
    const voucherFaq = westValley.faq?.find((f) => /voucher|section 8/i.test(f.q + f.a))
    expect(voucherFaq, "West Valley voucher FAQ").toBeTruthy()
    expect(voucherFaq!.a).toMatch(/lawful source of rent/i)
    expect(voucherFaq!.a).not.toMatch(/no section 8|no vouchers|voucher-excluded only/i)
  })

  it("keeps BYU housing rules as product facts, not occupant steering", () => {
    const provo = cityContentByName.Provo
    const byuFaq = provo.faq?.find((f) => /BYU/i.test(f.q))
    expect(byuFaq?.a).toMatch(/Honor Code occupancy rules/)
    expect(byuFaq?.a).not.toMatch(/BYU families|married students|young professionals/i)
  })
})

describe("city-content copy quality", () => {
  const copy = collectCopy()

  it("keeps editorial notes and SEO jargon out of published copy", () => {
    const NOTE =
      /\b(?:listing|location|geography|housing-stock) fact\b|\bas geography\b|geography amenity|local geography|\bis a listing\b|marketing performance/i
    for (const row of copy) {
      expect(row.text, `${row.city} ${row.field}`).not.toMatch(NOTE)
    }
  })

  it("follows brand voice: no em dashes, no banned words", () => {
    for (const row of copy) {
      const label = `${row.city} ${row.field}`
      expect(row.text, label).not.toMatch(/\u2014/)
      expect(row.text, label).not.toMatch(/straightforward|genuinely|honestly/i)
    }
  })

  it("has no stray punctuation or repeated highlights", () => {
    for (const row of copy) {
      expect(row.text, `${row.city} ${row.field}`).not.toMatch(/ ,|,,|\.\.|  | \./)
    }
    for (const [city, content] of Object.entries(cityContentByName)) {
      const highlights = (content.highlights ?? []).map((h) => h.toLowerCase())
      expect(new Set(highlights).size, `${city} highlights`).toBe(highlights.length)
    }
  })

  it("does not claim rail stations that do not exist", () => {
    const text = (city: string) =>
      copy
        .filter((r) => r.city === city)
        .map((r) => r.text)
        .join(" ")
    for (const city of ["Payson", "Salem", "Santaquin"]) {
      expect(text(city), city).not.toMatch(/Payson FrontRunner|FrontRunner (?:commuter rail )?station in Payson|Springville or Payson stations/i)
    }
    expect(text("Payson")).toMatch(/Provo Central/)
    expect(text("Bountiful")).not.toMatch(/Centerville FrontRunner/i)
    expect(text("North Salt Lake")).not.toMatch(/Centerville/)
    expect(text("Taylorsville")).not.toMatch(/TRAX (?:Red Line )?(?:runs through|enables)|TRAX stations in Taylorsville/i)
    expect(text("Draper")).not.toMatch(/Big Cottonwood/)
  })
})
