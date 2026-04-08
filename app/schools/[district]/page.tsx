import Link from "next/link"
import { findDistrictBySlug, allDistrictSlugs } from "@/lib/school-district-content"
import { toCitySlug } from "@/lib/utah-cities"
import type { Metadata } from "next"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CrossLinkSection } from "@/components/cross-link-section"
import { School, Users, MapPin, ExternalLink, CheckCircle2, BookOpen, ArrowRight } from "lucide-react"

type Params = Promise<{ district: string }>

export function generateStaticParams() {
  return allDistrictSlugs.map((district) => ({ district }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { district: districtSlug } = await params
  const district = findDistrictBySlug(districtSlug)
  const name = district?.name ?? districtSlug
  const title = `${name} | Schools & Education Guide | ${SITE_BRAND_SHORT}`
  const description = district
    ? `${district.name} serves ${district.citiesServed.slice(0, 3).join(", ")} and more — ${district.enrollment.toLocaleString()} students, top programs, and school listings.`
    : ""
  const canonical = `${SITE_URL}/schools/${districtSlug}/`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export default async function Page({ params }: { params: Params }) {
  const { district: districtSlug } = await params
  const district = findDistrictBySlug(districtSlug)
  if (!district) notFound()

  const levelOrder = ["Elementary", "Middle", "High", "K-12"] as const
  const schoolsByLevel = levelOrder.map((level) => ({
    level,
    schools: district.schools.filter((s) => s.level === level),
  })).filter((g) => g.schools.length > 0)

  return (
    <>
      <SEO
        title={`${district.name} | Schools & Education Guide | ${SITE_BRAND_SHORT}`}
        description={`${district.name}: ${district.enrollment.toLocaleString()} students across ${district.citiesServed.length} cities. School listings, programs, and community highlights.`}
        pathname={`/schools/${districtSlug}/`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Schools", url: `${SITE_URL}/schools/` },
          { name: district.name, url: `${SITE_URL}/schools/${districtSlug}/` },
        ])}
      />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 to-background py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-medium text-primary mb-2 flex items-center justify-center gap-1">
              <School className="h-4 w-4" />
              School District Guide
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              {district.name}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-foreground/70">{district.overview}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm">
                <Users className="h-4 w-4 text-primary" />
                {district.enrollment.toLocaleString()} students
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                {district.citiesServed.length} cities
              </span>
              <a
                href={district.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm hover:bg-primary/5 transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                Official Website
              </a>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">

          {/* Highlights */}
          <section>
            <h2 className="text-2xl font-bold mb-4">District Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {district.highlights.map((h) => (
                <div key={h} className="flex items-start gap-3 rounded-lg border p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">{h}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Notable Programs */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Notable Programs
            </h2>
            <div className="flex flex-wrap gap-2">
              {district.notablePrograms.map((p) => (
                <Badge key={p} variant="secondary" className="text-sm py-1 px-3">{p}</Badge>
              ))}
            </div>
          </section>

          {/* Schools by Level */}
          {schoolsByLevel.map(({ level, schools }) => (
            <section key={level}>
              <h2 className="text-2xl font-bold mb-4">{level} Schools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.map((s) => (
                  <Card key={s.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        {s.name}
                        <Badge variant="outline" className="text-xs">{s.grades}</Badge>
                      </CardTitle>
                    </CardHeader>
                    {(s.enrollment || s.notes) && (
                      <CardContent>
                        {s.enrollment && (
                          <p className="text-sm text-foreground/60">{s.enrollment.toLocaleString()} students</p>
                        )}
                        {s.notes && <p className="text-sm text-foreground/70 mt-1">{s.notes}</p>}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {/* Cities Served */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Cities Served
            </h2>
            <div className="flex flex-wrap gap-2">
              {district.citiesServed.map((city) => (
                <Link
                  key={city}
                  href={`/locations/${toCitySlug(city)}/`}
                  className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm hover:bg-primary/5 hover:border-primary/30 transition-colors"
                >
                  <MapPin className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  {city}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-8 rounded-xl bg-muted/50 px-6">
            <h2 className="text-xl font-bold mb-3">Find a Home in the {district.name}</h2>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              School district is a top factor for families. Our agents know every neighborhood and school assignment boundary.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {district.citiesServed.slice(0, 2).map((city) => (
                <Button key={city} asChild variant="outline">
                  <Link href={`/buy-sell/${toCitySlug(city)}/`}>
                    Buy in {city}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ))}
              <Button asChild>
                <Link href="/contact/">Talk to an Agent</Link>
              </Button>
            </div>
          </section>

          <CrossLinkSection
            title="Explore the Area"
            variant="pills"
            links={district.citiesServed.slice(0, 6).map((city) => ({
              label: `${city} City Guide`,
              href: `/locations/${toCitySlug(city)}/`,
            }))}
          />
        </div>
      </main>
    </>
  )
}
