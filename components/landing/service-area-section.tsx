"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "@/lib/utah-cities"
import { CITY_MARKET_DATA_DISCLOSURE, cityMarketData } from "@/lib/city-market-data"
import {
  DEFAULT_COVERAGE_CITY,
  filterCoverageCities,
  resolveCoverageCityName,
} from "@/lib/coverage-city-search"
import { Input } from "@/components/ui/input"
import { MapPin, Search, TrendingUp, Home, DollarSign } from "lucide-react"

const COUNTY_COLORS: Record<string, string> = {
  Weber: "bg-[hsl(var(--color-category-1))]",
  Davis: "bg-[hsl(var(--color-category-2))]",
  "Salt Lake": "bg-primary",
  Utah: "bg-[hsl(var(--color-category-3))]",
  Juab: "bg-[hsl(var(--color-category-4))]",
}

const COUNTY_BG: Record<string, string> = {
  Weber: "bg-[hsl(var(--color-category-1-surface))]",
  Davis: "bg-[hsl(var(--color-category-2-surface))]",
  "Salt Lake": "bg-primary/5",
  Utah: "bg-[hsl(var(--color-category-3-surface))]",
  Juab: "bg-[hsl(var(--color-category-4-surface))]",
}

function fmtUsd(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 10_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString("en-US")
}

const COUNTY_ORDER = ["Weber", "Davis", "Salt Lake", "Utah", "Juab"] as const

export function ServiceAreaSection() {
  const [query, setQuery] = useState("")
  const [selectedName, setSelectedName] = useState(DEFAULT_COVERAGE_CITY)

  const matches = useMemo(
    () => filterCoverageCities(utahCitiesFromNorthOgdenToNephi, query),
    [query],
  )
  const displayCity = resolveCoverageCityName(
    utahCitiesFromNorthOgdenToNephi,
    query,
    selectedName,
  )
  const displayData = cityMarketData[displayCity]
  const displaySlug = toCitySlug(displayCity)

  const groups = COUNTY_ORDER.map((county) => ({
    county,
    cities: matches.filter((city) => city.county === county),
  })).filter((group) => group.cities.length > 0)

  return (
    <section className="scroll-mt-24 py-16 bg-muted/30 dark:bg-muted/10" aria-labelledby="service-area-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 id="service-area-heading" className="text-3xl font-bold mb-3">
            55+ Cities Along Utah&apos;s Wasatch Front
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            From North Ogden to Nephi. Type a city to see median rent, then open the guide — no hover required.
          </p>
        </div>

        <div className="mx-auto mb-6 max-w-md">
          <label htmlFor="coverage-city-search" className="sr-only">
            Find your city
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="coverage-city-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find your city — Lehi, Ogden, Utah County…"
              autoComplete="address-level2"
              className="min-h-11 pl-9"
            />
          </div>
        </div>

        <div
          className="mb-8 rounded-xl border border-border bg-card px-4 py-4 sm:px-6"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap justify-center gap-6 text-center sm:justify-start sm:text-left">
              <div>
                <p className="text-xs text-foreground/50">City</p>
                <p className="font-bold text-primary">{displayCity}</p>
              </div>
              {displayData ? (
                <>
                  <div>
                    <p className="text-xs text-foreground/50 flex items-center gap-1 justify-center sm:justify-start">
                      <Home className="h-3 w-3" aria-hidden="true" /> Median price
                    </p>
                    <p className="font-bold">{fmtUsd(displayData.medianHomePrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 flex items-center gap-1 justify-center sm:justify-start">
                      <DollarSign className="h-3 w-3" aria-hidden="true" /> Median rent
                    </p>
                    <p className="font-bold">{fmtUsd(displayData.medianRent)}/mo</p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground/50 flex items-center gap-1 justify-center sm:justify-start">
                      <TrendingUp className="h-3 w-3" aria-hidden="true" /> Growth
                    </p>
                    <p className="font-bold">{displayData.growthRate}</p>
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
              <Link
                href={`/locations/${displaySlug}/`}
                className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                City guide
              </Link>
              <Link
                href={`/property-management/${displaySlug}/`}
                className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-sm font-medium hover:bg-muted"
              >
                Property management
              </Link>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-foreground/70 sm:text-left">
            {CITY_MARKET_DATA_DISCLOSURE}
          </p>
        </div>

        {matches.length === 0 ? (
          <p className="mb-6 text-center text-sm text-foreground/70" role="status">
            No Wasatch Front city matches that search. Try a city or county name.
          </p>
        ) : (
          <div className="space-y-6">
            {groups.map(({ county, cities }) => (
              <div key={county} className={`rounded-xl p-4 ${COUNTY_BG[county]}`}>
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70 mb-3 flex items-center gap-1.5">
                  <span className={`inline-block h-2 w-2 rounded-full ${COUNTY_COLORS[county]}`} />
                  {county} County
                </p>
                <div className="flex flex-wrap gap-2">
                  {cities.map((city) => {
                    const selected = city.name === displayCity
                    return (
                      <Link
                        key={city.name}
                        href={`/locations/${toCitySlug(city.name)}/`}
                        className={`inline-flex min-h-11 items-center gap-1 rounded-full border bg-card/80 backdrop-blur-sm px-3 py-1.5 text-sm transition-all hover:border-primary/50 hover:bg-primary/5 ${
                          selected
                            ? "border-primary bg-primary/10"
                            : "border-border/60"
                        }`}
                        aria-current={selected ? "true" : undefined}
                        onFocus={() => setSelectedName(city.name)}
                        onPointerEnter={() => setSelectedName(city.name)}
                      >
                        <MapPin className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                        {city.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/locations/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Explore All City Guides
          </Link>
        </div>
      </div>
    </section>
  )
}
