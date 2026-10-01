import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { AffordabilityCalculator } from "./affordability-calculator"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, unknown>) =>
      vars ? `${key} ${JSON.stringify(vars)}` : key,
    i18n: { resolvedLanguage: "en", language: "en" },
  }),
}))

describe("apply AffordabilityCalculator", () => {
  it("associates the income label with the input", () => {
    render(<AffordabilityCalculator monthlyRent={1500} />)
    const input = screen.getByLabelText("applyFlow.affordability.inputLabel")
    expect(input.tagName).toBe("INPUT")
  })

  it("renders the status region before any result so changes are announced", () => {
    render(<AffordabilityCalculator monthlyRent={1500} />)
    const status = screen.getByRole("status")
    expect(status).toBeEmptyDOMElement()

    fireEvent.change(screen.getByLabelText("applyFlow.affordability.inputLabel"), {
      target: { value: "90000" },
    })
    expect(screen.getByRole("status").textContent).toContain("applyFlow.affordability.meets")

    fireEvent.change(screen.getByLabelText("applyFlow.affordability.inputLabel"), {
      target: { value: "20000" },
    })
    expect(screen.getByRole("status").textContent).toContain("applyFlow.affordability.below")
  })
})
