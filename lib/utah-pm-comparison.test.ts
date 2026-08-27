import { describe, expect, it } from "vitest"
import { UTAH_PM_COMPARISON, type UtahPmRow } from "./utah-pm-comparison"

function byName(name: string): UtahPmRow {
  const row = UTAH_PM_COMPARISON.find((c) => c.name === name)
  if (!row) throw new Error(`Missing comparison row: ${name}`)
  return row
}

describe("UTAH_PM_COMPARISON", () => {
  it("lists Ondo first as the in-house column", () => {
    expect(UTAH_PM_COMPARISON[0]?.name).toBe("Ondo RE")
    expect(UTAH_PM_COMPARISON[0]?.isUs).toBe(true)
  })

  it("records Rentomatic’s advertised Aug 2026 flat fee and $0 placement, not the stale $89–$129 AppFolio figures", () => {
    const rentomatic = byName("Rentomatic")
    expect(rentomatic.mgmtFee).toMatch(/\$159/)
    expect(rentomatic.mgmtFee).not.toMatch(/\$89/)
    expect(rentomatic.leasingFee).toMatch(/\$0/)
    expect(rentomatic.techStack).toMatch(/not disclosed/i)
    expect(rentomatic.techStack).not.toMatch(/AppFolio/i)
    expect(rentomatic.techStack).not.toMatch(/marketing site/i)
  })

  it("records Rentomatic’s advertised Aug 2026 $0 signup with a verify hedge", () => {
    const rentomatic = byName("Rentomatic")
    expect(rentomatic.setupFee).toMatch(/\$0 signup/)
    expect(rentomatic.setupFee).toMatch(/as advertised [A-Z][a-z]{2} \d{4}/)
    expect(rentomatic.setupFee).toMatch(/verify/i)
  })

  it("states the percentage-alignment / leasing-fee tradeoff without insult", () => {
    const rentomatic = byName("Rentomatic")
    expect(rentomatic.cons).toMatch(/percentage|align/i)
    expect(rentomatic.cons).toMatch(/leas/i)
    expect(rentomatic.cons).not.toMatch(/scam|ripoff|worst|terrible|avoid/i)
  })

  it("keeps Ondo’s leasing fee at 50% of first month’s rent", () => {
    expect(byName("Ondo RE").leasingFee).toMatch(/50%/)
  })

  it("does not imply a setup fee that pricing says does not exist", () => {
    expect(byName("Ondo RE").setupFee).toMatch(/none/i)
    expect(byName("Ondo RE").setupFee).not.toMatch(/waived/i)
  })
})
