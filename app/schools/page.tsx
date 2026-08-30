import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import ConsultationCTA from "@/components/ConsultationCTA"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { schoolDistricts } from "@/lib/school-district-content"
import { SITE_URL } from "@/lib/site"
import { toCitySlug } from "@/lib/utah-cities"

export const metadata: Metadata = pageCanonicalMetadata("/schools", {
  title: "Utah School District Guides",
  description:
    "Directory of Wasatch Front school districts we publish guides for: campuses, cities served, and official district sites. Confirm programs and enrollment with the district.",
})

const faqs = [
  {
    question: "Are these official district pages?",
    answer:
      "No. Each guide summarizes campuses and cities we list for orientation. Boundaries, enrollment, and programs change. Use the official district website linked on every guide before you rely on a detail.",
  },
  {
    question: "Do you rank districts or schools?",
    answer:
      "We do not publish a ranking or a “best schools” list here. The guides are geographic: which district page covers which cities, plus the campus names we have on file.",
  },
]

export default function SchoolsHubPage() {
  const jsonLd = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Schools", url: `${SITE_URL}/schools/` },
    ]),
    generateFAQJsonLd(faqs),
  ].filter(Boolean)

  return (
    <>
      <SEO
        title="Utah School District Guides"
        description="Wasatch Front school district guides with official site links. Confirm details with the district."
        pathname="/schools"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen">
        <PageBanner
          title="School district guides"
          subtitle="Geography and official links. Not a ranking, and not a statement about who should live nearby."
          backgroundImage="/modern-office-building.webp"
        />
        <div className="container mx-auto max-w-6xl space-y-12 px-4 py-12">
          <BreadcrumbNav items={[{ label: "Schools" }]} />

          <section className="max-w-3xl space-y-4 text-foreground/80">
            <p>
              School campuses are a common question in a home search. These pages exist so you can jump from a city
              guide to the district we associated with it, then leave this site for the district’s own information.
              Housing decisions that treat school quality as a proxy for residents can violate Fair Housing rules; we
              keep this hub to names, cities served, and outbound links.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {schoolDistricts.map((district) => (
              <Card key={district.slug} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link
                      href={`/schools/${district.slug}/`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {district.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/70">
                  <p>Headquarters: {district.headquarters}</p>
                  <p>
                    Cities on this guide:{" "}
                    {district.citiesServed.map((city) => (
                      <span key={city}>
                        <Link
                          href={`/locations/${toCitySlug(city)}/`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {city}
                        </Link>
                        {city !== district.citiesServed[district.citiesServed.length - 1] ? ", " : ""}
                      </span>
                    ))}
                  </p>
                  <a
                    href={district.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Official district site
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

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
