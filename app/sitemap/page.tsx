import type { Metadata } from "next"
import SEO from "@/components/seo"
import {
  generateBreadcrumbJsonLd,
  generateSitemapItemListJsonLd,
  generateWebsiteJsonLd,
} from "@/lib/seo"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { SITE_URL, pageTitle } from "@/lib/site"
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

export const metadata: Metadata = pageCanonicalMetadata("/sitemap", {
  title: pageTitle("HTML Sitemap | Ondo Real Estate"),
  description: "Browse every public Ondo Real Estate page, services, locations, blog, and tools.",
})

const SECTION_ICONS: Record<string, LucideIcon> = {
  buy: Home,
  sell: TrendingUp,
  loans: Landmark,
  "rent-manage": Search,
  invest: TrendingUp,
  notary: FileSignature,
  calculators: Calculator,
  local: MapPin,
  company: Users,
  platform: Building2,
  faq: CircleHelp,
  glossary: BookOpen,
  blog: Newspaper,
  "legal-trust": Scale,
}

/** Machine-readable files (sitemap.xml, llms.txt, ...) are listed for agents in sitemap.md, not for people here. */
const isPageLink = (href: string) => !/\.[a-z0-9]+$/i.test(href)

// Off-screen sections skip layout and paint until scrolled near (CSS only, links stay in the HTML).
// Intrinsic size matches the fixed card height below so the grid doesn't jump as sections render.
const SECTION_RENDER_HINT = "scroll-mt-24 [content-visibility:auto] [contain-intrinsic-size:auto_20rem]"

export default function SitemapPage() {
  const siteSections = getSiteIndexSections()
    .map((section) => ({ ...section, links: section.links.filter((link) => isPageLink(link.href)) }))
    .filter((section) => section.links.length > 0)
  // Name and URL only: schema.org ListItem descriptions are not used for rich results, and
  // with ~1,000 links they were most of the page's JSON-LD weight.
  const itemList = getFlatSiteIndexForJsonLd().map(({ name, url }) => ({ name, url }))
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
              <a href="/sitemap.xml" className="text-primary underline underline-offset-4">
                XML sitemap
              </a>{" "}
              or the{" "}
              <a href="/llms.txt" className="text-primary underline underline-offset-4">
                LLM / agent brief
              </a>
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

          <nav aria-label="Site index" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {siteSections.map((section) => {
              const Icon = SECTION_ICONS[section.id] ?? Building2
              return (
                <section key={section.id} id={section.id} className={SECTION_RENDER_HINT}>
                  <Card className="flex h-80 flex-col overflow-hidden transition-shadow hover:shadow-lg">
                    <CardHeader className="shrink-0 space-y-1 border-b border-border p-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                        {section.title}
                        <span className="ml-auto text-xs font-normal text-muted-foreground">
                          {section.links.length}
                        </span>
                      </CardTitle>
                      {section.description ? (
                        <p className="line-clamp-2 text-xs text-muted-foreground">{section.description}</p>
                      ) : null}
                    </CardHeader>
                    <CardContent className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pt-3">
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li
                            key={`${section.id}-${link.href}-${link.name}`}
                            className="border-b border-border pb-2 last:border-b-0 last:pb-0"
                          >
                            <Link
                              href={link.href}
                              className="block rounded-sm hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <span className="text-sm font-medium">{link.name}</span>
                              <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{link.description}</span>
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
                    <Link href="/properties/">Search listings</Link>
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
