import SEO from "@/components/seo"
import {
  generateBreadcrumbJsonLd,
  generateSitemapItemListJsonLd,
  generateWebsiteJsonLd,
} from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { getFlatSiteIndexForJsonLd, getSiteIndexSections } from "@/lib/site-index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  BookOpen,
  Building2,
  Calculator,
  CircleHelp,
  FileSignature,
  Home,
  Landmark,
  MapPin,
  Newspaper,
  Scale,
  Search,
  TrendingUp,
  Users,
} from "lucide-react"

const SECTION_ICONS: Record<string, LucideIcon> = {
  "home-company": Building2,
  "buy-finance": Landmark,
  "local-hubs": MapPin,
  "sell-invest": TrendingUp,
  "rent-manage": Home,
  notary: FileSignature,
  calculators: Calculator,
  faq: CircleHelp,
  blog: BookOpen,
  about: Users,
  connect: Newspaper,
  "legal-trust": Scale,
}

export default function SitemapPage() {
  const siteSections = getSiteIndexSections()
  const itemList = getFlatSiteIndexForJsonLd()
  const structuredData = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Sitemap", url: `${SITE_URL.replace(/\/$/, "")}/sitemap/` },
    ]),
    generateWebsiteJsonLd(),
    generateSitemapItemListJsonLd(itemList),
  ]

  return (
    <main className="min-h-screen bg-background dark:bg-transparent">
      <SEO
        title="Sitemap | Ondo Real Estate"
        description="Human-readable index of every public Ondo Real Estate page: buy, sell, loans, investments, notary, calculators, FAQs, and blog. Includes links to XML sitemap and LLM brief."
        pathname="/sitemap"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={structuredData}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Site map</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Browse every public page on this site by topic. For crawlers, use the{" "}
              <Link href="/sitemap.xml" className="text-primary underline-offset-4 hover:underline">
                XML sitemap
              </Link>{" "}
              or the{" "}
              <Link href="/llms.txt" className="text-primary underline-offset-4 hover:underline">
                LLM / agent brief
              </Link>
              .
            </p>
          </header>

          <nav aria-label="Jump to section" className="mb-12 rounded-lg border border-border bg-card/50 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">On this page</p>
            <ul className="flex flex-wrap gap-2">
              {siteSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex rounded-md bg-muted px-2.5 py-1 text-sm text-foreground hover:bg-muted/80"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site index" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {siteSections.map((section) => {
              const Icon = SECTION_ICONS[section.id] ?? Building2
              return (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                        {section.title}
                      </CardTitle>
                      {section.description ? (
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      ) : null}
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li
                            key={`${section.id}-${link.href}-${link.name}`}
                            className="border-b border-border pb-3 last:border-b-0 last:pb-0"
                          >
                            <Link
                              href={link.href}
                              className="block rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span className="font-semibold text-sm">{link.name}</span>
                              <span className="mt-1 block text-xs text-muted-foreground">{link.description}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              )
            })}
          </nav>

          <div className="mt-16 text-center">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3">
                  <Search className="h-6 w-6" aria-hidden />
                  Can&apos;t find what you need?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-muted-foreground">
                  Search listings and articles, or contact us for a human who knows Utah real estate.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild>
                    <Link href="/search/">Search the site</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/contact/">Contact us</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
