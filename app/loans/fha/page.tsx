import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Shield, Users, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FHA Loans in Utah | Low Down Payment | Ondo Real Estate",
  description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score. Learn requirements, MIP costs, and how FHA compares to conventional.",
  alternates: { canonical: `${SITE_URL}/loans/fha/` },
  openGraph: { title: "FHA Loans in Utah | Low Down Payment | Ondo Real Estate", description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score." },
  twitter: { card: "summary_large_image", title: "FHA Loans in Utah | Ondo Real Estate", description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score." },
}

const benefits = [
  { title: "3.5% Down Payment", description: "As low as 3.5% down with a 580+ credit score — one of the lowest available", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Flexible Credit Standards", description: "Scores as low as 500 accepted (with 10% down); ideal for buyers rebuilding credit", icon: <Shield className="h-6 w-6" /> },
  { title: "Gift Funds Allowed", description: "100% of the down payment can come from family gifts — no seasoning required", icon: <Users className="h-6 w-6" /> },
  { title: "Higher DTI Tolerance", description: "Debt-to-income up to 57% with compensating factors vs 43–45% for conventional", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function FHALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="FHA Loans in Utah"
        description="FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score."
        pathname="/loans/fha"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "FHA Loans", url: `${SITE_URL}/loans/fha` },
        ])}
      />
      <PageBanner title="FHA Loans" subtitle="Government-backed financing with low down payments and flexible credit requirements" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is an FHA Loan?</h2>
              <p className="text-lg text-foreground/70">
                FHA loans are mortgages insured by the Federal Housing Administration. Because the government backs the lender against default, lenders can offer lower down payment requirements and more flexible qualification standards — making homeownership accessible to more Utah buyers.
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
              <h3 className="text-2xl font-bold mb-6">FHA Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Credit Score</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• 580+ → 3.5% minimum down payment</li>
                    <li>• 500–579 → 10% minimum down payment</li>
                    <li>• Below 500 → not eligible for FHA</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Mortgage Insurance Premium (MIP)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Upfront MIP: 1.75% of loan amount (can be financed)</li>
                    <li>• Annual MIP: 0.55–1.05% depending on term and LTV</li>
                    <li>• MIP stays for life of loan if down payment &lt; 10%</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Loan Limits (2024, Utah)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Salt Lake, Utah, Davis counties: $524,225 (1-unit)</li>
                    <li>• Summit County (Park City area): $1,149,825 (high-cost)</li>
                    <li>• Verify current limits at HUD.gov</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Property Requirements</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Must be primary residence</li>
                    <li>• FHA appraisal required (stricter than conventional)</li>
                    <li>• Property must meet HUD minimum property standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">FHA vs. Conventional: When FHA Wins</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">FHA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Lower credit score threshold</li>
                    <li>• Higher DTI tolerance</li>
                    <li>• Pairs well with Utah DPA programs</li>
                    <li>• Gift funds for full down payment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Conventional Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• No upfront MIP</li>
                    <li>• PMI removable at 80% LTV</li>
                    <li>• Higher loan limits</li>
                    <li>• Faster FHA appraisal turnaround without overlays</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Pre-Approved?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Get Pre-Approved</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CityLinksGrid title="FHA Loans by City" servicePrefix="loans" subServiceSlug="fha" />
    </main>
  )
}
