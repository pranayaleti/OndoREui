import type { Metadata } from "next"
import Link from "next/link"
import { Home, Landmark, MapPin } from "lucide-react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CityServiceDirectory } from "@/components/city-service-directory"
import ConsultationCTA from "@/components/ConsultationCTA"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import { utahCitiesFromNorthOgdenToNephi } from "@/lib/utah-cities"

export const metadata: Metadata = pageCanonicalMetadata("/buy-sell", {
  title: "Buy & Sell Homes in Utah | City Guides",
  description:
    "Utah buy and sell landing pages by city and ZIP, plus statewide buyer and seller guides. Local agents, pricing strategy, and closing support along the Wasatch Front.",
})

const faqs = [
  {
    question: "How is a city buy-and-sell page different from /buy or /sell?",
    answer:
      "The statewide Buy and Sell pages explain Ondo’s process for any Utah transaction. Each city page is the local entry point: neighborhoods we cover, how we list or tour homes there, and links to loans and property management in that city.",
  },
  {
    question: "Do you only work in the cities listed here?",
    answer:
      "These pages cover the Wasatch Front corridor we publish city guides for, from North Ogden through Nephi. If your property is nearby and not listed, start with the statewide Buy or Sell page or contact us and we will tell you whether we can help.",
  },
  {
    question: "What about a specific ZIP code?",
    answer:
      "ZIP hubs live under /buy-sell/zip/{zip}/ for ZIPs in this corridor. They point at the city those ZIPs belong to. They are not a separate brokerage and do not replace a comparative market analysis.",
  },
]

export default function BuySellHubPage() {
  const cityCount = utahCitiesFromNorthOgdenToNephi.length
  const jsonLd = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Buy & sell", url: `${SITE_URL}/buy-sell/` },
    ]),
    generateServiceJsonLd({
      name: `${SITE_NAME} Utah buy and sell`,
      description: "Buyer representation and listing services across published Wasatch Front city pages.",
      serviceType: "Real Estate Agent Services",
      areaServed: "Utah",
    }),
    generateFAQJsonLd(faqs),
  ].filter(Boolean)

  return (
    <>
      <SEO
        title="Buy & Sell Homes in Utah | City Guides"
        description="Utah buy and sell landing pages by city and ZIP, plus statewide buyer and seller guides."
        pathname="/buy-sell"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen">
        <PageBanner
          title="Buy or sell a home along the Wasatch Front"
          subtitle="City pages for local context. Statewide Buy and Sell pages for the full process. No invented sale-price or days-on-market promises."
          backgroundImage="/modern-apartment-balcony.png"
        />
        <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
          <BreadcrumbNav items={[{ label: "Buy & sell" }]} />

          <section className="max-w-3xl space-y-4 text-foreground/80">
            <p>
              Use this hub when you know the city. Each local page is built from the same service template as our
              loans and property-management city guides: what we do there, nearby cities, and a way to reach the
              team. For the step-by-step purchase path, start at{" "}
              <Link href="/buy/" className="font-medium text-primary underline-offset-4 hover:underline">
                Buy a home
              </Link>
              . For listing, photography, and negotiation, start at{" "}
              <Link href="/sell/" className="font-medium text-primary underline-offset-4 hover:underline">
                Sell your home
              </Link>
              .
            </p>
            <p>
              We publish {cityCount} city pages in this corridor. They are not thin copies of each other with only
              the name swapped: each city record carries its own ZIPs, county, and (where we maintain it) neighborhood
              and market notes. Figures on child pages are Ondo city medians with an as-of date, not an appraisal or
              CMA.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-primary" aria-hidden />
                  Statewide buy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/70">
                <p>First-time paths, loan education, and what happens from offer to keys.</p>
                <Link href="/buy/" className="font-medium text-primary underline-offset-4 hover:underline">
                  Open the buy guide
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Landmark className="h-5 w-5 text-primary" aria-hidden />
                  Statewide sell
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/70">
                <p>CMA, marketing, MLS syndication, and negotiation through close.</p>
                <Link href="/sell/" className="font-medium text-primary underline-offset-4 hover:underline">
                  Open the sell guide
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" aria-hidden />
                  ZIP hubs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/70">
                <p>
                  Example:{" "}
                  <Link href="/buy-sell/zip/84043/" className="font-medium text-primary underline-offset-4 hover:underline">
                    84043 (Lehi)
                  </Link>
                  . Swap in another published Utah ZIP in the same URL pattern.
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="max-w-3xl space-y-2 text-foreground/80">
            <h2 className="text-2xl font-bold text-foreground">Related statewide paths</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <Link href="/buy/first-time/" className="text-primary underline-offset-4 hover:underline">
                  First-time buyers
                </Link>
              </li>
              <li>
                <Link href="/buy/first-time/grants/" className="text-primary underline-offset-4 hover:underline">
                  Housing grants and down payment assistance
                </Link>
              </li>
              <li>
                <Link href="/loans/" className="text-primary underline-offset-4 hover:underline">
                  Utah home loans
                </Link>{" "}
                (education, not a credit decision)
              </li>
              <li>
                <Link href="/faq/buying-selling-faqs/" className="text-primary underline-offset-4 hover:underline">
                  Buying and selling FAQs
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-2xl font-bold">City buy-and-sell pages</h2>
            <p className="mb-8 max-w-3xl text-foreground/70">
              Pick a city to see local buy and sell context, then jump to loans or property management for the same
              place. Related:{" "}
              <Link href="/locations/" className="text-primary underline-offset-4 hover:underline">
                all service areas
              </Link>
              .
            </p>
            <CityServiceDirectory hrefForCity={(slug) => `/buy-sell/${slug}/`} linkLabel="Buy or sell in {city}" />
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-bold">Questions</h2>
            <dl className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-semibold">{faq.question}</dt>
                  <dd className="mt-1 text-foreground/70">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <ConsultationCTA
            title="Talk through a Utah purchase or listing"
            description="Book a 30-minute call. We will not quote a sale price or a loan approval on this page."
          />
        </div>
      </main>
    </>
  )
}
