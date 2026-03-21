import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "Research & Insights | Ondo Real Estate",
  description: "Market analysis, guides, and thought leadership from the Ondo team.",
}

const contentTypes = [
  { label: "Blog", href: "/blog", cta: "Read the blog" },
  { label: "News", href: "/news", cta: "Browse news" },
  { label: "Reports", href: "/contact", cta: "Request a report" },
  { label: "Webinars", href: "/contact", cta: "Join upcoming webinars" },
  { label: "Events", href: "/contact", cta: "See upcoming events" },
]

const featured = [
  {
    title: "Why Utah Is the Best Real Estate Investment Market",
    excerpt: "Utah's growing population and job market make it one of the top states for real estate investors.",
    href: "/blog/why-utah-best-real-estate-investment",
  },
  {
    title: "New Landlord Mistakes and the Systems That Fix Them",
    excerpt: "Common pitfalls new landlords face and how automated systems eliminate them.",
    href: "/blog/new-landlord-mistakes-systems",
  },
  {
    title: "Vacancy Risk Playbook",
    excerpt: "How to reduce vacancy risk and keep your rentals consistently occupied.",
    href: "/blog/vacancy-risk-playbook",
  },
]

export default function InsightsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Research & Insights | Ondo Real Estate"
        description="Market analysis, guides, and thought leadership from the Ondo team."
        pathname="/insights"
      />
      <PageBanner
        title="Research & Insights"
        subtitle="Market analysis, guides, and thought leadership from the Ondo team."
      />

      {/* Content type cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {contentTypes.map(({ label, href, cta }) => (
              <Card key={label} className="border border-border w-full sm:w-auto sm:flex-1 min-w-[140px]">
                <CardContent className="p-5 flex flex-col gap-3 items-center text-center">
                  <h2 className="text-lg font-semibold text-foreground">{label}</h2>
                  <Button asChild variant="outline" size="sm">
                    <Link href={href}>{cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured posts */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {featured.map(({ title, excerpt, href }) => (
              <Card key={href} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-3">
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-foreground/70">{excerpt}</p>
                  <Link href={href} className="text-sm text-primary underline-offset-2 hover:underline">Read more</Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/subscribe">Subscribe for updates</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
