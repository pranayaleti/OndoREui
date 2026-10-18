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

  // A licensed loan officer and NMLS ID appear only once LICENSING_LIVE is on (lib/site.ts).
  it("does not name a loan officer or NMLS ID while licensing is pending", () => {
    render(<SecondLookPage />)
    expect(screen.queryByText(/NMLS #\d/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Loan officer: Pranay/)).not.toBeInTheDocument()
  })

  // "Most buyers can" was an unsupported legal generalization; the copy hedges and points to the contract.
  it("hedges the switch-lenders claim and points to the purchase agreement", () => {
    render(<SecondLookPage />)
    expect(screen.queryByText(/most buyers/i)).not.toBeInTheDocument()
    expect(screen.getByText(/you may be able to switch lenders while under contract/i)).toBeInTheDocument()
    expect(screen.getByText(/check your purchase agreement deadlines/i)).toBeInTheDocument()
  })
})
