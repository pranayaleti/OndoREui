import { YourContactCard } from "@/components/people/your-contact-card"
import { pageTitle } from "@/lib/site"
import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd, FOUNDER_PERSON_ID } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { WebMCPMortgageTool } from "@/components/buy/webmcp-mortgage-tool"
import { BuySellHowItWorksSection } from "@/components/landing/buy-sell-how-it-works-section"
import { ServiceFaqSection } from "@/components/service-faq-section"
import { BUY_PAGE_FAQS } from "@/lib/service-faq"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"
import { LICENSING_HREF } from "@/lib/social-proof-stats"

const DESCRIPTION =
  "Buy a home on the Wasatch Front with an Ondo agent: search, offer, inspection and close, with home loans in the same shop."

export const metadata: Metadata = {
  title: pageTitle("Buy a Home in Utah | Agent-Led Search & Lending | Ondo Real Estate"),
  description: DESCRIPTION,
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
    type: "website",
    title: "Buy a Home in Utah | Agent-Led Search & Lending",
    description: DESCRIPTION,
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

const whatYouGet = [
  { title: "An agent who searches with you", body: "Live for-sale inventory, including the MLS, and tours on your schedule." },
  { title: "A written buyer agreement", body: "Compensation is negotiated and written down before you tour. The seller does not automatically pay your agent." },
  { title: "Offer through close", body: "Price, dates, contingencies, inspection, appraisal and credits. Your agent works the contract." },
  { title: "Loans in the same shop", body: "Talk through conventional, FHA, VA and USDA options while you shop. You are not required to finance with Ondo to buy with Ondo." },
]

export default function BuyPage() {
  return (
    <main>
      <WebMCPMortgageTool />
      <SEO
        reviewedBy={FOUNDER_PERSON_ID}
        title="Buy a Home in Utah | Agent-Led Search & Lending"
        description={DESCRIPTION}
        pathname="/buy/"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Buy a home in Utah", url: `${SITE_URL}/buy/` },
          ]),
          generateServiceJsonLd({
            name: "Utah home buying services",
            description: "Agent-led home searches, tours, negotiations and financing conversations across Utah.",
            serviceType: "Home Buying",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="Buy a home in Utah"
        subtitle="An agent on your side from the first tour to the keys."
        backgroundImage="/suburban-house-garden.webp"
        primaryCta={{
          label: "See what you can afford",
          href: "/buy/quiz/",
          event: "page_banner_buyer_quiz",
          analyticsLabel: "buy",
        }}
      />

      <section className="bg-background py-16" aria-labelledby="buy-what-heading">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 id="buy-what-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
            What you get
          </h2>
          <ul className="space-y-4">
            {whatYouGet.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-foreground/80">
                  <span className="font-semibold text-foreground">{item.title}.</span> {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-foreground/70">
            Not sure where to start?{" "}
            <Link href="/get-matched/" className="font-medium text-primary underline underline-offset-4">
              Tell us what you are looking for
            </Link>{" "}
            or compare{" "}
            <Link href="/calculators/rent-vs-own/" className="font-medium text-primary underline underline-offset-4">
              rent vs own
            </Link>
            .
          </p>
        </div>
      </section>

      <BuySellHowItWorksSection audience="buyer" />

      <ServiceFaqSection id="buy-faq" faqs={BUY_PAGE_FAQS} moreHref="/faq/buying-selling-faqs/" moreLabel="All buying and selling questions" />

      <div className="container mx-auto max-w-3xl px-4 pt-10">
        <p className="text-xs leading-relaxed text-foreground/60">
          {ARRIVAL_LENDING_DISCLOSURE}{" "}
          <Link href={LICENSING_HREF} className="font-medium text-primary underline underline-offset-4">
            Licensing disclosures
          </Link>
        </p>
      </div>
      <YourContactCard kind="agent" />
    </main>
  )
}
