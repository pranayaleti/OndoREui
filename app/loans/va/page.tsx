import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Shield, Star, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ContentFaq } from "@/components/content/content-faq"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { VA_FUNDING_FEE, EXAMPLE_NOTE, EXAMPLE_PURCHASE_PRICE_UTAH, HILL_AFB_VA, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "VA Home Loans in Utah | Zero Down for Veterans | Ondo Real Estate",
  description: "VA loans offer zero down payment and no PMI for eligible veterans and active-duty service members in Utah. Learn about the funding fee, COE, and Hill AFB area lenders.",
  alternates: { canonical: `${SITE_URL}/loans/va/` },
  openGraph: { title: "VA Home Loans in Utah | Zero Down for Veterans | Ondo Real Estate", description: "VA loans offer zero down payment and no PMI for eligible veterans in Utah.", images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: "VA Loans in Utah | Ondo Real Estate", description: "Zero down payment home loans for eligible veterans and service members in Utah.", images: [DEFAULT_OG_IMAGE_URL] },
}

const benefits = [
  { title: "Zero down when eligible", description: VA_FUNDING_FEE.downPaymentNote, icon: <DollarSign className="h-6 w-6" /> },
  { title: "No private mortgage insurance", description: "VA loans do not charge monthly PMI. That is not a published monthly savings versus conventional.", icon: <Shield className="h-6 w-6" /> },
  { title: "VA pricing", description: "VA loans are often priced differently from conventional because of the guarantee. That is not a promise of a lower rate on your file.", icon: <Star className="h-6 w-6" /> },
  { title: "Closing costs", description: "VA rules allow sellers to pay some or all of certain closing costs, up to program limits. It is not automatic.", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function VALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="VA Home Loans in Utah"
        description="VA loans offer zero down payment and no PMI for eligible veterans in Utah."
        pathname="/loans/va/"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans/` },
          { name: "VA Loans", url: `${SITE_URL}/loans/va/` },
        ])}
      />
      <PageBanner title="VA Home Loans" subtitle="Earned benefits for veterans and active-duty service members: zero down, no PMI" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The VA Home Loan Benefit</h2>
              <p className="text-lg text-foreground/70">
                The VA home loan program is a benefit for people who have served, subject to entitlement, occupancy, and lender overlays. Backed by the Department of Veterans Affairs, VA loans can allow eligible borrowers to purchase with no down payment and no monthly PMI. Pricing is still file-specific.
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
                    <li>• Veterans with qualifying service and discharge (confirm the current VA chart)</li>
                    <li>• Active-duty service members, National Guard, and Reserves when service-length rules are met</li>
                    <li>• Some surviving spouses — COE is the source of truth, not this list</li>
                    <li>• Service-length and discharge rules are more detailed than a marketing bullet. Confirm on va.gov and with a Certificate of Eligibility.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">VA Funding Fee (confirm current schedule)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• First use, less than 5% down: {VA_FUNDING_FEE.firstUseLessThan5PercentDown} (as of {LENDING_FACTS_AS_OF})</li>
                    <li>• Subsequent use, less than 5% down: {VA_FUNDING_FEE.subsequentUseLessThan5PercentDown}</li>
                    <li>• Can often be financed into the loan</li>
                    <li>• {VA_FUNDING_FEE.exemptionNote}</li>
                    <li className="text-sm">{VA_FUNDING_FEE.source}</li>
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
                  <h4 className="text-lg font-semibold mb-3">Utah Military Context (Hill AFB)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• {HILL_AFB_VA.where}</li>
                    <li>• {HILL_AFB_VA.commute}</li>
                    <li>• {HILL_AFB_VA.baseHousingVsPurchase}</li>
                    <li>• {HILL_AFB_VA.coe} Deep guide:{" "}
                      <Link href="/blog/hill-afb-va-coe-occupancy" className="underline underline-offset-4">
                        Hill AFB COE and occupancy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">VA vs. Conventional: an illustration, not a quote</h3>
              <p className="text-foreground/70 mb-4">
                On a ${EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")} purchase (Davis County is an example location only). {EXAMPLE_NOTE} {VA_FUNDING_FEE.downPaymentNote}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">VA loan</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Down payment: $0 when remaining entitlement and occupancy rules are met</li>
                    <li>• Monthly PMI: none on a VA purchase</li>
                    <li>• Funding fee: first-use, less than 5% down is {VA_FUNDING_FEE.firstUseLessThan5PercentDown} of the loan amount on the published schedule as of {LENDING_FACTS_AS_OF}. Example: {VA_FUNDING_FEE.firstUseLessThan5PercentDown} of ${EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")} = $9,675 if that schedule still applies. Confirm before quoting. Can often be financed.</li>
                    <li>• Cash to close: closing costs, prepaids, and any allowed seller concessions still apply. We do not publish a cash-to-close range here.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">Conventional (5% down, same price)</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Down payment: ${Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.05).toLocaleString("en-US")} in this illustration</li>
                    <li>• PMI: often required below 20% equity. The monthly amount depends on score, LTV, and the insurer. We do not publish a PMI dollar range.</li>
                    <li>• No VA funding fee</li>
                    <li>• Cash to close: down payment plus closing costs and prepaids. Do not treat a round number on this page as yours.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">Funding fee, entitlement, restoration, and residual</h3>
              <p className="text-foreground/70 mb-4">
                Three files veterans ask about next:{" "}
                <Link href="/blog/va-funding-fee-finance-vs-pay-cash">finance vs pay the funding fee</Link>,{" "}
                <Link href="/blog/va-entitlement-second-va-loan">using VA while another VA loan is open</Link>,{" "}
                <Link href="/blog/selling-with-va-loan-entitlement-restoration">
                  selling and restoring entitlement after payoff
                </Link>
                , and{" "}
                <Link href="/blog/va-residual-income-vs-dti">residual income vs DTI</Link>. Hill AFB (Davis County)
                occupancy and COE — not a mill doorway:{" "}
                <Link href="/blog/hill-afb-va-coe-occupancy">Hill AFB COE + occupancy</Link>. A veteran buying in a rural
                tract should compare tests, not slogans:{" "}
                <Link href="/blog/usda-vs-va-vs-fha-veteran-rural">USDA vs VA vs FHA</Link>. A VA-to-VA rate reduction
                with fewer docs is a{" "}
                <Link href="/blog/fha-va-streamline-refinance-less-docs">VA IRRRL / streamline</Link> — not a cash-out.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Ask about VA eligibility</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Talk with a loan officer</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/blog/hill-afb-va-coe-occupancy">Hill AFB COE + occupancy</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare all loan types</Link></Button>
              </div>
            </div>
            <RelatedContent path="/loans/va" title="VA-related education" />
            <IsThisRightForMe table="purchase" programs={["va", "fha", "conventional"]} highlight="va" />
            <NextStepCta path="/loans/va" />
            <ContentFaq
              items={[
                {
                  question: "Is every veteran eligible for zero down?",
                  answer: VA_FUNDING_FEE.downPaymentNote,
                },
                {
                  question: "Is the funding fee always charged?",
                  answer: VA_FUNDING_FEE.exemptionNote,
                },
                {
                  question: "Can I stay in Hill AFB housing and still call a purchased house a VA primary?",
                  answer: HILL_AFB_VA.baseHousingVsPurchase,
                },
              ]}
            />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>

      <CityLinksGrid title="VA Loans by City" servicePrefix="loans" subServiceSlug="va" />
    </main>
  )
}
