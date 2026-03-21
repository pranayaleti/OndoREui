import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { SITE_EMAILS } from "@/lib/site"

export const metadata: Metadata = {
  title: "Partners | Ondo Real Estate",
  description: "Ondo integrates with Stripe, Supabase, HubSpot, Resend, Anthropic Claude, and Leaflet Maps.",
}

const partners = [
  { name: "Stripe", description: "Secure rent payments and billing" },
  { name: "Supabase", description: "Real-time database and file storage" },
  { name: "HubSpot", description: "CRM and lead pipeline management" },
  { name: "Resend", description: "Transactional email delivery" },
  { name: "Claude AI", description: "AI assistant powering portfolio insights" },
  { name: "Leaflet", description: "Interactive property maps" },
]

export default function PartnersPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Partners | Ondo Real Estate"
        description="Ondo integrates with Stripe, Supabase, HubSpot, Resend, Anthropic Claude, and Leaflet Maps."
        pathname="/partners"
      />
      <PageBanner
        title="Built to integrate with the tools you already use"
        subtitle="Ondo connects to the platforms your business already runs on."
      />

      {/* Partner grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {partners.map(({ name, description }) => (
              <Card key={name} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-2">
                  <p className="text-2xl font-bold text-primary">{name}</p>
                  <p className="text-foreground/70 text-sm">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Become a partner */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="bg-background border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">Partner with Ondo</h2>
            <p className="text-foreground/70 mb-6">Reach Utah real estate professionals by integrating with the Ondo platform.</p>
            <Button asChild>
              <a href={`mailto:${SITE_EMAILS.primary}`}>Contact us</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Learn more about Ondo</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
