import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import RateWatchPage from "./page"

describe("/refinance/watch (unpublished)", () => {
  it("carries the lending disclosure in the page template", () => {
    render(<RateWatchPage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })
})
