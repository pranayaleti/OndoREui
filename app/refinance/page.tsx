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
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { BreakEvenTable } from "@/components/content/break-even-table"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Mortgage Refinance in Utah | Ondo Real Estate",
  description: "Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process.",
  alternates: { canonical: `${SITE_URL}/refinance/` },
  openGraph: { title: "Mortgage Refinance in Utah | Ondo Real Estate", description: "Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process.", url: `${SITE_URL}/refinance/`, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: "Mortgage Refinance in Utah | Ondo Real Estate", description: "Refinance your Utah mortgage to lower your rate, change your term, or tap equity. Compare rate-and-term vs cash-out refinancing and the process.", images: [DEFAULT_OG_IMAGE_URL] },
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
              <p className="text-lg text-foreground/70">
                Refinancing replaces your current mortgage with a new one — to change rate or term, or to convert equity
                into cash. A lower note rate can still lose after costs if you move or refinance again first. Run
                break-even before you treat a headline rate as savings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="Rate-and-term">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/refinance/rate-term" className="hover:text-primary">Rate-and-term</Link>
                  </CardTitle>
                  <CardDescription>Lower your interest rate or shorten your term without taking cash out.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Cash-out">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/refinance/cash-out" className="hover:text-primary">Cash-out</Link>
                  </CardTitle>
                  <CardDescription>Convert home equity into cash. Different LTV and tax questions than rate-and-term.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Break-even math">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/refinance-break-even-when-lower-rate-loses" className="hover:text-primary">Break-even math</Link>
                  </CardTitle>
                  <CardDescription>Include points and origination. A lower note rate can still lose if you move first.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Streamline refinance">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/fha-va-streamline-refinance-less-docs" className="hover:text-primary">FHA / VA streamline</Link>
                  </CardTitle>
                  <CardDescription>Less documentation is not no-docs. Occupancy, payment history, and net benefit still apply.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="No closing cost refinance">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/no-closing-cost-refinance-rate-credit-tradeoff" className="hover:text-primary">“No closing cost” refi</Link>
                  </CardTitle>
                  <CardDescription>The credit that covers fees is usually paid for in the rate. Run break-even.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Discount points">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/discount-points-breakeven-without-sales-pitch" className="hover:text-primary">Discount points</Link>
                  </CardTitle>
                  <CardDescription>Break-even is cost divided by monthly P&amp;I savings. Not a temporary buydown.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="HELOC vs cash-out">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/heloc-vs-cash-out-refinance" className="hover:text-primary">HELOC vs cash-out</Link>
                  </CardTitle>
                  <CardDescription>Second lien vs replacing the first. Payment and tax questions differ.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="HELOC after year two">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/heloc-after-year-two-vs-cash-out" className="hover:text-primary">HELOC after year two</Link>
                  </CardTitle>
                  <CardDescription>Seasoning overlays after a recent closing — not a remake of lien structure.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Delayed financing">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/delayed-financing-after-cash-purchase" className="hover:text-primary">Delayed financing</Link>
                  </CardTitle>
                  <CardDescription>Cash purchase, then a cash-out later. Agency exception — not a statute.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Biweekly vs refinance">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/biweekly-extra-principal-vs-refinance" className="hover:text-primary">Biweekly vs refinance</Link>
                  </CardTitle>
                  <CardDescription>One extra payment a year versus a new note. No savings promise.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Recast vs refinance">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/recast-vs-refinance" className="hover:text-primary">Recast vs refinance</Link>
                  </CardTitle>
                  <CardDescription>Keep the rate after a lump sum, or replace the note. Different costs.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Condo aging HOA">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link href="/blog/refinancing-condo-aging-hoa" className="hover:text-primary">Condo with an aging HOA</Link>
                  </CardTitle>
                  <CardDescription>Project reserves, litigation, and insurance can stall a refinance.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <BreakEvenTable table="stay-scenarios" />

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
            <RelatedContent path="/refinance" title="Refinance education and tools" />
            <IsThisRightForMe table="equity" />
            <NextStepCta path="/refinance" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}
