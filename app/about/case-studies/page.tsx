import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: pageTitle("Case Studies | Ondo Real Estate Utah"),
  // These are illustrative scenarios, not documented client results, so keep them out
  // of search until real, verified case studies replace them.
  robots: { index: false, follow: true },
  description: "Illustrative scenarios for Utah owners, buyers, and investors: vacancy, FHA financing with down payment assistance, investor yield, and jumbo refinancing. Not actual client results.",
  alternates: { canonical: `${SITE_URL}/about/case-studies/` },
  openGraph: {
    title: pageTitleText("Case Studies | Ondo Real Estate Utah"),
    description: "Illustrative scenarios for Utah owners, buyers, and investors: vacancy, FHA financing with down payment assistance, investor yield, and jumbo refinancing. Not actual client results.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitleText("Case Studies | Ondo Real Estate Utah"),
    description: "Illustrative scenarios for Utah owners, buyers, and investors: vacancy, FHA financing with down payment assistance, investor yield, and jumbo refinancing. Not actual client results.",
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

const stories = [
  {
    headline: "Example: Salt Lake City Landlord Reduces Vacancy from 45 to 12 Days",
    propertyType: "Single-family rental",
    location: "Salt Lake City",
    challenge:
      "45-day average vacancy between tenants, the owner was handling all maintenance calls personally, and there was no formal screening process in place to evaluate prospective tenants.",
    solution:
      "Full-service property management: professional tenant screening, coordinated vendor maintenance, and a systematic leasing process from listing to move-in.",
    outcomes: [
      "Vacancy reduced from 45 days to 12 days",
      "98% on-time rent collection rate",
      "Owner reclaimed 8+ hours per week",
    ],
  },
  {
    headline: "Example: First-Time Buyer in Lehi Closes with FHA Loan and Zero Cash Over Asking",
    propertyType: "First home purchase",
    location: "Lehi, Utah County",
    challenge:
      "Limited savings in a competitive Utah County market, uncertainty about loan program options, and concern about covering both down payment and closing costs simultaneously.",
    solution:
      "FHA loan combined with a Utah Housing Corporation DPA second mortgage to cover the down payment, plus buyer representation to negotiate and manage the closing timeline.",
    outcomes: [
      "Closed at asking price, no cash over asking",
      "DPA second mortgage covered closing costs",
      "Keys in hand in 38 days from offer acceptance",
    ],
  },
  {
    headline: "Example: Draper Investor Targets 7.2% Projected Yield on Fully Managed Rental",
    propertyType: "Multi-unit investment",
    location: "Draper",
    challenge:
      "The investor wanted meaningful real estate exposure but had no bandwidth for active management, sourcing, acquisition coordination, and day-to-day operations all needed to be handled externally.",
    solution:
      "Source the multi-unit property, manage the acquisition process end to end, and have property management in place on day one with no gap between closing and operations.",
    outcomes: [
      "7.2% projected cap rate at acquisition (projection, not a guarantee)",
      "100% occupied within 19 days of closing",
      "Zero owner involvement required in operations",
    ],
  },
  {
    headline: "Example: Park City Owner Saves $380/Month with Jumbo Refinance",
    propertyType: "Primary residence refinance",
    location: "Park City",
    challenge:
      "The owner inherited an above-market jumbo rate from a 2022 purchase when rates peaked. Market rates had shifted favorably but jumbo appraisals at Park City valuations require specialist lender relationships.",
    solution:
      "Connect the owner with a jumbo refinance lender experienced in Park City valuations and guide the appraisal process, preserving the existing tenant arrangement on the property.",
    outcomes: [
      "$380/month payment reduction",
      "Break-even on refinance costs in 18 months",
      "Existing tenant retained, no leasing gap",
    ],
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Case Studies | Ondo Real Estate Utah"
        description="Illustrative scenarios for Utah owners, buyers, and investors: vacancy, FHA financing with down payment assistance, investor yield, and jumbo refinancing. Not actual client results."
        pathname="/about/case-studies"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Case Studies", url: `${SITE_URL}/about/case-studies` },
        ])}
      />
      <PageBanner
        title="Case Studies"
        subtitle="Illustrative scenarios for Utah property owners, first-time buyers, and investors"
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Intro */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Scenarios Across Utah Markets</h2>
              <p className="text-lg text-foreground/70">
                These are illustrative scenarios, not results from specific clients. They show the kinds of situations we see: landlords losing money on extended vacancies, first-time buyers overwhelmed by financing options, investors wanting returns without operational headaches, and homeowners stuck with rate structures that no longer fit the market. The names, figures, and timelines are examples only. Your own results will differ.
              </p>
            </div>

            {/* Story cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {stories.map((story, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                      Illustrative scenario: {story.propertyType}, {story.location}
                    </div>
                    <CardTitle className="text-base leading-snug">{story.headline}</CardTitle>
                    <CardDescription className="sr-only">{story.headline}</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-6 flex flex-col gap-4 flex-1">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1">Challenge</p>
                      <p className="text-sm text-foreground/70">{story.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-1">Solution</p>
                      <p className="text-sm text-foreground/70">{story.solution}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">Example outcomes</p>
                      <ul className="space-y-1">
                        {story.outcomes.map((outcome) => (
                          <li key={outcome} className="flex items-start gap-2 text-sm text-foreground/70">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Talk Through Your Own Situation</h3>
              <p className="text-foreground/70 mb-6">
                If one of these scenarios sounds like your situation, reach out and we will walk through your options with you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Talk to Our Team</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
