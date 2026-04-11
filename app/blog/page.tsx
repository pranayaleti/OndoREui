 "use client"

import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import { Calendar, User, ArrowRight, MapPin } from "lucide-react"

export default function BlogPage() {
  const featuredPost = {
    title: "Remote Online Notary in All 50 States",
    excerpt: "How ONDO Notary delivers secure Remote Online Notarization nationwide with ID checks, audit trails, and lender-ready documents.",
    author: "ONDO Notary Team",
    date: "January 10, 2025",
    readTime: "6 min read",
    category: "Notary",
    image: "/modern-office-building.png",
    slug: "remote-online-notary-all-50-states"
  }

  const blogPosts = useMemo(() => ([
    {
      title: "The Hidden Math Behind Renting vs Owning",
      excerpt: "Opportunity cost, equity velocity, and inflation-adjusted rent modeled by a developer-landlord.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Finance",
      image: "/modern-office-building.png",
      slug: "renting-vs-owning-hidden-math"
    },
    {
      title: "I’m a Full-Stack Dev and Landlord: What Software Gets Wrong",
      excerpt: "UX gaps in property software and how to design flows that serve tenants and owners.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Product",
      image: "/modern-townhouse-garage.png",
      slug: "full-stack-dev-landlord-gaps"
    },
    {
      title: "Commercial Real Estate 101: Cap Rates, NNN, and Tenant Mix",
      excerpt: "A practical primer on how cap rates, lease structures, and tenant mix shape CRE value.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Commercial",
      image: "/modern-office-building.png",
      slug: "commercial-real-estate-101-tenant-mix"
    },
    {
      title: "Crypto and Real Estate: Building a Barbell Hedge",
      excerpt: "Balancing fast, volatile assets with slow, cashflowing rentals—without co-mingling risk.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Strategy",
      image: "/modern-apartment-balcony.png",
      slug: "crypto-and-real-estate-hedge"
    },
    {
      title: "New Landlord Mistakes and the Systems That Prevent Them",
      excerpt: "Documentation, reserves, maintenance states, and comms playbooks to avoid expensive errors.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Landlording",
      image: "/modern-office-building.png",
      slug: "new-landlord-mistakes-systems"
    },
    {
      title: "Utah Rent vs Buy: Wasatch Front Playbook",
      excerpt: "Corridor-specific math on taxes, transit, schools, and maintenance along the Wasatch Front.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Utah",
      image: "/city-map-with-pin.png",
      slug: "utah-rent-vs-buy-wasatch-front",
      cities: ["Salt Lake City", "Draper", "Lehi", "Provo", "Ogden"],
    },
    {
      title: "Property Management Automation Checklist",
      excerpt: "High-ROI automations for rent, maintenance, and owner reporting—built by a dev-operator.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Automation",
      image: "/modern-office-building.png",
      slug: "property-management-automation-checklist"
    },
    {
      title: "Vacancy Risk Playbook",
      excerpt: "Model, reduce, and recover from vacancy with renewals, turns, and seasonality tactics.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Vacancy",
      image: "/modern-apartment-balcony.png",
      slug: "vacancy-risk-playbook"
    },
    {
      title: "Maintenance and CapEx Strategy for Rentals",
      excerpt: "Lifecycle intervals, reserves, and standardization to keep NOI stable and assets healthy.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Maintenance",
      image: "/modern-office-building.png",
      slug: "maintenance-capex-strategy"
    },
    {
      title: "Dashboards for Landlords: See Patterns, Act Faster",
      excerpt: "KPIs, design principles, and build notes for turning rentals into a managed system.",
      author: "ONDO Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Analytics",
      image: "/modern-office-building.png",
      slug: "dashboards-for-landlords"
    },
    {
      title: "Building a High-Performance Real Estate Platform with Next.js 15 and Supabase",
      excerpt: "A technical deep dive into the architecture of Ondo Real Estate, featuring App Router, React Server Components, and Supabase.",
      author: "Engineering Team",
      date: "December 10, 2025",
      readTime: "8 min read",
      category: "Engineering",
      image: "/modern-office-building.png",
      slug: "building-high-performance-real-estate-nextjs-supabase"
    },
    {
      title: "Engineering Accuracy: Behind the Scenes of Real Estate Investment Calculators",
      excerpt: "How we built the web's most accurate real estate financial calculators using React and TypeScript.",
      author: "Engineering Team",
      date: "December 10, 2025",
      readTime: "7 min read",
      category: "Engineering",
      image: "/modern-townhouse-garage.png",
      slug: "engineering-real-estate-investment-calculators"
    },
    {
      title: "Modernizing Legal Workflows: Integrating Remote Online Notary Services",
      excerpt: "How we integrated seamless booking for mobile and remote online notary services directly into the Ondo platform.",
      author: "Product Team",
      date: "December 10, 2025",
      readTime: "5 min read",
      category: "Product",
      image: "/modern-apartment-balcony.png",
      slug: "modernizing-notary-workflows-integration"
    },
    {
      title: "Technical SEO for Real Estate: JSON-LD, Sitemaps, and Core Web Vitals",
      excerpt: "A blueprint for dominating local real estate search results using Next.js SEO primitives and structured data.",
      author: "Growth Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "SEO",
      image: "/modern-office-building.png",
      slug: "technical-seo-for-real-estate"
    },
    {
      title: "Designing a Property Owner Portal: Managing Assets at Scale",
      excerpt: "How we built a comprehensive dashboard for landlords to track performance, manage tenants, and organize documents.",
      author: "Product Team",
      date: "December 10, 2025",
      readTime: "6 min read",
      category: "Product",
      image: "/modern-office-building.png",
      slug: "designing-property-owner-portal"
    },
    {
      title: "Mobile Notary in Utah County: Fees, Timing, and How to Book",
      excerpt: "Transparent pricing, same-day scheduling, and where we travel for on-site notarization in Utah County.",
      author: "ONDO Notary Team",
      date: "January 10, 2025",
      readTime: "6 min read",
      category: "Notary",
      image: "/modern-apartment-balcony.png",
      slug: "mobile-notary-utah-county-guide"
    },
    {
      title: "Remote Online Notary for Real Estate Closings",
      excerpt: "Step-by-step RON workflow for purchases, refis, HELOCs, and investor deals with title-ready audit trails.",
      author: "ONDO Notary Team",
      date: "January 10, 2025",
      readTime: "7 min read",
      category: "Notary",
      image: "/modern-townhouse-garage.png",
      slug: "remote-online-notary-real-estate-closings"
    },
    {
      title: "Checklist: Prepare for Your Remote Online Notary Session",
      excerpt: "ID verification, tech checks, and witness tips to avoid rescheduling and get sealed PDFs instantly.",
      author: "ONDO Notary Team",
      date: "January 10, 2025",
      readTime: "5 min read",
      category: "Notary",
      image: "/modern-office-building.png",
      slug: "prepare-for-remote-online-notary-session"
    },
    {
      title: "First-Time Home Buyer Guide: Everything You Need to Know",
      excerpt: "Complete guide to buying your first home in Utah, from pre-approval to closing day.",
      author: "Sarah Johnson",
      date: "December 10, 2024",
      readTime: "8 min read",
      category: "Buying Guide",
      image: "/suburban-house-garden.png",
      slug: "first-time-home-buyer-guide"
    },
    {
      title: "Property Management Tips for Utah Landlords",
      excerpt: "Essential tips for managing rental properties in Utah's competitive market.",
      author: "Michael Chen",
      date: "December 5, 2024",
      readTime: "6 min read",
      category: "Property Management",
      image: "/property-manager-meeting.png",
      slug: "property-management-tips-utah-landlords",
      cities: ["Salt Lake City", "Lehi", "Provo", "Ogden"],
    },
    {
      title: "Mortgage Rate Trends: What to Expect in 2025",
      excerpt: "Analysis of current mortgage rate trends and predictions for the coming year.",
      author: "Jennifer Martinez",
      date: "November 28, 2024",
      readTime: "4 min read",
      category: "Mortgage",
      image: "/modern-townhouse-garage.png",
      slug: "mortgage-rate-trends-2025"
    },
    {
      title: "Why Utah is the Best Place to Invest in Real Estate",
      excerpt: "Discover why Utah's real estate market offers excellent investment opportunities.",
      author: "David Thompson",
      date: "November 20, 2024",
      readTime: "7 min read",
      category: "Investment",
      image: "/city-map-with-pin.png",
      slug: "why-utah-best-real-estate-investment",
      cities: ["Salt Lake City", "Draper", "Lehi", "Sandy", "Orem", "Ogden"],
    },
    {
      title: "Home Staging Tips That Actually Work",
      excerpt: "Professional staging tips to help your home sell faster and for more money.",
      author: "Lisa Park",
      date: "November 15, 2024",
      readTime: "5 min read",
      category: "Selling",
      image: "/modern-apartment-balcony.png",
      slug: "home-staging-tips-that-work"
    },
    {
      title: "Understanding Property Taxes in Utah",
      excerpt: "Complete breakdown of Utah property taxes and how they affect your investment.",
      author: "Robert Wilson",
      date: "November 8, 2024",
      readTime: "6 min read",
      category: "Taxes",
      image: "/placeholder.jpg",
      slug: "understanding-property-taxes-utah"
    }
  ]), [])

  const categoryCounts = useMemo(() => {
    return blogPosts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1
      return acc
    }, {})
  }, [blogPosts])

  const categories = useMemo(() => {
    const names = Object.keys(categoryCounts).sort()
    return [{ name: "All", count: blogPosts.length }, ...names.map(name => ({ name, count: categoryCounts[name] }))]
  }, [blogPosts.length, categoryCounts])

  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [activeCity, setActiveCity] = useState<string>("All")

  // Collect unique cities across all tagged posts
  const citiesWithPosts = useMemo(() => {
    const all = new Set<string>()
    blogPosts.forEach((p) => {
      if ("cities" in p && Array.isArray((p as { cities?: string[] }).cities)) {
        (p as { cities: string[] }).cities.forEach((c) => all.add(c))
      }
    })
    return ["All", ...Array.from(all).sort()]
  }, [blogPosts])

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const catMatch = activeCategory === "All" || post.category === activeCategory
      const cityMatch =
        activeCity === "All" ||
        ("cities" in post &&
          Array.isArray((post as { cities?: string[] }).cities) &&
          (post as { cities: string[] }).cities.includes(activeCity))
      return catMatch && cityMatch
    })
  }, [activeCategory, activeCity, blogPosts])

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
        backgroundImage="/modern-office-building.png"
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
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{featuredPost.category}</Badge>
                      <span className="text-sm text-foreground/70">{featuredPost.readTime}</span>
                    </div>
                    <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                    <CardDescription className="text-lg mb-6">{featuredPost.excerpt}</CardDescription>
                    <div className="flex items-center gap-4 text-sm text-foreground/70 mb-6">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.date}
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
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
                  {filteredPosts.map((post, index) => (
                    <Link key={index} href={`/blog/${post.slug}`} className="group block h-full">
                      <Card className="h-full hover:shadow-lg transition-shadow group-hover:border-primary/60">
                      <div className="relative h-48">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                            className="object-cover transition-transform duration-200 group-hover:scale-[1.01]"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">{post.category}</Badge>
                          <span className="text-xs text-foreground/70">{post.readTime}</span>
                        </div>
                          <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        <CardDescription className="mb-4 line-clamp-2">{post.excerpt}</CardDescription>
                          <div className="flex items-center gap-4 text-xs text-foreground/70">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const isActive = category.name === activeCategory
                        return (
                          <Button
                            key={category.name}
                            variant={isActive ? "secondary" : "outline"}
                            size="sm"
                            className="gap-2"
                            onClick={() => setActiveCategory(category.name)}
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
                {citiesWithPosts.length > 1 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Filter by City
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {citiesWithPosts.map((city) => {
                          const isActive = city === activeCity
                          return (
                            <Button
                              key={city}
                              variant={isActive ? "secondary" : "outline"}
                              size="sm"
                              onClick={() => setActiveCity(city)}
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

                <Card>
                  <CardHeader>
                    <CardTitle>Stay Updated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 mb-4">
                      Get the latest real estate insights delivered to your inbox.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/contact">Subscribe to Newsletter</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-card text-white">
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
