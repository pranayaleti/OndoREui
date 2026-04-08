"use client"

import Link from "next/link"
import { useMemo } from "react"
import { SITE_PHONE } from "@/lib/site"
import { type UtahCity, toCitySlug } from "@/lib/utah-cities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cityMarketData } from "@/lib/city-market-data"
import { getNearbyCities } from "@/lib/nearby-cities"
import { CrossLinkSection } from "@/components/cross-link-section"
import {
  DollarSign,
  Home,
  Calculator,
  Phone,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react"

type CityPricingGuideProps = {
  city: UtahCity
}

function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US")
}

function estimateMonthlyPayment(price: number, downPct: number, rate: number, years: number): number {
  const principal = price * (1 - downPct / 100)
  const monthlyRate = rate / 100 / 12
  const numPayments = years * 12
  if (monthlyRate === 0) return principal / numPayments
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
}

export function CityPricingGuide({ city }: CityPricingGuideProps) {
  const citySlug = toCitySlug(city.name)
  const market = cityMarketData[city.name]
  const nearbyCities = useMemo(() => getNearbyCities(city.name, 4), [city.name])

  const pmFees = {
    monthlyMgmt: { pct: "8–10%", example: market ? Math.round(market.medianRent * 0.09) : 135 },
    leasing: "50–100% of first month's rent",
    vacancy: "Included in management fee",
    maintenance: "Billed at cost + coordination fee",
    eviction: "$500–$1,500 (varies by case)",
  }

  const monthlyPayment30 = market ? Math.round(estimateMonthlyPayment(market.medianHomePrice, 20, 6.75, 30)) : null
  const monthlyPayment15 = market ? Math.round(estimateMonthlyPayment(market.medianHomePrice, 20, 6.25, 15)) : null
  const closingCosts = market ? Math.round(market.medianHomePrice * 0.03) : null

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-background py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-primary mb-2">Pricing Guide</p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Cost of Real Estate Services in {city.name}, Utah
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-foreground/70">
            What property management, home buying, and mortgages cost in {city.name} — with local market context.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-14">

        {/* Property Management Fees */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Property Management Fees in {city.name}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center rounded-lg border p-4">
              <div>
                <p className="font-medium">Monthly Management Fee</p>
                <p className="text-sm text-foreground/60">Rent collection, tenant communication, reporting</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{pmFees.monthlyMgmt.pct}</p>
                <p className="text-sm text-foreground/60">≈ {fmtUsd(pmFees.monthlyMgmt.example)}/mo</p>
              </div>
            </div>
            <div className="flex justify-between items-center rounded-lg border p-4">
              <div>
                <p className="font-medium">Tenant Placement / Leasing Fee</p>
                <p className="text-sm text-foreground/60">Marketing, screening, lease execution</p>
              </div>
              <p className="font-bold text-right">{pmFees.leasing}</p>
            </div>
            <div className="flex justify-between items-center rounded-lg border p-4">
              <div>
                <p className="font-medium">Vacancy Fee</p>
                <p className="text-sm text-foreground/60">Cost during vacant periods</p>
              </div>
              <p className="font-bold text-right">{pmFees.vacancy}</p>
            </div>
            <div className="flex justify-between items-center rounded-lg border p-4">
              <div>
                <p className="font-medium">Maintenance Coordination</p>
                <p className="text-sm text-foreground/60">Vendor dispatch, quality check, invoicing</p>
              </div>
              <p className="font-bold text-right">{pmFees.maintenance}</p>
            </div>
            <div className="flex justify-between items-center rounded-lg border p-4">
              <div>
                <p className="font-medium">Eviction Management</p>
                <p className="text-sm text-foreground/60">Legal coordination, filing, court appearance</p>
              </div>
              <p className="font-bold text-right">{pmFees.eviction}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-primary/5 p-6">
            <h3 className="font-semibold mb-2">What&apos;s included with Ondo RE</h3>
            <ul className="space-y-2">
              {[
                "Online rent collection with direct deposit",
                "24/7 emergency maintenance response",
                "Monthly financial statements and tax-ready reports",
                "Tenant screening (credit, criminal, eviction, income)",
                "Real-time owner dashboard with AI insights",
                "Annual property inspections",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Home Buying Costs */}
        {market && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              Home Buying Costs in {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Median Home Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{fmtUsd(market.medianHomePrice)}</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    Avg {market.avgDaysOnMarket} days on market
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Estimated Closing Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{fmtUsd(closingCosts!)}</p>
                  <p className="text-sm text-foreground/60 mt-1">~3% of purchase price</p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-4">Estimated Monthly Mortgage Payments</h3>
            <p className="text-sm text-foreground/60 mb-4">
              Based on {city.name} median price of {fmtUsd(market.medianHomePrice)} with 20% down
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-foreground/60">30-Year Fixed @ 6.75%</p>
                <p className="text-2xl font-bold">{fmtUsd(monthlyPayment30!)}/mo</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-foreground/60">15-Year Fixed @ 6.25%</p>
                <p className="text-2xl font-bold">{fmtUsd(monthlyPayment15!)}/mo</p>
              </div>
            </div>
            <p className="text-xs text-foreground/40 mt-2">
              * Estimates exclude property taxes, insurance, and HOA. Rates are illustrative — get a personalized quote.
            </p>
          </section>
        )}

        {/* Rental Market */}
        {market && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Rental Market in {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-foreground/60">Median Rent</p>
                <p className="text-2xl font-bold">{fmtUsd(market.medianRent)}/mo</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-foreground/60">Gross Rent Yield</p>
                <p className="text-2xl font-bold">
                  {((market.medianRent * 12 / market.medianHomePrice) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-sm text-foreground/60">Rent-to-Income Ratio</p>
                <p className="text-2xl font-bold">
                  {((market.medianRent * 12 / market.medianHouseholdIncome) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Nearby City Comparison */}
        {nearbyCities.length > 0 && market && (
          <section>
            <h2 className="text-2xl font-bold mb-6">How {city.name} Compares</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">City</th>
                    <th className="text-right py-2 px-4">Median Price</th>
                    <th className="text-right py-2 px-4">Median Rent</th>
                    <th className="text-right py-2 pl-4">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-primary/5 font-medium">
                    <td className="py-2 pr-4">{city.name}</td>
                    <td className="text-right py-2 px-4">{fmtUsd(market.medianHomePrice)}</td>
                    <td className="text-right py-2 px-4">{fmtUsd(market.medianRent)}</td>
                    <td className="text-right py-2 pl-4">{market.growthRate}</td>
                  </tr>
                  {nearbyCities.map((nc) => {
                    const ncData = cityMarketData[nc.name]
                    if (!ncData) return null
                    return (
                      <tr key={nc.name} className="border-b">
                        <td className="py-2 pr-4">
                          <Link href={`/pricing/${toCitySlug(nc.name)}/`} className="text-primary hover:underline">
                            {nc.name}
                          </Link>
                        </td>
                        <td className="text-right py-2 px-4">{fmtUsd(ncData.medianHomePrice)}</td>
                        <td className="text-right py-2 px-4">{fmtUsd(ncData.medianRent)}</td>
                        <td className="text-right py-2 pl-4">{ncData.growthRate}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center py-8 rounded-xl bg-muted/50 px-6">
          <h2 className="text-2xl font-bold mb-3">Get a Free Rental Analysis for {city.name}</h2>
          <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
            Find out what your property could earn with professional management. No obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/property-management/${citySlug}/`}>
                Get Free Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                {SITE_PHONE}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/calculators/">
                <Calculator className="mr-2 h-4 w-4" />
                Use Calculators
              </Link>
            </Button>
          </div>
        </section>

        {/* Cross-links */}
        <CrossLinkSection
          title={`More ${city.name} Resources`}
          variant="pills"
          links={[
            { label: `${city.name} City Guide`, href: `/locations/${citySlug}/` },
            { label: `${city.name} Property Management`, href: `/property-management/${citySlug}/` },
            { label: `${city.name} Home Loans`, href: `/loans/${citySlug}/` },
            { label: `Buy or Sell in ${city.name}`, href: `/buy-sell/${citySlug}/` },
            ...nearbyCities.slice(0, 3).map((nc) => ({
              label: `${nc.name} Pricing Guide`,
              href: `/pricing/${toCitySlug(nc.name)}/`,
            })),
          ]}
        />
      </div>
    </>
  )
}
