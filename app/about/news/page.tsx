import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User, ArrowRight, Phone, Mail } from "lucide-react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/about/news", {
  title: "News & Updates | Ondo Real Estate",
  description: "Stay informed with the latest news and insights from Ondo Real Estate.",
})


export default function NewsPage() {
  const newsArticles = [
    {
      title: "Ondo Real Estate Expands to Utah County",
      excerpt: "We're excited to announce our expansion into Utah County, bringing our exceptional property management and real estate services to Provo, Orem, and surrounding areas.",
      date: "2024-01-15",
      author: "Pranay Reddy Aleti",
      category: "Company News",
      image: "/modern-office-building.png",
      featured: true
    },
    {
      title: "Utah Housing Market Shows Strong Growth in Q4 2023",
      excerpt: "The Utah real estate market continues to show resilience with strong growth in property values and increased demand for both residential and commercial properties.",
      date: "2024-01-10",
      author: "Sarah Johnson",
      category: "Market Update",
      image: "/modern-apartment-balcony.png",
      featured: false
    },
    {
      title: "Ondo Real Estate Wins 'Best Property Management Company' Award",
      excerpt: "We're honored to receive the 'Best Property Management Company' award from Utah Business Magazine for the second consecutive year.",
      date: "2024-01-05",
      author: "Emily Rodriguez",
      category: "Awards",
      image: "/property-manager-meeting.png",
      featured: false
    },
    {
      title: "New Technology Platform Launches for Property Owners",
      excerpt: "Our new property management platform provides real-time insights, automated reporting, and streamlined communication for property owners.",
      date: "2023-12-20",
      author: "Michael Chen",
      category: "Technology",
      image: "/modern-office-building.png",
      featured: false
    },
    {
      title: "Housing Affordability Initiative Launched in Salt Lake City",
      excerpt: "We're partnering with local organizations to provide affordable housing solutions and support for first-time homebuyers in the Salt Lake City area.",
      date: "2023-12-15",
      author: "Pranay Reddy Aleti",
      category: "Community",
      image: "/suburban-house-garden.png",
      featured: false
    },
    {
      title: "Utah Real Estate Market Forecast for 2024",
      excerpt: "Our experts share their predictions for the Utah real estate market in 2024, including trends, opportunities, and what to expect for buyers and sellers.",
      date: "2023-12-10",
      author: "Sarah Johnson",
      category: "Market Analysis",
      image: "/modern-townhouse-garage.png",
      featured: false
    }
  ]

  const categories = [
    { name: "All", count: newsArticles.length },
    { name: "Company News", count: newsArticles.filter(article => article.category === "Company News").length },
    { name: "Market Update", count: newsArticles.filter(article => article.category === "Market Update").length },
    { name: "Awards", count: newsArticles.filter(article => article.category === "Awards").length },
    { name: "Technology", count: newsArticles.filter(article => article.category === "Technology").length },
    { name: "Community", count: newsArticles.filter(article => article.category === "Community").length },
    { name: "Market Analysis", count: newsArticles.filter(article => article.category === "Market Analysis").length }
  ]

  const featuredArticle = newsArticles.find(article => article.featured)
  const regularArticles = newsArticles.filter(article => !article.featured)

  return (
    <main className="min-h-screen">
      <SEO
        title="News & Updates | Ondo Real Estate"
        description="Stay updated with the latest news, market insights, and company updates from Ondo Real Estate. Read about our growth, awards, and community initiatives."
        pathname="/about/news"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "News", url: `${SITE_URL}/about/news` },
        ])}
      />
      <PageBanner
        title="News & Updates"
        subtitle="Stay informed with the latest news and insights from Ondo Real Estate"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">Latest News</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70">
                Stay updated with our latest company news, market insights, and community initiatives.
              </p>
            </div>

            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Featured Story</h3>
                <Card className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <div className="h-64 md:h-full bg-muted dark:bg-card flex items-center justify-center">
                        <Image
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {featuredArticle.category}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredArticle.date).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-4 dark:text-foreground">{featuredArticle.title}</CardTitle>
                      <CardDescription className="text-base mb-4">{featuredArticle.excerpt}</CardDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                          <User className="h-4 w-4" />
                          {featuredArticle.author}
                        </div>
                        <Button variant="outline" size="sm">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 dark:text-foreground">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={category.name === "All" ? "default" : "outline"}
                    size="sm"
                    className="text-sm"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>

            {/* Regular Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {regularArticles.map((article, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-muted dark:bg-card flex items-center justify-center">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-foreground/70">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg dark:text-foreground line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-foreground/70">
                        <User className="h-3 w-3" />
                        {article.author}
                      </div>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-muted dark:bg-muted rounded-lg p-8 mb-12">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-4 dark:text-foreground">Stay Updated</h3>
                <p className="text-foreground/70 dark:text-foreground/70 mb-6">
                  Subscribe to our newsletter to receive the latest news, market updates, and insights directly in your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-card dark:text-white"
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>
            </div>

            {/* Contact for Media */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Media Inquiries</h3>
              <p className="text-lg text-foreground/70 dark:text-foreground/70 mb-6">
                For media inquiries, press releases, or interview requests, please contact our communications team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`mailto:${SITE_EMAILS.media}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    {SITE_EMAILS.media}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`tel:${SITE_PHONE.replace(/[^+\\d]/g, "")}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {SITE_PHONE}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
