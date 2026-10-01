import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"

const description =
  "How a reverse mortgage (HECM) works for Utah homeowners 62+: the balance grows over time, you keep paying taxes and insurance, and counseling is required first."

export const metadata: Metadata = {
  title: pageTitle("Reverse Mortgages in Utah | Ondo Real Estate"),
  description,
  alternates: { canonical: `${SITE_URL}/loans/reverse/` },
  openGraph: { title: pageTitleText("Reverse Mortgages in Utah | Ondo Real Estate"), description, url: `${SITE_URL}/loans/reverse/`, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: pageTitleText("Reverse Mortgages in Utah | Ondo Real Estate"), description, images: [DEFAULT_OG_IMAGE_URL] },
}

export default function ReverseMortgagePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Reverse Mortgages in Utah"
        description={description}
        pathname="/loans/reverse"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "Reverse Mortgage", url: `${SITE_URL}/loans/reverse` },
        ])}
      />
      <PageBanner title="Reverse Mortgage" subtitle="How it works, what it costs, and what you still owe, for homeowners 62+" backgroundImage="/suburban-house-garden.webp" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How a Reverse Mortgage Works</h2>
              <p className="text-lg text-foreground/70">A reverse mortgage (usually an FHA-insured HECM) lets homeowners 62 and older borrow against part of their home equity as a lump sum, monthly payments, or a line of credit, with no required monthly mortgage payment. It is still a loan. Interest and mortgage insurance are added to the balance every month, so the amount owed grows over time and your equity shrinks. The loan comes due when the last borrower dies, sells, or no longer lives in the home as a primary residence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="No required monthly mortgage payment">
                <CardHeader>
                  <CardTitle className="text-lg">No required monthly mortgage payment</CardTitle>
                  <CardDescription>You are not required to make a monthly mortgage payment, but interest and mortgage insurance are added to the balance, so what you owe grows each month.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Several payout options">
                <CardHeader>
                  <CardTitle className="text-lg">Several payout options</CardTitle>
                  <CardDescription>Lump sum, monthly income, a line of credit, or a combination.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="You stay on title, with conditions">
                <CardHeader>
                  <CardTitle className="text-lg">You stay on title, with conditions</CardTitle>
                  <CardDescription>You remain the owner, but you must keep paying property taxes, homeowner&apos;s insurance and any HOA dues, and keep the home in good repair. If you fall behind, the lender can call the loan due and foreclose.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Know the trade-offs">
                <CardHeader>
                  <CardTitle className="text-lg">Know the trade-offs</CardTitle>
                  <CardDescription>It reduces the equity your heirs inherit. The loan is repaid from the sale of the home or by your heirs paying it off, and the amount owed is limited to the value of the home.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="mb-12 rounded-lg border border-border bg-muted p-6">
              <h3 className="text-xl font-bold mb-3">What to know before you decide</h3>
              <ul className="list-disc space-y-2 pl-5 text-foreground/80">
                <li>HUD-approved counseling is required before you can apply for an FHA-insured HECM. A counselor will go over the costs, the alternatives and the effect on your heirs.</li>
                <li>Costs include an upfront mortgage insurance premium, an annual mortgage insurance premium, origination and closing costs, and servicing fees. These are usually financed into the loan, which makes the balance grow faster.</li>
                <li>The loan comes due when the last borrower dies, sells the home, or no longer lives there as a primary residence. A move to a care facility for about 12 months in a row can trigger repayment.</li>
                <li>You must keep paying property taxes, homeowner&apos;s insurance and HOA dues, and maintain the home. Missing these can lead to foreclosure.</li>
                <li>A spouse who is not on the loan may have limited protections if the borrower dies, and only if certain conditions are met. Ask about this before you apply.</li>
                <li>Funds you receive can affect eligibility for needs-based benefits such as Medicaid or SSI. Talk to a benefits counselor or tax professional first.</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/loans/conventional" asChild variant="outline" size="sm">
                <Link href="/loans/conventional">Conventional loans</Link>
              </Button>
              <Button key="/loans/heloc" asChild variant="outline" size="sm">
                <Link href="/loans/heloc">HELOC</Link>
              </Button>
              <Button key="/refinance/cash-out" asChild variant="outline" size="sm">
                <Link href="/refinance/cash-out">Cash-out refinance</Link>
              </Button>
              <Button key="/calculators/retirement" asChild variant="outline" size="sm">
                <Link href="/calculators/retirement">Retirement calculator</Link>
              </Button>
              <Button key="/contact" asChild variant="outline" size="sm">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to talk it through?</h3>
              <p className="text-foreground/70 mb-6">Get a clear, no-pressure look at your options with an Ondo advisor.</p>
              <Button asChild size="lg">
                <Link href="/contact">Speak with an advisor</Link>
              </Button>
            </div>

            <LendingDisclaimer className="mt-10" />
          </div>
        </div>
      </section>
    </main>
  )
}
