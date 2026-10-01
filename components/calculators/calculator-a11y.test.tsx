import { describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
// Lives here, not beside the calculators: every file under pages/ becomes a route.
import BuyingPowerCalculator from "@/pages/calculators/buying-power-calculator"
import ClosingCostCalculator from "@/pages/calculators/closing-cost-calculator"
import IncomeCalculator from "@/pages/calculators/income-calculator"
import RefinanceCalculator from "@/pages/calculators/refinance-calculator"
import TemporaryBuydownCalculator from "@/pages/calculators/temporary-buydown-calculator"
import MortgagePaymentCalculator from "@/pages/calculators/mortgage-payment-calculator"

const calculators = {
  "buying power": BuyingPowerCalculator,
  "closing cost": ClosingCostCalculator,
  income: IncomeCalculator,
  refinance: RefinanceCalculator,
  "temporary buydown": TemporaryBuydownCalculator,
}

describe("calculator form controls have accessible names", () => {
  for (const [name, Calculator] of Object.entries(calculators)) {
    it(`every select on the ${name} calculator is labelled`, () => {
      render(<Calculator />)
      const selects = screen.getAllByRole("combobox")
      expect(selects.length).toBeGreaterThan(0)
      for (const select of selects) {
        expect(select).toHaveAccessibleName()
      }
    })
  }

  it("groups the mortgage payment term and rate-structure buttons under their labels", () => {
    render(<MortgagePaymentCalculator />)
    expect(screen.getByRole("group", { name: "Loan Term" })).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Rate Structure" })).toBeInTheDocument()
  })

  it("expands amortization years from a real button, not a role=button table row", async () => {
    const { container } = render(<MortgagePaymentCalculator />)
    // The schedule is open by default.
    await screen.findByRole("button", { name: "Hide Details" })
    expect(container.querySelector("tr[role]")).toBeNull()
    const toggle = await screen.findByRole("button", { name: "Year 1 monthly details" })
    expect(toggle).toHaveAttribute("aria-expanded", "false")
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Mo 1")).toBeInTheDocument()
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute("aria-expanded", "false")
  })
})
