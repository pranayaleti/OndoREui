"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import { Button } from "@/components/ui/button"
import { cityMarketData } from "@/lib/city-market-data"
import { BASELINE_SQFT, ESTIMATE_DATA_DISCLOSURE, estimateHomeValue } from "@/lib/home-value-estimate"
import { formatUsd0 } from "@/lib/fee-comparison"

const cities = Object.keys(cityMarketData).sort()

export function RentSnapshotSection() {
  const [city, setCity] = useState("")
  const [bedrooms, setBedrooms] = useState(3)
  const [revealed, setRevealed] = useState(false)

  const estimate = useMemo(() => {
    if (!city) return null
    return estimateHomeValue(city, bedrooms, BASELINE_SQFT)
  }, [city, bedrooms])

  const handleReveal = () => {
    if (!city || !estimate) return
    setRevealed(true)
  }

  const prefill =
    revealed && estimate
      ? `Homepage rent snapshot — ${city}, ${bedrooms} bed. Estimated rent ${formatUsd0(estimate.rentLow)}–${formatUsd0(estimate.rentHigh)}/mo.`
      : ""

  return (
    <section
      className="bg-muted/30 py-16 md:py-20"
      aria-labelledby="rent-snapshot-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Number first, name second
          </p>
          <h2
            id="rent-snapshot-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            See a rent range before you leave a name
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            City and bedrooms in, a median-based rent range out. Contact is
            optional and only shows after the number — one form, tagged as an
            owner inquiry.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="block">
              <span className="text-sm font-medium text-foreground">City</span>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  setRevealed(false)
                }}
                className="mt-1.5 w-full rounded-md border border-border bg-background py-2.5 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a Utah city…</option>
                {cities.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="mt-4">
              <legend className="text-sm font-medium text-foreground">Bedrooms</legend>
              <div className="mt-1.5 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <label
                    key={n}
                    className={`flex cursor-pointer items-center justify-center rounded-md border-2 py-2.5 text-sm font-medium transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:text-primary ${
                      bedrooms === n
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-foreground/70 hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rent-snapshot-bedrooms"
                      value={n}
                      checked={bedrooms === n}
                      onChange={() => {
                        setBedrooms(n)
                        setRevealed(false)
                      }}
                      className="sr-only"
                    />
                    {n === 5 ? "5+" : n}
                  </label>
                ))}
              </div>
            </fieldset>

            <Button
              type="button"
              className="mt-6 w-full"
              disabled={!city}
              onClick={handleReveal}
            >
              See estimated rent
            </Button>

            {revealed && estimate ? (
              <div className="mt-6 rounded-md border border-primary/20 bg-primary/5 p-4" aria-live="polite">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
                  Estimated monthly rent
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                  {formatUsd0(estimate.rentLow)} – {formatUsd0(estimate.rentHigh)}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-foreground/50">
                  {ESTIMATE_DATA_DISCLOSURE} Square footage and sale range live on the{" "}
                  <Link
                    href="/whats-my-home-worth"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    full home-value estimator
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <p className="mt-6 text-sm text-foreground/50">
                Pick a city, then reveal the range. We ask for contact after that.
              </p>
            )}
          </div>

          <div>
            {revealed && estimate ? (
              <ContactLeadForm
                source="website"
                defaultInquiryType="owner"
                routeAfterSubmit={false}
                prefillMessage={prefill}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-sm text-foreground/60">
                Your note to the team appears here after the rent range — one
                owner form, not a second copy of the same fields.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
