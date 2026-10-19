import { describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
// Lives here, not beside the calculator: every file under pages/ becomes a route.
import AffordabilityCalculator from "@/pages/calculators/affordability-calculator"
import IncomeCalculator from "@/pages/calculators/income-calculator"

function selectProgram(value: string) {
  const select = screen.getAllByRole("combobox").find((el) =>
    Array.from((el as HTMLSelectElement).options).some((o) => o.value === "fha"),
  ) as HTMLSelectElement
  fireEvent.change(select, { target: { value } })
}

describe("affordability and income calculators DTI copy", () => {
  it("affordability states the selected program's front and back limits", () => {
    render(<AffordabilityCalculator />)
    expect(screen.getByText(/target: ≤28% for Conventional loans/)).toBeInTheDocument()
    selectProgram("fha")
    expect(screen.getByText(/target: ≤31% for FHA loans/)).toBeInTheDocument()
    expect(screen.getByText(/target: ≤43% for FHA loans/)).toBeInTheDocument()
    selectProgram("va")
    expect(screen.getByText(/target: no fixed limit for VA loans/)).toBeInTheDocument()
  })

  it("income calculator no longer hard-codes 28/36", () => {
    render(<IncomeCalculator />)
    expect(screen.getByText(/target: ≤28% for Conventional loans/)).toBeInTheDocument()
    expect(screen.queryByText(/conservative 28\/36/)).toBeNull()
  })
})
