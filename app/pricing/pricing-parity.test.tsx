import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import PricingPage from "./page"
import {
  GROWTH_MGMT_RATE,
  GROWTH_MIN_UNITS,
  LEASING_FEE_RATE,
  PORTFOLIO_MIN_UNITS,
  STARTER_MAX_UNITS,
  STARTER_MGMT_RATE,
} from "@/lib/fee-comparison"
import { PRICING_INCLUDED_ROWS, VENDOR_INVOICE_POLICY } from "@/lib/pricing-included"

const pct = (rate: number) => `${Math.round(rate * 100)}%`
const ratesRow = () => PRICING_INCLUDED_ROWS.find((r) => /rate by portfolio/i.test(r.item))!
const leasingRow = () => PRICING_INCLUDED_ROWS.find((r) => /leasing/i.test(r.item))!

describe("pricing page and included-vs-typical rows use the same published fees", () => {
  it("the rate row quotes the shared Starter, Growth and Portfolio bands", () => {
    const { ondo } = ratesRow()
    expect(ondo).toContain(`Starter ${pct(STARTER_MGMT_RATE)} (1–${STARTER_MAX_UNITS} units)`)
    expect(ondo).toContain(`Growth ${pct(GROWTH_MGMT_RATE)} (${GROWTH_MIN_UNITS}–${PORTFOLIO_MIN_UNITS - 1} units)`)
    expect(ondo).toContain(`Portfolio ${PORTFOLIO_MIN_UNITS}+`)
  })

  it("the leasing row quotes the shared leasing rate", () => {
    expect(leasingRow().ondo).toContain(`${pct(LEASING_FEE_RATE)} of first month`)
  })

  it("the rendered page shows the same rates, leasing fee and no-setup-fee answer", () => {
    const { container } = render(<PricingPage />)
    const text = (container.textContent ?? "").replace(/\s+/g, " ")
    expect(text).toContain(pct(STARTER_MGMT_RATE))
    expect(text).toContain(pct(GROWTH_MGMT_RATE))
    expect(text).toContain(`1–${STARTER_MAX_UNITS} units`)
    expect(text).toContain(`${GROWTH_MIN_UNITS}–${PORTFOLIO_MIN_UNITS - 1} units`)
    expect(text).toContain(`${PORTFOLIO_MIN_UNITS}+ units`)
    expect(text).toContain(`leasing fee of ${pct(LEASING_FEE_RATE)} of the first month`)
    expect(text).toMatch(/There is no setup fee/)
    // The table beside the FAQ must agree with the FAQ.
    const setup = PRICING_INCLUDED_ROWS.find((r) => /setup/i.test(r.item))!
    expect(setup.ondo).toMatch(/^None\./)
    expect(text).toContain(VENDOR_INVOICE_POLICY)
  })
})
