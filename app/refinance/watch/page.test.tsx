import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LICENSING_LIVE } from "@/lib/site"
import RateWatchPage from "./page"

describe("/refinance/watch", () => {
  it("carries the lending disclosure in the page template", () => {
    render(<RateWatchPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })

  // The loan officer's NMLS ID appears only once LICENSING_LIVE is on (lib/site.ts), and then once.
  it("names the loan officer's NMLS ID only when licensing is live, and only once", () => {
    render(<RateWatchPage />)
    expect(screen.queryAllByText(/NMLS #2699085/)).toHaveLength(LICENSING_LIVE ? 1 : 0)
    expect(screen.queryByText(/Loan officer: Pranay/)).not.toBeInTheDocument()
  })
})
