import { describe, expect, it } from "vitest"
import { CONTACT_SECTION, INTAKE_TYPES, INTAKE_TYPE_IDS, SECTIONS_BY_TYPE } from "./intake-questions"

const allText = (sections: (typeof SECTIONS_BY_TYPE)[keyof typeof SECTIONS_BY_TYPE]) =>
  sections
    .flatMap((s) => [s.title, s.intro ?? "", ...s.fields.flatMap((f) => [f.label, f.help ?? "", ...(f.options ?? [])])])
    .join(" \n ")
    .toLowerCase()

/** Every word a visitor can read: type blurbs, the contact step and all four questionnaires. */
const everyText = () =>
  [
    ...INTAKE_TYPES.flatMap((t) => [t.title, t.blurb]),
    allText([CONTACT_SECTION]),
    ...INTAKE_TYPE_IDS.map((id) => allText(SECTIONS_BY_TYPE[id])),
  ]
    .join(" \n ")
    .toLowerCase()

describe("intake questions", () => {
  it("offers a questionnaire for every type", () => {
    expect(INTAKE_TYPES.map((t) => t.id)).toEqual([...INTAKE_TYPE_IDS])
    for (const id of INTAKE_TYPE_IDS) expect(SECTIONS_BY_TYPE[id].length).toBeGreaterThan(0)
  })

  it("uses snake_case ids the API keeps, unique within each questionnaire", () => {
    for (const id of INTAKE_TYPE_IDS) {
      const ids = SECTIONS_BY_TYPE[id].flatMap((s) => s.fields.map((f) => f.id))
      expect(new Set(ids).size).toBe(ids.length)
      for (const fieldId of ids) expect(fieldId).toMatch(/^[a-z0-9_]{1,60}$/)
      const contactIds = new Set(CONTACT_SECTION.fields.map((f) => f.id))
      for (const fieldId of ids) expect(contactIds.has(fieldId)).toBe(false)
    }
  })

  it("keeps renter questions Fair Housing safe", () => {
    const text = allText(SECTIONS_BY_TYPE.tenant)
    for (const term of [
      "child",
      "kids",
      "famil",
      "married",
      "marital",
      "spouse",
      "pregnan",
      "religio",
      "church",
      "national origin",
      "citizen",
      "immigra",
      "race",
      "ethnic",
      "disab",
      "handicap",
      "income source",
      "source of income",
      "section 8",
      "voucher",
      "employ",
      "credit score",
      "age",
    ]) {
      expect(text, `renter questionnaire mentions "${term}"`).not.toMatch(new RegExp(`\\b${term}`))
    }
  })

  it("never steers: no neighborhood or resident characterisations anywhere in the copy", () => {
    // Fair Housing (42 USC 3604, 24 CFR 100.70): the questions must not invite or hint at
    // preferences about who lives somewhere. Applies to every flow, not only renters.
    const text = everyText()
    for (const term of ["safe neighborhood", "safe area", "family-friendly", "family friendly", "good schools", "best schools", "exclusive", "quiet neighborhood", "low crime", "neighbors like"]) {
      expect(text, `intake copy says "${term}"`).not.toContain(term)
    }
  })

  it("does not market lending from the questionnaire", () => {
    const text = everyText()
    for (const term of ["second opinion", "refinanc", "rate", "apr", "nmls", "pre-qualify you", "we lend"]) {
      expect(text, `questionnaire mentions "${term}"`).not.toMatch(new RegExp(`\\b${term}`))
    }
  })
})
