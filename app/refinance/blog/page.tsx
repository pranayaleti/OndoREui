import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Refinance Guides & Insights | Ondo Real Estate",
  description: "Refinance guides and mortgage insights: when to refinance, rate-and-term vs cash-out, pay-down strategies, and rate trends.",
  alternates: { canonical: `${SITE_URL}/refinance/blog/` },
  openGraph: { title: "Refinance Guides & Insights | Ondo Real Estate", description: "Refinance guides and mortgage insights: when to refinance, rate-and-term vs cash-out, pay-down strategies, and rate trends.", url: `${SITE_URL}/refinance/blog/` },
  twitter: { card: "summary_large_image", title: "Refinance Guides & Insights | Ondo Real Estate", description: "Refinance guides and mortgage insights: when to refinance, rate-and-term vs cash-out, pay-down strategies, and rate trends." },
}

export default function RefinanceBlogPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Refinance Guides & Insights"
        description={"Refinance guides and mortgage insights: when to refinance, rate-and-term vs cash-out, pay-down strategies, and rate trends."}
        pathname="/refinance/blog"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Refinance", url: `${SITE_URL}/refinance` },
          { name: "Guides", url: `${SITE_URL}/refinance/blog` },
        ])}
      />
      <PageBanner title="Refinance Guides" subtitle="Articles and math to time your refinance right" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Refinance, Explained</h2>
              <p className="text-lg text-foreground/70">Timing a refinance well comes down to a few numbers: your new rate, your remaining term, how long you’ll stay, and the closing costs. These guides walk through the math and the trade-offs so you can decide with confidence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="When to refinance">
                <CardHeader>
                  <CardTitle className="text-lg">When to refinance</CardTitle>
                  <CardDescription>The break-even rule and how long you need to stay for a refi to pay off.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Pay-down hacks">
                <CardHeader>
                  <CardTitle className="text-lg">Pay-down hacks</CardTitle>
                  <CardDescription>Biweekly payments, extra principal, and recasting to save interest.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Rate trends">
                <CardHeader>
                  <CardTitle className="text-lg">Rate trends</CardTitle>
                  <CardDescription>How to read the rate environment before locking a refinance.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Rent vs own">
                <CardHeader>
                  <CardTitle className="text-lg">Rent vs own</CardTitle>
                  <CardDescription>The bigger housing math behind buying, holding, and refinancing.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/blog/mortgage-paydown-hacks" asChild variant="outline" size="sm">
                <Link href="/blog/mortgage-paydown-hacks">Mortgage pay-down hacks</Link>
              </Button>
              <Button key="/blog/rent-vs-own-calculator-guide" asChild variant="outline" size="sm">
                <Link href="/blog/rent-vs-own-calculator-guide">Rent vs own</Link>
              </Button>
              <Button key="/blog" asChild variant="outline" size="sm">
                <Link href="/blog">All blog posts</Link>
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
