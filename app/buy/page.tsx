import { SITE_SOCIALS } from "@/lib/site"
import type { Metadata } from "next"
import Script from "next/script"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Handshake, Landmark, Search, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ConsultationCTA from "@/components/ConsultationCTA"
import { WebMCPMortgageTool } from "@/components/buy/webmcp-mortgage-tool"
import { BuyLendingStrip } from "@/components/buy/buy-lending-strip"
import { BuySellHowItWorksSection } from "@/components/landing/buy-sell-how-it-works-section"
import { BuySellNextSteps } from "@/components/buy-sell/next-steps-links"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"
import { LICENSING_HREF } from "@/lib/social-proof-stats"

export const metadata: Metadata = {
  title: "Buy a Home in Utah | Agent-Led Search & Lending | Ondo Real Estate",
  description:
    "Work with an Ondo buyer’s agent across the Wasatch Front. Agent-led for-sale search, in-house mortgages, and rental inventory on this site. Not a public MLS feed. Not a commitment to lend.",
  keywords: [
    "buy house Utah",
    "Utah home buying",
    "first-time home buyer Utah",
    "Utah mortgage",
    "Salt Lake City real estate agents",
    "Lehi buyer’s agent",
    "Provo home buying",
  ],
  alternates: {
    canonical: `${SITE_URL}/buy/`,
  },
  openGraph: {
    title: "Buy a Home in Utah | Agent-Led Search & Lending",
    description:
      "Shop with an Ondo agent, run the numbers on /loans and calculators, and browse rentals we actually list on this site.",
    url: `${SITE_URL}/buy/`,
    images: [
      {
        url: `${SITE_URL}/suburban-house-garden.png`,
        width: 1200,
        height: 630,
        alt: "Utah home along the Wasatch Front",
      },
    ],
  },
}

const services = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Work with an agent",
    description:
      "An Ondo agent searches live for-sale inventory with you, including the MLS. This website does not run a public homes-for-sale feed.",
  },
  {
    icon: <Landmark className="h-8 w-8" />,
    title: "Loans in the same shop",
    description:
      "Talk with a loan officer about conventional, FHA, VA, and USDA options. Estimates here are illustration only — not a commitment to lend.",
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Rentals on this site",
    description:
      "Live listings at /properties are rentals we manage. Use them if you are comparing rent vs own, not as a for-sale catalog.",
  },
  {
    icon: <Handshake className="h-8 w-8" />,
    title: "Offer through close",
    description:
      "Offer strategy, negotiation, inspections, and closing coordination under a written buyer-broker agreement.",
  },
]

export default function BuyPage() {
  return (
    <>
      <WebMCPMortgageTool />
      <SEO
        title="Buy a Home in Utah | Agent-Led Search & Lending"
        description="Work with an Ondo buyer’s agent. Agent-led for-sale search, in-house mortgages, and rental inventory on this site. Not a public MLS feed."
        pathname="/buy/"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Buy a home in Utah", url: `${SITE_URL}/buy/` },
          ]),
          generateServiceJsonLd({
            name: "Utah home buying services",
            description: "Agent-led home searches, tours, negotiations, and mortgage origination across Utah.",
            serviceType: "Home Buying",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="Buy a home in Utah"
        subtitle="Shop with an agent, run the loan numbers, and compare rent vs own. For-sale search is agent-led — this site lists rentals we manage."
        backgroundImage="/suburban-house-garden.png"
      />

      <BuyLendingStrip />

      <BuySellHowItWorksSection audience="buyer" />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">What buying with Ondo includes</h2>
            <p className="text-xl text-foreground/70">
              Representation, lending, and rental inventory you can actually use on this site.
              We do not advertise a self-serve MLS search or a four-minute pre-qualification letter.
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="p-6 text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 text-primary">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/70">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-foreground">How search actually works here</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold">Agent-led for-sale search</h4>
                    <p className="text-foreground/70">
                      Your agent uses MLS and other sources with you. There is no public “advanced MLS search” on this website.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold">Written buyer agreement</h4>
                    <p className="text-foreground/70">
                      Buyer-broker compensation is negotiated and written down. It is not typically free, and the seller does not automatically pay your agent.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold">Lending in parallel</h4>
                    <p className="text-foreground/70">
                      Start on{" "}
                      <Link href="/loans" className="font-medium text-primary underline-offset-4 hover:underline">
                        /loans
                      </Link>{" "}
                      and the calculators. You are not required to use Ondo for financing to buy with Ondo.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h4 className="font-semibold">Rent vs own, with live rentals</h4>
                    <p className="text-foreground/70">
                      Compare on{" "}
                      <Link href="/calculators/rent-vs-own" className="font-medium text-primary underline-offset-4 hover:underline">
                        rent vs own
                      </Link>
                      , then browse{" "}
                      <Link href="/properties" className="font-medium text-primary underline-offset-4 hover:underline">
                        rentals we manage
                      </Link>
                      .
                    </p>
                  </div>
                </li>
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-foreground/60">
                {ARRIVAL_LENDING_DISCLOSURE}{" "}
                <Link href={LICENSING_HREF} className="font-medium text-primary underline underline-offset-4">
                  Licensing disclosures
                </Link>
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg">
              <Image
                src="/modern-townhouse-garage.png"
                alt="Utah townhouse along the Wasatch Front"
                fill
                className="object-cover"
                sizes="100vw"
                title="Utah townhouse"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <BuySellNextSteps audience="buyer" />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <ConsultationCTA
              title="Ready to work with a buyer’s agent?"
              description="Book a 30-minute call to talk neighborhoods, budget, and a written buyer agreement. Not a loan application."
              variant="card"
            />
          </div>
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Questions about buying in Utah?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">
            Compensation, agreements, and process — including what changed after 2024.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/faq/buying-selling-faqs">View buying FAQs</Link>
          </Button>
        </div>
      </section>

      <Script id="buy-service-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Service"],
          name: "Home Buying Services",
          description: "Agent-led representation and mortgage origination for Utah buyers. Not a public MLS search.",
          provider: {
            "@type": ["Organization", "LocalBusiness", "RealEstateAgent"],
            name: SITE_NAME,
            url: SITE_URL,
            areaServed: ["Lehi UT", "Salt Lake City UT", "Draper UT", "Utah County"],
            sameAs: SITE_SOCIALS,
          },
          areaServed: ["Lehi UT", "Salt Lake City UT", "Draper UT", "Utah County"],
          serviceType: "Real Estate Sales",
        })}
      </Script>
    </>
  )
}
