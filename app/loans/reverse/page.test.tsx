import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import ReverseMortgagePage, { metadata } from "./page"

describe("/loans/reverse", () => {
  it("states that the balance grows and the loan is still a loan", () => {
    render(<ReverseMortgagePage />)
    expect(screen.getByText(/interest and mortgage insurance are added to the balance/i, { selector: "p" })).toBeInTheDocument()
    expect(screen.queryByText(/^No monthly payment$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^You keep the title$/)).not.toBeInTheDocument()
  })

  it("covers counseling, costs, due events, foreclosure and non-borrowing spouses", () => {
    render(<ReverseMortgagePage />)
    expect(screen.getByText(/HUD-approved counseling is required/i)).toBeInTheDocument()
    expect(screen.getByText(/upfront mortgage insurance premium/i)).toBeInTheDocument()
    expect(screen.getByText(/last borrower dies, sells the home/i)).toBeInTheDocument()
    expect(screen.getByText(/can call the loan due and foreclose/i)).toBeInTheDocument()
    expect(screen.getByText(/spouse who is not on the loan/i)).toBeInTheDocument()
  })

  it("carries the lending disclosure like the sibling loan pages", () => {
    render(<ReverseMortgagePage />)
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/equal housing lender/i)).toBeInTheDocument()
  })

  it("does not advertise it as turning equity into income without payments", () => {
    expect(String(metadata.description)).not.toMatch(/without monthly/i)
    render(<ReverseMortgagePage />)
    expect(screen.queryByText(/turn equity into income/i)).not.toBeInTheDocument()
  })
})
