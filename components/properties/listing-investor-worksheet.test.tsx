import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ListingInvestorWorksheet } from "./listing-investor-worksheet"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"

describe("ListingInvestorWorksheet", () => {
  it("prefills listed rent and hides yields until a purchase price assumption is entered", () => {
    render(<ListingInvestorWorksheet listedMonthlyRent={2195} />)

    expect(screen.getByRole("heading", { name: /illustrative investor worksheet/i })).toBeInTheDocument()
    expect(screen.getByText(/listed rent \(this listing\)/i)).toBeInTheDocument()
    expect(screen.getByText(/\$2,195/)).toBeInTheDocument()
    expect(screen.queryByRole("region", { name: /illustration results/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/high-yield|set it and forget it|safe neighborhood/i)).not.toBeInTheDocument()
    expect(screen.getByText(/not a guarantee/i)).toBeInTheDocument()
    expect(screen.getAllByText(/not a quote/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/not advice/i)).toBeInTheDocument()
    expect(screen.getByText(/not a loan offer/i)).toBeInTheDocument()
    expect(screen.getByText(/you are not required to use ondo to finance/i)).toBeInTheDocument()
    expect(screen.getByText(/the typed rate is not a quote or apr/i)).toBeInTheDocument()
    expect(screen.getByText(ARRIVAL_LENDING_DISCLOSURE)).toBeInTheDocument()
    expect(screen.getByText(/not a commitment to lend/i)).toBeInTheDocument()
    expect(screen.getByText(/nmls id on file/i)).toBeInTheDocument()
    const rateField = screen.getByLabelText(/^mortgage rate/i)
    const describedBy = rateField.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()
    const describedIds = describedBy!.split(" ")
    expect(describedIds.every((id) => document.getElementById(id))).toBe(true)
    expect(describedIds.some((id) => document.getElementById(id)?.textContent === ARRIVAL_LENDING_DISCLOSURE)).toBe(
      true,
    )
    expect(screen.getByRole("link", { name: /request information/i })).toHaveAttribute("href", "#listing-inquire")
    expect(screen.getByRole("button", { name: /reset/i }).className).toContain(
      STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS.split(" ")[0]!,
    )
  })

  it("shows estimated P&I, NOI, cap rate, and cash-on-cash after purchase price, then reset clears them", () => {
    render(<ListingInvestorWorksheet listedMonthlyRent={2000} />)

    fireEvent.change(screen.getByLabelText(/^purchase price/i), { target: { value: "400000" } })
    fireEvent.change(screen.getByLabelText(/^down payment/i), { target: { value: "25" } })
    fireEvent.change(screen.getByLabelText(/^closing costs/i), { target: { value: "3" } })
    fireEvent.change(screen.getByLabelText(/^mortgage rate/i), { target: { value: "6.5" } })
    fireEvent.change(screen.getByLabelText(/^property tax/i), { target: { value: "1" } })
    fireEvent.change(screen.getByLabelText(/^insurance/i), { target: { value: "0.5" } })
    fireEvent.change(screen.getByLabelText(/^hoa/i), { target: { value: "0.25" } })
    fireEvent.change(screen.getByLabelText(/^vacancy/i), { target: { value: "5" } })
    fireEvent.change(screen.getByLabelText(/^management/i), { target: { value: "8" } })

    const results = screen.getByRole("region", { name: /illustration results/i })
    expect(results).toHaveTextContent(/est\. p&i/i)
    expect(results).toHaveTextContent(/est\. noi/i)
    expect(results).toHaveTextContent(/est\. cap rate/i)
    expect(results).toHaveTextContent(/est\. cash-on-cash/i)
    expect(results).toHaveTextContent("3.47%")

    fireEvent.click(screen.getByRole("button", { name: /reset/i }))
    expect(screen.getByLabelText(/^purchase price/i)).toHaveValue(null)
    expect(screen.queryByRole("region", { name: /illustration results/i })).not.toBeInTheDocument()
    expect(screen.getByText(/\$2,000/)).toBeInTheDocument()
  })
})
