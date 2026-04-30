"use client"

import Link from "next/link"
import { useMemo } from "react"
import { SITE_PHONE } from "@/lib/site"
import { type UtahCity, toCitySlug } from "@/lib/utah-cities"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cityMarketData } from "@/lib/city-market-data"
import { getNearbyCities } from "@/lib/nearby-cities"
import { CommuteBadges } from "@/components/commute-badges"
import { CrossLinkSection } from "@/components/cross-link-section"
import {
  TrendingUp,
  Home,
  DollarSign,
  Users,
  Briefcase,
  School,
  Phone,
  BarChart3,
  Clock,
  Building2,
} from "lucide-react"

type MarketReportPageProps = { city: UtahCity }

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString("en-US")
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-foreground/60">{label}</p>
      </CardContent>
    </Card>
  )
}

export function MarketReportPage({ city }: MarketReportPageProps) {
  const citySlug = toCitySlug(city.name)
  const market = cityMarketData[city.name]
  const nearbyCities = useMemo(() => getNearbyCities(city.name, 6), [city.name])

  if (!market) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Market Report Coming Soon</h1>
        <p className="text-foreground/70">Market data for {city.name} is being compiled.</p>
      </div>
    )
  }

  const grossYield = ((market.medianRent * 12) / market.medianHomePrice * 100).toFixed(1)
  const rentToIncome = ((market.medianRent * 12) / market.medianHouseholdIncome * 100).toFixed(0)
  const priceToIncome = (market.medianHomePrice / market.medianHouseholdIncome).toFixed(1)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-primary mb-2">
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Market Report — {city.county} County
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {city.name}, Utah Real Estate Market Report
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-foreground/70">
            Comprehensive market data, pricing trends, employment, schools, and investment metrics for {city.name}.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-14">

        {/* Key Metrics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Key Market Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Home} label="Median Home Price" value={fmtUsd(market.medianHomePrice)} />
            <StatCard icon={DollarSign} label="Median Rent" value={`${fmtUsd(market.medianRent)}/mo`} />
            <StatCard icon={Users} label="Population" value={market.population.toLocaleString()} />
            <StatCard icon={TrendingUp} label="Growth Rate" value={market.growthRate} />
          </div>
        </section>

        {/* Detailed Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Detailed Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-foreground/60 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Avg Days on Market</p>
              <p className="text-xl font-bold mt-1">{market.avgDaysOnMarket} days</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-foreground/60">Median Household Income</p>
              <p className="text-xl font-bold mt-1">{fmtUsd(market.medianHouseholdIncome)}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-foreground/60">Owner-Occupied Homes</p>
              <p className="text-xl font-bold mt-1">{market.ownerOccupiedPct}%</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-foreground/60">Gross Rent Yield</p>
              <p className="text-xl font-bold mt-1">{grossYield}%</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-foreground/60">Rent-to-Income Ratio</p>
              <p className="text-xl font-bold mt-1">{rentToIncome}%</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-foreground/60">Price-to-Income Ratio</p>
              <p className="text-xl font-bold mt-1">{priceToIncome}x</p>
            </div>
            {market.elevation && (
              <div className="rounded-lg border p-4">
                <p className="text-sm text-foreground/60">Elevation</p>
                <p className="text-xl font-bold mt-1">{market.elevation.toLocaleString()} ft</p>
              </div>
            )}
          </div>
        </section>

        {/* Employment */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Major Employers
          </h2>
          <div className="flex flex-wrap gap-2">
            {market.topEmployers.map((emp) => (
              <span key={emp} className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
                {emp}
              </span>
            ))}
          </div>
        </section>

        {/* Commute */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Commute Times</h2>
          <CommuteBadges commuteTimes={market.commuteTimes} />
        </section>

        {/* Schools */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            Education
          </h2>
          <p className="text-foreground/70 mb-3">
            School District: <strong>{market.schoolDistrict}</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {market.notableSchools.map((s) => (
              <span key={s} className="inline-flex items-center rounded-full border px-3 py-1 text-sm">{s}</span>
            ))}
          </div>
        </section>

        {/* Nearby City Comparison Table */}
        {nearbyCities.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Regional Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4">City</th>
                    <th className="py-2 px-3 text-right">Price</th>
                    <th className="py-2 px-3 text-right">Rent</th>
                    <th className="py-2 px-3 text-right">Population</th>
                    <th className="py-2 px-3 text-right">Growth</th>
                    <th className="py-2 pl-3 text-right">DOM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-primary/5 font-semibold">
                    <td className="py-2 pr-4">{city.name}</td>
                    <td className="py-2 px-3 text-right">{fmtUsd(market.medianHomePrice)}</td>
                    <td className="py-2 px-3 text-right">{fmtUsd(market.medianRent)}</td>
                    <td className="py-2 px-3 text-right">{market.population.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">{market.growthRate}</td>
                    <td className="py-2 pl-3 text-right">{market.avgDaysOnMarket}</td>
                  </tr>
                  {nearbyCities.map((nc) => {
                    const d = cityMarketData[nc.name]
                    if (!d) return null
                    return (
                      <tr key={nc.name} className="border-b">
                        <td className="py-2 pr-4">
                          <Link href={`/market-reports/${toCitySlug(nc.name)}/`} className="text-primary hover:underline">{nc.name}</Link>
                        </td>
                        <td className="py-2 px-3 text-right">{fmtUsd(d.medianHomePrice)}</td>
                        <td className="py-2 px-3 text-right">{fmtUsd(d.medianRent)}</td>
                        <td className="py-2 px-3 text-right">{d.population.toLocaleString()}</td>
                        <td className="py-2 px-3 text-right">{d.growthRate}</td>
                        <td className="py-2 pl-3 text-right">{d.avgDaysOnMarket}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <Separator />

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold mb-3">Invest in {city.name} Real Estate</h2>
          <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
            Get expert guidance on buying, selling, or managing property in {city.name}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/property-management/${citySlug}/`}>
                <Building2 className="mr-2 h-4 w-4" />
                Property Management
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                {SITE_PHONE}
              </a>
            </Button>
          </div>
        </section>

        <CrossLinkSection
          title={`${city.name} Resources`}
          variant="pills"
          links={[
            { label: `${city.name} City Guide`, href: `/locations/${citySlug}/` },
            { label: `${city.name} Pricing Guide`, href: `/pricing/${citySlug}/` },
            { label: `${city.name} Property Management`, href: `/property-management/${citySlug}/` },
            { label: `${city.name} Home Loans`, href: `/loans/${citySlug}/` },
            { label: `Buy or Sell in ${city.name}`, href: `/buy-sell/${citySlug}/` },
          ]}
        />
      </div>
    </>
  )
}
