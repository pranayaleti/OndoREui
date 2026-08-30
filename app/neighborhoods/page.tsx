import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import ConsultationCTA from "@/components/ConsultationCTA"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { neighborhoodsByCity } from "@/lib/neighborhood-content"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { SITE_URL } from "@/lib/site"
import { toCitySlug } from "@/lib/utah-cities"

export const metadata: Metadata = pageCanonicalMetadata("/neighborhoods", {
  title: "Utah Neighborhood Guides",
  description:
    "Housing-stock notes for named Wasatch Front neighborhoods: typical homes, walkability, parks, and school campuses nearby. Amenities only — not who should live there.",
})

const faqs = [
  {
    question: "How do you choose what to describe?",
    answer:
      "We describe housing types, parks, transit, and school campuses as geography. We do not describe the people who live there or who a neighborhood is “for.” That is a Fair Housing rule, not a style choice.",
  },
  {
    question: "Is a price range on a neighborhood page an appraisal?",
    answer:
      "No. Ranges on neighborhood pages are informal context. They are not an appraisal, BPO, or CMA. Confirm value with a licensed opinion before you buy, sell, or lend.",
  },
]

export default function NeighborhoodsHubPage() {
  const cities = Object.keys(neighborhoodsByCity)
  const jsonLd = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Neighborhoods", url: `${SITE_URL}/neighborhoods/` },
    ]),
    generateFAQJsonLd(faqs),
  ].filter(Boolean)

  return (
    <>
      <SEO
        title="Utah Neighborhood Guides"
        description="Named Wasatch Front neighborhoods: housing stock, parks, and nearby campuses. Not steering copy."
        pathname="/neighborhoods"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen">
        <PageBanner
          title="Neighborhood guides"
          subtitle="Housing, parks, and how the streets connect — not a profile of residents."
          backgroundImage="/suburban-house-garden.png"
        />
        <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
          <BreadcrumbNav items={[{ label: "Neighborhoods" }]} />

          <section className="max-w-3xl space-y-4 text-foreground/80">
            <p>
              We publish named neighborhood pages for cities where we already maintain that layer of detail. Each page
              sits under its city: <code className="text-sm">/neighborhoods/{"{city}"}/{"{neighborhood}"}/</code>. For a
              full city service menu (buy, sell, loans, management), use{" "}
              <Link href="/locations/" className="font-medium text-primary underline-offset-4 hover:underline">
                Locations
              </Link>
              .
            </p>
          </section>

          {cities.map((cityName) => {
            const citySlug = toCitySlug(cityName)
            const hoods = neighborhoodsByCity[cityName]
            return (
              <section key={cityName} aria-labelledby={`hoods-${citySlug}`}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id={`hoods-${citySlug}`} className="text-2xl font-bold">
                    {cityName}
                  </h2>
                  <Link
                    href={`/locations/${citySlug}/`}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {cityName} city guide
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {hoods.map((hood) => (
                    <Card key={hood.slug} className="transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          <Link
                            href={`/neighborhoods/${citySlug}/${hood.slug}/`}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            {hood.name}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-foreground/70">{hood.character}</p>
                        <Badge variant="outline" className="text-xs">
                          Walkability: {hood.walkability}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )
          })}

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

          <ConsultationCTA />
        </div>
      </main>
    </>
  )
}
