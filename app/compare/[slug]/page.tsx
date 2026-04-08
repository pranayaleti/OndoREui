import Link from "next/link"
import { findCityBySlug, utahCitiesFromNorthOgdenToNephi, toCitySlug } from "@/lib/utah-cities"
import { cityMarketData } from "@/lib/city-market-data"
import type { Metadata } from "next"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CrossLinkSection } from "@/components/cross-link-section"
import { CheckCircle2, XCircle, Minus, ArrowRight } from "lucide-react"

// Generate pairs for adjacent cities (neighbor pairs)
const CITY_PAIRS: [string, string][] = [
  ["draper", "lehi"],
  ["draper", "sandy"],
  ["lehi", "saratoga-springs"],
  ["salt-lake-city", "draper"],
  ["salt-lake-city", "sandy"],
  ["provo", "orem"],
  ["ogden", "layton"],
  ["lehi", "american-fork"],
  ["sandy", "riverton"],
  ["south-jordan", "riverton"],
  ["bountiful", "salt-lake-city"],
  ["west-jordan", "south-jordan"],
]

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return CITY_PAIRS.map(([a, b]) => ({ slug: `${a}-vs-${b}` }))
}

function parsePairSlug(slug: string): { aSlug: string; bSlug: string } | null {
  const vsIdx = slug.indexOf("-vs-")
  if (vsIdx === -1) return null
  return { aSlug: slug.slice(0, vsIdx), bSlug: slug.slice(vsIdx + 4) }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const pair = parsePairSlug(slug)
  if (!pair) return {}
  const a = findCityBySlug(pair.aSlug)
  const b = findCityBySlug(pair.bSlug)
  if (!a || !b) return {}
  const title = `${a.name} vs ${b.name}, Utah — Real Estate Comparison | ${SITE_BRAND_SHORT}`
  const description = `Compare ${a.name} and ${b.name} side-by-side: home prices, rent, schools, commute, growth rate, and lifestyle.`
  const canonical = `${SITE_URL}/compare/${slug}/`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

function Winner({ value }: { value: "a" | "b" | "tie" }) {
  if (value === "tie") return <Minus className="h-4 w-4 text-foreground/40" />
  if (value === "a") return <CheckCircle2 className="h-4 w-4 text-green-500" />
  return <XCircle className="h-4 w-4 text-foreground/30" />
}

function fmtUsd(n: number) {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString()
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params
  const pair = parsePairSlug(slug)
  if (!pair) notFound()
  const a = findCityBySlug(pair.aSlug)
  const b = findCityBySlug(pair.bSlug)
  if (!a || !b) notFound()
  const aData = cityMarketData[a.name]
  const bData = cityMarketData[b.name]

  type Row = {
    label: string
    aVal: string
    bVal: string
    winner: "a" | "b" | "tie"
    note?: string
  }

  const rows: Row[] = aData && bData ? [
    {
      label: "Median Home Price",
      aVal: fmtUsd(aData.medianHomePrice),
      bVal: fmtUsd(bData.medianHomePrice),
      winner: aData.medianHomePrice < bData.medianHomePrice ? "a" : aData.medianHomePrice > bData.medianHomePrice ? "b" : "tie",
      note: "Lower = more affordable entry",
    },
    {
      label: "Median Rent",
      aVal: `${fmtUsd(aData.medianRent)}/mo`,
      bVal: `${fmtUsd(bData.medianRent)}/mo`,
      winner: "tie",
    },
    {
      label: "Population",
      aVal: aData.population.toLocaleString(),
      bVal: bData.population.toLocaleString(),
      winner: "tie",
    },
    {
      label: "Growth Rate",
      aVal: aData.growthRate,
      bVal: bData.growthRate,
      winner: parseFloat(aData.growthRate) > parseFloat(bData.growthRate) ? "a" : parseFloat(aData.growthRate) < parseFloat(bData.growthRate) ? "b" : "tie",
      note: "Higher = faster appreciation potential",
    },
    {
      label: "Avg Days on Market",
      aVal: `${aData.avgDaysOnMarket} days`,
      bVal: `${bData.avgDaysOnMarket} days`,
      winner: aData.avgDaysOnMarket < bData.avgDaysOnMarket ? "a" : aData.avgDaysOnMarket > bData.avgDaysOnMarket ? "b" : "tie",
      note: "Fewer days = stronger demand",
    },
    {
      label: "Median Household Income",
      aVal: fmtUsd(aData.medianHouseholdIncome),
      bVal: fmtUsd(bData.medianHouseholdIncome),
      winner: aData.medianHouseholdIncome > bData.medianHouseholdIncome ? "a" : aData.medianHouseholdIncome < bData.medianHouseholdIncome ? "b" : "tie",
    },
    {
      label: "Owner-Occupied",
      aVal: `${aData.ownerOccupiedPct}%`,
      bVal: `${bData.ownerOccupiedPct}%`,
      winner: "tie",
    },
    {
      label: "Gross Rent Yield",
      aVal: `${((aData.medianRent * 12 / aData.medianHomePrice) * 100).toFixed(1)}%`,
      bVal: `${((bData.medianRent * 12 / bData.medianHomePrice) * 100).toFixed(1)}%`,
      winner: (aData.medianRent * 12 / aData.medianHomePrice) > (bData.medianRent * 12 / bData.medianHomePrice) ? "a" : "b",
      note: "Higher = better rental income relative to price",
    },
    {
      label: "School District",
      aVal: aData.schoolDistrict,
      bVal: bData.schoolDistrict,
      winner: "tie",
    },
  ] : []

  return (
    <>
      <SEO
        title={`${a.name} vs ${b.name}, Utah — Real Estate Comparison | ${SITE_BRAND_SHORT}`}
        description={`${a.name} vs ${b.name}: compare home prices, rent, schools, commute, and growth.`}
        pathname={`/compare/${slug}/`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Compare", url: `${SITE_URL}/compare/` },
          { name: `${a.name} vs ${b.name}`, url: `${SITE_URL}/compare/${slug}/` },
        ])}
      />

      <main>
        <section className="bg-gradient-to-br from-primary/5 to-background py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              {a.name} vs {b.name}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-foreground/70">
              Side-by-side comparison of real estate, schools, commute, and lifestyle in {a.name} and {b.name}, Utah.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">

          {rows.length > 0 ? (
            <section>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Metric</th>
                      <th className="text-center py-3 px-4 font-semibold text-primary">{a.name}</th>
                      <th className="text-center py-3 px-4 font-semibold text-primary">{b.name}</th>
                      <th className="text-center py-3 px-4 text-xs text-foreground/50">Edge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="py-3 px-4">
                          <p className="font-medium">{row.label}</p>
                          {row.note && <p className="text-xs text-foreground/50">{row.note}</p>}
                        </td>
                        <td className="text-center py-3 px-4 font-medium">{row.aVal}</td>
                        <td className="text-center py-3 px-4 font-medium">{row.bVal}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex justify-center">
                            {row.winner === "tie" ? (
                              <Minus className="h-4 w-4 text-foreground/30" />
                            ) : row.winner === "a" ? (
                              <span className="text-xs font-semibold text-green-600">{a.name}</span>
                            ) : (
                              <span className="text-xs font-semibold text-green-600">{b.name}</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <p className="text-foreground/60">Full comparison data coming soon for this city pair.</p>
          )}

          {/* Commute comparison */}
          {aData && bData && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Commutes from {a.name}</h2>
                <div className="space-y-2">
                  {aData.commuteTimes.map((c) => (
                    <div key={c.destination} className="flex justify-between rounded-lg border p-3 text-sm">
                      <span>{c.destination}</span>
                      <span className="font-medium">{c.minutes} min</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Commutes from {b.name}</h2>
                <div className="space-y-2">
                  {bData.commuteTimes.map((c) => (
                    <div key={c.destination} className="flex justify-between rounded-lg border p-3 text-sm">
                      <span>{c.destination}</span>
                      <span className="font-medium">{c.minutes} min</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTAs */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold text-lg mb-3">Explore {a.name}</h3>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/locations/${pair.aSlug}/`}>City Guide</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/property-management/${pair.aSlug}/`}>Property Management</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/buy-sell/${pair.aSlug}/`}>
                      Buy in {a.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold text-lg mb-3">Explore {b.name}</h3>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/locations/${pair.bSlug}/`}>City Guide</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/property-management/${pair.bSlug}/`}>Property Management</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/buy-sell/${pair.bSlug}/`}>
                      Buy in {b.name} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <CrossLinkSection
            title="More Comparisons"
            variant="pills"
            links={CITY_PAIRS.filter(([x, y]) => `${x}-vs-${y}` !== slug).slice(0, 8).map(([x, y]) => {
              const cityA = utahCitiesFromNorthOgdenToNephi.find((c) => toCitySlug(c.name) === x)
              const cityB = utahCitiesFromNorthOgdenToNephi.find((c) => toCitySlug(c.name) === y)
              return {
                label: `${cityA?.name ?? x} vs ${cityB?.name ?? y}`,
                href: `/compare/${x}-vs-${y}/`,
              }
            })}
          />
        </div>
      </main>
    </>
  )
}
