import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LICENSING_LIVE } from "@/lib/site"
import SecondLookPage from "./page"

describe("/loans/second-look", () => {
  // Lending disclosures are a template property: the page carries them, not each instance.
  it("carries the lending disclosure in the page template", () => {
    render(<SecondLookPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })

  // The loan officer's NMLS ID appears only once LICENSING_LIVE is on (lib/site.ts), and then once.
  it("names the loan officer's NMLS ID only when licensing is live, and only once", () => {
    render(<SecondLookPage />)
    expect(screen.queryAllByText(/NMLS #2699085/)).toHaveLength(LICENSING_LIVE ? 1 : 0)
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
