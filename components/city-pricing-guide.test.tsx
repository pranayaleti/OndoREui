import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { CityPricingGuide } from "./city-pricing-guide"
import { findCityBySlug } from "@/lib/utah-cities"
import { cityMarketData } from "@/lib/city-market-data"
import { LEASING_FEE_RATE, STARTER_MGMT_RATE, GROWTH_MGMT_RATE } from "@/lib/fee-comparison"
import { PRICING_INCLUDED_ROWS, VENDOR_INVOICE_POLICY } from "@/lib/pricing-included"

const lehi = findCityBySlug("lehi")!

describe("CityPricingGuide fee schedule", () => {
  it("states the same fees as /pricing, from the shared constants", () => {
    const { container } = render(<CityPricingGuide city={lehi} />)
    const text = container.textContent ?? ""
    const starter = Math.round(STARTER_MGMT_RATE * 100)
    const growth = Math.round(GROWTH_MGMT_RATE * 100)
    const leasing = Math.round(LEASING_FEE_RATE * 100)
    expect(text).toContain(`${starter}% (1–4 units), ${growth}% (5–15 units)`)
    expect(text).toContain(`${leasing}% of first month's rent, one-time`)
    expect(text).toContain(`${VENDOR_INVOICE_POLICY} on vendor invoices`)

    // The /pricing table says the same thing about leasing and vendor invoices.
    const leasingRow = PRICING_INCLUDED_ROWS.find((r) => /leasing/i.test(r.item))!
    expect(leasingRow.ondo).toContain(`${leasing}%`)
    const vendorRow = PRICING_INCLUDED_ROWS.find((r) => /vendor/i.test(r.item))!
    expect(vendorRow.ondo).toContain(VENDOR_INVOICE_POLICY)
  })

  it("computes the monthly example from the Starter rate on the city's median rent", () => {
    const { container } = render(<CityPricingGuide city={lehi} />)
    const expected = Math.round(cityMarketData[lehi.name]!.medianRent * STARTER_MGMT_RATE)
    expect(container.textContent).toContain(`≈ $${expected.toLocaleString("en-US")}/mo at 10%`)
  })

  it("no longer publishes the old ranges or an unpublished coordination fee", () => {
    const { container } = render(<CityPricingGuide city={lehi} />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/50–100%/)
    expect(text).not.toMatch(/8–10%/)
    expect(text).not.toMatch(/coordination fee/i)
    expect(text).not.toMatch(/\$500–\$1,500/)
  })
})
