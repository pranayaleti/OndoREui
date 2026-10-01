import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { calculateCostOfLiving, createDefaultState, formatCurrency } from "@/lib/cost-of-living"
import { SummaryPanel } from "./summary-panel"

const dir = __dirname

describe("cost-of-living SummaryPanel", () => {
  it("does not import recharts statically, so the calculator chunk stays small", () => {
    const panel = readFileSync(join(dir, "summary-panel.tsx"), "utf8")
    expect(panel).not.toMatch(/from ["']recharts["']/)
    expect(panel).toMatch(/dynamic\(\(\) => import\(["']\.\/summary-pie-chart["']\)/)
    const calc = readFileSync(join(dir, "monthly-expense-calculator.tsx"), "utf8")
    expect(calc).not.toMatch(/from ["']recharts["']/)
  })

  it("renders the totals right away and draws the pie chart after it loads", async () => {
    const state = createDefaultState()
    const result = calculateCostOfLiving(state)
    const { container } = render(<SummaryPanel result={result} state={state} showCta={false} />)
    expect(screen.getByText(formatCurrency(result.expensesTotal))).toBeInTheDocument()
    if (result.slices.length > 0) {
      await waitFor(() => expect(container.querySelector(".recharts-responsive-container")).not.toBeNull())
    }
  })
})
