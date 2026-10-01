import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
// Lives here, not beside the calculator: every file under pages/ becomes a route.
import OwnerVsSelfCalculator from "@/pages/calculators/owner-vs-self-calculator"
import { LEASING_FEE_RATE, STARTER_MGMT_RATE } from "@/lib/fee-comparison"

describe("owner vs self calculator", () => {
  it("defaults to the published Starter (1-4 unit) management fee and leasing fee", () => {
    render(<OwnerVsSelfCalculator />)
    const basis = screen.getByTestId("owner-vs-self-fee-basis")
    expect(basis).toHaveTextContent(`${Math.round(STARTER_MGMT_RATE * 100)}% management fee`)
    expect(basis).toHaveTextContent(`${Math.round(LEASING_FEE_RATE * 100)}% leasing fee`)
    expect(screen.getByText(/– Ondo mgmt \(10%\)/)).toBeInTheDocument()
  })

  it("headline advantage for the default single rental uses the 10% rate (+$542, not +$1,044)", () => {
    render(<OwnerVsSelfCalculator />)
    expect(screen.getByText(/Ondo nets you/)).toHaveTextContent("+$542")
    expect(screen.queryByText(/\+\$1,044/)).not.toBeInTheDocument()
  })

  it("has no stray space before the comma after the work-week note", () => {
    const { container } = render(<OwnerVsSelfCalculator />)
    expect(container.textContent).not.toMatch(/work-week\)\s+,/)
  })
})
