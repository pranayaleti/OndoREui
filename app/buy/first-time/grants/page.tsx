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

export const metadata: Metadata = {
  title: "Utah Housing Grants & Down Payment Assistance",
  description:
    "A guide to Utah down payment assistance and homebuyer grant programs — Utah Housing Corporation loans, county and city assistance, and who qualifies.",
  alternates: { canonical: `${SITE_URL}/buy/first-time/grants/` },
  openGraph: {
    title: "Utah Housing Grants & Down Payment Assistance | Ondo Real Estate",
    description:
      "Down payment assistance and grant programs for Utah homebuyers, with eligibility summaries and official links.",
    url: `${SITE_URL}/buy/first-time/grants/`,
  },
}

interface GrantProgram {
  name: string
  eligibility: string
  description: string
  href: string
}

const programs: GrantProgram[] = [
  {
    name: "Utah Housing Corporation — FirstHome & HomeAgain",
    eligibility: "First-time and repeat buyers meeting income and purchase-price limits",
    description:
      "The state housing agency offers competitive first-mortgage programs (FirstHome, HomeAgain, Score) that pair with down payment assistance second loans.",
    href: "https://utahhousingcorp.org/",
  },
  {
    name: "Utah Housing Down Payment Assistance (2nd loan)",
    eligibility: "Buyers using a Utah Housing first mortgage",
    description:
      "A subordinate loan that can cover down payment and closing costs, letting qualified buyers finance up to the full purchase with little cash out of pocket.",
    href: "https://utahhousingcorp.org/homebuyer/",
  },
  {
    name: "Utah First-Time Homebuyer Assistance Program",
    eligibility: "First-time buyers purchasing a newly built home (program terms vary)",
    description:
      "State-funded assistance created to help first-time buyers with down payment and closing costs on qualifying new construction — availability and funding change over time.",
    href: "https://utahhousingcorp.org/",
  },
  {
    name: "County & city down payment assistance",
    eligibility: "Income-qualified buyers in participating jurisdictions",
    description:
      "Many Utah counties and cities (e.g., Salt Lake County, Provo, West Valley City) run HOME/CDBG-funded assistance programs. Availability and amounts vary locally.",
    href: "https://utahhousingcorp.org/homebuyer/",
  },
  {
    name: "Federal loan programs (FHA / VA / USDA)",
    eligibility: "Varies — low down payment, veteran, or rural-area buyers",
    description:
      "Not grants, but low- or no-down-payment loans that pair well with the assistance above. See our FHA vs conventional guide for the trade-offs.",
    href: "https://www.hud.gov/buying/loans",
  },
]

export default function UtahHousingGrantsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Housing Grants & Down Payment Assistance"
        description="A guide to Utah down payment assistance and homebuyer grant programs — Utah Housing Corporation loans, county and city assistance, and who qualifies."
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
        title="Utah Housing Grants & Down Payment Assistance"
        subtitle="Programs that help Utah buyers bridge the down payment gap"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Assistance for Utah Homebuyers</h2>
              <p className="text-lg text-foreground/70">
                The down payment is the biggest hurdle for most first-time buyers. Utah offers several
                programs — from state housing loans to local grants — that can cover part or all of it.
                Below is a starting map; program terms, funding, and eligibility change often, so confirm
                current details with each provider.
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
                caps change frequently and vary by location. Always verify current terms directly with
                the program administrator or a licensed loan officer before relying on them.
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
                <Link href="/qualify">Get Pre-Qualified</Link>
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
          </div>
        </div>
      </section>
    </main>
  )
}
