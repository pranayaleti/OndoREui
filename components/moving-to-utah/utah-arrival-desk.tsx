"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import { cityMarketData } from "@/lib/city-market-data"
import {
  ARRIVAL_FAIR_HOUSING,
  ARRIVAL_LENDING_DISCLOSURE,
  ARRIVAL_RENT_DISCLOSURE,
  arrivalContactPrefill,
  arrivalPathInquiryType,
  arrivalPrimaryCta,
  arrivalSecondaryCta,
  commuteRowsForWorkplace,
  formatArrivalDate,
  formatMedianRent,
  minutesLabel,
  tourWindowForStartDate,
  WORKPLACE_CHIPS,
  type ArrivalPathId,
} from "@/lib/utah-arrival"
import { cn } from "@/lib/utils"

const PATHS: ReadonlyArray<{
  id: ArrivalPathId
  title: string
  body: string
}> = [
  {
    id: "rent",
    title: "Rent before the start date",
    body: "Browse Ondo-managed homes, request a showing, then apply by invite. There is no public apply form.",
  },
  {
    id: "buy",
    title: "Buy with brokerage + NMLS",
    body: "Purchase help and NMLS-licensed lending in one shop. Asking is not a loan application or a credit decision, and you are not required to use Ondo for financing.",
  },
  {
    id: "leaving-a-home",
    title: "A home is staying behind",
    body: "Free rent and sale estimate, then management if you want it. The management fee is charged when rent is collected.",
  },
  {
    id: "people-ops",
    title: "Housing for someone joining a team",
    body: "Share the hub they will commute to. We point at current rentals and showings — same written screening for every complete application.",
  },
]

export function UtahArrivalDesk() {
  const instanceId = useId().replace(/:/g, "")
  const fieldId = (name: string) => `arrival-${name}-${instanceId}`
  const [workplace, setWorkplace] = useState("Lehi")
  const [startDate, setStartDate] = useState("")
  const [path, setPath] = useState<ArrivalPathId>("rent")
  const [housingCity, setHousingCity] = useState("Lehi")

  const rows = useMemo(() => commuteRowsForWorkplace(cityMarketData, workplace), [workplace])

  const selectedCity = useMemo(() => {
    if (rows.some((row) => row.city === housingCity)) return housingCity
    return rows[0]?.city ?? ""
  }, [rows, housingCity])

  const selectedRow = rows.find((row) => row.city === selectedCity) ?? rows[0]
  const tour = startDate ? tourWindowForStartDate(startDate) : null
  const prefill = arrivalContactPrefill(path, workplace, selectedCity || undefined)
  const primaryCta = arrivalPrimaryCta(
    path,
    selectedRow?.city ?? workplace,
    selectedRow?.listingsHref ?? "/properties/",
  )
  const secondaryCta = arrivalSecondaryCta(path)

  function chooseWorkplace(next: string) {
    setWorkplace(next)
    const nextRows = commuteRowsForWorkplace(cityMarketData, next)
    if (nextRows[0]) setHousingCity(nextRows[0].city)
  }

  return (
    <div className="space-y-10">
      <section aria-labelledby={fieldId("workplace-heading")} className="space-y-4">
        <div>
          <h2 id={fieldId("workplace-heading")} className="text-xl font-semibold text-foreground md:text-2xl">
            Weekday workplace
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            Type a city or pick a common Wasatch Front hub. The ledger uses Ondo commute minutes and city median rents for our 55-city coverage set.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Common workplaces">
          {WORKPLACE_CHIPS.map((chip) => {
            const pressed = workplace === chip.query
            return (
              <button
                key={chip.query}
                type="button"
                aria-pressed={pressed}
                onClick={() => chooseWorkplace(chip.query)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
                  pressed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/60",
                )}
              >
                {chip.label}
              </button>
            )
          })}
        </div>
        <div>
          <Label htmlFor={fieldId("workplace")}>Type a workplace</Label>
          <Input
            id={fieldId("workplace")}
            value={workplace}
            onChange={(event) => chooseWorkplace(event.target.value)}
            placeholder="e.g. Lehi, Ogden, Hill Air Force Base"
            className="mt-2 max-w-md"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor={fieldId("start")}>Start date (optional)</Label>
          <Input
            id={fieldId("start")}
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-2 max-w-md"
          />
          <p aria-live="polite" aria-atomic="true" className="mt-2 min-h-5 text-sm text-foreground/70">
            {tour?.kind === "window"
              ? `Begin touring between ${formatArrivalDate(tour.tourFrom)} and ${formatArrivalDate(tour.tourTo)} so the last two weeks are not a scramble.`
              : tour?.kind === "soon"
                ? "Inside 45 days, fewer Ondo-managed homes are typically listed for a future move-in. Browse what is live now and request a showing."
                : tour?.kind === "past"
                  ? "That start date is already behind us. Use today's listings instead."
                  : ""}
          </p>
        </div>
      </section>

      <section aria-labelledby={fieldId("ledger-heading")}>
        <h2 id={fieldId("ledger-heading")} className="text-xl font-semibold text-foreground md:text-2xl">
          Housing cities by weekday drive
        </h2>
        {rows.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-sm text-foreground/70">
            No commute minutes for that workplace yet. Try Salt Lake City, Lehi, Provo, Ogden, or Hill Air Force Base.
          </p>
        ) : (
          <RadioGroup
            value={selectedCity}
            onValueChange={setHousingCity}
            className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
            aria-label="Housing city"
          >
            {rows.map((row) => {
              const inputId = fieldId(`city-${row.city}`)
              const selected = row.city === selectedCity
              return (
                <div
                  key={row.city}
                  className={cn(
                    "grid gap-3 px-4 py-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center",
                    STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
                    selected ? "bg-primary/5" : "",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value={row.city}
                      id={inputId}
                      className={STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS}
                    />
                    <Label
                      htmlFor={inputId}
                      className={cn(
                        "cursor-pointer font-semibold tabular-nums text-primary",
                        STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
                      )}
                    >
                      <span aria-hidden="true">{minutesLabel(row.minutes)}</span>
                      <span className="sr-only">
                        {minutesLabel(row.minutes)}, {row.city}
                      </span>
                    </Label>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{row.city}</p>
                    <p className="text-sm text-foreground/70">{formatMedianRent(row.medianRent)} typical</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Link
                      href={row.listingsHref}
                      aria-label={`Rentals in ${row.city}`}
                      className="min-h-11 inline-flex items-center font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Rentals
                    </Link>
                    <Link
                      href={row.guideHref}
                      aria-label={`City guide for ${row.city}`}
                      className="min-h-11 inline-flex items-center text-foreground/80 underline-offset-4 hover:underline"
                    >
                      City guide
                    </Link>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        )}
        <p className="mt-3 text-sm text-foreground/70">{ARRIVAL_RENT_DISCLOSURE}</p>
      </section>

      <section aria-labelledby={fieldId("path-heading")}>
        <h2 id={fieldId("path-heading")} className="text-xl font-semibold text-foreground md:text-2xl">
          What should happen next?
        </h2>
        <RadioGroup
          value={path}
          onValueChange={(value) => setPath(value as ArrivalPathId)}
          className="mt-4 grid gap-3 md:grid-cols-2"
          aria-label="Arrival path"
        >
          {PATHS.map((item) => {
            const inputId = fieldId(`path-${item.id}`)
            const selected = path === item.id
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-xl border p-4",
                  STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
                  selected ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={item.id}
                    id={inputId}
                    className={cn("mt-1", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
                  />
                  <Label
                    htmlFor={inputId}
                    className={cn(
                      "cursor-pointer space-y-1 font-normal",
                      STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS,
                    )}
                  >
                    <span className="block font-semibold text-foreground">{item.title}</span>
                    <span className="block text-sm text-foreground/70">{item.body}</span>
                  </Label>
                </div>
              </div>
            )
          })}
        </RadioGroup>
        <div className="mt-4 flex flex-wrap gap-3">
          {selectedRow || path === "people-ops" || path === "buy" || path === "leaving-a-home" ? (
            <Link
              href={primaryCta.href}
              className="inline-flex min-h-11 items-center rounded-md bg-gradient-to-r from-orange-500 to-red-800 px-4 text-base font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {primaryCta.label}
            </Link>
          ) : null}
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium text-foreground hover:border-primary/60"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
        {path === "buy" ? (
          <p className="mt-3 text-sm text-foreground/70">{ARRIVAL_LENDING_DISCLOSURE}</p>
        ) : null}
      </section>

      <section id="arrival-contact" className="scroll-mt-24" aria-labelledby={fieldId("contact-heading")}>
        <h2 id={fieldId("contact-heading")} className="text-xl font-semibold text-foreground md:text-2xl">
          Tell us the start date
        </h2>
        <p className="mt-1 mb-4 text-sm text-foreground/70">
          We reply in English. Portal access stays invite-only.
        </p>
        <ContactLeadForm
          key={`${path}-${workplace}-${selectedCity}`}
          defaultInquiryType={arrivalPathInquiryType(path)}
          prefillMessage={prefill}
          source="website"
        />
        <p className="mt-4 text-sm text-foreground/70">{ARRIVAL_FAIR_HOUSING}</p>
      </section>
    </div>
  )
}
