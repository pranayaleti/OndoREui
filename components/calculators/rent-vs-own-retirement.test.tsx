import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
// Lives here, not beside the calculators: every file under pages/ becomes a route.
import RentVsOwnCalculator from "@/pages/calculators/rent-vs-own-calculator"
import RetirementCalculator from "@/pages/calculators/retirement-calculator"

function setField(label: string, value: string) {
  const input = screen.getByLabelText(label)
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value } })
  fireEvent.blur(input)
}

describe("rent vs own calculator", () => {
  it("does not recommend buying or show a 0-year break-even when buying never breaks even", () => {
    render(<RentVsOwnCalculator />)
    setField("Monthly Rent", "1000")
    setField("Home Price", "900000")
    setField("Down Payment", "180000")
    setField("Home Appreciation", "0")
    expect(screen.getByText(/Does not break even within 10 years/)).toBeInTheDocument()
    expect(screen.getByText("Renting may be more cost-effective")).toBeInTheDocument()
    expect(screen.queryByText("Buying is likely the better choice")).not.toBeInTheDocument()
    expect(screen.queryByText(/^0 years$/)).not.toBeInTheDocument()
  })

  it("keeps non-currency inputs free of a currency prefix", () => {
    const { container } = render(<RentVsOwnCalculator />)
    const field = (id: string) => container.querySelector(`#${id}`)!.parentElement!
    expect(field("analysisYears").textContent).not.toContain("$")
    expect(field("investmentReturn").textContent).toContain("%")
    expect(field("monthlyRent").textContent).toContain("$")
  })
})

describe("retirement calculator", () => {
  it("labels a negative gap as a surplus, not a red gap", () => {
    render(<RetirementCalculator />)
    expect(screen.getByText("On Track")).toBeInTheDocument()
    expect(screen.getByText("Income Surplus")).toBeInTheDocument()
    expect(screen.queryByText("Income Gap")).not.toBeInTheDocument()
  })

  it("changes results when income, expenses and life expectancy change", () => {
    render(<RetirementCalculator />)
    expect(screen.getByText("Annual Savings Capacity").parentElement).toHaveTextContent("$20,000")
    setField("Annual Income", "250000")
    setField("Annual Expenses", "10000")
    expect(screen.getByText("Annual Savings Capacity").parentElement).toHaveTextContent("$240,000")
    setField("Life Expectancy", "100")
    expect(screen.getByText("Years in Retirement").parentElement).toHaveTextContent("35")
  })
})
