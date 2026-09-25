import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import SecondLookPage from "./page"

describe("/loans/second-look (unpublished)", () => {
  // Lending disclosures are a template property: the page carries them, not each instance.
  it("carries the lending disclosure in the page template", () => {
    render(<SecondLookPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })
})
