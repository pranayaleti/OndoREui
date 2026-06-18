"use client"

/**
 * Owner: Self-Manage vs Ondo RE Calculator
 *
 * High-intent lead-gen tool. Visitors enter their rent + cost assumptions and
 * see a side-by-side annual net comparison: doing it themselves vs handing it
 * to Ondo. The "hidden cost of your time" is the conversion lever — most
 * landlords undervalue their own hours by 5–10x.
 *
 * Output: annual net income under each path, hours saved per year, and a
 * recommendation. Followed by a soft CTA to book a call.
 *
 * NOTE(i18n): user-facing copy is English-only. This client component can be
 * wired to react-i18next later — kept simple here to keep the conversion path
 * fast.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calculator as CalcIcon, Info, Clock, DollarSign } from "lucide-react"

interface Inputs {
  monthlyRent: number
  vacancyPct: number
  propertyTax: number      // annual $
  insurance: number        // annual $
  repairsPct: number       // % of gross rent
  otherExpenses: number    // annual $
  managementFeePct: number // Ondo fee, % of collected rent
  leasingFeePctRent: number // Ondo leasing fee, % of one month's rent (annualized)
  selfHoursPerMonth: number
  hourlyTimeValue: number
}

interface Results {
  grossRent: number
  vacancyLoss: number
  effectiveRent: number
  fixedExpenses: number
  repairsCost: number
  ondoMgmtFee: number
  ondoLeasingFee: number
  selfNet: number
  selfNetIncludingTime: number
  ondoNet: number
  annualHoursSaved: number
  timeValueSaved: number
  ondoAdvantage: number
}

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

const fmtUSDSigned = (n: number) =>
  `${n >= 0 ? "+" : "-"}${fmtUSD(Math.abs(n))}`

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  prefix,
  suffix,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  step?: number
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground/90">{label}</span>
      {hint && <span className="block text-xs text-foreground/50 mt-0.5">{hint}</span>}
      <div className="mt-1.5 relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-foreground/50 pointer-events-none">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value)
            onChange(Number.isNaN(parsed) ? 0 : parsed)
          }}
          className={`w-full rounded-md border border-border bg-background py-2.5 ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-12" : "pr-3"} text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-foreground/50 pointer-events-none">{suffix}</span>
        )}
      </div>
    </label>
  )
}

const DEFAULTS: Inputs = {
  monthlyRent: 2200,
  vacancyPct: 5,
  propertyTax: 3200,
  insurance: 1100,
  repairsPct: 8,
  otherExpenses: 600,
  managementFeePct: 8,
  leasingFeePctRent: 50, // 50% of one month's rent annualized over 24-month avg tenant stay
  selfHoursPerMonth: 6,
  hourlyTimeValue: 50,
}

const OwnerVsSelfCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS)
  const [showAssumptions, setShowAssumptions] = useState(false)

  const set = useCallback(<K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setInputs((prev) => ({ ...prev, [k]: v }))
  }, [])

  const results: Results = useMemo(() => {
    const grossRent = inputs.monthlyRent * 12
    const vacancyLoss = grossRent * (inputs.vacancyPct / 100)
    const effectiveRent = grossRent - vacancyLoss
    const fixedExpenses = inputs.propertyTax + inputs.insurance + inputs.otherExpenses
    const repairsCost = effectiveRent * (inputs.repairsPct / 100)

    // Ondo management fee = % of collected (effective) rent
    const ondoMgmtFee = effectiveRent * (inputs.managementFeePct / 100)
    // Leasing fee amortized: assume 24-month avg tenancy → annual = (one month rent × pct%) / 2
    const ondoLeasingFee = (inputs.monthlyRent * (inputs.leasingFeePctRent / 100)) / 2

    const baseNet = effectiveRent - fixedExpenses - repairsCost
    const selfNet = baseNet
    const ondoNet = baseNet - ondoMgmtFee - ondoLeasingFee

    const annualHoursSaved = inputs.selfHoursPerMonth * 12
    const timeValueSaved = annualHoursSaved * inputs.hourlyTimeValue
    const selfNetIncludingTime = selfNet - timeValueSaved

    // Ondo "advantage" = how much more (or less) you keep with Ondo when
    // counting your time as a real cost.
    const ondoAdvantage = ondoNet - selfNetIncludingTime

    return {
      grossRent,
      vacancyLoss,
      effectiveRent,
      fixedExpenses,
      repairsCost,
      ondoMgmtFee,
      ondoLeasingFee,
      selfNet,
      selfNetIncludingTime,
      ondoNet,
      annualHoursSaved,
      timeValueSaved,
      ondoAdvantage,
    }
  }, [inputs])

  // Analytics: fire once when the user makes their first edit (engagement signal).
  const [engaged, setEngaged] = useState(false)
  useEffect(() => {
    if (engaged) return
    const isDefault = (Object.keys(DEFAULTS) as Array<keyof Inputs>).every(
      (k) => inputs[k] === DEFAULTS[k]
    )
    if (!isDefault) {
      setEngaged(true)
      // Best-effort GA event without coupling to the analytics module's typing.
      if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        ;(window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
          "event",
          "use_calculator",
          { event_category: "calculator_interaction", event_label: "owner_vs_self" }
        )
      }
    }
  }, [inputs, engaged])

  const ondoWins = results.ondoAdvantage >= 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All calculators
        </Link>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary mb-3">
            <CalcIcon className="h-3.5 w-3.5" aria-hidden="true" />
            For Utah Property Owners
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Self-Manage vs Ondo RE: What's actually more profitable?
          </h1>
          <p className="mt-3 text-foreground/70 max-w-2xl">
            Enter your rental's real numbers. We'll show side-by-side annual net income — and the
            hidden cost most landlords forget: the value of their own time.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Inputs */}
          <section className="lg:col-span-2 space-y-5" aria-label="Calculator inputs">
            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
                Income & expenses
              </h2>
              <div className="space-y-4">
                <NumberField label="Monthly rent" value={inputs.monthlyRent} onChange={(v) => set("monthlyRent", v)} prefix="$" />
                <NumberField label="Vacancy" value={inputs.vacancyPct} onChange={(v) => set("vacancyPct", v)} suffix="%" hint="Utah average is ~5%." />
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="Annual property tax" value={inputs.propertyTax} onChange={(v) => set("propertyTax", v)} prefix="$" />
                  <NumberField label="Annual insurance" value={inputs.insurance} onChange={(v) => set("insurance", v)} prefix="$" />
                </div>
                <NumberField label="Repairs / maintenance" value={inputs.repairsPct} onChange={(v) => set("repairsPct", v)} suffix="%" hint="Industry rule of thumb: 8–10% of gross rent." />
                <NumberField label="Other annual expenses" value={inputs.otherExpenses} onChange={(v) => set("otherExpenses", v)} prefix="$" hint="HOA, landscaping, pest, etc." />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                Your time
              </h2>
              <div className="space-y-4">
                <NumberField
                  label="Hours/month on this rental"
                  value={inputs.selfHoursPerMonth}
                  onChange={(v) => set("selfHoursPerMonth", v)}
                  hint="Tenant calls, maintenance dispatch, bookkeeping, rent chasing."
                />
                <NumberField
                  label="Your hourly time value"
                  value={inputs.hourlyTimeValue}
                  onChange={(v) => set("hourlyTimeValue", v)}
                  prefix="$"
                  hint="What an hour of your time is worth at your day job or business."
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAssumptions((s) => !s)}
              className="text-xs text-foreground/60 hover:text-foreground inline-flex items-center gap-1"
              aria-expanded={showAssumptions}
            >
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              {showAssumptions ? "Hide" : "Show"} Ondo fee assumptions
            </button>
            {showAssumptions && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                <NumberField
                  label="Ondo management fee"
                  value={inputs.managementFeePct}
                  onChange={(v) => set("managementFeePct", v)}
                  suffix="%"
                  hint="% of collected rent. Editable — contact us for your exact quote."
                />
                <NumberField
                  label="Leasing fee"
                  value={inputs.leasingFeePctRent}
                  onChange={(v) => set("leasingFeePctRent", v)}
                  suffix="% of rent"
                  hint="One-time per placement; amortized over a 24-month average tenancy."
                />
              </div>
            )}
          </section>

          {/* Results */}
          <section className="lg:col-span-3 space-y-5" aria-label="Comparison results" aria-live="polite">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Self-manage column */}
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-1">Self-manage</h3>
                <p className="text-3xl font-extrabold text-foreground mt-1">{fmtUSD(results.selfNet)}</p>
                <p className="text-xs text-foreground/50">Annual net (before counting your time)</p>
                <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
                  <Row label="Gross rent" value={fmtUSD(results.grossRent)} />
                  <Row label="– Vacancy" value={`-${fmtUSD(results.vacancyLoss)}`} />
                  <Row label="– Tax + insurance + other" value={`-${fmtUSD(results.fixedExpenses)}`} />
                  <Row label="– Repairs" value={`-${fmtUSD(results.repairsCost)}`} />
                  <div className="pt-2 mt-2 border-t border-dashed border-border">
                    <Row
                      label={`Your time (${results.annualHoursSaved} hrs/yr)`}
                      value={`-${fmtUSD(results.timeValueSaved)}`}
                      muted
                    />
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-muted/40 p-3">
                  <p className="text-xs text-foreground/60">Net after counting your time</p>
                  <p className="text-xl font-bold text-foreground">{fmtUSD(results.selfNetIncludingTime)}</p>
                </div>
              </div>

              {/* Ondo column */}
              <div className={`rounded-lg p-5 ${ondoWins ? "border-2 border-primary bg-primary/5" : "border border-border bg-card"}`}>
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide mb-1 flex items-center gap-2">
                  Ondo manages
                  {ondoWins && (
                    <span className="rounded-full bg-primary text-primary-foreground text-[10px] px-2 py-0.5 font-bold">
                      Recommended
                    </span>
                  )}
                </h3>
                <p className="text-3xl font-extrabold text-primary mt-1">{fmtUSD(results.ondoNet)}</p>
                <p className="text-xs text-foreground/50">Annual net (your time = $0)</p>
                <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
                  <Row label="Gross rent" value={fmtUSD(results.grossRent)} />
                  <Row label="– Vacancy" value={`-${fmtUSD(results.vacancyLoss)}`} />
                  <Row label="– Tax + insurance + other" value={`-${fmtUSD(results.fixedExpenses)}`} />
                  <Row label="– Repairs" value={`-${fmtUSD(results.repairsCost)}`} />
                  <Row label={`– Ondo mgmt (${inputs.managementFeePct}%)`} value={`-${fmtUSD(results.ondoMgmtFee)}`} />
                  <Row label="– Leasing fee (amortized)" value={`-${fmtUSD(results.ondoLeasingFee)}`} />
                  <div className="pt-2 mt-2 border-t border-dashed border-border">
                    <Row label="Your time" value="$0" muted />
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-primary/10 p-3">
                  <p className="text-xs text-foreground/60">Net</p>
                  <p className="text-xl font-bold text-foreground">{fmtUSD(results.ondoNet)}</p>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className={`rounded-lg p-5 ${ondoWins ? "bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30" : "bg-card border border-border"}`}>
              <p className="text-xs uppercase tracking-wide text-foreground/50 font-semibold">When you count your time</p>
              <p className={`mt-1 text-2xl md:text-3xl font-extrabold ${ondoWins ? "text-primary" : "text-foreground"}`}>
                {ondoWins ? "Ondo nets you " : "Self-managing nets you "}
                {fmtUSDSigned(Math.abs(results.ondoAdvantage))}
                {" more / year"}
              </p>
              <p className="mt-2 text-sm text-foreground/70">
                You'd get back <strong>{results.annualHoursSaved} hours/year</strong>{" "}
                ({results.annualHoursSaved >= 40 ? "≈ a full work-week" : "of weekends and evenings"}) —
                worth about {fmtUSD(results.timeValueSaved)} at your hourly rate.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact?source=owner-vs-self-calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get a personalized quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/property-management"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  See what's included
                </Link>
              </div>
            </div>

            <p className="text-xs text-foreground/50 leading-relaxed">
              Estimates only. Actual results depend on tenant quality, property condition, market rent at lease-up,
              and applicable Utah landlord-tenant law. Repair % uses the industry rule of thumb; your property may vary.
              Ondo fees shown are illustrative — request a quote for your exact pricing.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? "text-foreground/50" : "text-foreground/80"}`}>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export default OwnerVsSelfCalculator
