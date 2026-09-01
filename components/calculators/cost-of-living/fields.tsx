"use client"

import { useEffect, useId, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DONT_KNOW_YOUR_NUMBER, SUGGESTED_STARTING_POINT_HINT } from "@/lib/cost-of-living-defaults"
import { formatCurrency, money, sanitizeAmount } from "@/lib/cost-of-living"

function parseNumeric(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "")
  if (cleaned === "" || cleaned === ".") return 0
  const n = Number(cleaned)
  return sanitizeAmount(n)
}

function formatGrouped(value: number): string {
  return money(value).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 })
}

type CurrencyInputProps = {
  id?: string
  label: string
  value: number
  onChange: (value: number) => void
  hint?: string
  disabled?: boolean
  suffix?: string
  describedBy?: string
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  hint,
  disabled,
  suffix,
  describedBy,
}: CurrencyInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState(formatGrouped(value))

  useEffect(() => {
    if (!focused) setDraft(formatGrouped(value))
  }, [value, focused])

  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
          $
        </span>
        <Input
          id={inputId}
          inputMode="decimal"
          autoComplete="off"
          disabled={disabled}
          value={focused ? draft : formatGrouped(value)}
          aria-describedby={cn(hint ? hintId : undefined, describedBy)}
          onFocus={(event) => {
            setFocused(true)
            setDraft(value === 0 ? "" : String(value))
            event.target.select()
          }}
          onBlur={() => {
            setFocused(false)
            onChange(parseNumeric(draft))
          }}
          onChange={(event) => {
            setDraft(event.target.value)
            onChange(parseNumeric(event.target.value))
          }}
          className={cn("h-11 pl-7 tabular-nums", suffix ? "pr-14" : undefined)}
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type PercentInputProps = {
  id?: string
  label: string
  value: number
  onChange: (value: number) => void
  hint?: string
  min?: number
  max?: number
}

export function PercentInput({ id, label, value, onChange, hint, min = 0, max = 100 }: PercentInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    if (!focused) setDraft(String(value))
  }, [value, focused])

  const commit = (raw: string) => {
    const n = parseNumeric(raw)
    onChange(Math.min(max, Math.max(min, n)))
  }

  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="relative">
        <Input
          id={inputId}
          inputMode="decimal"
          autoComplete="off"
          value={focused ? draft : String(value)}
          aria-describedby={hint ? hintId : undefined}
          onFocus={(event) => {
            setFocused(true)
            setDraft(String(value))
            event.target.select()
          }}
          onBlur={() => {
            setFocused(false)
            commit(draft)
          }}
          onChange={(event) => {
            setDraft(event.target.value)
            commit(event.target.value)
          }}
          className="h-11 pr-8 tabular-nums"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
          %
        </span>
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type NumberStepperProps = {
  id?: string
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  hint?: string
}

export function NumberStepper({ id, label, value, onChange, min = 0, max = 10, hint }: NumberStepperProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`

  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          id={inputId}
          inputMode="numeric"
          value={value}
          aria-describedby={hint ? hintId : undefined}
          onChange={(event) => {
            const n = Number.parseInt(event.target.value, 10)
            if (Number.isNaN(n)) {
              onChange(min)
              return
            }
            onChange(Math.min(max, Math.max(min, n)))
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault()
              onChange(Math.min(max, value + 1))
            }
            if (event.key === "ArrowDown") {
              event.preventDefault()
              onChange(Math.max(min, value - 1))
            }
          }}
          className="h-11 w-16 text-center tabular-nums"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type ExpenseRowProps = {
  label: string
  value: number
  onChange: (value: number) => void
  hint?: string
  includedLabel?: string
  suggested?: number
  disabled?: boolean
}

export function ExpenseRow({ label, value, onChange, hint, includedLabel, suggested, disabled }: ExpenseRowProps) {
  const isCustom = suggested !== undefined && Math.abs(value - suggested) > 0.5
  const displayHint = includedLabel ?? hint ?? SUGGESTED_STARTING_POINT_HINT

  return (
    <div className="min-w-0 border-b border-border/70 py-3 last:border-b-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <CurrencyInput label={label} value={value} onChange={onChange} disabled={disabled || Boolean(includedLabel)} />
        </div>
        {isCustom && !includedLabel ? (
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-primary">Custom</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{displayHint}</p>
    </div>
  )
}

type SuggestedValueInputProps = ExpenseRowProps & {
  onApplySuggested?: () => void
}

export function SuggestedValueInput({
  label,
  value,
  onChange,
  suggested = 0,
  hint,
  onApplySuggested,
}: SuggestedValueInputProps) {
  const [showEstimate, setShowEstimate] = useState(value > 0)

  return (
    <div className="min-w-0 space-y-2 border-b border-border/70 py-3 last:border-b-0">
      <CurrencyInput label={label} value={value} onChange={onChange} hint={hint} />
      {!showEstimate ? (
        <button
          type="button"
          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => {
            setShowEstimate(true)
            onChange(suggested)
            onApplySuggested?.()
          }}
        >
          {DONT_KNOW_YOUR_NUMBER}
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">{hint ?? SUGGESTED_STARTING_POINT_HINT}</p>
      )}
    </div>
  )
}

type BuyRentToggleProps = {
  value: "buy" | "rent"
  onChange: (value: "buy" | "rent") => void
}

export function BuyRentToggle({ value, onChange }: BuyRentToggleProps) {
  return (
    <div role="radiogroup" aria-label="Buy or rent" className="grid grid-cols-2 gap-2">
      {(["buy", "rent"] as const).map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "h-12 rounded-md border text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-foreground hover:bg-muted",
            )}
          >
            {option === "buy" ? "Buy" : "Rent"}
          </button>
        )
      })}
    </div>
  )
}

export function formatLiveTotal(value: number): string {
  return formatCurrency(value)
}
