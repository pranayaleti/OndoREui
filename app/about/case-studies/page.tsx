import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Case Studies | Ondo Real Estate Utah",
  description: "Real outcomes from Utah owners and buyers: faster leasing, FHA closings, investor yields, and jumbo refinances handled by Ondo Real Estate.",
  alternates: { canonical: `${SITE_URL}/about/case-studies/` },
  openGraph: {
    title: "Case Studies | Ondo Real Estate Utah",
    description: "Real outcomes from Utah owners and buyers: faster leasing, FHA closings, investor yields, and jumbo refinances handled by Ondo Real Estate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | Ondo Real Estate Utah",
    description: "Real outcomes from Utah owners and buyers: faster leasing, FHA closings, investor yields, and jumbo refinances handled by Ondo Real Estate.",
  },
}

const story1JsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Salt Lake City Landlord Reduces Vacancy from 45 to 12 Days",
  "description": "A Salt Lake City single-family rental owner cut average vacancy from 45 days to 12 days, achieved 98% on-time rent collection, and reclaimed 8+ hours per week after engaging Ondo full-service property management with tenant screening and maintenance coordination.",
  "datePublished": "2025-06-01",
  "author": { "@type": "Organization", "name": "Ondo Real Estate" },
}

const story2JsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "First-Time Buyer in Lehi Closes with FHA Loan and Zero Cash Over Asking",
  "description": "A first-time buyer in Lehi, Utah County, used an FHA loan paired with a Utah Housing Corporation DPA second mortgage and Ondo buyer representation to close at asking price with DPA covering closing costs — keys in hand in 38 days.",
  "datePublished": "2025-04-15",
  "author": { "@type": "Organization", "name": "Ondo Real Estate" },
}

const story3JsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Draper Investor Achieves 7.2% Projected Yield on Fully Managed Rental",
  "description": "A Draper investor sought real estate exposure without active management. Ondo sourced a multi-unit property, handled acquisition, and placed full property management on day one — resulting in a 7.2% projected cap rate and 100% occupancy within 19 days.",
  "datePublished": "2025-08-20",
  "author": { "@type": "Organization", "name": "Ondo Real Estate" },
}

const story4JsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Park City Owner Saves $380/Month with Jumbo Refinance",
  "description": "A Park City primary residence owner carrying an above-market jumbo rate from 2022 worked with Ondo to connect with a jumbo refi lender and navigate a Park City appraisal, achieving a $380/month payment reduction with an 18-month break-even.",
  "datePublished": "2025-10-05",
  "author": { "@type": "Organization", "name": "Ondo Real Estate" },
}

const stories = [
  {
    headline: "Salt Lake City Landlord Reduces Vacancy from 45 to 12 Days",
    propertyType: "Single-family rental",
    location: "Salt Lake City",
    challenge:
      "45-day average vacancy between tenants, the owner was handling all maintenance calls personally, and there was no formal screening process in place to evaluate prospective tenants.",
    solution:
      "Ondo full-service property management: professional tenant screening, coordinated vendor maintenance, and a systematic leasing process from listing to move-in.",
    outcomes: [
      "Vacancy reduced from 45 days to 12 days",
      "98% on-time rent collection rate",
      "Owner reclaimed 8+ hours per week",
    ],
  },
  {
    headline: "First-Time Buyer in Lehi Closes with FHA Loan and Zero Cash Over Asking",
    propertyType: "First home purchase",
    location: "Lehi, Utah County",
    challenge:
      "Limited savings in a competitive Utah County market, uncertainty about loan program options, and concern about covering both down payment and closing costs simultaneously.",
    solution:
      "FHA loan combined with a Utah Housing Corporation DPA second mortgage to cover the down payment, plus Ondo buyer representation to negotiate and manage the closing timeline.",
    outcomes: [
      "Closed at asking price — no cash over asking",
      "DPA second mortgage covered closing costs",
      "Keys in hand in 38 days from offer acceptance",
    ],
  },
  {
    headline: "Draper Investor Achieves 7.2% Projected Yield on Fully Managed Rental",
    propertyType: "Multi-unit investment",
    location: "Draper",
    challenge:
      "The investor wanted meaningful real estate exposure but had no bandwidth for active management — sourcing, acquisition coordination, and day-to-day operations all needed to be handled externally.",
    solution:
      "Ondo sourced the multi-unit property, managed the acquisition process end to end, and placed property management services on day one with no gap between closing and operations.",
    outcomes: [
      "7.2% projected cap rate at acquisition",
      "100% occupied within 19 days of closing",
      "Zero owner involvement required in operations",
    ],
  },
  {
    headline: "Park City Owner Saves $380/Month with Jumbo Refinance",
    propertyType: "Primary residence refinance",
    location: "Park City",
    challenge:
      "The owner inherited an above-market jumbo rate from a 2022 purchase when rates peaked. Market rates had shifted favorably but jumbo appraisals at Park City valuations require specialist lender relationships.",
    solution:
      "Ondo connected the owner with a jumbo refi lender experienced in Park City valuations and guided the appraisal process, preserving the existing tenant arrangement on the property.",
    outcomes: [
      "$380/month payment reduction",
      "Break-even on refinance costs in 18 months",
      "Existing tenant retained — no leasing gap",
    ],
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Case Studies | Ondo Real Estate Utah"
        description="Real outcomes from Utah owners and buyers: faster leasing, FHA closings, investor yields, and jumbo refinances handled by Ondo Real Estate."
        pathname="/about/case-studies"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Case Studies", url: `${SITE_URL}/about/case-studies` },
        ])}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(story1JsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(story2JsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(story3JsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(story4JsonLd) }}
      />
      <PageBanner
        title="Case Studies"
        subtitle="Real outcomes from Utah property owners, first-time buyers, and investors who worked with Ondo Real Estate"
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Intro */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Results Across Utah Markets</h2>
              <p className="text-lg text-foreground/70">
                These stories reflect the types of situations we encounter every day — landlords losing money on extended vacancies, first-time buyers overwhelmed by financing options, investors wanting returns without operational headaches, and homeowners stuck with rate structures that no longer fit the market. Each case below is drawn from real client work in Utah. Names and identifying details are generalised for privacy, but the numbers and timelines are accurate.
              </p>
            </div>

            {/* Story cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {stories.map((story, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                      {story.propertyType} &mdash; {story.location}
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
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">Outcomes</p>
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
              <h3 className="text-2xl font-bold mb-4">See What Others Are Saying</h3>
              <p className="text-foreground/70 mb-6">
                Case studies show the mechanics — testimonials give you the full picture from the client&apos;s perspective. Or if you are ready to talk through your own situation, reach out and we will walk through it with you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Talk to Our Team</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about/testimonials">Read Testimonials</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
