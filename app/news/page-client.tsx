"use client"

import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { NEWS_ITEMS } from "@/lib/news-items"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Globe2, ExternalLink } from "lucide-react"

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Real Estate News Aggregator | Ondo Real Estate"
        description="Curated real estate news and market updates from trusted national and Utah-focused sources, all in one place."
        pathname="/news"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "News", url: `${SITE_URL}/news` },
        ])}
      />

      <PageBanner
        title="Real Estate News"
        subtitle="Curated headlines and data sources for serious buyers, sellers, and investors"
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Trusted Real Estate News Sources</h2>
                <p className="mt-2 text-sm text-foreground/70">
                  We aggregate high-signal real estate news and data so you can quickly scan what matters, then click
                  through to the original source for full details.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <Globe2 className="h-4 w-4" />
                <span>External sources · Links open in a new tab</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {NEWS_ITEMS.map((item) => (
                <Card key={item.title} className="h-full flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[11px]">
                        {item.category}
                      </Badge>
                      {item.region && (
                        <Badge variant="secondary" className="text-[11px]">
                          {item.region}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm">{item.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-foreground/70">
                      <div className="flex items-center gap-1">
                        <Globe2 className="h-3 w-3" />
                        <span>{item.source}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <Button asChild size="sm" className="w-full justify-center gap-2">
                      <Link href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
                        View on {item.source}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/socials">Also see Socials & updates</Link>
              </Button>
            </div>

            <div className="mt-12 text-center text-sm text-foreground/70">
              <p>
                Ondo Real Estate does not own or control the external news sites linked above. Always verify details
                with a licensed professional before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
