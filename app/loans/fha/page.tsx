import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Shield, Users, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { FHA_SNAPSHOT, LENDING_FACTS_AS_OF, FHA_COUNTY_LIMIT_NOTE } from "@/lib/content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FHA Loans in Utah | Low Down Payment | Ondo Real Estate",
  description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score. Learn requirements, MIP costs, and how FHA compares to conventional.",
  alternates: { canonical: `${SITE_URL}/loans/fha/` },
  openGraph: { title: "FHA Loans in Utah | Low Down Payment | Ondo Real Estate", description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score." },
  twitter: { card: "summary_large_image", title: "FHA Loans in Utah | Ondo Real Estate", description: "FHA loans let Utah buyers put as little as 3.5% down with a 580+ credit score." },
}

const benefits = [
  { title: "Low down payment options", description: `${FHA_SNAPSHOT.minDownPayment580Plus} down with 580+ under HUD policy; overlays often sit higher. ${FHA_SNAPSHOT.scoreNote}`, icon: <DollarSign className="h-6 w-6" /> },
  { title: "Flexible credit policy", description: FHA_SNAPSHOT.scoreNote, icon: <Shield className="h-6 w-6" /> },
  { title: "Gift funds", description: FHA_SNAPSHOT.giftFunds, icon: <Users className="h-6 w-6" /> },
  { title: "DTI with compensating factors", description: FHA_SNAPSHOT.dtiNote, icon: <CheckCircle className="h-6 w-6" /> },
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
                FHA loans are mortgages insured by the Federal Housing Administration. Because the government backs the lender against default, lenders can offer lower down payment requirements and more flexible qualification standards, making homeownership accessible to more Utah buyers.
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
                    <li>• 580+ → {FHA_SNAPSHOT.minDownPayment580Plus} minimum down (HUD; overlays apply)</li>
                    <li>• 500–579 → {FHA_SNAPSHOT.minDownPayment500To579} minimum down</li>
                    <li>• {FHA_SNAPSHOT.scoreNote}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Mortgage Insurance Premium (MIP)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Upfront MIP: {FHA_SNAPSHOT.upfrontMip} (as of {LENDING_FACTS_AS_OF})</li>
                    <li>• Annual MIP: {FHA_SNAPSHOT.annualMipNote}</li>
                    <li>• MIP stays for life of loan if down payment &lt; 10%</li>
                    <li>• How annual MIP actually ends vs conventional PMI: <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends" className="underline underline-offset-4">MIP vs PMI</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Loan limits</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• FHA publishes county loan limits each year. Utah counties differ.</li>
                    <li>• {FHA_COUNTY_LIMIT_NOTE}</li>
                    <li>• Confirm the property county on HUD’s current limit lookup before you quote a number.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Property Requirements</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Must be primary residence. A 2–4 unit house-hack is still occupancy of one unit — see{" "}
                      <Link href="/blog/house-hacking-duplex-with-fha" className="underline underline-offset-4">FHA duplex house-hack</Link>.</li>
                    <li>• FHA appraisal required (stricter than conventional)</li>
                    <li>• Property must meet HUD minimum property standards</li>
                    <li>• Condos: the project must be on HUD’s current roster or qualify for single-unit approval. See the <Link href="/blog/fha-condo-roster-project-approval" className="underline underline-offset-4">FHA condo roster guide</Link>. A listing that says “townhome” is not automatically a condo — <Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask" className="underline underline-offset-4">townhome vs condo HOA docs</Link>.</li>
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
                    <li>• PMI can often be removed with enough equity (see conventional PMI rules)</li>
                    <li>• Higher loan limits in many counties (confirm FHFA vs HUD tables)</li>
                    <li>• Property standards that are typically less repair-heavy than HUD MPRs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Compare FHA with conventional</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional guide</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/hazard-vs-ho3-vs-ho6-condo-insurance">Hazard vs HO-3 vs HO-6</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/fha-condo-roster-project-approval">FHA condo roster</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask">Townhome vs condo HOA docs</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/should-i-wait-for-20-percent-down">Wait for 20% vs buy sooner</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">MIP vs PMI exit</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/house-hacking-duplex-with-fha">FHA duplex house-hack</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/usda-vs-va-vs-fha-veteran-rural">USDA vs VA vs FHA</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/dpa-stacked-with-fha-gift-funds">DPA + FHA gift</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/qualify">Talk with a loan officer</Link></Button>
              </div>
            </div>
            <RelatedContent path="/loans/fha" />
            <IsThisRightForMe table="purchase" programs={["fha", "conventional", "va"]} highlight="fha" />
            <NextStepCta path="/loans/fha" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>

      <CityLinksGrid title="FHA Loans by City" servicePrefix="loans" subServiceSlug="fha" />
    </main>
  )
}
