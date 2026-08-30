import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"

export const metadata: Metadata = {
  title: "Rate-and-Term Refinance in Utah | Ondo Real Estate",
  description: "A rate-and-term refinance lowers your mortgage rate or changes your loan term without taking cash out. Learn when it pays off and the break-even math.",
  alternates: { canonical: `${SITE_URL}/refinance/rate-term/` },
  openGraph: { title: "Rate-and-Term Refinance in Utah | Ondo Real Estate", description: "A rate-and-term refinance lowers your mortgage rate or changes your loan term without taking cash out. Learn when it pays off and the break-even math.", url: `${SITE_URL}/refinance/rate-term/` },
  twitter: { card: "summary_large_image", title: "Rate-and-Term Refinance in Utah | Ondo Real Estate", description: "A rate-and-term refinance lowers your mortgage rate or changes your loan term without taking cash out. Learn when it pays off and the break-even math." },
}

export default function RateTermRefinancePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Rate-and-Term Refinance in Utah"
        description={"A rate-and-term refinance lowers your mortgage rate or changes your loan term without taking cash out. Learn when it pays off and the break-even math."}
        pathname="/refinance/rate-term"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Refinance", url: `${SITE_URL}/refinance` },
          { name: "Rate-and-Term", url: `${SITE_URL}/refinance/rate-term` },
        ])}
      />
      <PageBanner title="Rate-and-Term Refinance" subtitle="Lower your rate or shorten your term — no cash out" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a Rate-and-Term Refinance?</h2>
              <p className="text-lg text-foreground/70">A rate-and-term refinance replaces your loan with a new one at a better rate, a different term (e.g. 30 → 15 years), or both — without increasing the balance. It’s the most common refinance, used to cut monthly payments or pay the loan off faster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="Lower your rate">
                <CardHeader>
                  <CardTitle className="text-lg">Lower your rate</CardTitle>
                  <CardDescription>A lower rate reduces both your monthly payment and total interest paid.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Shorten the term">
                <CardHeader>
                  <CardTitle className="text-lg">Shorten the term</CardTitle>
                  <CardDescription>Move from a 30- to a 15-year loan to build equity and save interest.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Drop mortgage insurance">
                <CardHeader>
                  <CardTitle className="text-lg">Drop mortgage insurance</CardTitle>
                  <CardDescription>Enough equity may let you refinance out of FHA MIP or PMI.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Know the break-even">
                <CardHeader>
                  <CardTitle className="text-lg">Know the break-even</CardTitle>
                  <CardDescription>Closing costs ÷ monthly savings = the month you start truly saving.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/blog/refinance-break-even-when-lower-rate-loses" asChild variant="outline" size="sm">
                <Link href="/blog/refinance-break-even-when-lower-rate-loses">When a lower rate still loses</Link>
              </Button>
              <Button key="/blog/fha-va-streamline-refinance-less-docs" asChild variant="outline" size="sm">
                <Link href="/blog/fha-va-streamline-refinance-less-docs">FHA / VA streamline</Link>
              </Button>
              <Button key="/blog/no-closing-cost-refinance-rate-credit-tradeoff" asChild variant="outline" size="sm">
                <Link href="/blog/no-closing-cost-refinance-rate-credit-tradeoff">“No closing cost” refi</Link>
              </Button>
              <Button key="/refinance/cash-out" asChild variant="outline" size="sm">
                <Link href="/refinance/cash-out">Cash-out refinance</Link>
              </Button>
              <Button key="/refinance/process" asChild variant="outline" size="sm">
                <Link href="/refinance/process">Refinance process</Link>
              </Button>
              <Button key="/calculators/refinance" asChild variant="outline" size="sm">
                <Link href="/calculators/refinance">Refinance calculator</Link>
              </Button>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to talk it through?</h3>
              <p className="text-foreground/70 mb-6">Get a clear, no-pressure look at your options with an Ondo advisor.</p>
              <Button asChild size="lg">
                <Link href="/contact">Speak with an advisor</Link>
              </Button>
            </div>
            <RelatedContent path="/refinance/rate-term" />
            <NextStepCta path="/refinance/rate-term" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}
