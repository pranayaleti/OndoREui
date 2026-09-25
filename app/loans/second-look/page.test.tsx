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
})
