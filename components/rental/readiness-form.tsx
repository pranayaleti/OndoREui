"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CREDIT_SCORE_RANGES } from "@/lib/rental-application"
import { postReadiness, type ReadinessAnswers, type ReadinessResult } from "@/lib/api/rental"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"

const empty: ReadinessAnswers = {
  isAtLeast18: true,
  adultCount: 1,
  employed: true,
  selfEmployed: false,
  approximateMonthlyIncomeCents: null,
  creditScoreRangeId: "unknown",
  hasRentalHistory: true,
  hasPets: false,
  hasAssistanceAnimal: false,
  smokesOrVapes: false,
  canObtainRentersInsurance: true,
}

export function ReadinessForm({
  propertyId,
  onReady,
}: {
  propertyId: string
  onReady?: () => void
}) {
  const [answers, setAnswers] = useState<ReadinessAnswers>(empty)
  const [income, setIncome] = useState("")
  const [result, setResult] = useState<ReadinessResult | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault()
        setBusy(true)
        setError("")
        try {
          const dollars = income.trim() ? Number(income) : null
          const payload: ReadinessAnswers = {
            ...answers,
            approximateMonthlyIncomeCents:
              dollars != null && Number.isFinite(dollars) ? Math.round(dollars * 100) : null,
          }
          const next = await postReadiness(propertyId, payload)
          setResult(next)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not check requirements")
        } finally {
          setBusy(false)
        }
      }}
    >
      <h3 className="text-lg font-semibold">Check your application requirements</h3>
      <p className="text-sm text-muted-foreground">
        This is not an approval or a denial. It only lists what this property asks you to have ready.
      </p>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.isAtLeast18}
          onChange={(e) => setAnswers((a) => ({ ...a, isAtLeast18: e.target.checked }))}
        />
        I am at least 18
      </label>
      <div>
        <Label htmlFor="adult-count">Adults who will live in the home</Label>
        <Input
          id="adult-count"
          type="number"
          min={1}
          max={20}
          className="mt-1"
          value={answers.adultCount}
          onChange={(e) => setAnswers((a) => ({ ...a, adultCount: Number(e.target.value) || 1 }))}
        />
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.employed}
          onChange={(e) => setAnswers((a) => ({ ...a, employed: e.target.checked }))}
        />
        Currently employed
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.selfEmployed}
          onChange={(e) => setAnswers((a) => ({ ...a, selfEmployed: e.target.checked }))}
        />
        Self-employed
      </label>
      <div>
        <Label htmlFor="income">Approximate household monthly income (USD)</Label>
        <Input id="income" inputMode="decimal" className="mt-1" value={income} onChange={(e) => setIncome(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="credit-range">Credit score range</Label>
        <select
          id="credit-range"
          className="mt-1 flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={answers.creditScoreRangeId}
          onChange={(e) => setAnswers((a) => ({ ...a, creditScoreRangeId: e.target.value }))}
        >
          {CREDIT_SCORE_RANGES.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.hasRentalHistory}
          onChange={(e) => setAnswers((a) => ({ ...a, hasRentalHistory: e.target.checked }))}
        />
        I have prior rental history
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.hasPets}
          onChange={(e) => setAnswers((a) => ({ ...a, hasPets: e.target.checked }))}
        />
        I have pets (not including assistance animals)
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.hasAssistanceAnimal}
          onChange={(e) => setAnswers((a) => ({ ...a, hasAssistanceAnimal: e.target.checked }))}
        />
        I may request an assistance animal accommodation
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.smokesOrVapes}
          onChange={(e) => setAnswers((a) => ({ ...a, smokesOrVapes: e.target.checked }))}
        />
        Someone in the household smokes or vapes
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={answers.canObtainRentersInsurance}
          onChange={(e) => setAnswers((a) => ({ ...a, canObtainRentersInsurance: e.target.checked }))}
        />
        I can obtain renters insurance if required
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="min-h-11 w-full" disabled={busy}>
        {busy ? "Checking…" : "Check your application requirements"}
      </Button>
      {result ? (
        <div className="space-y-3 rounded-xl border border-border p-4">
          <p className="font-semibold">{result.headline}</p>
          <p className="text-sm text-muted-foreground">{result.body}</p>
          {result.missing.length > 0 ? (
            <ul className="list-disc pl-5 text-sm">
              {result.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {result.notes.map((note) => (
            <p key={note} className="text-xs text-muted-foreground">
              {note}
            </p>
          ))}
          {result.outcome === "ready" && onReady ? (
            <Button type="button" className="min-h-11 w-full" onClick={onReady}>
              Start application
            </Button>
          ) : null}
          <FairHousingNotice compact />
        </div>
      ) : null}
    </form>
  )
}
