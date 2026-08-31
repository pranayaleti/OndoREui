import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Reverse Mortgages in Utah | Ondo Real Estate",
  description: "A reverse mortgage lets Utah homeowners 62+ convert home equity into income without monthly mortgage payments. Learn how HECMs work and the trade-offs.",
  alternates: { canonical: `${SITE_URL}/loans/reverse/` },
  openGraph: { title: "Reverse Mortgages in Utah | Ondo Real Estate", description: "A reverse mortgage lets Utah homeowners 62+ convert home equity into income without monthly mortgage payments. Learn how HECMs work and the trade-offs.", url: `${SITE_URL}/loans/reverse/`, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: "Reverse Mortgages in Utah | Ondo Real Estate", description: "A reverse mortgage lets Utah homeowners 62+ convert home equity into income without monthly mortgage payments. Learn how HECMs work and the trade-offs.", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function ReverseMortgagePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Reverse Mortgages in Utah"
        description={"A reverse mortgage lets Utah homeowners 62+ convert home equity into income without monthly mortgage payments. Learn how HECMs work and the trade-offs."}
        pathname="/loans/reverse"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "Reverse Mortgage", url: `${SITE_URL}/loans/reverse` },
        ])}
      />
      <PageBanner title="Reverse Mortgage" subtitle="Turn equity into income for homeowners 62+" backgroundImage="/suburban-house-garden.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How a Reverse Mortgage Works</h2>
              <p className="text-lg text-foreground/70">A reverse mortgage (usually an FHA-insured HECM) lets homeowners 62 and older convert part of their home equity into cash — as a lump sum, monthly payments, or a line of credit — without making monthly mortgage payments. The loan is repaid when the home is sold or the last borrower leaves. You keep the title and must stay current on taxes and insurance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card key="No monthly payment">
                <CardHeader>
                  <CardTitle className="text-lg">No monthly payment</CardTitle>
                  <CardDescription>You receive funds instead of paying a mortgage each month.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Several payout options">
                <CardHeader>
                  <CardTitle className="text-lg">Several payout options</CardTitle>
                  <CardDescription>Lump sum, monthly income, a line of credit, or a combination.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="You keep the title">
                <CardHeader>
                  <CardTitle className="text-lg">You keep the title</CardTitle>
                  <CardDescription>You remain the owner; the loan is repaid from the home later.</CardDescription>
                </CardHeader>
              </Card>
              <Card key="Know the trade-offs">
                <CardHeader>
                  <CardTitle className="text-lg">Know the trade-offs</CardTitle>
                  <CardDescription>It reduces the equity your heirs inherit — best considered carefully.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button key="/loans/conventional" asChild variant="outline" size="sm">
                <Link href="/loans/conventional">Conventional loans</Link>
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
          </div>
        </div>
      </section>
    </main>
  )
}
