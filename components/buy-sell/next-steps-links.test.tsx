import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { BuySellNextSteps } from "./next-steps-links"

describe("BuySellNextSteps", () => {
  it("puts the affordability quiz first for buyers", () => {
    render(<BuySellNextSteps audience="buyer" />)
    const links = within(screen.getByRole("navigation")).getAllByRole("link")
    expect(links[0]).toHaveAttribute("href", "/buy/quiz/")
    expect(links[0]).toHaveTextContent("See what you can afford")
  })

  it("does not add the buyer quiz to the seller list", () => {
    render(<BuySellNextSteps audience="seller" />)
    expect(screen.queryByRole("link", { name: /see what you can afford/i })).toBeNull()
  })
})
