import { SITE_SOCIALS } from "@/lib/site"
import type { Metadata } from "next"
import Script from "next/script"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle, LineChart, Shield, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ConsultationCTA from "@/components/ConsultationCTA"
import { BuySellHowItWorksSection } from "@/components/landing/buy-sell-how-it-works-section"
import { BuySellNextSteps } from "@/components/buy-sell/next-steps-links"
import { SellIncludedVsTypicalTable } from "@/components/pricing/sell-included-vs-typical-table"
import { ListingPacketForm } from "@/components/leads/listing-packet-form"
import { SELL_INCLUDED_ROWS } from "@/lib/sell-included"

export const metadata: Metadata = {
  title: "Sell Your Utah Home | CMA, Listing & Negotiation | Ondo Real Estate",
  description:
    "List with Ondo: comparative market analysis, professional photography, MLS syndication, and negotiation through close. Compensation is quoted in writing — no savings guarantee.",
  keywords: [
    "sell house Utah",
    "home valuation Utah",
    "list my home Utah",
    "CMA Utah",
    "Salt Lake City real estate agents",
    "Lehi real estate agents",
    "Provo real estate agents",
  ],
  alternates: {
    canonical: `${SITE_URL}/sell/`,
  },
  openGraph: {
    title: "Sell Your Utah Home | CMA, Listing & Negotiation",
    description:
      "Pricing strategy, photography, MLS syndication, and negotiation. Request a listing packet or book a call.",
    url: `${SITE_URL}/sell/`,
    images: [
      {
        url: `${SITE_URL}/modern-apartment-balcony.png`,
        width: 1200,
        height: 630,
        alt: "Utah home prepared for listing",
      },
    ],
  },
}

const services = [
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "CMA & pricing",
    description: "Comparative market analysis and a written pricing strategy before you list.",
  },
  {
    icon: <Camera className="h-8 w-8" />,
    title: "Photography & marketing",
    description: "Professional photography, staging guidance, and MLS syndication to major portals.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Showings",
    description: "Coordinated showings while the home is on market — not a promised days-on-market.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Negotiation through close",
    description: "Offer review, negotiation, and closing coordination with your listing agent.",
  },
]

export default function SellPage() {
  return (
    <>
      <SEO
        title="Sell Your Utah Home | CMA, Listing & Negotiation"
        description="List with Ondo: CMA, photography, MLS syndication, and negotiation. Compensation is quoted in writing."
        pathname="/sell/"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Sell your Utah home", url: `${SITE_URL}/sell/` },
          ]),
          generateServiceJsonLd({
            name: "Utah home selling services",
            description: "Pricing strategy, marketing, MLS syndication, and negotiations for Utah listings.",
            serviceType: "Home Selling",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="Sell your Utah home"
        subtitle="A CMA, a listing plan, and an agent through close — without invented sale-price or speed claims."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <BuySellHowItWorksSection audience="seller" />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">What a listing with Ondo includes</h2>
            <p className="text-xl text-foreground/70">
              Only services we already deliver: CMA, photography, MLS syndication, and negotiation.
              We do not advertise a flat savings number or a guaranteed timeline.
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

          <ul className="mx-auto mb-16 max-w-3xl space-y-3">
            {SELL_INCLUDED_ROWS.map((row) => (
              <li key={row.item} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">{row.item}</p>
                  <p className="text-sm text-foreground/70">{row.ondo}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-foreground">Request a CMA, then list</h3>
              <p className="mb-4 text-foreground/70">
                Start with{" "}
                <Link href="/whats-my-home-worth" className="font-medium text-primary underline-offset-4 hover:underline">
                  a city-median estimate
                </Link>
                , then request a listing packet or book a call. A walk-through CMA is a conversation with an
                agent — not the estimator widget.
              </p>
              <p className="text-foreground/70">
                Prefer to pick a time now? Use Calendly in the consultation card below, or send a seller
                inquiry at{" "}
                <Link href="/contact?audience=seller#book-a-call" className="font-medium text-primary underline-offset-4 hover:underline">
                  /contact
                </Link>
                .
              </p>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg">
              <Image
                src="/modern-office-building.png"
                alt="Ondo Real Estate office in Utah"
                className="h-full w-full object-cover"
                width={600}
                height={384}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <SellIncludedVsTypicalTable />
      </section>

      <section className="bg-background py-16" aria-labelledby="listing-packet-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
            <div>
              <h2 id="listing-packet-heading" className="mb-4 text-3xl font-bold text-foreground">
                Listing packet
              </h2>
              <p className="mb-4 text-foreground/70">
                Send the property address and timing. We follow up with a CMA conversation and a marketing
                outline. This is a seller lead — it does not open a public dashboard or create an account.
              </p>
              <p className="text-sm text-foreground/60">
                Photos stay off this form on purpose. Describe what you have; we will request files by email.
              </p>
            </div>
            <ListingPacketForm />
          </div>
        </div>
      </section>

      <BuySellNextSteps audience="seller" />

      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <ConsultationCTA
              title="Book a listing conversation"
              description="Calendly for a 30-minute call, or send details if you need a follow-up. Not a guaranteed sale price."
              variant="card"
            />
          </div>
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Questions about selling?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">
            Pricing, agreements, and what buyer-broker compensation looks like after 2024.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/faq/buying-selling-faqs">View selling FAQs</Link>
          </Button>
        </div>
      </section>

      <Script id="sell-service-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Service"],
          name: "Home Selling Services",
          description: "CMA, listing marketing, MLS syndication, and negotiation for Utah sellers.",
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
