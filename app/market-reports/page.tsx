import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { CityServiceDirectory } from "@/components/city-service-directory"
import ConsultationCTA from "@/components/ConsultationCTA"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { CITY_MARKET_AS_OF, CITY_MARKET_DATA_DISCLOSURE } from "@/lib/city-market-data"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { SITE_URL } from "@/lib/site"
import { utahCitiesFromNorthOgdenToNephi } from "@/lib/utah-cities"

export const metadata: Metadata = pageCanonicalMetadata("/market-reports", {
  title: "Utah City Real Estate Market Reports",
  description:
    "Ondo city-level market snapshots for the Wasatch Front: medians we maintain internally, commute notes, and links to buy, sell, loans, and property management. Not an MLS pull or appraisal.",
})

const faqs = [
  {
    question: "Are these official MLS statistics?",
    answer: CITY_MARKET_DATA_DISCLOSURE,
  },
  {
    question: "Why isn’t there one statewide median on this hub?",
    answer:
      "A single Utah number hides county and city differences. Each city report holds that city’s Ondo medians. Use the city page, then verify with a CMA or other independent source before you make a decision.",
  },
]

export default function MarketReportsHubPage() {
  const jsonLd = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Market reports", url: `${SITE_URL}/market-reports/` },
    ]),
    generateFAQJsonLd(faqs),
  ].filter(Boolean)

  return (
    <>
      <SEO
        title="Utah City Real Estate Market Reports"
        description="Ondo city-level market snapshots for the Wasatch Front. Not an MLS pull, appraisal, BPO, or CMA."
        pathname="/market-reports"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen">
        <PageBanner
          title="Utah city market reports"
          subtitle={`Internal Ondo city medians as of ${CITY_MARKET_AS_OF}. Use them as context, then verify.`}
          backgroundImage="/modern-office-building.webp"
        />
        <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
          <BreadcrumbNav items={[{ label: "Market reports" }]} />

          <section className="max-w-3xl space-y-4 text-foreground/80">
            <p>
              This index lists {utahCitiesFromNorthOgdenToNephi.length} city reports. Each report is a snapshot we
              maintain for that city: housing and rent medians we last checked, commute minutes to nearby job centers,
              and links into buy, sell, loans, and property management. It is not a forecast and not a valuation of a
              specific property.
            </p>
            <p className="text-sm text-foreground/60">{CITY_MARKET_DATA_DISCLOSURE}</p>
            <p>
              For how we talk about data on the marketing site without inventing a statewide median, see{" "}
              <Link href="/data/" className="font-medium text-primary underline-offset-4 hover:underline">
                Market data
              </Link>
              .
            </p>
          </section>

          <CityServiceDirectory hrefForCity={(slug) => `/market-reports/${slug}/`} linkLabel="{city} market report" />

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
            title="Want a property-specific opinion?"
            description="A call can lead to a CMA or a rental analysis. This hub is not either of those."
          />
        </div>
      </main>
    </>
  )
}
