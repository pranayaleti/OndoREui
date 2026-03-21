import type { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, Wrench, DollarSign, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { SITE_CLAUDE_ASK_ONDO_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Ondo Academy | Real Estate Education",
  description: "Free guides, tools, and resources to help you make smarter real estate decisions in Utah.",
}

const topics = [
  {
    icon: TrendingUp,
    title: "Investing",
    links: [
      { label: "Why Utah Is the Best Real Estate Investment Market", href: "/blog/why-utah-best-real-estate-investment" },
      { label: "Renting vs Owning: The Hidden Math", href: "/blog/renting-vs-owning-hidden-math" },
      { label: "Investment Opportunities", href: "/investments" },
    ],
  },
  {
    icon: Wrench,
    title: "Property Management",
    links: [
      { label: "New Landlord Mistakes and the Systems That Fix Them", href: "/blog/new-landlord-mistakes-systems" },
      { label: "Property Management Automation Checklist", href: "/blog/property-management-automation-checklist" },
      { label: "Maintenance & CapEx Strategy", href: "/blog/maintenance-capex-strategy" },
    ],
  },
  {
    icon: DollarSign,
    title: "Loans & Financing",
    links: [
      { label: "Mortgage Rate Trends 2025", href: "/blog/mortgage-rate-trends-2025" },
      { label: "Mortgage Calculators", href: "/calculators" },
      { label: "Loan Types Explained", href: "/loans" },
    ],
  },
  {
    icon: MapPin,
    title: "Utah Market",
    links: [
      { label: "Utah Rent vs Buy: Wasatch Front", href: "/blog/utah-rent-vs-buy-wasatch-front" },
      { label: "Why Utah: Market Overview", href: "/why-utah" },
      { label: "Utah Real Estate Market Data", href: "/data" },
    ],
  },
]

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Ondo Academy | Real Estate Education"
        description="Free guides, tools, and resources to help you make smarter real estate decisions in Utah."
        pathname="/academy"
      />
      <PageBanner
        title="Ondo Academy"
        subtitle="Free guides, tools, and resources to help you make smarter real estate decisions."
      />

      {/* Topic cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {topics.map(({ icon: Icon, title, links }) => (
              <Card key={title} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {links.map(({ label, href }) => (
                      <li key={href}>
                        <Link href={href} className="text-sm text-primary underline-offset-2 hover:underline">
                          {label}
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

      {/* Ask AI callout */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-background border border-border rounded-lg p-8">
            <h2 className="text-xl font-bold text-foreground mb-3">Have a specific question?</h2>
            <p className="text-foreground/70 mb-6">Ask the Ondo AI assistant — it knows Utah real estate inside out.</p>
            <Button asChild>
              <a href={SITE_CLAUDE_ASK_ONDO_URL} target="_blank" rel="noopener noreferrer">Ask AI</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">Read the blog</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
