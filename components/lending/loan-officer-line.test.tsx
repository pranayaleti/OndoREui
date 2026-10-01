import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LoanOfficerLine } from "./loan-officer-line"

describe("LoanOfficerLine", () => {
  it("shows only the individual NMLS ID while licensing is off", () => {
    render(<LoanOfficerLine />)
    expect(screen.getByText("Loan officer: Pranay Reddy Aleti, NMLS #2699085")).toBeInTheDocument()
    expect(screen.queryByRole("link", { name: /nmls consumer access/i })).not.toBeInTheDocument()
  })

  it("does not show a company ID that has not been supplied, even when live", () => {
    render(<LoanOfficerLine live companyId="" />)
    expect(screen.queryByText(/company nmls/i)).not.toBeInTheDocument()
  })

  it("adds the company ID and NMLS Consumer Access link once live with a company ID", () => {
    render(<LoanOfficerLine live companyId="123456" />)
    expect(screen.getByText(/company nmls #123456/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /nmls consumer access/i })).toHaveAttribute(
      "href",
      "https://www.nmlsconsumeraccess.org/",
    )
  })
})
