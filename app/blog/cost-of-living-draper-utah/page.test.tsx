import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CostOfLivingDraper from "./page"

describe("/blog/cost-of-living-draper-utah", () => {
  // A quoted rate and payment next to a loan CTA reads as credit advertising without APR and terms.
  it("does not quote a mortgage rate or payment, and points to the calculator", () => {
    const { container } = render(<CostOfLivingDraper />)
    expect(container.textContent).not.toMatch(/6\.75%/)
    expect(container.textContent).not.toMatch(/\$3,210/)
    expect(screen.getByRole("link", { name: /mortgage payment calculator/i })).toHaveAttribute(
      "href",
      "/calculators/mortgage-payment/",
    )
  })
})
