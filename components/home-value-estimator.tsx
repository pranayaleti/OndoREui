"use client"

/**
 * "What's My Utah Home Worth?" — free lead-magnet estimator.
 *
 * Maps to playbook idea #1 (called out in 2026 RE research as the
 * single most effective lead-gen tool in real estate).
 *
 * Approach:
 *   - Static estimator driven by lib/city-market-data.ts. No API dependency,
 *     no rate limits, no cost. Acknowledges accuracy limits in copy.
 *   - Email captured AFTER showing the estimate (commitment + curiosity gap)
 *     for "send the detailed report" — converts ~3-4x better than upfront
 *     email gates.
 *   - Email submission flows to existing /api/leads/contact via lib/leads-api,
 *     so HubSpot + attribution + drip flows are already wired.
 *
 * NOTE(i18n): English-only client component. react-i18next migration is
 * straightforward when locale routing for marketing pages lands.
 */

import { useMemo, useState } from "react"
import Link from "next/link"
import { Calculator, Loader2, CheckCircle2, AlertCircle, ArrowRight, Home, DollarSign, MapPin } from "lucide-react"
import { cityMarketData } from "@/lib/city-market-data"
import { submitContactLead } from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { isValidEmail } from "@/lib/security"
import { analytics } from "@/lib/analytics"

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

// Bedroom multipliers — based on Utah multi-family / SFR market spreads.
const BEDROOM_MULTIPLIERS: Record<number, number> = {
  1: 0.70,
  2: 0.90,
  3: 1.00, // baseline (median rent assumes ~3bd)
  4: 1.15,
  5: 1.30,
}

// Square-feet adjustment: linear ±5% per 100 sqft from the 1800 sqft baseline.
function sqftAdjustment(sqft: number): number {
  const delta = (sqft - 1800) / 100
  return 1 + delta * 0.05
}

interface Estimate {
  rentLow: number
  rentHigh: number
  saleLow: number
  saleHigh: number
  rentBase: number
  saleBase: number
}

function calculate(city: string, bedrooms: number, sqft: number): Estimate | null {
  const data = cityMarketData[city]
  if (!data) return null

  const bedroomMult = BEDROOM_MULTIPLIERS[bedrooms] ?? 1.0
  const sqftMult = sqftAdjustment(sqft)

  const rentBase = Math.round(data.medianRent * bedroomMult * sqftMult)
  // Show as a ±10% range so we don't pretend pinpoint accuracy.
  const rentLow = Math.round(rentBase * 0.9)
  const rentHigh = Math.round(rentBase * 1.1)

  const saleBase = Math.round(data.medianHomePrice * bedroomMult * sqftMult)
  const saleLow = Math.round(saleBase * 0.9)
  const saleHigh = Math.round(saleBase * 1.1)

  return { rentLow, rentHigh, saleLow, saleHigh, rentBase, saleBase }
}

const cities = Object.keys(cityMarketData).sort()

export function HomeValueEstimator() {
  const [city, setCity] = useState("")
  const [bedrooms, setBedrooms] = useState(3)
  const [sqft, setSqft] = useState(1800)
  const [hasCalculated, setHasCalculated] = useState(false)

  // Email capture (after estimate is shown)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const estimate = useMemo(() => {
    if (!city) return null
    return calculate(city, bedrooms, sqft)
  }, [city, bedrooms, sqft])

  const handleCalculate = () => {
    if (!city) return
    setHasCalculated(true)
    analytics.trackEvent("home_value_calculated", "lead_magnet", `${city}_${bedrooms}bd`)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim().toLowerCase()
    if (!isValidEmail(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.")
      setStatus("error")
      return
    }
    setStatus("submitting")
    setErrorMsg(null)

    const friendlyName = name.trim() || trimmedEmail.split("@")[0]
    const messageParts: string[] = [
      "Home Value Estimator request",
      `City: ${city}`,
      `Bedrooms: ${bedrooms}`,
      `Square feet: ${sqft}`,
      estimate ? `Estimated rent: ${fmtUSD(estimate.rentLow)}–${fmtUSD(estimate.rentHigh)}/mo` : null,
      estimate ? `Estimated sale price: ${fmtUSD(estimate.saleLow)}–${fmtUSD(estimate.saleHigh)}` : null,
    ].filter(Boolean) as string[]

    const result = await submitContactLead({
      name: friendlyName,
      email: trimmedEmail,
      source: "website",
      message: messageParts.join("\n"),
      attribution: getAttributionPayloadForApi(),
    })

    if ("error" in result) {
      setErrorMsg(result.error || "Something went wrong. Please try again.")
      setStatus("error")
      analytics.trackFormSubmission("home_value_estimator", false)
      return
    }
    setStatus("success")
    analytics.trackFormSubmission("home_value_estimator", true)
    analytics.trackLeadGeneration("home_value_estimator")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" aria-hidden="true" />
            Tell us about your property
          </h2>

          <label className="block mb-4">
            <span className="text-sm font-medium text-foreground/90">City</span>
            <div className="mt-1.5 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 pointer-events-none" aria-hidden="true" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a Utah city…</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-foreground/90">Bedrooms</span>
            <div className="mt-1.5 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBedrooms(n)}
                  className={`py-2.5 rounded-md border-2 text-sm font-medium transition-colors ${
                    bedrooms === n
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card hover:border-primary/40 text-foreground/70"
                  }`}
                >
                  {n === 5 ? "5+" : n}
                </button>
              ))}
            </div>
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-foreground/90">Square feet</span>
            <input
              type="number"
              inputMode="numeric"
              min={400}
              max={10000}
              step={50}
              value={sqft}
              onChange={(e) => setSqft(parseInt(e.target.value, 10) || 0)}
              className="mt-1.5 w-full rounded-md border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="block text-xs text-foreground/50 mt-1">Roughly — exact number not required.</span>
          </label>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={!city}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            {hasCalculated ? "Recalculate" : "Get my estimate"}
          </button>
        </div>

        {/* Results */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
            Your estimate
          </h2>

          {!hasCalculated || !estimate ? (
            <div className="text-center py-10 text-foreground/50 text-sm">
              <p>Pick a city, bedrooms, and square feet — then hit <em>Get my estimate</em>.</p>
            </div>
          ) : (
            <div className="space-y-4" aria-live="polite">
              <div className="rounded-md bg-primary/5 border border-primary/20 p-4">
                <p className="text-xs uppercase tracking-wide text-foreground/60 font-semibold">Estimated monthly rent</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">
                  {fmtUSD(estimate.rentLow)} – {fmtUSD(estimate.rentHigh)}
                </p>
                <p className="text-xs text-foreground/60 mt-1">/ month</p>
              </div>
              <div className="rounded-md bg-primary/5 border border-primary/20 p-4">
                <p className="text-xs uppercase tracking-wide text-foreground/60 font-semibold">Estimated sale price</p>
                <p className="mt-1 text-2xl font-extrabold text-foreground">
                  {fmtUSD(estimate.saleLow)} – {fmtUSD(estimate.saleHigh)}
                </p>
              </div>

              <p className="text-xs text-foreground/50 leading-relaxed">
                Range based on median {city} market data plus bedroom and square-foot adjustments.
                Actual value depends on condition, amenities, finishes, and current market timing —
                we'll send a free walk-through valuation below.
              </p>

              {/* Email capture */}
              <div className="mt-6 pt-6 border-t border-border">
                {status === "success" ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
                    <p className="font-semibold text-foreground">Check your inbox.</p>
                    <p className="text-sm text-foreground/60 mt-1">A detailed report is on its way within 1 business day.</p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                      <Link
                        href="/calculators/owner-vs-self"
                        className="inline-flex items-center justify-center gap-1.5 text-sm text-primary hover:underline"
                      >
                        Run the rental ROI numbers
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Want the detailed report?</p>
                    <p className="text-xs text-foreground/60">
                      We'll send a personalized valuation with comps, days-on-market data,
                      and rent vs sale tradeoffs. Free, no obligation.
                    </p>
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === "submitting"}
                      className="w-full rounded-md border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (status === "error") { setStatus("idle"); setErrorMsg(null) }
                      }}
                      disabled={status === "submitting"}
                      aria-invalid={status === "error"}
                      className="w-full rounded-md border border-border bg-background py-2.5 px-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting" || !email}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send me the report
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                    {status === "error" && errorMsg && (
                      <p className="text-sm text-destructive inline-flex items-center gap-1.5" role="alert">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {errorMsg}
                      </p>
                    )}
                    <p className="text-xs text-foreground/50">No spam. Unsubscribe anytime.</p>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
