import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mortgage Refinance in Utah | Ondo Real Estate",
  description: "Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process.",
  alternates: { canonical: `${SITE_URL}/refinance/` },
  openGraph: { title: "Mortgage Refinance in Utah | Ondo Real Estate", description: "Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process.", url: `${SITE_URL}/refinance/` },
  twitter: { card: "summary_large_image", title: "Mortgage Refinance in Utah | Ondo Real Estate", description: "Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process." },
}

export default function RefinanceHubPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Mortgage Refinance in Utah"
        description={"Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process."}
        pathname="/refinance"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Refinance", url: `${SITE_URL}/refinance` },
        ])}
      />
      <PageBanner title="Mortgage Refinance" subtitle="Lower your rate, change your term, or tap your equity" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Should You Refinance?</h2>
              <p className="text-lg text-foreground/70">Refinancing replaces your current mortgage with a new one — ideally at a lower rate, a shorter term, or to convert equity into cash. Whether it saves you money depends on your new rate, how long you’ll stay, and the closing costs. Weigh the break-even point before you commit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="Rate-and-term">
                <CardHeader>
                  <CardTitle className="text-lg">Rate-and-term</CardTitle>
                  <CardDescription>Lower your interest rate or shorten your term without taking cash out.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Cash-out">
                <CardHeader>
                  <CardTitle className="text-lg">Cash-out</CardTitle>
                  <CardDescription>Convert home equity into cash for renovations, debt payoff, or investing.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="The process">
                <CardHeader>
                  <CardTitle className="text-lg">The process</CardTitle>
                  <CardDescription>Application, appraisal, underwriting, and closing — usually 30–45 days.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Break-even math">
                <CardHeader>
                  <CardTitle className="text-lg">Break-even math</CardTitle>
                  <CardDescription>Divide closing costs by monthly savings to see when a refi pays off.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/refinance/process" asChild variant="outline" size="sm">
                <Link href="/refinance/process">Refinance process</Link>
              </Button>
              <Button key="/refinance/rate-term" asChild variant="outline" size="sm">
                <Link href="/refinance/rate-term">Rate-and-term</Link>
              </Button>
              <Button key="/refinance/cash-out" asChild variant="outline" size="sm">
                <Link href="/refinance/cash-out">Cash-out</Link>
              </Button>
              <Button key="/calculators/refinance" asChild variant="outline" size="sm">
                <Link href="/calculators/refinance">Mortgage calculator</Link>
              </Button>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to talk it through?</h3>
              <p className="text-foreground/70 mb-6">Get a clear, no-pressure look at your options with an Ondo advisor.</p>
              <Button asChild size="lg">
                <Link href="/contact">Speak with an advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
