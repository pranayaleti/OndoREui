import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import ConsultationCTA from "@/components/ConsultationCTA"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Housing Grants & Down Payment Assistance Programs",
  description:
    "A guide to down payment assistance and homebuyer grant programs. Eligibility is determined by the agency and the lender, not this page.",
  alternates: { canonical: `${SITE_URL}/buy/first-time/grants/` },
  openGraph: {
    title: "Housing Grants & Down Payment Assistance Programs | Ondo Real Estate",
    description:
      "Down payment assistance and grant programs for U.S. homebuyers, with eligibility summaries and official links.",
    url: `${SITE_URL}/buy/first-time/grants/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

interface GrantProgram {
  name: string
  eligibility: string
  description: string
  href: string
}

const programs: GrantProgram[] = [
  {
    name: "State Housing Finance Agencies (HFAs)",
    eligibility: "First-time and repeat buyers meeting state income and purchase-price limits",
    description:
      "Every state has a Housing Finance Agency offering below-market first mortgages paired with down payment and closing-cost assistance (grants or second loans). This is the first place most buyers should look.",
    href: "https://www.ncsha.org/housing-help/",
  },
  {
    name: "Down payment assistance (grants & second loans)",
    eligibility: "Income-qualified buyers in participating states, counties, and cities",
    description:
      "Thousands of local programs, administered by states, counties, cities, and nonprofits, offer forgivable grants or low-interest second loans to cover down payment and closing costs. Availability and amounts vary by location.",
    href: "https://downpaymentresource.com/",
  },
  {
    name: "FHA loans",
    eligibility: "Buyers with lower down payments or credit that doesn't fit conventional loans",
    description:
      "Government-backed loans allowing as little as 3.5% down with flexible credit requirements, a common pairing with down payment assistance. See our FHA vs conventional guide for the trade-offs.",
    href: "https://www.hud.gov/buying/loans",
  },
  {
    name: "VA & USDA loans",
    eligibility: "Eligible veterans/service members (VA) or rural-area buyers (USDA)",
    description:
      "Both can offer 0% down. VA loans serve veterans, active-duty, and eligible spouses; USDA loans serve qualifying buyers in designated rural and suburban areas with income limits.",
    href: "https://www.va.gov/housing-assistance/home-loans/",
  },
  {
    name: "Conventional 3%-down & first-time programs",
    eligibility: "Buyers meeting income limits (varies by program)",
    description:
      "Fannie Mae HomeReady and Freddie Mac Home Possible allow as little as 3% down with reduced mortgage insurance for income-qualified buyers. Mortgage Credit Certificates (MCCs) can add a federal tax credit on mortgage interest.",
    href: "https://www.consumerfinance.gov/owning-a-home/",
  },
  {
    name: "Good Neighbor Next Door",
    eligibility: "Law enforcement, teachers (pre-K–12), firefighters, and EMTs",
    description:
      "A HUD program offering eligible public servants 50% off the list price of homes in designated revitalization areas, in exchange for a 3-year owner-occupancy commitment.",
    href: "https://www.hud.gov/program_offices/housing/sfh/reo/goodn/gnndabot",
  },
  {
    name: "Nonprofit & employer assistance",
    eligibility: "Varies, income-qualified buyers, or employees of participating employers",
    description:
      "Nonprofits like NeighborWorks and Habitat for Humanity, plus a growing number of employer-assisted housing (EAH) programs, offer grants, forgivable loans, or matched savings toward a down payment.",
    href: "https://www.neighborworks.org/",
  },
]

export default function HousingGrantsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Housing Grants & Down Payment Assistance Programs"
        description="A guide to down payment assistance and homebuyer grant programs in the U.S., state housing finance agencies, FHA/VA/USDA loans, and who qualifies."
        pathname="/buy/first-time/grants"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "First-Time Homebuyer", url: `${SITE_URL}/buy/first-time` },
          { name: "Housing Grants", url: `${SITE_URL}/buy/first-time/grants` },
        ])}
      />
      <PageBanner
        title="Housing Grants & Down Payment Assistance"
        subtitle="Programs that help buyers bridge the down payment gap"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Assistance for Homebuyers</h2>
              <p className="text-lg text-foreground/70">
                The down payment is often the first hurdle. Across the U.S., state housing agencies, local grants, and
                federal loan programs can cover part of it. Terms, funding, and eligibility change. Confirm with the
                agency. If a family gift will sit next to DPA on an FHA file, read{" "}
                <Link href="/blog/dpa-stacked-with-fha-gift-funds" className="text-primary underline-offset-4 hover:underline">
                  how DPA stacks with an FHA gift
                </Link>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-12">
              {programs.map((program) => (
                <Card key={program.name}>
                  <CardHeader>
                    <CardTitle className="text-xl">{program.name}</CardTitle>
                    <CardDescription className="text-primary">
                      Who it&apos;s for: {program.eligibility}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 mb-4">{program.description}</p>
                    <Button asChild variant="outline" size="sm">
                      <a href={program.href} target="_blank" rel="noopener noreferrer">
                        Official program info
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-muted p-6 mb-12">
              <p className="text-sm text-foreground/70">
                <strong className="text-foreground">Note:</strong> This page is educational and not
                financial, tax, or legal advice. Grant availability, income limits, and purchase-price
                caps change frequently and vary by state and locality. Always verify current terms
                directly with the program administrator or a licensed loan officer before relying on them.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Button asChild variant="outline" size="sm">
                <Link href="/buy/first-time">First-Time Buyer Guide</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/loans">Explore Loans</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/qualify">Talk with a loan officer</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/blog/dpa-stacked-with-fha-gift-funds">DPA + FHA gift</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/blog/first-time-home-buyer-guide">First-Time Buyer Blog</Link>
              </Button>
            </div>

            <div className="max-w-2xl mx-auto">
              <ConsultationCTA
                title="Not Sure Which Program Fits?"
                description="Talk to an Ondo advisor about combining down payment assistance with the right loan for your budget."
                variant="card"
              />
            </div>
            <RelatedContent path="/buy/first-time/grants" />
            <NextStepCta path="/buy/first-time/grants" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </section>
    </main>
  )
}
