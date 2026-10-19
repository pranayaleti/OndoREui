import Link from "next/link"
import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UtahLandlordEducationSection } from "@/components/resources/utah-landlord-education-section"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { getGlossaryTerm, glossaryHref } from "@/lib/content/glossary"

const DESCRIPTION =
  "Calculators, guides, landlord templates, market reports and a plain-English glossary for renting, buying, selling, managing and financing in Utah."

export const metadata: Metadata = {
  title: pageTitle("Resources: Calculators, Guides & Glossary"),
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/resources/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Resources: Calculators, Guides & Glossary"),
    description: DESCRIPTION,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

const groups = [
  {
    title: "Tools",
    links: [
      { href: "/whats-my-home-worth/", label: "Free home estimate" },
      { href: "/calculators/", label: "All calculators" },
      { href: "/calculators/owner-vs-self/", label: "Self-manage vs Ondo" },
      { href: "/calculators/mortgage-payment/", label: "Mortgage payment" },
      { href: "/calculators/rent-vs-own/", label: "Rent vs own" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/learn/", label: "Mortgage learning hub" },
      { href: "/blog/", label: "Blog" },
      { href: "/resources/templates/", label: "Landlord templates" },
      { href: "/faq/", label: "FAQs" },
      { href: "/glossary/", label: "Glossary" },
    ],
  },
  {
    title: "Utah",
    links: [
      { href: "/market-reports/", label: "City market reports" },
      { href: "/locations/", label: "City guides" },
      { href: "/neighborhoods/", label: "Neighborhood guides" },
      { href: "/schools/", label: "School districts" },
      { href: "/moving-to-utah/", label: "New to Utah" },
    ],
  },
]

const formulas = [
  { name: "Net operating income (NOI)", formula: "Gross rent − operating expenses" },
  { name: "Cap rate", formula: "NOI ÷ property value" },
  { name: "Cash-on-cash return", formula: "Annual pre-tax cash flow ÷ cash invested" },
  { name: "Debt service coverage (DSCR)", formula: "NOI ÷ annual loan payments" },
]

/** Definitions come from the glossary itself so they cannot drift from /glossary/<slug>/. */
const GLOSSARY_HIGHLIGHT_SLUGS = ["noi", "cap-rate", "dscr", "cash-on-cash-return", "cash-flow", "vacancy-rate"] as const
const glossaryHighlights = GLOSSARY_HIGHLIGHT_SLUGS.flatMap((slug) => {
  const entry = getGlossaryTerm(slug)
  return entry ? [entry] : []
})

export default function ResourcesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Resources: Calculators, Guides & Glossary"
        description={DESCRIPTION}
        pathname="/resources"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Resources", url: `${SITE_URL}/resources` },
        ])}
      />
      <PageBanner title="Resources" subtitle="Tools, guides and definitions in one place." />

      <section className="bg-background py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {groups.map((group) => (
              <Card key={group.title}>
                <CardHeader>
                  <CardTitle>{group.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-primary underline underline-offset-4">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30 py-16">
        <div className="container mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-foreground">Four numbers every rental is judged on</h2>
            <ul className="space-y-3">
              {formulas.map((f) => (
                <li key={f.name} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-medium text-foreground">{f.name}</p>
                  <p className="mt-1 font-mono text-xs text-foreground/70">{f.formula}</p>
                </li>
              ))}
            </ul>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Glossary highlights</CardTitle>
            </CardHeader>
            <CardContent role="region" aria-label="Glossary highlights" className="space-y-4 text-sm text-foreground/80">
              {glossaryHighlights.map((entry) => (
                <div key={entry.slug}>
                  <p className="font-semibold">
                    <Link href={glossaryHref(entry.slug)} className="underline underline-offset-2">
                      {entry.term}
                    </Link>
                  </p>
                  <p className="text-foreground/70">{entry.short}</p>
                </div>
              ))}
              <Button asChild variant="outline" size="sm">
                <Link href="/glossary/">Browse the full glossary</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <UtahLandlordEducationSection />
    </main>
  )
}
