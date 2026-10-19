import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const read = (rel: string) => readFileSync(join(__dirname, "..", "..", rel), "utf8")

describe("lending and tax facts are current", () => {
  it("VA loans page does not send veterans to eBenefits for the COE", () => {
    expect(read("app/loans/va/page.tsx")).not.toMatch(/eBenefits/)
  })

  it("grants page covers Utah Housing Corporation and is titled for Utah", () => {
    const src = read("app/buy/first-time/grants/page.tsx")
    expect(src).toMatch(/Utah Housing Corporation/)
    expect(src).toMatch(/title: "Utah Down Payment Assistance/)
    expect(src).toMatch(/utahhousingcorp\.org/)
  })

  it("the investments page reflects the 2025 Opportunity Zone law, 2027 designations and an as-of note", () => {
    const src = read("app/investments/page.tsx")
    expect(src).toMatch(/permanent/)
    expect(src).toMatch(/January 1, 2027/)
    expect(src).toMatch(/December 31, 2026/)
    expect(src).toMatch(/As of October 2026/)
  })
})
