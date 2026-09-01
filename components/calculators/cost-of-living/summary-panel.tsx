"use client"

import { useId } from "react"
import Link from "next/link"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { LICENSING_HREF } from "@/lib/social-proof-stats"
import {
  COST_OF_LIVING_LENDING_DISCLAIMER,
  COST_OF_LIVING_NOT_ADVICE,
  COST_OF_LIVING_PLANNING_DISCLAIMER,
} from "@/lib/cost-of-living-defaults"
import {
  formatCurrency,
  formatPercent,
  type CostOfLivingResult,
  type CostOfLivingState,
  type ExpenseCategoryId,
  exploreHomesHref,
} from "@/lib/cost-of-living"

const SLICE_COLORS: Record<ExpenseCategoryId, string> = {
  housing: "hsl(var(--primary))",
  transportation: "hsl(var(--color-category-1))",
  food: "hsl(var(--color-category-3))",
  utilities: "hsl(var(--color-category-4))",
  insurance: "hsl(var(--color-category-2))",
  healthcare: "hsl(var(--muted-foreground))",
  personal: "hsl(var(--secondary-foreground))",
  childcare: "hsl(var(--accent))",
  pets: "hsl(var(--color-category-4))",
  debt: "hsl(var(--destructive))",
  lifestyle: "hsl(var(--color-category-2))",
  other: "hsl(var(--border))",
}

type SummaryPanelProps = {
  result: CostOfLivingResult
  state: CostOfLivingState
  compact?: boolean
  onAdjust?: () => void
  showCta?: boolean
}

export function SummaryPanel({ result, state, compact = false, onAdjust, showCta = true }: SummaryPanelProps) {
  const headingId = useId()
  const href = exploreHomesHref(state, result)
  const ctaLabel = "Explore homes within your budget"

  return (
    <aside
      className="rounded-lg border border-border bg-card p-5 shadow-sm"
      aria-labelledby={headingId}
    >
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Estimated monthly expenses</p>
      <p
        id={headingId}
        className="mt-1 font-extrabold tabular-nums tracking-tight text-foreground"
        style={{ fontSize: compact ? "1.75rem" : "2.5rem", lineHeight: 1.1 }}
        aria-live="polite"
      >
        {formatCurrency(result.expensesTotal)}
        <span className="ml-1 text-base font-medium text-muted-foreground">/ month</span>
      </p>
      <div className="mt-2 h-px bg-primary" aria-hidden />
      <div className="mt-px h-0.5 bg-foreground" aria-hidden />
      <p className="mt-3 text-sm text-muted-foreground">
        {formatCurrency(result.annualExpenses)} per year
      </p>

      {!compact && result.slices.length > 0 ? (
        <div className="mt-5 h-48" aria-hidden={false}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={result.slices}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={1}
              >
                {result.slices.map((slice) => (
                  <Cell key={slice.id} fill={SLICE_COLORS[slice.id]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(typeof value === "number" ? value : 0)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      <ul className="mt-4 space-y-2">
        {result.slices.map((slice) => (
          <li key={slice.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: SLICE_COLORS[slice.id] }}
                aria-hidden
              />
              <span className="truncate">{slice.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-foreground">
              {formatCurrency(slice.amount)}{" "}
              <span className="text-muted-foreground">({formatPercent(slice.percent)})</span>
            </span>
          </li>
        ))}
      </ul>

      {result.incomeTotal > 0 ? (
        <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
          <p className="font-medium text-foreground">Cash flow</p>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Income</span>
            <span className="tabular-nums">{formatCurrency(result.incomeTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expenses</span>
            <span className="tabular-nums">{formatCurrency(result.expensesTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Savings goal</span>
            <span className="tabular-nums">{formatCurrency(result.savingsGoal)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Remaining</span>
            <span className="tabular-nums">{formatCurrency(result.remaining)}</span>
          </div>
        </div>
      ) : null}

      {result.housingBudget ? (
        <p className="mt-4 text-sm text-foreground/90">
          Based on your inputs, a housing payment around{" "}
          <strong>
            {formatCurrency(result.housingBudget.lowMonthly)}–{formatCurrency(result.housingBudget.highMonthly)}
          </strong>
          /month may fit within your target budget. This is a planning range, not a qualification or loan offer.
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Add optional income to see a housing payment range that may fit your target budget. This is not a
          qualification.
        </p>
      )}

      {showCta ? (
        <div className="mt-5 flex flex-col gap-2">
          <Button asChild className="h-11 w-full">
            <Link href={href}>{ctaLabel}</Link>
          </Button>
          {onAdjust ? (
            <Button type="button" variant="outline" className="h-11 w-full" onClick={onAdjust}>
              Adjust calculator
            </Button>
          ) : null}
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        {COST_OF_LIVING_PLANNING_DISCLAIMER} {COST_OF_LIVING_NOT_ADVICE}{" "}
        <Link href={LICENSING_HREF} className="underline underline-offset-2 hover:text-foreground">
          Licensing
        </Link>
        . {COST_OF_LIVING_LENDING_DISCLAIMER}
      </p>
    </aside>
  )
}

type MobileSummaryBarProps = {
  total: number
  onViewSummary: () => void
}

export function MobileSummaryBar({ total, onViewSummary }: MobileSummaryBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Estimated monthly</p>
          <p className="text-lg font-bold tabular-nums">{formatCurrency(total)}</p>
        </div>
        <Button type="button" onClick={onViewSummary} className="h-11 shrink-0">
          View summary
        </Button>
      </div>
    </div>
  )
}
