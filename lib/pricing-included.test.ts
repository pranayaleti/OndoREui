import { describe, expect, it } from "vitest"
import { PRICING_INCLUDED_ROWS } from "./pricing-included"

describe("PRICING_INCLUDED_ROWS", () => {
  it("names the real Ondo inclusions owners ask about", () => {
    const blob = PRICING_INCLUDED_ROWS.map((r) => `${r.item} ${r.ondo}`).join(" ").toLowerCase()
    expect(blob).toMatch(/collected rent/)
    expect(blob).toMatch(/50%/)
    expect(blob).toMatch(/30-day/)
    expect(blob).toMatch(/markup/)
    expect(blob).toMatch(/owner portal|custom/)
    expect(blob).toMatch(/24\/7/)
    expect(blob).toMatch(/nmls/)
    expect(blob).toMatch(/setup/)
  })

  it("is explicit that leasing is a one-time 50% fee, not $0 placement", () => {
    const leasing = PRICING_INCLUDED_ROWS.find((r) => /leas/i.test(r.item))
    expect(leasing).toBeDefined()
    expect(leasing?.ondo).toMatch(/50%/)
    expect(leasing?.typical).toMatch(/\$0|0 placement|advertised/i)
  })

  it("does not claim products Ondo does not offer", () => {
    const blob = PRICING_INCLUDED_ROWS.map((r) => `${r.item} ${r.ondo} ${r.typical}`).join(" ")
    expect(blob).not.toMatch(/guarantee/i)
    expect(blob).not.toMatch(/\$2,?000 pet/i)
    expect(blob).not.toMatch(/100%\s+satisfaction/i)
    expect(blob).not.toMatch(/lease in 30/i)
  })

  it("states there is no setup fee, matching the published pricing FAQ", () => {
    const setup = PRICING_INCLUDED_ROWS.find((r) => /setup/i.test(r.item))
    expect(setup?.ondo).toMatch(/none/i)
    expect(setup?.ondo).not.toMatch(/waived for first/i)
  })

  it("does not sell lending conversations as a management-plan inclusion", () => {
    const licenses = PRICING_INCLUDED_ROWS.find((r) => /license/i.test(r.item))
    expect(licenses?.ondo).not.toMatch(/lending conversations/i)
    expect(licenses?.ondo).toMatch(/not an offer or commitment to lend/i)
  })
})
