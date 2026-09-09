"use client"

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { Minus, Plus, RotateCcw, X } from "lucide-react"

/**
 * NumberField — the numeric input used by the calculators.
 *
 * ## Why this exists
 *
 * Every numeric input on the site was written as:
 *
 *     value={formData.homePrice || ''}
 *     onChange={(e) => handleInputChange('homePrice', Number(e.target.value))}
 *
 * Driving that in a real browser turns up four distinct defects:
 *
 * 1. `value={x || ''}` renders a legitimate 0 as empty, so **0 cannot be entered
 *    at all** — typing "0" leaves the field blank. That matters for HOA dues,
 *    a 0% down VA loan, and any "no, none of this" answer.
 * 2. A field whose value is *derived* (`((down / price) * 100).toFixed(1)`)
 *    re-formats under the caret on every keystroke. Typing "12.5" into the
 *    down-payment percent field produced "1.0" → "1.0" → "1.0" → "1.1".
 *    It was not editable at any speed.
 * 3. `onFocus={e => e.target.select()}` saves the *first* click, but a second
 *    click to place the caret drops the selection, so typing appends:
 *    3000 + "2" became **3000002**. This is the reported "changing 3000 to
 *    2000 is not clean".
 * 4. No thousands separators, so 300000 is hard to read back and verify.
 *
 * Note for anyone re-deriving this: `Number("4.")` does eat the decimal point
 * in isolation, but `<input type="number">` keeps its own bad-input buffer, so
 * typing 4.125 actually worked before. That was not the bug. The four above were.
 *
 * ## The model
 *
 * While the field is focused it owns a **draft string** — the literal characters
 * typed. The parsed number flows up to the caller so results stay live, but the
 * number is never written back into the box mid-edit. On blur the draft is
 * clamped, rounded, committed, and discarded, and the field renders the
 * formatted value again. The caller's state stays a plain `number`, so adopting
 * this is a swap at the JSX layer, not a state refactor.
 *
 * Thousands grouping is applied **at rest only**, never while typing. Live
 * grouping requires re-seating the caret after every reformat, which is the
 * single most fragile part of an input like this; grouping at rest buys the
 * readability without any of that risk.
 */

export type NumberFieldKind = "currency" | "rate" | "percent" | "years" | "count"

type KindSpec = {
  /** Decimal places when formatting at rest. */
  decimals: number
  /** Arrow-key increment. Shift multiplies by 10. */
  step: number
  inputMode: "decimal" | "numeric"
  /** Thousands separators at rest. */
  group: boolean
  prefix?: string
  suffix?: string
}

const KIND_SPECS: Record<NumberFieldKind, KindSpec> = {
  // Money moves in useful chunks — $3,000 → $2,000 is one Shift+Down.
  currency: { decimals: 0, step: 100, inputMode: "decimal", group: true, prefix: "$" },
  // Rate sheets are priced in eighths, so that is what an arrow key should move.
  rate: { decimals: 3, step: 0.125, inputMode: "decimal", group: false, suffix: "%" },
  percent: { decimals: 1, step: 0.5, inputMode: "decimal", group: false, suffix: "%" },
  years: { decimals: 0, step: 1, inputMode: "numeric", group: false },
  count: { decimals: 0, step: 10, inputMode: "numeric", group: true },
}

export type NumberFieldProps = {
  id: string
  label: string
  value: number
  /** Called only with a finite number. An incomplete draft emits nothing. */
  onChange: (next: number) => void
  kind?: NumberFieldKind
  min?: number
  max?: number
  /** Override the kind's arrow-key increment. */
  step?: number
  /** Helper text under the field. */
  hint?: string
  /**
   * The value this field starts at when the calculator loads. When the current
   * value differs, the field is marked as yours and offers a one-click revert —
   * so a site-supplied estimate never looks like something you entered.
   */
  defaultValue?: number
  /** Label suffix shown while the value still equals `defaultValue`. */
  defaultBadge?: string
  disabled?: boolean
  className?: string
}

/** Strip everything that cannot appear in a decimal, keeping one dot and a leading minus. */
function sanitize(raw: string, allowNegative: boolean): string {
  let out = raw.replace(/[^0-9.\-]/g, "")
  const negative = allowNegative && out.startsWith("-")
  out = out.replace(/-/g, "")
  const firstDot = out.indexOf(".")
  if (firstDot !== -1) {
    out = out.slice(0, firstDot + 1) + out.slice(firstDot + 1).replace(/\./g, "")
  }
  return negative ? `-${out}` : out
}

function format(value: number, spec: KindSpec): string {
  if (!Number.isFinite(value)) return ""
  const fixed = spec.decimals > 0 ? trimTrailingZeros(value.toFixed(spec.decimals)) : String(Math.round(value))
  if (!spec.group) return fixed
  const [whole, fraction] = fixed.split(".")
  const grouped = (whole ?? "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return fraction ? `${grouped}.${fraction}` : grouped
}

/** 6.125 not 6.125000, but 6.5 not 6.5 → 6.500. */
function trimTrailingZeros(fixed: string): string {
  return fixed.includes(".") ? fixed.replace(/0+$/, "").replace(/\.$/, "") : fixed
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function clamp(value: number, min?: number, max?: number): number {
  let out = value
  if (typeof min === "number") out = Math.max(min, out)
  if (typeof max === "number") out = Math.min(max, out)
  return out
}

/**
 * Snap to the step grid rather than adding to an off-grid value, so nudging
 * 6.13% up lands on 6.25% instead of 6.255%.
 */
function nudge(value: number, step: number, direction: 1 | -1, decimals: number): number {
  const scaled = value / step
  const next =
    direction === 1
      ? (Math.floor(scaled + 1e-9) + 1) * step
      : (Math.ceil(scaled - 1e-9) - 1) * step
  return roundTo(next, decimals)
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  kind = "currency",
  min,
  max,
  step,
  hint,
  defaultValue,
  defaultBadge = "Est.",
  disabled = false,
  className = "",
}: NumberFieldProps) {
  const spec = KIND_SPECS[kind]
  const increment = step ?? spec.step
  const allowNegative = typeof min === "number" && min < 0

  const [draft, setDraft] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Escape blurs the field, and blur runs before the setDraft(null) has flushed —
  // without this the abandoned draft would be committed on the way out.
  const abandonRef = useRef(false)
  // Keystrokes push a live number up so the results panel tracks typing, which
  // means the caller's value has already moved by the time Escape is pressed.
  // Remember what it was when editing began so Escape can genuinely revert.
  const valueAtFocusRef = useRef(value)
  // Selecting inside onFocus does not survive: setDraft rewrites the DOM value
  // ("3,000" -> "3000") on the next render and drops the selection. Deferring with
  // requestAnimationFrame is worse — it can land AFTER the first keystroke and
  // re-select, so the second character replaces the first. Select exactly once,
  // synchronously, in the layout effect that follows the draft being installed.
  const selectOnDraftRef = useRef(false)
  const generatedId = useId()
  const hintId = `${id || generatedId}-hint`
  const statusId = `${id || generatedId}-status`

  // Announced only when a commit changes the value (a clamp), so a screen reader
  // is not narrating every keystroke.
  const [status, setStatus] = useState("")
  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(""), 4000)
    return () => clearTimeout(timer)
  }, [status])

  useLayoutEffect(() => {
    if (selectOnDraftRef.current && draft !== null) {
      selectOnDraftRef.current = false
      inputRef.current?.select()
    }
  }, [draft])

  const isEditing = draft !== null
  const display = isEditing ? draft : format(value, spec)
  const isDefault = typeof defaultValue === "number" && value === defaultValue
  const canReset = typeof defaultValue === "number" && value !== defaultValue

  const commit = useCallback(
    (rawDraft: string) => {
      const parsed = Number.parseFloat(rawDraft)
      if (!Number.isFinite(parsed)) {
        // Empty or a lone "." — keep the last good value rather than leaving the
        // field holding nothing. The caller's number is never made NaN.
        setDraft(null)
        return
      }
      const settled = roundTo(clamp(parsed, min, max), spec.decimals)
      if (settled !== parsed) {
        setStatus(`Adjusted to ${format(settled, spec)}`)
      }
      setDraft(null)
      if (settled !== value) onChange(settled)
    },
    [max, min, onChange, spec, value],
  )

  const applyNudge = useCallback(
    (direction: 1 | -1, multiplier: number) => {
      const base = isEditing ? Number.parseFloat(draft ?? "") : value
      const from = Number.isFinite(base) ? base : value
      const next = clamp(nudge(from, increment * multiplier, direction, spec.decimals), min, max)
      setDraft(null)
      if (next !== value) onChange(next)
    },
    [draft, increment, isEditing, max, min, onChange, spec.decimals, value],
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault() // otherwise the page scrolls
      applyNudge(event.key === "ArrowUp" ? 1 : -1, event.shiftKey ? 10 : 1)
      return
    }
    if (event.key === "Enter" && draft !== null) {
      commit(draft)
      return
    }
    if (event.key === "Escape" && draft !== null) {
      abandonRef.current = true // abandon the edit and restore the pre-edit value
      setDraft(null)
      if (valueAtFocusRef.current !== value) onChange(valueAtFocusRef.current)
      inputRef.current?.blur()
    }
  }

  const stepLabel =
    kind === "currency" || kind === "count"
      ? format(increment, spec)
      : `${trimTrailingZeros(increment.toFixed(spec.decimals))}${spec.suffix ?? ""}`

  return (
    <div className={className}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {isDefault ? (
            <span className="ml-2 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-normal text-foreground/55">
              {defaultBadge}
            </span>
          ) : null}
        </label>
        {canReset ? (
          <button
            type="button"
            onClick={() => {
              setDraft(null)
              onChange(defaultValue as number)
            }}
            className="inline-flex items-center gap-1 rounded text-xs font-medium text-foreground/60 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
            <span className="sr-only">
              {label} to the default, {format(defaultValue as number, spec)}
            </span>
          </button>
        ) : null}
      </div>

      <div
        className={`flex items-stretch rounded-lg border bg-card/60 transition-colors motion-reduce:transition-none ${
          disabled ? "opacity-60" : ""
        } border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-ring`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled || (typeof min === "number" && value <= min)}
          onClick={() => applyNudge(-1, 1)}
          className="flex w-11 shrink-0 items-center justify-center rounded-l-lg text-foreground/60 transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="relative flex flex-1 items-center">
          {spec.prefix ? (
            <span aria-hidden="true" className="pl-1 text-foreground/60">
              {spec.prefix}
            </span>
          ) : null}
          <input
            ref={inputRef}
            id={id}
            // Deliberately text, not number: type="number" silently rejects values
            // it dislikes (reading .value as "") and its spinner steps by 1, which
            // is useless on a home price and wrong on a rate.
            type="text"
            inputMode={spec.inputMode}
            autoComplete="off"
            enterKeyHint="done"
            disabled={disabled}
            value={display}
            aria-describedby={`${hint ? `${hintId} ` : ""}${id || generatedId}-keys ${statusId}`}
            onFocus={() => {
              valueAtFocusRef.current = value
              // Select on entry so a single click and type replaces the value.
              // A later click inside the field places the caret as normal — the
              // clear button is the escape hatch for "start over".
              selectOnDraftRef.current = true
              setDraft(format(value, spec).replace(/,/g, ""))
            }}
            onChange={(event) => {
              const next = sanitize(event.target.value, allowNegative)
              setDraft(next)
              const parsed = Number.parseFloat(next)
              // Push a live number so results track typing, but never push NaN.
              if (Number.isFinite(parsed)) onChange(roundTo(parsed, spec.decimals))
            }}
            onBlur={() => {
              if (abandonRef.current) {
                abandonRef.current = false
                setDraft(null)
                return
              }
              if (draft !== null) commit(draft)
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent px-2 py-3 text-base text-foreground outline-none placeholder:text-foreground/35"
          />
          {spec.suffix ? (
            <span aria-hidden="true" className="pr-1 text-foreground/60">
              {spec.suffix}
            </span>
          ) : null}
          {isEditing && display.length > 0 ? (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()} // keep focus so the caret stays put
              onClick={() => {
                setDraft("")
                inputRef.current?.focus()
              }}
              className="mr-1 shrink-0 rounded-full p-1.5 text-foreground/45 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Clear {label}</span>
            </button>
          ) : null}
        </div>

        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled || (typeof max === "number" && value >= max)}
          onClick={() => applyNudge(1, 1)}
          className="flex w-11 shrink-0 items-center justify-center rounded-r-lg text-foreground/60 transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-foreground/55">
          {hint}
        </p>
      ) : null}
      {/*
        Shown only while the field is focused. Repeating a keyboard hint under all
        ten inputs turned the form into noise; it is still in the DOM at all times
        and referenced by aria-describedby, so assistive tech never loses it.
      */}
      <p
        className={`mt-1 text-[11px] text-foreground/40 ${isEditing ? "" : "sr-only"}`}
        id={`${id || generatedId}-keys`}
      >
        <span className="sr-only">Keyboard: </span>
        <kbd className="font-sans">↑↓</kbd> {stepLabel}
        <span aria-hidden="true"> · </span>
        <kbd className="font-sans">⇧↑↓</kbd> {kind === "currency" || kind === "count" ? format(increment * 10, spec) : `${trimTrailingZeros((increment * 10).toFixed(spec.decimals))}${spec.suffix ?? ""}`}
      </p>
      {/*
        The steppers are aria-hidden and out of the tab order on purpose: a
        keyboard user already has ArrowUp/ArrowDown on the input itself, which is
        announced above. Exposing both would put two redundant stops in the tab
        order for every one of ~161 fields.
      */}
      <span id={statusId} role="status" aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  )
}
