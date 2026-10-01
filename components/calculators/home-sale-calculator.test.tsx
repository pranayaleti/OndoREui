import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import HomeSaleCalculator from "@/pages/calculators/home-sale-calculator"

describe("HomeSaleCalculator commissions", () => {
  it("splits listing and buyer agent commissions and does not call 5-6% typical", () => {
    const { container } = render(<HomeSaleCalculator />)
    expect(screen.getByLabelText(/Listing Agent Commission/i)).toBeTruthy()
    expect(screen.getByLabelText(/Buyer Agent Commission/i)).toBeTruthy()
    const text = container.textContent ?? ""
    expect(text).toMatch(/negotiable and not set by law/i)
    expect(text).not.toMatch(/typically 5-6%/i)
    expect(text).not.toMatch(/realtor/i)
  })

  it("sums both commissions into the cost breakdown", () => {
    const { container } = render(<HomeSaleCalculator />)
    // $400,000 at 2.5% + 2.5% = $20,000
    expect(container.textContent).toContain("Agent Commissions:$20,000")
  })
})
