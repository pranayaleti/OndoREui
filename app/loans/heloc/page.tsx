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
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "HELOC & Home Equity Loans in Utah | Ondo Real Estate",
  description: "HELOCs and home equity loans (HELOAN) let Utah homeowners borrow against equity. Learn the difference, rates, and when each fits.",
  alternates: { canonical: `${SITE_URL}/loans/heloc/` },
  openGraph: { title: "HELOC & Home Equity Loans in Utah | Ondo Real Estate", description: "HELOCs and home equity loans (HELOAN) let Utah homeowners borrow against equity. Learn the difference, rates, and when each fits.", url: `${SITE_URL}/loans/heloc/`, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: "HELOC & Home Equity Loans in Utah | Ondo Real Estate", description: "HELOCs and home equity loans (HELOAN) let Utah homeowners borrow against equity. Learn the difference, rates, and when each fits.", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function HelocPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="HELOC & Home Equity Loans in Utah"
        description={"HELOCs and home equity loans (HELOAN) let Utah homeowners borrow against equity. Learn the difference, rates, and when each fits."}
        pathname="/loans/heloc"
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "HELOC / HELOAN", url: `${SITE_URL}/loans/heloc` },
        ])}
      />
      <PageBanner title="HELOC & Home Equity Loans" subtitle="Borrow against your equity — line of credit or lump sum" backgroundImage="/modern-townhouse-garage.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">HELOC vs Home Equity Loan</h2>
              <p className="text-lg text-foreground/70">Both let you borrow against the equity in your home while keeping your first mortgage. A HELOC is a revolving line of credit you draw from as needed (usually variable-rate); a home equity loan (HELOAN) is a one-time lump sum at a fixed rate. Which fits depends on whether your need is ongoing or one-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="HELOC — flexible">
                <CardHeader>
                  <CardTitle className="text-lg">HELOC — flexible</CardTitle>
                  <CardDescription>A revolving credit line you draw and repay as needed during the draw period.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="HELOAN — fixed">
                <CardHeader>
                  <CardTitle className="text-lg">HELOAN — fixed</CardTitle>
                  <CardDescription>A lump sum at a fixed rate and payment — predictable for a one-time cost.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Keep your first mortgage">
                <CardHeader>
                  <CardTitle className="text-lg">Keep your first mortgage</CardTitle>
                  <CardDescription>A second-lien option that doesn’t touch your existing low-rate mortgage.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Common uses">
                <CardHeader>
                  <CardTitle className="text-lg">Common uses</CardTitle>
                  <CardDescription>Renovations, tuition, or consolidating higher-interest debt.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/blog/heloc-vs-cash-out-refinance" asChild variant="outline" size="sm">
                <Link href="/blog/heloc-vs-cash-out-refinance">HELOC vs cash-out guide</Link>
              </Button>
              <Button key="/blog/heloc-after-year-two-vs-cash-out" asChild variant="outline" size="sm">
                <Link href="/blog/heloc-after-year-two-vs-cash-out">HELOC after year two</Link>
              </Button>
              <Button key="/blog/cross-collateral-equity-to-buy-another-house" asChild variant="outline" size="sm">
                <Link href="/blog/cross-collateral-equity-to-buy-another-house">Cross-collateral education</Link>
              </Button>
              <Button key="/refinance/cash-out" asChild variant="outline" size="sm">
                <Link href="/refinance/cash-out">Cash-out refinance</Link>
              </Button>
              <Button key="/loans/conventional" asChild variant="outline" size="sm">
                <Link href="/loans/conventional">Conventional loans</Link>
              </Button>
              <Button key="/blog/finishing-basement-roi" asChild variant="outline" size="sm">
                <Link href="/blog/finishing-basement-roi">Home improvement ROI</Link>
              </Button>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to talk it through?</h3>
              <p className="text-foreground/70 mb-6">Get a clear, no-pressure look at your options with an Ondo advisor.</p>
              <Button asChild size="lg">
                <Link href="/contact">Speak with an advisor</Link>
              </Button>
            </div>
            <RelatedContent path="/loans/heloc" />
            <IsThisRightForMe table="equity" highlight="heloc" />
            <NextStepCta path="/loans/heloc" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}
