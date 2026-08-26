import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cash-Out Refinance in Utah | Ondo Real Estate",
  description: "A cash-out refinance converts home equity into cash by replacing your mortgage with a larger loan. Learn the limits, costs, and smart uses.",
  alternates: { canonical: `${SITE_URL}/refinance/cash-out/` },
  openGraph: { title: "Cash-Out Refinance in Utah | Ondo Real Estate", description: "A cash-out refinance converts home equity into cash by replacing your mortgage with a larger loan. Learn the limits, costs, and smart uses.", url: `${SITE_URL}/refinance/cash-out/` },
  twitter: { card: "summary_large_image", title: "Cash-Out Refinance in Utah | Ondo Real Estate", description: "A cash-out refinance converts home equity into cash by replacing your mortgage with a larger loan. Learn the limits, costs, and smart uses." },
}

export default function CashOutRefinancePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Cash-Out Refinance in Utah"
        description={"A cash-out refinance converts home equity into cash by replacing your mortgage with a larger loan. Learn the limits, costs, and smart uses."}
        pathname="/refinance/cash-out"
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Refinance", url: `${SITE_URL}/refinance` },
          { name: "Cash-Out", url: `${SITE_URL}/refinance/cash-out` },
        ])}
      />
      <PageBanner title="Cash-Out Refinance" subtitle="Turn home equity into cash — at mortgage rates" backgroundImage="/modern-townhouse-garage.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a Cash-Out Refinance?</h2>
              <p className="text-lg text-foreground/70">A cash-out refinance replaces your mortgage with a larger loan and gives you the difference as cash. Lenders typically let you borrow up to 80% of your home’s value. It’s often cheaper than other borrowing because it’s secured by your home — but it resets your mortgage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="Access equity">
                <CardHeader>
                  <CardTitle className="text-lg">Access equity</CardTitle>
                  <CardDescription>Borrow against equity you’ve built, usually up to 80% of value (LTV).</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Lower-rate borrowing">
                <CardHeader>
                  <CardTitle className="text-lg">Lower-rate borrowing</CardTitle>
                  <CardDescription>Mortgage rates are typically well below credit cards or personal loans.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Smart uses">
                <CardHeader>
                  <CardTitle className="text-lg">Smart uses</CardTitle>
                  <CardDescription>Renovations that add value, high-interest debt payoff, or a down payment.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Weigh the reset">
                <CardHeader>
                  <CardTitle className="text-lg">Weigh the reset</CardTitle>
                  <CardDescription>You’re re-starting the loan and paying closing costs — run the numbers first.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/refinance/rate-term" asChild variant="outline" size="sm">
                <Link href="/refinance/rate-term">Rate-and-term refinance</Link>
              </Button>
              <Button key="/blog/cash-on-cash-return-explained" asChild variant="outline" size="sm">
                <Link href="/blog/cash-on-cash-return-explained">Cash-on-cash return</Link>
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
          </div>
        </div>
      </section>
    </main>
  )
}
