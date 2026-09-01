import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, MapPin, Home, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { USDA_SNAPSHOT, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "USDA Rural Loans in Utah | Map and Income Tests | Ondo Real Estate",
  description:
    "USDA loans can be zero down when the address map, household income, and occupancy tests fit. Confirm current RD tools. Educational, not a credit decision.",
  alternates: { canonical: `${SITE_URL}/loans/usda/` },
  openGraph: { title: "USDA Rural Loans in Utah | Map and Income Tests | Ondo Real Estate", description: "USDA loans can be zero down when map, income, and occupancy tests fit. Confirm current RD tools.", images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: "USDA Loans in Utah | Ondo Real Estate", description: "Zero down when map, income, and occupancy tests fit. Confirm current USDA tools.", images: [DEFAULT_OG_IMAGE_URL] },
}

const benefits = [
  { title: "Zero down when eligible", description: "100% financing is available only when the property map, household income, occupancy, and overlays all fit.", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Address-specific map", description: USDA_SNAPSHOT.mapNote, icon: <MapPin className="h-6 w-6" /> },
  { title: "Guarantee fee (snapshot)", description: `${USDA_SNAPSHOT.upfrontGuaranteeFee}. Annual: ${USDA_SNAPSHOT.annualFee}. ${USDA_SNAPSHOT.feeNote}`, icon: <Home className="h-6 w-6" /> },
  { title: "Primary residence", description: USDA_SNAPSHOT.occupancy, icon: <CheckCircle className="h-6 w-6" /> },
]

export default function USDALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="USDA Rural Loans in Utah"
        description="USDA loans can be zero down when map, income, and occupancy tests fit. Confirm current RD tools."
        pathname="/loans/usda"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "USDA Loans", url: `${SITE_URL}/loans/usda` },
        ])}
      />
      <PageBanner title="USDA Rural Loans" subtitle="Zero down payment financing for eligible rural and suburban Utah communities" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a USDA Loan?</h2>
              <p className="text-lg text-foreground/70">
                USDA Rural Development loans are backed by the U.S. Department of Agriculture. Zero down is available
                only after the property address, household income, occupancy, and lender overlays all fit. Pricing is
                file-specific. Run USDA’s published map before you write an offer as if the program is available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((b, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{b.icon}</div>
                    <CardTitle>{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">USDA Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Income Limits</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• {USDA_SNAPSHOT.incomeNote}</li>
                    <li>• Confirm household size and the current area limit on USDA’s published tool. Do not use a marketing-page AMI figure (as of {LENDING_FACTS_AS_OF}).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Eligible Utah Areas</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• {USDA_SNAPSHOT.mapNote}</li>
                    <li>• Some Cache Valley, Sanpete, and rural Utah County pockets have been eligible in past map vintages. That is not a substitute for the current address lookup.</li>
                    <li>• How-to: <Link href="/blog/usda-map-income-limit-eligibility" className="text-primary underline underline-offset-4">USDA map and income limit</Link></li>
                    <li>• Veteran in a rural tract: <Link href="/blog/usda-vs-va-vs-fha-veteran-rural" className="text-primary underline underline-offset-4">USDA vs VA vs FHA</Link> — comparison, not a pick.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Fees (confirm current RD notice)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Upfront: {USDA_SNAPSHOT.upfrontGuaranteeFee}</li>
                    <li>• Annual: {USDA_SNAPSHOT.annualFee}</li>
                    <li>• {USDA_SNAPSHOT.feeNote}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Property &amp; Credit</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• {USDA_SNAPSHOT.occupancy}</li>
                    <li>• {USDA_SNAPSHOT.creditNote}</li>
                    <li>• Property must be in a currently eligible census area — verify before the offer.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">USDA vs. FHA: Which Zero-Down Option Fits?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">USDA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Zero down when map, income, and occupancy tests pass</li>
                    <li>• Guarantee fee snapshot is dated in the facts module — confirm the current RD notice</li>
                    <li>• Compare total cost on two Loan Estimates rather than assuming USDA beats FHA</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">FHA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• No geographic map test — FHA is not census-tract limited the way USDA is</li>
                    <li>• HUD credit policy can sit lower than many USDA overlays; overlays still apply</li>
                    <li>• No USDA household income cap</li>
                    <li>• HUD county limits differ from USDA area limits — look up the current tables</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Check the map before the offer</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/blog/usda-map-income-limit-eligibility">USDA map how-to</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/usda-vs-va-vs-fha-veteran-rural">USDA vs VA vs FHA</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/qualify">Talk with a loan officer</Link></Button>
              </div>
            </div>
            <RelatedContent path="/loans/usda" />
            <IsThisRightForMe table="purchase" programs={["usda", "fha", "conventional"]} highlight="usda" />
            <NextStepCta path="/loans/usda" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>

      <CityLinksGrid title="USDA Loans by City" servicePrefix="loans" subServiceSlug="usda" />
    </main>
  )
}
