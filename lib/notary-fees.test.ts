import { describe, expect, it } from "vitest"
import {
  NOTARY_EXAMPLE_QUOTES,
  NOTARY_IN_PERSON_ACT_USD,
  NOTARY_PRICING_SUMMARY,
  NOTARY_RON_ACT_USD,
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

  it("never publishes a per-act total above the Utah remote cap", () => {
    for (const quote of NOTARY_EXAMPLE_QUOTES) {
      const total = Number(/Total \$(\d+)/.exec(quote.detail)?.[1])
      const acts = Number(/(\d+) act/.exec(`${quote.title} ${quote.detail}`)?.[1] ?? 1)
      expect(total / acts).toBeLessThanOrEqual(NOTARY_RON_ACT_USD)
    }
    const copy = [NOTARY_PRICING_SUMMARY, ...NOTARY_EXAMPLE_QUOTES.map((q) => `${q.title} ${q.detail}`)].join(" ")
    expect(copy).not.toMatch(/same-day|after[- ]hours|weekend|\$50|\$65/i)
  })

  it("points pricing copy at the posted schedule", () => {
    expect(NOTARY_PRICING_SUMMARY).toContain("/notary#fees")
    expect(NOTARY_PRICING_SUMMARY).toContain("$25")
  })
})
