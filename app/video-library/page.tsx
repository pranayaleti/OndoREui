import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Calculator, FileText, Landmark, PlayCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { toCanonicalPageUrl } from "@/lib/page-canonical"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/video-library") },
  title: "Learn Ondo | Guides, Academy & Calculators",
  description:
    "Learning paths for owners, tenants, buyers, and investors: academy, written guides, calculators, and a live walkthrough. We do not host a placeholder video grid.",
}

const paths = [
  {
    icon: Users,
    title: "Academy",
    description: "Role-based starting points for owners, investors, buyers, and tenants.",
    href: "/academy/",
    label: "Open academy",
  },
  {
    icon: BookOpen,
    title: "Blog and guides",
    description: "Utah property management, mortgages, buying, selling, and notary articles.",
    href: "/blog/",
    label: "Read the blog",
  },
  {
    icon: Landmark,
    title: "Mortgage learning hub",
    description: "Topic clusters for variable income, first-time buyers, and loan programs. Education, not a quote.",
    href: "/learn/",
    label: "Open learning hub",
  },
  {
    icon: Calculator,
    title: "Calculators",
    description: "Mortgage, affordability, refinance, and owner tools. Results are estimates.",
    href: "/calculators/",
    label: "Open calculators",
  },
  {
    icon: FileText,
    title: "Templates",
    description: "Utah-oriented lease, checklist, and maintenance forms.",
    href: "/resources/templates/",
    label: "Browse templates",
  },
  {
    icon: PlayCircle,
    title: "Platform demo",
    description: "Self-serve demo and how to book a live walkthrough with the team.",
    href: "/demo/",
    label: "Open demo",
  },
]

export default function VideoLibraryPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Learn Ondo | Guides, Academy & Calculators"
        description="Learning paths for owners, tenants, buyers, and investors. Written guides and a live walkthrough — not a coming-soon video wall."
        pathname="/video-library"
        image={`${SITE_URL}/modern-office-building.webp`}
      />
      <PageBanner
        title="Learn how Ondo works"
        subtitle="Start with academy, guides, and calculators. Book a walkthrough when you want a live demo."
        backgroundImage="/modern-office-building.webp"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="mx-auto mb-10 max-w-2xl text-center text-foreground/70">
            We are not posting untitled “coming soon” clips with invented runtimes. These links go to pages that
            already ship: training, articles, math tools, and a demo you can actually open.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map(({ icon: Icon, title, description, href, label }) => (
              <Card key={href} className="border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground/70">{description}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={href}>{label}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-12 text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/demo">Book a live walkthrough</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
