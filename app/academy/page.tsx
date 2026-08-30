import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Calculator, CalendarDays, FileText, Home, Landmark, PlayCircle, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { CalendlyBookSection } from "@/components/contact/calendly-inline-embed"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/academy", {
  title: "Ondo Academy | Free Utah Real Estate Training",
  description:
    "Free training for Utah owners, investors, buyers, and tenants: templates, calculators, videos, events, and a call with our team.",
})

const startHerePaths = [
  {
    icon: Home,
    title: "Owners",
    description: "Property management, pricing, and a free rental analysis for Utah landlords.",
    href: "/property-management",
    label: "Owner start here",
  },
  {
    icon: Landmark,
    title: "Investors",
    description: "Portfolio strategy, opportunities, and the numbers that actually matter.",
    href: "/solutions/investors",
    label: "Investor start here",
  },
  {
    icon: Users,
    title: "Buyers",
    description: "Utah buying paths, loan education, and calculators — estimates, not promises.",
    href: "/buy",
    label: "Buyer start here",
  },
  {
    icon: BookOpen,
    title: "Tenants",
    description: "How renting with Ondo works: applications, payments, and maintenance.",
    href: "/solutions/tenants",
    label: "Tenant start here",
  },
]

const libraryLinks = [
  {
    icon: FileText,
    title: "Templates",
    description: "Utah-oriented lease, checklist, maintenance, and onboarding forms.",
    href: "/resources/templates",
    label: "Browse templates",
  },
  {
    icon: Calculator,
    title: "Calculators",
    description: "Mortgage, affordability, and owner tools. Results are informational.",
    href: "/calculators",
    label: "Open calculators",
  },
  {
    icon: BookOpen,
    title: "Mortgage learning hub",
    description: "Variable income, loan programs, first-time buyers, and FAQs. Education, not a quote.",
    href: "/learn",
    label: "Open learning hub",
  },
  {
    icon: PlayCircle,
    title: "Guides and academy",
    description: "Written training, calculators, and a live walkthrough. Not a placeholder video wall.",
    href: "/video-library",
    label: "Watch videos",
  },
  {
    icon: CalendarDays,
    title: "Events",
    description: "Upcoming sessions and community events across Utah.",
    href: "/events",
    label: "See events",
  },
]

export default function AcademyPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Ondo Academy | Free Utah Real Estate Training"
        description="Free training for Utah owners, investors, buyers, and tenants: templates, calculators, videos, events, and a call with our team."
        pathname="/academy"
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Academy", url: `${SITE_URL}/academy` },
        ])}
      />
      <PageBanner
        title="Ondo Academy"
        subtitle="Free training for owners, investors, buyers, and tenants. Start with a path, then use the templates, calculators, videos, and events already on this site."
      />

      <section className="bg-background py-16" aria-labelledby="academy-start-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 id="academy-start-heading" className="mb-3 text-3xl font-bold">
              Start here
            </h2>
            <p className="text-foreground/70">
              Pick the role that matches you. Each path goes to a live page — not a course upsell.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {startHerePaths.map(({ icon: Icon, title, description, href, label }) => (
              <Card key={title} className="border border-border">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <CardTitle>{title}</CardTitle>
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href={href}>{label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16" aria-labelledby="academy-library-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 id="academy-library-heading" className="mb-3 text-3xl font-bold">
              Free training library
            </h2>
            <p className="text-foreground/70">
              Practical tools we already publish. Use them on your own, or bring questions to a call.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {libraryLinks.map(({ icon: Icon, title, description, href, label }) => (
              <Card key={title} className="border border-border bg-card">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <CardTitle>{title}</CardTitle>
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline">
                    <Link href={href}>{label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CalendlyBookSection />
    </main>
  )
}
