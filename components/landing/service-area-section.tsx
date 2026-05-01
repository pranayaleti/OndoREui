"use client"

import Link from "next/link"
import { useState } from "react"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "@/lib/utah-cities"
import { cityMarketData } from "@/lib/city-market-data"
import { MapPin, TrendingUp, Home, DollarSign } from "lucide-react"

// Counties in north-to-south order with color coding
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
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString()
}

export function ServiceAreaSection() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const hoveredData = hoveredCity ? cityMarketData[hoveredCity] : null

  // Group cities by county in display order
  const countyOrder = ["Weber", "Davis", "Salt Lake", "Utah", "Juab"]
  const groups = countyOrder.map((county) => ({
    county,
    cities: utahCitiesFromNorthOgdenToNephi.filter((c) => c.county === county),
  })).filter((g) => g.cities.length > 0)

  return (
    <section className="py-16 bg-muted/30 dark:bg-muted/10" aria-labelledby="service-area-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 id="service-area-heading" className="text-3xl font-bold mb-3">
            55+ Cities Along Utah&apos;s Wasatch Front
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            From North Ogden to Nephi — local real estate expertise in every city. Hover a city to see market data.
          </p>
        </div>

        {/* Hover preview */}
        <div className="mb-8 h-20 flex items-center justify-center">
          {hoveredCity && hoveredData ? (
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in text-center">
              <div>
                <p className="text-xs text-foreground/50">City</p>
                <p className="font-bold text-primary">{hoveredCity}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 flex items-center gap-1 justify-center"><Home className="h-3 w-3" /> Median Price</p>
                <p className="font-bold">{fmtUsd(hoveredData.medianHomePrice)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 flex items-center gap-1 justify-center"><DollarSign className="h-3 w-3" /> Median Rent</p>
                <p className="font-bold">{fmtUsd(hoveredData.medianRent)}/mo</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 flex items-center gap-1 justify-center"><TrendingUp className="h-3 w-3" /> Growth</p>
                <p className="font-bold">{hoveredData.growthRate}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-foreground/70 italic">Hover over a city to see market data</p>
          )}
        </div>

        {/* City grid by county */}
        <div className="space-y-6">
          {groups.map(({ county, cities }) => (
            <div key={county} className={`rounded-xl p-4 ${COUNTY_BG[county]}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/70 mb-3 flex items-center gap-1.5">
                <span className={`inline-block h-2 w-2 rounded-full ${COUNTY_COLORS[county]}`} />
                {county} County
              </p>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Link
                    key={city.name}
                    href={`/locations/${toCitySlug(city.name)}/`}
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onMouseEnter={() => setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                  >
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    {city.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/locations/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            Explore All City Guides
          </Link>
        </div>
      </div>
    </section>
  )
}
