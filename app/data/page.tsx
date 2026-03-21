import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "Utah Real Estate Market Data | Ondo Real Estate",
  description: "Quarterly insights on Utah's residential and rental markets — median rent, vacancy rates, home prices, and trends.",
}

const stats = [
  { label: "Median Rent", value: "$1,650/mo" },
  { label: "Vacancy Rate", value: "4.2%" },
  { label: "Median Home Price", value: "$485,000" },
  { label: "YoY Price Change", value: "+3.1%" },
]

const futurePages = [
  { title: "Market Reports", description: "Quarterly Utah real estate research" },
  { title: "Benchmarks", description: "Compare rent and returns across Utah markets" },
  { title: "Trends", description: "Historical pricing and vacancy trends" },
]

export default function DataPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Real Estate Market Data | Ondo Real Estate"
        description="Quarterly insights on Utah's residential and rental markets — median rent, vacancy rates, home prices, and trends."
        pathname="/data"
      />
      <PageBanner
        title="Utah Real Estate Market Data"
        subtitle="Quarterly insights on Utah's residential and rental markets."
      />

      {/* Stat cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-foreground/50 mb-8">Updated Q1 2026</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map(({ label, value }) => (
              <Card key={label} className="border border-border text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-primary mb-1">{value}</p>
                  <p className="text-sm text-foreground/70">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-section links */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Explore deeper insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {futurePages.map(({ title, description }) => (
              <Card key={title} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-foreground/70">{description}</p>
                  <span className="text-xs text-foreground/40 mt-1">Coming soon</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/contact">Get a free market analysis</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
