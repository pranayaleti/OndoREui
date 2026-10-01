import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { amount?: string }) => (opts?.amount ? `${key}:${opts.amount}` : key),
  }),
}))

import { BuyLendingStrip } from "@/components/buy/buy-lending-strip"

function submitWithRate(rate: string) {
  render(<BuyLendingStrip />)
  fireEvent.change(screen.getByLabelText("buyLending.rate"), { target: { value: rate } })
  fireEvent.click(screen.getByRole("button", { name: "buyLending.calculate" }))
}

describe("BuyLendingStrip", () => {
  it("shows a payment for the default 6.5% example", () => {
    submitWithRate("6.5")
    expect(screen.getByRole("status")).toHaveTextContent("$2,528")
  })

  it("shows no payment for a negative rate", () => {
    submitWithRate("-5")
    expect(screen.queryByRole("status")).toBeNull()
  })
})
