"use client"

import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { analyticsAttributes } from "@/lib/analytics"
import { SITE_URL } from "@/lib/site"
import { DEFAULT_BLOG_IMAGE, getBlogPosts, type BlogPostEntry } from "@/lib/blog-posts"
import { formatArticleDate } from "@/components/content/article-byline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Calendar, ArrowRight, MapPin } from "lucide-react"

// Blog readers who want email updates go to the dedicated /subscribe/ page (not the contact form).
const SUBSCRIBE_HREF = "/subscribe/?utm_source=blog&utm_medium=referral&utm_campaign=blog_index"

function SubscribeCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Stay Updated</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/70 mb-4">
          Get the latest real estate insights delivered to your inbox.
        </p>
        <Button asChild className="w-full">
          <Link href={SUBSCRIBE_HREF} {...analyticsAttributes("subscribe_click", "blog_index", "newsletter")}>
            Subscribe to Newsletter
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// Posts come from the one registry (lib/blog-posts.ts), newest first. The newest post is featured
// so the hub never leads with a stale article; the grid lists the rest.
const [featuredPost, ...blogPosts] = getBlogPosts()

const CATEGORIES = (() => {
  const counts = blogPosts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1
    return acc
  }, {})
  return [
    { name: "All", count: blogPosts.length },
    ...Object.keys(counts)
      .sort()
      .map((name) => ({ name, count: counts[name] })),
  ]
})()

// Unique cities across all tagged posts.
const CITIES_WITH_POSTS = ["All", ...Array.from(new Set(blogPosts.flatMap((post) => post.cities ?? []))).sort()]

function readTimeLabel(post: BlogPostEntry): string | null {
  return post.readMinutes ? `${post.readMinutes} min read` : null
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [activeCity, setActiveCity] = useState<string>("All")

  // Persist the filters in the URL (?category=Credit&city=Lehi) so a filtered list can be shared
  // and survives a reload. Read after mount so the static HTML stays the unfiltered list.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const category = params.get("category")
      const city = params.get("city")
      if (category && CATEGORIES.some((c) => c.name === category)) setActiveCategory(category)
      if (city && CITIES_WITH_POSTS.includes(city)) setActiveCity(city)
    } catch {
      // Filters are a convenience; ignore an unreadable URL.
    }
  }, [])

  const syncUrl = useCallback((category: string, city: string) => {
    try {
      const params = new URLSearchParams()
      if (category !== "All") params.set("category", category)
      if (city !== "All") params.set("city", city)
      const query = params.toString()
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`)
    } catch {
      // History API unavailable; the filter still works in memory.
    }
  }, [])

  const selectCategory = (name: string) => {
    setActiveCategory(name)
    syncUrl(name, activeCity)
  }
  const selectCity = (name: string) => {
    setActiveCity(name)
    syncUrl(activeCategory, name)
  }
  const clearFilters = () => {
    setActiveCategory("All")
    setActiveCity("All")
    syncUrl("All", "All")
  }

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const catMatch = activeCategory === "All" || post.category === activeCategory
      const cityMatch = activeCity === "All" || (post.cities?.includes(activeCity) ?? false)
      return catMatch && cityMatch
    })
  }, [activeCategory, activeCity])

  return (
    <main className="min-h-screen">
      <SEO
        title="Real Estate Blog | Ondo Real Estate"
        description="Stay updated with the latest Utah real estate news, market insights, and expert advice from Ondo Real Estate professionals."
        pathname="/blog"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ])}
      />
      <PageBanner
        title="Real Estate Blog"
        subtitle="Expert insights, market updates, and helpful tips for Utah real estate"
        backgroundImage="/modern-office-building.webp"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Featured Post */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-8">Featured Article</h2>
              <Card className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={featuredPost.image ?? DEFAULT_BLOG_IMAGE}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      {readTimeLabel(featuredPost) ? (
                        <span className="text-sm text-foreground/70">{readTimeLabel(featuredPost)}</span>
                      ) : null}
                    </div>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4">{featuredPost.title}</h3>
                    <CardDescription className="text-lg mb-6">{featuredPost.excerpt}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-foreground/70 mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatArticleDate(featuredPost.published)}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read More<span className="sr-only">: {featuredPost.title}</span>
                        <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Blog Posts */}
              <div className="lg:col-span-3">
                <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.slug} className="group relative h-full">
                      <Card className="h-full hover:shadow-lg transition-shadow group-hover:border-primary/60">
                      <div className="relative h-48">
                        <Image
                          src={post.image ?? DEFAULT_BLOG_IMAGE}
                          alt=""
                          fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          {readTimeLabel(post) ? (
                            <span className="text-xs text-foreground/70">{readTimeLabel(post)}</span>
                          ) : null}
                        </div>
                          <h3 className="text-lg font-semibold leading-none tracking-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="after:absolute after:inset-0 after:z-10 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                            >
                              {post.title}
                            </Link>
                          </h3>
                        <CardDescription className="mb-4 line-clamp-2">{post.excerpt}</CardDescription>
                          <div className="flex items-center gap-4 text-xs text-foreground/70">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatArticleDate(post.published)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </div>
                  ))}
                </div>
                <p role="status" aria-live="polite" className="sr-only">
                  {filteredPosts.length === 1 ? "1 article shown" : `${filteredPosts.length} articles shown`}
                </p>
                {filteredPosts.length === 0 && (
                  <div className="rounded-lg border border-border p-6 text-center">
                    <p className="mb-4 text-foreground/80">No articles match that category and city together.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
                <SubscribeCard className="mt-8 lg:hidden" />
              </div>

              {/* Sidebar: filters sit above the list on mobile (order-first), beside it on desktop */}
              <div className="order-first lg:order-none lg:col-span-1">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
                      {CATEGORIES.map((category) => {
                        const isActive = category.name === activeCategory
                        return (
                          <Button
                            key={category.name}
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            className="shrink-0 gap-2"
                            onClick={() => selectCategory(category.name)}
                            aria-pressed={isActive}
                          >
                            <span className="text-sm">{category.name}</span>
                            <Badge variant={isActive ? "outline" : "secondary"} className="text-[11px]">
                              {category.count}
                            </Badge>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* City filter */}
                {CITIES_WITH_POSTS.length > 1 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Filter by City
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
                        {CITIES_WITH_POSTS.map((city) => {
                          const isActive = city === activeCity
                          return (
                            <Button
                              key={city}
                              variant={isActive ? "secondary" : "outline"}
                              size="sm"
                              className="shrink-0"
                              onClick={() => selectCity(city)}
                              aria-pressed={isActive}
                            >
                              {city}
                            </Button>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <SubscribeCard className="hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-card text-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Your Real Estate Move?</h2>
            <p className="text-xl mb-8">
              Our expert team is here to help you navigate Utah's real estate market with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Get Expert Advice</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted dark:border-white dark:text-white dark:hover:bg-card/75"
              >
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
