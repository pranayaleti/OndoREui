import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RateWatchPage from "./page"

describe("/refinance/watch", () => {
  it("carries the lending disclosure in the page template", () => {
    render(<RateWatchPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })

  // A licensed loan officer and NMLS ID appear only once LICENSING_LIVE is on (lib/site.ts).
  it("does not name a loan officer or NMLS ID while licensing is pending", () => {
    render(<RateWatchPage />)
    expect(screen.queryByText(/NMLS #\d/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Loan officer: Pranay/)).not.toBeInTheDocument()
  })
})
