import { YourContactCard } from "@/components/people/your-contact-card"
import { pageTitle } from "@/lib/site"
import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd, FOUNDER_PERSON_ID } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { BuySellHowItWorksSection } from "@/components/landing/buy-sell-how-it-works-section"
import { ListingPacketForm } from "@/components/leads/listing-packet-form"
import { ServiceFaqSection } from "@/components/service-faq-section"
import { SELL_PAGE_FAQS } from "@/lib/service-faq"
import { SELL_INCLUDED_ROWS } from "@/lib/sell-included"

const DESCRIPTION =
  "Sell your Utah home with a full-service listing: comparative market analysis, professional photos, MLS syndication and negotiation to close."

export const metadata: Metadata = {
  title: pageTitle("Sell Your Utah Home: Pricing, Photos & Negotiation"),
  description: DESCRIPTION,
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
    type: "website",
    title: "Sell Your Utah Home | CMA, Listing & Negotiation",
    description: DESCRIPTION,
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

/** The first five included lines: pricing, photos, staging, MLS, showings and negotiation. */
const included = SELL_INCLUDED_ROWS.slice(0, 5)

export default function SellPage() {
  return (
    <main>
      <SEO
        reviewedBy={FOUNDER_PERSON_ID}
        title="Sell Your Utah Home | CMA, Listing & Negotiation"
        description={DESCRIPTION}
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
        subtitle="A real pricing analysis, a listing plan and an agent through close."
        backgroundImage="/modern-apartment-balcony.webp"
        primaryCta={{
          label: "Get my home value",
          href: "/whats-my-home-worth/",
          event: "page_banner_home_value",
          analyticsLabel: "sell",
        }}
      />

      <section className="bg-background py-16" aria-labelledby="sell-what-heading">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 id="sell-what-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
            What you get
          </h2>
          <ul className="space-y-4">
            {included.map((row) => (
              <li key={row.item} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-foreground/80">
                  <span className="font-semibold text-foreground">{row.item}.</span> {row.ondo}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-foreground/70">
            Listing compensation is quoted in writing for your property. The online estimate is a starting point, not a CMA.
          </p>
        </div>
      </section>

      <BuySellHowItWorksSection audience="seller" />

      <section className="bg-background py-16" aria-labelledby="listing-packet-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
            <div>
              <h2 id="listing-packet-heading" className="mb-4 text-3xl font-bold text-foreground">
                Request a listing packet
              </h2>
              <p className="text-foreground/70">
                Send the address and your timing. We follow up with a pricing conversation and a marketing outline.
                Prefer to talk first?{" "}
                <Link href="/contact?audience=seller#book-a-call" className="font-medium text-primary underline underline-offset-4">
                  Book a call
                </Link>
                .
              </p>
            </div>
            <ListingPacketForm />
          </div>
        </div>
      </section>

      <ServiceFaqSection id="sell-faq" faqs={SELL_PAGE_FAQS} moreHref="/faq/buying-selling-faqs/" moreLabel="All buying and selling questions" />

      <YourContactCard kind="agent" />
    </main>
  )
}
