import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SecondLookPage from "./page"

describe("/loans/second-look", () => {
  // Lending disclosures are a template property: the page carries them, not each instance.
  it("carries the lending disclosure in the page template", () => {
    render(<SecondLookPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })

  // A page soliciting loan business names the loan officer and his personal NMLS ID.
  it("names the loan officer with his NMLS ID", () => {
    render(<SecondLookPage />)
    expect(screen.getByText("Loan officer: Pranay Reddy Aleti, NMLS #2699085")).toBeInTheDocument()
  })

  // "Most buyers can" was an unsupported legal generalization; the copy hedges and points to the contract.
  it("hedges the switch-lenders claim and points to the purchase agreement", () => {
    render(<SecondLookPage />)
    expect(screen.queryByText(/most buyers/i)).not.toBeInTheDocument()
    expect(screen.getByText(/you may be able to switch lenders while under contract/i)).toBeInTheDocument()
    expect(screen.getByText(/check your purchase agreement deadlines/i)).toBeInTheDocument()
  })
})
