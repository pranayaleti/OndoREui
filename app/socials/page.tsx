import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, ExternalLink, Globe2, Share2 } from "lucide-react"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { getLatestNewsItems } from "@/lib/news-items"
import { SOCIAL_POSTS } from "@/lib/social-posts"
import { SITE_SOCIAL_LINKS, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Socials & Updates | Ondo Real Estate",
  description:
    "Latest Ondo social posts, profile links, and curated real estate news — follow along on Linktree and our public channels.",
  alternates: { canonical: `${SITE_URL}/socials/` },
  openGraph: {
    title: "Socials & Updates | Ondo Real Estate",
    description:
      "Curated social highlights, live profile links, and the latest industry news we track for Utah buyers, owners, and investors.",
    url: `${SITE_URL}/socials/`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: "Ondo Real Estate — socials and updates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Socials & Updates | Ondo Real Estate",
    description: "Curated posts, Linktree, and the latest real estate news we track.",
    images: [`${SITE_URL}/modern-office-building.webp`],
  },
}

function platformLabelFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "")
    if (host.includes("linktr.ee")) return "Linktree"
    if (host.includes("facebook")) return "Facebook"
    if (host.includes("instagram")) return "Instagram"
    if (host.includes("linkedin")) return "LinkedIn"
    if (host.includes("youtube")) return "YouTube"
    if (host.includes("tiktok")) return "TikTok"
    if (host === "x.com" || host.includes("twitter")) return "X"
    if (host.includes("pinterest")) return "Pinterest"
    if (host.includes("yelp")) return "Yelp"
    return host
  } catch {
    return "Social"
  }
}

export default function SocialsPage() {
  const liveProfiles = SITE_SOCIAL_LINKS.filter((s) => s.live)
  const latestNews = getLatestNewsItems(4)

  return (
    <main className="min-h-screen">
      <SEO
        title="Socials & Updates | Ondo Real Estate"
        description="Latest Ondo social posts, profile links, and curated real estate news."
        pathname="/socials"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Socials", url: `${SITE_URL}/socials` },
        ])}
      />

      <PageBanner
        title="Socials & updates"
        subtitle="Posts, profiles, and the latest news we track"
        backgroundImage="/modern-office-building.webp"
      />

      {/* Social posts */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8 flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Social posts</h2>
          </div>
          <p className="text-sm text-foreground/70 mb-8 max-w-2xl">
            Highlights and announcements from Ondo. Click through to the full post or page.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {SOCIAL_POSTS.map((post) => (
              <Card key={`${post.platform}-${post.title}`} className="h-full flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {post.platform}
                    </Badge>
                    <span className="text-xs text-foreground/60">{post.date}</span>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild size="sm" className="w-full justify-center gap-2">
                    <Link href={post.url} target="_blank" rel="noopener noreferrer">
                      View post
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Follow us */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-bold mb-2">Follow us</h2>
          <p className="text-sm text-foreground/70 mb-8 max-w-2xl">
            Live profiles only — we list channels once they&apos;re claimed and active. Linktree is the
            always-on hub for every public link.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {liveProfiles.map((profile) => {
              const label = profile.label ?? platformLabelFromUrl(profile.url)
              return (
                <Button key={profile.url} asChild variant="outline">
                  <Link href={profile.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    {label}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="rounded-lg border border-border bg-background p-8 text-center max-w-xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Linktree hub</h3>
            <p className="text-sm text-foreground/70 mb-6">
              Open our Linktree for every public booking link, tool, and profile in one place.
              (Embeds are often blocked by browsers — a direct link is more reliable.)
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link
                href="https://linktr.ee/ondorealestate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Linktree
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Latest news</h2>
              <p className="mt-2 text-sm text-foreground/70">
                Same curated sources as our{" "}
                <Link href="/news" className="text-primary underline-offset-4 hover:underline">
                  news page
                </Link>
                .
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/news">See all news</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {latestNews.map((item) => (
              <Card key={item.title} className="h-full flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {item.category}
                    </Badge>
                    {item.region ? (
                      <Badge variant="secondary" className="text-[11px]">
                        {item.region}
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm">{item.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-xs text-foreground/70">
                    <span className="inline-flex items-center gap-1">
                      <Globe2 className="h-3 w-3" />
                      {item.source}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
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
        </div>
      </section>
    </main>
  )
}
