"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import {
  DEFAULT_EXAMPLE_MONTHLY_RENT,
  FEE_COMPARISON_AS_OF,
  GROWTH_MGMT_RATE,
  RENT_SLIDER_MAX,
  RENT_SLIDER_MIN,
  RENT_SLIDER_STEP,
  buildFeeSnapshot,
  flatFeeCrossoverRent,
  formatUsd0,
  typicalUtahPmRangeLabel,
} from "@/lib/fee-comparison"

function unitsForMode(mode: "starter" | "growth"): number {
  switch (mode) {
    case "starter":
      return 1
    case "growth":
      return 5
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}

export function FeeAlignmentWidget() {
  const rentId = useId()
  const timeId = useId()
  const bandGroupName = useId()
  const [rent, setRent] = useState(DEFAULT_EXAMPLE_MONTHLY_RENT)
  const [mode, setMode] = useState<"starter" | "growth">("starter")
  const [showTime, setShowTime] = useState(false)

  const units = unitsForMode(mode)
  const snap = buildFeeSnapshot(rent, units)
  const crossover = formatUsd0(flatFeeCrossoverRent(GROWTH_MGMT_RATE))

  return (
    <section
      className="border-y border-border/40 bg-background py-16 md:py-20"
      aria-labelledby="fee-alignment-heading"
    >
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Aligned with collected rent
          </p>
          <h2
            id="fee-alignment-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Fees that wait for the rent
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Ondo bills a percentage of rent that actually hits the account.
            Dollars below are <strong className="font-semibold text-foreground">per unit</strong>
            — door count only picks Starter 10% (1–4) or Growth 8% (5–15).
            Leasing stays on its own one-time line.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card md:grid md:grid-cols-[auto_1fr]">
          <div
            className="hidden w-2 bg-gradient-to-b from-orange-500 to-red-800 md:block"
            aria-hidden="true"
          />
          <div className="grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-8">
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-end justify-between gap-4">
                  <Label htmlFor={rentId} className="text-sm font-medium text-foreground">
                    Monthly rent per unit
                  </Label>
                  <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                    {formatUsd0(rent)}
                  </span>
                </div>
                <input
                  id={rentId}
                  type="range"
                  min={RENT_SLIDER_MIN}
                  max={RENT_SLIDER_MAX}
                  step={RENT_SLIDER_STEP}
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  aria-valuetext={formatUsd0(rent)}
                  className="w-full accent-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-foreground/50">
                  <span>{formatUsd0(RENT_SLIDER_MIN)}</span>
                  <span>{formatUsd0(RENT_SLIDER_MAX)}</span>
                </div>
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-foreground">
                  Published rate (does not multiply the ledger)
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className={`flex ${STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS} cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5`}>
                    <input
                      type="radio"
                      name={bandGroupName}
                      value="starter"
                      checked={mode === "starter"}
                      onChange={() => setMode("starter")}
                      className="accent-primary"
                    />
                    1–4 doors · Starter 10%
                  </label>
                  <label className={`flex ${STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS} cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5`}>
                    <input
                      type="radio"
                      name={bandGroupName}
                      value="growth"
                      checked={mode === "growth"}
                      onChange={() => setMode("growth")}
                      className="accent-primary"
                    />
                    5–15 doors · Growth 8%
                  </label>
                </div>
                <p className="mt-2 text-xs text-foreground/50">
                  16+ units is a custom Portfolio quote — not illustrated here.
                </p>
              </fieldset>

              <div className="flex items-center gap-3">
                <Switch
                  id={timeId}
                  checked={showTime}
                  onCheckedChange={setShowTime}
                  aria-label="Price my time too"
                />
                <Label htmlFor={timeId} className="cursor-pointer text-sm font-medium text-foreground">
                  Price my time too
                </Label>
              </div>
              {showTime && (
                <p className="text-sm text-foreground/70">
                  This ledger stays on fees. Hours, hourly rate, vacancy, and
                  repairs live on the full calculator —{" "}
                  <Link
                    href="/calculators/owner-vs-self"
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    self-manage vs Ondo
                  </Link>
                  .
                </p>
              )}
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/60">
                Per-unit ledger
              </p>
              <dl
                className="divide-y divide-border rounded-lg border border-border"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-foreground/70">Ondo per unit this month</dt>
                  <dd className="font-mono text-xl font-semibold tabular-nums text-foreground">
                    {formatUsd0(snap.ondoMonthlyFee)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-foreground/70">{typicalUtahPmRangeLabel()}</dt>
                  <dd className="font-mono text-sm tabular-nums text-foreground/80">
                    {`${formatUsd0(snap.typicalPmLow)}–${formatUsd0(snap.typicalPmHigh)}`}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-foreground/70">One-time leasing per new placement</dt>
                  <dd className="font-mono text-sm tabular-nums text-foreground/80">
                    {formatUsd0(snap.oneTimeLeasingFee)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-foreground/50">
                Illustrative, not a quote. Figures are per unit. Management is a
                percentage of collected rent; leasing is billed only when we place
                a new tenant. Some Utah shops advertise a flat ~$159/mo as of{" "}
                {FEE_COMPARISON_AS_OF} regardless of rent; at 8% that crosses
                around {crossover}. Verify current pricing with any provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
