import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { FeeAlignmentWidget } from "./fee-alignment-widget"
import {
  ADVERTISED_FLAT_MONTHLY,
  DEFAULT_EXAMPLE_MONTHLY_RENT,
  FEE_COMPARISON_AS_OF,
  GROWTH_MGMT_RATE,
  buildFeeSnapshot,
  flatFeeCrossoverRent,
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
    expect(screen.getByRole("heading", { level: 2 }).textContent).not.toContain(formatUsd0(ADVERTISED_FLAT_MONTHLY))
    expect(screen.getByText(/illustrative, not a quote/i)).toBeInTheDocument()
    expect(screen.getByText(/8–12%/)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(FEE_COMPARISON_AS_OF))).toBeInTheDocument()
  })

  it("offers a time-value toggle that points at the full owner-vs-self calculator", () => {
    render(<FeeAlignmentWidget />)
    fireEvent.click(screen.getByRole("switch", { name: /price my time/i }))
    const calc = screen.getByRole("link", { name: /owner-vs-self|self-manage vs ondo/i })
    expect((calc.getAttribute("href") ?? "").replace(/\/$/, "")).toBe("/calculators/owner-vs-self")
  })

  it("mentions a quiet advertised-flat footnote without making it the brand", () => {
    render(<FeeAlignmentWidget />)
    const note = screen.getByText(/Some Utah shops advertise/)
    expect(note.textContent).toContain(`${formatUsd0(ADVERTISED_FLAT_MONTHLY)}/mo as of ${FEE_COMPARISON_AS_OF}`)
    expect(note.textContent).toContain(formatUsd0(flatFeeCrossoverRent(GROWTH_MGMT_RATE)))
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

  describe("live announcements", () => {
    afterEach(() => vi.useRealTimers())

    it("keeps the ledger out of a live region and announces one debounced summary", () => {
      vi.useFakeTimers()
      const { container } = render(<FeeAlignmentWidget />)
      expect(container.querySelector("dl[aria-live]")).toBeNull()
      const status = screen.getByRole("status")
      expect(status).toHaveTextContent("")

      const slider = screen.getByRole("slider", { name: /monthly rent per unit/i })
      fireEvent.change(slider, { target: { value: "2400" } })
      fireEvent.change(slider, { target: { value: "2600" } })
      expect(status).toHaveTextContent("")

      act(() => {
        vi.advanceTimersByTime(1000)
      })
      const expected = formatUsd0(buildFeeSnapshot(2600, 1).ondoMonthlyFee)
      expect(status).toHaveTextContent(`Ondo fee per unit this month: ${expected}.`)
    })
  })
})
