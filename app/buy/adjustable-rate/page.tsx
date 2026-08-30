import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TrendingDown, Clock, Calculator, AlertCircle } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ARM_CAPS, LENDING_FACTS_AS_OF } from "@/lib/content"

export const metadata: Metadata = pageCanonicalMetadata("/buy/adjustable-rate", {
  title: "Adjustable-Rate Mortgage (ARM) Guide | Utah Real Estate",
  description: "Learn about adjustable-rate mortgages in Utah. Understand ARM benefits, rate caps, and when an ARM might be right for you.",
})


export default function AdjustableRatePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Adjustable-Rate Mortgage (ARM) Guide | Utah Real Estate"
        description="Learn about adjustable-rate mortgages in Utah. Understand ARM benefits, rate caps, and when an ARM might be right for you."
        pathname="/buy/adjustable-rate"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "Adjustable-Rate Mortgage", url: `${SITE_URL}/buy/adjustable-rate` },
        ])}
      />
      <PageBanner
        title="Adjustable-Rate Mortgage (ARM)"
        subtitle="Lower initial rates with flexibility for short-term homeowners"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What is an Adjustable-Rate Mortgage?</h2>
              <p className="text-lg text-foreground/70">
                An ARM starts with a fixed interest rate for an initial period, then adjusts periodically based on market conditions. This can offer lower initial payments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <TrendingDown className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Lower Initial Rate</CardTitle>
                  <CardDescription>Start with a lower interest rate and monthly payment than fixed-rate loans.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Short-Term Ownership</CardTitle>
                  <CardDescription>Ideal if you plan to sell or refinance before the rate adjusts.</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Rate Caps</CardTitle>
                  <CardDescription>
                    Initial, periodic, and lifetime caps limit how far the note rate can move. Read{" "}
                    <Link href="/blog/arm-caps-in-plain-english" className="underline underline-offset-4">
                      ARM caps in plain English
                    </Link>
                    .
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Understand the Risks</CardTitle>
                  <CardDescription>Rates can increase, potentially raising your monthly payment over time.</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">How caps work (as of {LENDING_FACTS_AS_OF})</h3>
              <p className="text-foreground/70 mb-4">{ARM_CAPS.notation}</p>
              <ul className="space-y-3 text-foreground/70">
                <li>
                  <strong>Initial.</strong> {ARM_CAPS.initial}
                </li>
                <li>
                  <strong>Periodic.</strong> {ARM_CAPS.periodic}
                </li>
                <li>
                  <strong>Lifetime.</strong> {ARM_CAPS.lifetime}
                </li>
              </ul>
              <p className="mt-4 text-foreground/70">{ARM_CAPS.fullyIndexed}</p>
              <p className="mt-2 text-foreground/70">{ARM_CAPS.paymentNote}</p>
              <p className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/blog/arm-caps-in-plain-english">ARM caps in plain English</Link>
                </Button>
              </p>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">Common ARM types</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-2">5/1 ARM</h4>
                  <p className="text-foreground/70">Fixed rate for 5 years, then adjusts annually. Often used when the plan is to sell or refinance before the first adjustment — not a promise that you will.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">7/1 ARM</h4>
                  <p className="text-foreground/70">Fixed rate for 7 years, then adjusts annually.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">10/1 ARM</h4>
                  <p className="text-foreground/70">Fixed rate for 10 years, then adjusts annually. Longer fixed period, still an ARM after that date.</p>
                </div>
              </div>
              <p className="mt-6 text-foreground/70">
                Interest-only is a different payment machine: principal is not required during a stated period. That is
                not an ARM teaser and not a temporary buydown.{" "}
                <Link href="/blog/interest-only-mortgages-who-they-are-for" className="underline underline-offset-4">
                  Interest-only: who it is for
                </Link>
                .
              </p>
            </div>

            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold mb-6">Is an ARM Right for You?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/calculators/mortgage-payment">Compare Loan Options</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/arm-caps-in-plain-english">Read the cap structure</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog/interest-only-mortgages-who-they-are-for">Interest-only vs ARM</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Speak with a Loan Officer</Link>
                </Button>
              </div>
            </div>

            <ConsultationCTA
              title="ARM structure, not a rate promise"
              description="A loan officer can explain index, margin, and caps on a Loan Estimate. That conversation is not a quote from this page."
              variant="card"
            />
            <RelatedContent path="/buy/adjustable-rate" />
            <NextStepCta path="/buy/adjustable-rate" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}

