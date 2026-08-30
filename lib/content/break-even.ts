/**
 * Reusable refinance break-even table copy (matrix id 43).
 * Illustrations only. Not a quote, lock, or recommendation to refinance.
 */

import { EXAMPLE_NOTE, LENDING_FACTS_AS_OF } from "./lending-facts"
import type { ComparisonColumn, ComparisonRow } from "./program-fit"

export const BREAK_EVEN_TABLE_IDS = ["stay-scenarios", "recast-vs-refi"] as const

export type BreakEvenTableId = (typeof BREAK_EVEN_TABLE_IDS)[number]

export const REFI_BREAK_EVEN_COPY = {
  asOf: LENDING_FACTS_AS_OF,
  formula:
    "Break-even months ≈ cash costs ÷ monthly principal-and-interest savings. Cash costs include appraisal, title, recording, prepaid interest, origination, and discount points, minus lender credits.",
  denominator:
    "Use old P&I minus new P&I. Do not treat a tax, insurance, or HOA change as “savings.”",
  notAQuote: EXAMPLE_NOTE,
} as const

export type BreakEvenStayScenario = {
  id: string
  heading: string
  href?: string
  costs: number
  monthlyPiSavings: number
  stayMonths: number
}

/** Worked examples for the stay-horizon table. Dollars are illustrations. */
export const BREAK_EVEN_STAY_SCENARIOS: readonly BreakEvenStayScenario[] = [
  {
    id: "modest",
    heading: "Modest costs",
    href: "/calculators/refinance",
    costs: 3_000,
    monthlyPiSavings: 200,
    stayMonths: 24,
  },
  {
    id: "points",
    heading: "Costs include a point",
    href: "/blog/discount-points-breakeven-without-sales-pitch",
    costs: 6_000,
    monthlyPiSavings: 150,
    stayMonths: 24,
  },
  {
    id: "thin",
    heading: "Thin monthly savings",
    href: "/blog/no-closing-cost-refinance-rate-credit-tradeoff",
    costs: 4_000,
    monthlyPiSavings: 50,
    stayMonths: 24,
  },
] as const

export function breakEvenMonths(cashCosts: number, monthlyPiSavings: number): number | null {
  if (!Number.isFinite(cashCosts) || cashCosts < 0) return null
  if (!Number.isFinite(monthlyPiSavings) || monthlyPiSavings <= 0) return null
  return Math.ceil(cashCosts / monthlyPiSavings)
}

export function earnsBackWithinStay(
  cashCosts: number,
  monthlyPiSavings: number,
  stayMonths: number,
): boolean | null {
  const months = breakEvenMonths(cashCosts, monthlyPiSavings)
  if (months === null || !Number.isFinite(stayMonths) || stayMonths <= 0) return null
  return months <= stayMonths
}

function usd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

function stayOutcome(scenario: BreakEvenStayScenario): string {
  const months = breakEvenMonths(scenario.costs, scenario.monthlyPiSavings)
  const earns = earnsBackWithinStay(scenario.costs, scenario.monthlyPiSavings, scenario.stayMonths)
  if (months === null || earns === null) return "Not a valid illustration."
  if (earns) {
    return `About ${months} months. In this illustration, a ${scenario.stayMonths}-month stay earns the costs back.`
  }
  return `About ${months} months. In this illustration, a ${scenario.stayMonths}-month stay does not earn the costs back.`
}

function stayScenarioColumns(): readonly ComparisonColumn[] {
  return BREAK_EVEN_STAY_SCENARIOS.map((scenario) => ({
    id: scenario.id,
    heading: scenario.heading,
    href: scenario.href,
  }))
}

function stayScenarioRows(): readonly ComparisonRow[] {
  const costs: ComparisonRow = {
    id: "costs",
    criterion: "Illustrated cash costs",
    cells: Object.fromEntries(
      BREAK_EVEN_STAY_SCENARIOS.map((scenario) => [scenario.id, usd(scenario.costs)]),
    ),
  }
  const savings: ComparisonRow = {
    id: "savings",
    criterion: "Illustrated monthly P&I savings",
    cells: Object.fromEntries(
      BREAK_EVEN_STAY_SCENARIOS.map((scenario) => [scenario.id, usd(scenario.monthlyPiSavings)]),
    ),
  }
  const months: ComparisonRow = {
    id: "months",
    criterion: "Break-even months",
    cells: Object.fromEntries(
      BREAK_EVEN_STAY_SCENARIOS.map((scenario) => {
        const value = breakEvenMonths(scenario.costs, scenario.monthlyPiSavings)
        return [scenario.id, value === null ? "—" : `${value} months`]
      }),
    ),
  }
  const stay: ComparisonRow = {
    id: "stay",
    criterion: `If you move or refinance again in ${BREAK_EVEN_STAY_SCENARIOS[0].stayMonths} months`,
    cells: Object.fromEntries(
      BREAK_EVEN_STAY_SCENARIOS.map((scenario) => [scenario.id, stayOutcome(scenario)]),
    ),
  }
  return [costs, savings, months, stay]
}

const RECAST_VS_REFI_COLUMNS: readonly ComparisonColumn[] = [
  { id: "recast", heading: "Recast", href: "/blog/recast-vs-refinance" },
  {
    id: "refi-pay",
    heading: "Refinance (pay costs)",
    href: "/blog/refinance-break-even-when-lower-rate-loses",
  },
  {
    id: "refi-credit",
    heading: "Refinance (lender credit)",
    href: "/blog/no-closing-cost-refinance-rate-credit-tradeoff",
  },
] as const

const RECAST_VS_REFI_ROWS: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What changes",
    cells: {
      recast: "Same note rate and remaining term. Payment is re-amortized after a principal curtailment.",
      "refi-pay": "New note. Rate, term, and costs. Break-even uses cash you pay.",
      "refi-credit": "New note. Credit covers many fees; the cost is usually a higher note rate.",
    },
  },
  {
    id: "cost-shape",
    criterion: "Typical cost shape (illustration, not a quote)",
    cells: {
      recast: "A servicer recast fee — often a few hundred dollars when the investor allows it — plus the lump sum you already chose to send.",
      "refi-pay": "Title, origination, points, prepaid interest. Put all of it in the numerator.",
      "refi-credit": "Cash at closing can look small. Run break-even against the higher P&I, not against zero cost.",
    },
  },
  {
    id: "when",
    criterion: "When people compare it",
    cells: {
      recast: "You like the current rate, you have a lump sum, and the servicer will recast.",
      "refi-pay": "You want a lower rate or a different term and will stay long enough to earn costs back.",
      "refi-credit": "You want a new note with little cash out of pocket and accept the rate trade.",
    },
  },
] as const

export function breakEvenColumns(table: BreakEvenTableId): readonly ComparisonColumn[] {
  switch (table) {
    case "stay-scenarios":
      return stayScenarioColumns()
    case "recast-vs-refi":
      return RECAST_VS_REFI_COLUMNS
    default: {
      const _exhaustive: never = table
      return _exhaustive
    }
  }
}

export function breakEvenRows(table: BreakEvenTableId): readonly ComparisonRow[] {
  switch (table) {
    case "stay-scenarios":
      return stayScenarioRows()
    case "recast-vs-refi":
      return RECAST_VS_REFI_ROWS
    default: {
      const _exhaustive: never = table
      return _exhaustive
    }
  }
}

export function isBreakEvenTableId(value: string): value is BreakEvenTableId {
  return (BREAK_EVEN_TABLE_IDS as readonly string[]).includes(value)
}
