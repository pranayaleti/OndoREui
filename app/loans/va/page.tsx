import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Shield, Star, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VA Home Loans in Utah | Zero Down for Veterans | Ondo Real Estate",
  description: "VA loans offer zero down payment and no PMI for eligible veterans and active-duty service members in Utah. Learn about the funding fee, COE, and Hill AFB area lenders.",
  alternates: { canonical: `${SITE_URL}/loans/va/` },
  openGraph: { title: "VA Home Loans in Utah | Zero Down for Veterans | Ondo Real Estate", description: "VA loans offer zero down payment and no PMI for eligible veterans in Utah." },
  twitter: { card: "summary_large_image", title: "VA Loans in Utah | Ondo Real Estate", description: "Zero down payment home loans for eligible veterans and service members in Utah." },
}

const benefits = [
  { title: "Zero Down Payment", description: "No down payment required for eligible borrowers — the most powerful benefit in housing finance", icon: <DollarSign className="h-6 w-6" /> },
  { title: "No Private Mortgage Insurance", description: "VA loans never require PMI regardless of down payment amount — saving hundreds per month", icon: <Shield className="h-6 w-6" /> },
  { title: "Competitive Rates", description: "VA loans historically carry rates 0.25–0.5% below conventional — backed by the government guarantee", icon: <Star className="h-6 w-6" /> },
  { title: "Limited Closing Costs", description: "VA caps what lenders can charge; sellers can pay all closing costs on a VA loan", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function VALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="VA Home Loans in Utah"
        description="VA loans offer zero down payment and no PMI for eligible veterans in Utah."
        pathname="/loans/va"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "VA Loans", url: `${SITE_URL}/loans/va` },
        ])}
      />
      <PageBanner title="VA Home Loans" subtitle="Earned benefits for veterans and active-duty service members — zero down, no PMI" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The VA Home Loan Benefit</h2>
              <p className="text-lg text-foreground/70">
                The VA home loan program is one of the most powerful financial benefits available to those who have served. Backed by the Department of Veterans Affairs, VA loans allow eligible borrowers to purchase a home with no down payment, no PMI, and competitive rates — in Utah and nationwide.
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
              <h3 className="text-2xl font-bold mb-6">Eligibility & Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Who Is Eligible</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Veterans with honorable discharge</li>
                    <li>• Active-duty service members (90+ days)</li>
                    <li>• National Guard / Reserves (6+ years or 90 days wartime)</li>
                    <li>• Surviving spouses of veterans who died in service</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">VA Funding Fee (2024)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• First use, 0% down: 2.15% of loan amount</li>
                    <li>• Subsequent use, 0% down: 3.3%</li>
                    <li>• Can be financed into the loan</li>
                    <li>• Waived for veterans with service-connected disability</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Certificate of Eligibility (COE)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Required before the loan can close</li>
                    <li>• Most lenders pull it directly from VA systems (takes minutes)</li>
                    <li>• Or request via eBenefits or VA Form 26-1880</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Utah Military Context</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Hill Air Force Base (Davis County) — large VA loan market</li>
                    <li>• Dugway Proving Ground, Tooele County</li>
                    <li>• Utah National Guard installations across Wasatch Front</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">VA vs. Conventional: The Numbers</h3>
              <p className="text-foreground/70 mb-4">On a $450,000 purchase in Davis County:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">VA Loan</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Down payment: $0</li>
                    <li>• PMI: $0/month</li>
                    <li>• Funding fee: ~$9,675 (financed)</li>
                    <li>• Total cash to close: ~$5,000–8,000 (closing costs only)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Conventional (5% down)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Down payment: $22,500</li>
                    <li>• PMI: ~$150–200/month until 80% LTV</li>
                    <li>• No funding fee</li>
                    <li>• Total cash to close: ~$31,000+</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Start Your VA Loan</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Get Pre-Approved</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
