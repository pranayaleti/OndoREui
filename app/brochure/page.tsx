import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE } from "@/lib/site"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, FileText, Shield, TrendingUp, Building2, Mail, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Investor Brochure | Ondo Real Estate",
  description:
    "Download the Ondo Real Estate investor brochure to learn about our strategy, track record, team, and current investment opportunities in Utah.",
  alternates: { canonical: `${SITE_URL}/brochure/` },
  openGraph: {
    title: "Investor Brochure | Ondo Real Estate",
    description:
      "Get our free investor brochure — strategy overview, portfolio highlights, and how to get started with Ondo Real Estate.",
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
        description="Download the free Ondo Real Estate investor brochure — strategy, portfolio, and how to start earning passive income."
        pathname="/brochure"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Brochure", url: `${SITE_URL}/brochure` },
        ])}
      />

      <PageBanner
        title="Free Investor Brochure"
        subtitle="Everything you need to know about investing with Ondo Real Estate — in one concise guide"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">

            {/* What's inside */}
            <div>
              <h2 className="text-2xl font-bold mb-6">What&apos;s inside</h2>
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
                  anything before you download.
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

            {/* Download form */}
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="flex justify-center mb-4">
                  <Download className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Get your free copy</h3>
                <p className="text-center text-sm text-foreground/60 mb-6">
                  Enter your details and we&apos;ll email you the brochure instantly.
                </p>
                {/* This form submits to your preferred lead-capture / email provider.
                    Wire the action/onSubmit to your backend or a form service like Resend. */}
                <form className="space-y-4" action="/api/brochure-request" method="POST">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="first">First name</Label>
                      <Input id="first" name="first_name" required placeholder="Jane" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last">Last name</Label>
                      <Input id="last" name="last_name" required placeholder="Smith" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Send me the brochure
                  </Button>
                  <p className="text-center text-xs text-foreground/50">
                    By submitting you agree to our{" "}
                    <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>.
                    No spam.{" "}
                    <Link href="/unsubscribe" className="hover:underline">Unsubscribe</Link> anytime.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Explore more */}
      <section className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <p className="text-foreground/60 mb-4">Want to dig deeper before downloading?</p>
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
