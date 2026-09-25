import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
// Lives here, not beside the calculator: every file under pages/ becomes a route.
import AffordabilityCalculator from "@/pages/calculators/affordability-calculator"

describe("affordability calculator", () => {
  // Pinned before its math moved into lib/affordability.ts, so the refactor cannot shift results.
  it("shows the same maximum price and payment for its default inputs", () => {
    render(<AffordabilityCalculator />)
    expect(screen.getByText("Maximum Home Price").nextElementSibling).toHaveTextContent("$245,493")
    expect(screen.getAllByText("Monthly Payment")[0]!.nextElementSibling).toHaveTextContent("$1,867")
  })
})
