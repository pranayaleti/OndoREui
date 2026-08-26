import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { FeeAlignmentWidget } from "./fee-alignment-widget"
import {
  DEFAULT_EXAMPLE_MONTHLY_RENT,
  buildFeeSnapshot,
  formatUsd0,
} from "@/lib/fee-comparison"

describe("FeeAlignmentWidget", () => {
  it("defaults to $2,200 collected rent and names the rent slider", () => {
    render(<FeeAlignmentWidget />)
    const slider = screen.getByRole("slider", { name: /monthly rent per unit/i })
    expect(slider).toHaveValue(String(DEFAULT_EXAMPLE_MONTHLY_RENT))
    expect(screen.getByText(formatUsd0(DEFAULT_EXAMPLE_MONTHLY_RENT))).toBeInTheDocument()
  })

  it("shows Starter 10% per unit and drops to Growth 8% when 5–15 doors is selected", () => {
    render(<FeeAlignmentWidget />)
    const starter = buildFeeSnapshot(DEFAULT_EXAMPLE_MONTHLY_RENT, 1)
    expect(screen.getByText(formatUsd0(starter.ondoMonthlyFee))).toBeInTheDocument()

    fireEvent.click(screen.getByRole("radio", { name: /5–15 doors/i }))
    const growth = buildFeeSnapshot(DEFAULT_EXAMPLE_MONTHLY_RENT, 5)
    expect(screen.getByText(formatUsd0(growth.ondoMonthlyFee))).toBeInTheDocument()
    expect(screen.getByText("Ondo per unit this month")).toBeInTheDocument()
    expect(screen.queryByText(formatUsd0(growth.ondoMonthlyFee * 5))).not.toBeInTheDocument()
  })

  it("does not price 16+ doors as Growth 8%", () => {
    render(<FeeAlignmentWidget />)
    expect(screen.getByText(/16\+ units is a custom Portfolio quote/i)).toBeInTheDocument()
    expect(screen.queryByRole("radio", { name: /5\+ doors/i })).not.toBeInTheDocument()
  })

  it("keeps the one-time leasing fee on its own line", () => {
    render(<FeeAlignmentWidget />)
    expect(screen.getByText(/one-time leasing/i)).toBeInTheDocument()
    expect(screen.getByText(formatUsd0(buildFeeSnapshot(DEFAULT_EXAMPLE_MONTHLY_RENT, 1).oneTimeLeasingFee))).toBeInTheDocument()
  })

  it("frames aligned incentives, not a 12% vs $159 headline, and does not clone competitor copy", () => {
    const { container } = render(<FeeAlignmentWidget />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/see what you keep/i)
    expect(text).not.toMatch(/no bots/i)
    expect(text).not.toMatch(/guarantee/i)
    expect(screen.getByRole("heading", { level: 2 }).textContent).not.toMatch(/\$159/)
    expect(screen.getByText(/illustrative, not a quote/i)).toBeInTheDocument()
    expect(screen.getByText(/8–12%/)).toBeInTheDocument()
    expect(screen.getByText(/Aug 2026/)).toBeInTheDocument()
  })

  it("offers a time-value toggle that points at the full owner-vs-self calculator", () => {
    render(<FeeAlignmentWidget />)
    fireEvent.click(screen.getByRole("switch", { name: /price my time/i }))
    const calc = screen.getByRole("link", { name: /owner-vs-self|self-manage vs ondo/i })
    expect((calc.getAttribute("href") ?? "").replace(/\/$/, "")).toBe("/calculators/owner-vs-self")
  })

  it("mentions a quiet advertised-flat footnote without making it the brand", () => {
    render(<FeeAlignmentWidget />)
    expect(screen.getByText(/\$159/)).toBeInTheDocument()
    expect(screen.getByText(/\$1,988/)).toBeInTheDocument()
  })

  it("does not share one radio name across two mounted ledgers", () => {
    const { container } = render(
      <>
        <FeeAlignmentWidget />
        <FeeAlignmentWidget />
      </>,
    )
    const names = [...container.querySelectorAll('input[type="radio"]')].map((el) =>
      el.getAttribute("name"),
    )
    expect(names).toHaveLength(4)
    expect(new Set(names).size).toBe(2)
  })
})
