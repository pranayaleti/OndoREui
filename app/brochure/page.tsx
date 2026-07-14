import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { FileText, Shield, TrendingUp, Building2, Mail, Phone } from "lucide-react"
import { BrochureRequestForm } from "@/components/leads/brochure-request-form"

export const metadata: Metadata = {
  title: "Investor Brochure | Ondo Real Estate",
  description:
    "Request the Ondo Real Estate investor overview to learn about our strategy, track record, team, and investment approach in Utah.",
  alternates: { canonical: `${SITE_URL}/brochure/` },
  openGraph: {
    title: "Investor Brochure | Ondo Real Estate",
    description:
      "Request our investor overview — strategy overview, portfolio highlights, and how to get started with Ondo Real Estate.",
    url: `${SITE_URL}/brochure`,
  },
}

const highlights = [
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Investment strategy",
    description: "Our value-add playbook and target returns",
  },
  {
    icon: <Building2 className="h-6 w-6" />,
    title: "Portfolio overview",
    description: "Current properties and performance data",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Risk management",
    description: "How we protect investor capital at every stage",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Getting started guide",
    description: "Step-by-step process for new investors",
  },
]

export default function BrochurePage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Investor Brochure | Ondo Real Estate"
        description="Request the Ondo Real Estate investor overview — strategy, portfolio, and how to start earning passive income."
        pathname="/brochure"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Brochure", url: `${SITE_URL}/brochure` },
        ])}
      />

      <PageBanner
        title="Investor Overview"
        subtitle="Tell us where to reach you — our team will send the investor overview and follow up."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-6">What&apos;s covered</h2>
              <div className="space-y-4 mb-8">
                {highlights.map((h) => (
                  <div key={h.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {h.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{h.title}</p>
                      <p className="text-sm text-foreground/60">{h.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg border bg-muted/40">
                <p className="text-sm text-foreground/70">
                  Prefer to talk first? Our investor relations team is happy to walk you through
                  anything before you request materials.
                </p>
                <div className="mt-3 space-y-2">
                  <a href={`tel:${SITE_PHONE.replace(/\D/g, "")}`} className="flex items-center gap-2 text-sm hover:underline text-foreground/80">
                    <Phone className="h-4 w-4" /> {SITE_PHONE}
                  </a>
                  <a href={`mailto:${SITE_EMAILS.primary}`} className="flex items-center gap-2 text-sm hover:underline text-foreground/80">
                    <Mail className="h-4 w-4" /> {SITE_EMAILS.primary}
                  </a>
                </div>
              </div>
            </div>

            <BrochureRequestForm />
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-foreground/60 mb-4">Want to dig deeper before requesting?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/strategy">Read our strategy</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/new-investors">New investor guide</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/investments">Browse investments</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
