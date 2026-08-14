import { describe, expect, it } from "vitest"
import {
  NOTARY_EXAMPLE_AFTER_HOURS_RON_TOTAL,
  NOTARY_EXAMPLE_QUOTES,
  NOTARY_EXAMPLE_SAME_DAY_RON_TOTAL,
  NOTARY_IN_PERSON_ACT_USD,
  NOTARY_PRICING_SUMMARY,
  NOTARY_RON_ACT_USD,
  NOTARY_SAME_DAY_USD,
} from "./notary-fees"

describe("notary-fees", () => {
  it("keeps RON at the Utah statutory remote maximum", () => {
    expect(NOTARY_RON_ACT_USD).toBe(25)
    expect(NOTARY_IN_PERSON_ACT_USD).toBe(10)
  })

  it("does not publish a mobile travel schedule", () => {
    expect(NOTARY_PRICING_SUMMARY).toMatch(/do not offer in-office or mobile travel/i)
    expect(NOTARY_EXAMPLE_QUOTES.every((quote) => !/mobile|mile/i.test(`${quote.title} ${quote.detail}`))).toBe(
      true,
    )
  })

  it("quotes same-day and after-hours RON from the posted add-ons", () => {
    expect(NOTARY_EXAMPLE_SAME_DAY_RON_TOTAL).toBe(NOTARY_RON_ACT_USD + NOTARY_SAME_DAY_USD)
    expect(NOTARY_EXAMPLE_AFTER_HOURS_RON_TOTAL).toBe(NOTARY_RON_ACT_USD + 40)
  })

  it("points pricing copy at the posted schedule", () => {
    expect(NOTARY_PRICING_SUMMARY).toContain("/notary#fees")
    expect(NOTARY_PRICING_SUMMARY).toContain("$25")
  })
})
