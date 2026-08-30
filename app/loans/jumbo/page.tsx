import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, TrendingUp, Building2, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { CONFORMING_LIMIT_NOTE } from "@/lib/content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jumbo Loans in Utah | Park City & Draper | Ondo Real Estate",
  description: "Jumbo loans finance homes above the current FHFA conforming limit for the property county. Look up this year’s table. This is not a quote.",
  alternates: { canonical: `${SITE_URL}/loans/jumbo/` },
  openGraph: { title: "Jumbo Loans in Utah | Park City & Draper | Ondo Real Estate", description: "Jumbo loans finance homes above the current FHFA conforming limit for the property county." },
  twitter: { card: "summary_large_image", title: "Jumbo Loans in Utah | Ondo Real Estate", description: "Jumbo loans for high-value properties in Park City, Draper, and across Utah." },
}

const benefits = [
  { title: "Above conforming limits", description: CONFORMING_LIMIT_NOTE, icon: <DollarSign className="h-6 w-6" /> },
  { title: "Pricing is file-specific", description: "Jumbo pricing can sit near conforming pricing for some files. It is not always higher, and it is not a promised spread.", icon: <TrendingUp className="h-6 w-6" /> },
  { title: "Utah high-value markets", description: "Park City, Draper, Holladay, Cottonwood Heights, and similar corridors often need jumbo when the county limit is exceeded.", icon: <Building2 className="h-6 w-6" /> },
  { title: "Flexible structures", description: "Fixed and ARM options exist. Interest-only and portfolio lending are overlays, not a product you are promised.", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function JumboLoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Jumbo Loans in Utah"
        description="Jumbo loans finance homes above the current FHFA conforming limit for the property county."
        pathname="/loans/jumbo"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "Jumbo Loans", url: `${SITE_URL}/loans/jumbo` },
        ])}
      />
      <PageBanner title="Jumbo Loans" subtitle="Financing for Utah's premium and high-value properties" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a Jumbo Loan?</h2>
              <p className="text-lg text-foreground/70">
                A jumbo loan is a mortgage that exceeds the conforming loan limits set by Fannie Mae and Freddie Mac. {CONFORMING_LIMIT_NOTE} High-cost counties (for example Summit) can have a higher ceiling than the rest of the state. Do not use a number copied from an old blog post.
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
              <h3 className="text-2xl font-bold mb-6">Jumbo Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Credit Score</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Credit overlays are set by the investor; 700+ is common but not a promise</li>
                    <li>• No government guarantee; lenders set their own overlays</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Down Payment</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Typically 10–20% depending on loan size</li>
                    <li>• Some portfolio lenders offer 5–10% with reserves</li>
                    <li>• 80% LTV preferred to avoid jumbo PMI</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Reserves</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• 6–18 months PITI in liquid or near-liquid assets</li>
                    <li>• Retirement accounts often count at 60–70%</li>
                    <li>• Business assets may qualify with 2-year CPA letter</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Utah High-Value Corridors</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Park City / Deer Valley / Jordanelle</li>
                    <li>• Draper, South Jordan, Holladay</li>
                    <li>• Cottonwood Heights, Little Cottonwood Canyon area</li>
                    <li>• Emigration Canyon, Millcreek hillsides</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Jumbo vs. Conforming: Key Differences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Jumbo Considerations</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Stricter credit and reserve requirements</li>
                    <li>• Larger down payment typically expected</li>
                    <li>• Not sold to Fannie/Freddie, held in portfolio</li>
                    <li>• Full income documentation required</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">When Jumbo Makes Sense</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• The purchase exceeds the current FHFA conforming limit for that county</li>
                    <li>• Credit, reserves, and income documentation meet that investor’s overlays</li>
                    <li>• Pricing is compared on a Loan Estimate, not assumed to beat conforming</li>
                    <li>• A piggyback (two-loan) structure is a separate conversation, not the default</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Discuss a jumbo purchase</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/blog/jumbo-vs-conforming-fhfa-county-limit">FHFA lookup how-to</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/utah-county-conforming-loan-limit-lookup">Utah county lookup</Link></Button>
              </div>
            </div>
            <RelatedContent path="/loans/jumbo" />
            <IsThisRightForMe table="purchase" programs={["jumbo", "conventional"]} highlight="jumbo" />
            <NextStepCta path="/loans/jumbo" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>

      <CityLinksGrid title="Jumbo Loans by City" servicePrefix="loans" subServiceSlug="jumbo" />
    </main>
  )
}
