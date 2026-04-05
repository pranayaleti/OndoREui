import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench, Bell, ClipboardList, Users } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import { CityLinksGrid } from "@/components/city-links-grid"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maintenance Coordination | Property Management Utah | Ondo",
  description: "Ondo handles tenant maintenance requests end-to-end: intake, vendor dispatch, owner approval, and completion tracking. Keep your Utah rental in top condition.",
  alternates: { canonical: `${SITE_URL}/property-management/maintenance-coordination/` },
  openGraph: { title: "Maintenance Coordination | Ondo Real Estate", description: "End-to-end maintenance coordination for Utah rental properties." },
  twitter: { card: "summary_large_image", title: "Maintenance Coordination | Ondo", description: "We handle tenant maintenance requests from intake to completion." },
}

const features = [
  { title: "24/7 Request Intake", description: "Tenants submit requests via the portal any time — categorised by urgency, with photo attachments", icon: <Bell className="h-6 w-6" /> },
  { title: "Vetted Vendor Network", description: "We dispatch from our pre-screened Utah vendor network — licensed, insured, and rated by past performance", icon: <Users className="h-6 w-6" /> },
  { title: "Owner Approval Thresholds", description: "You set a dollar threshold. Work under it proceeds automatically; above it requires your sign-off", icon: <ClipboardList className="h-6 w-6" /> },
  { title: "Completion Tracking", description: "Every request logged from open to close with photos, invoices, and tenant sign-off in your dashboard", icon: <Wrench className="h-6 w-6" /> },
]

export default function MaintenanceCoordinationPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Maintenance Coordination | Property Management Utah"
        description="End-to-end maintenance coordination for Utah rental properties."
        pathname="/property-management/maintenance-coordination"
        image={`${SITE_URL}/property-manager-meeting.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management` },
          { name: "Maintenance Coordination", url: `${SITE_URL}/property-management/maintenance-coordination` },
        ])}
      />
      <PageBanner title="Maintenance Coordination" subtitle="Fast, transparent maintenance handling — tenants stay happy, your asset stays protected" backgroundImage="/property-manager-meeting.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Maintenance Done Right</h2>
              <p className="text-lg text-foreground/70">
                Slow maintenance response is the top reason Utah tenants don't renew. Our coordination system ensures every request is acknowledged, triaged, and resolved quickly — with full visibility for owners and tenants throughout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((f, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{f.icon}</div>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">The Workflow</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Tenant Submits Request", desc: "Via the tenant portal: description, urgency level (routine / urgent / emergency), and photos. Emergency requests trigger an immediate on-call response." },
                  { step: "2", title: "Triage and Vendor Dispatch", desc: "Our team reviews, categorises, and dispatches the appropriate vendor from our network. For work above your approval threshold, we contact you with vendor quote before proceeding." },
                  { step: "3", title: "Work Completed and Documented", desc: "Vendor completes the work and submits completion photos and invoice. Tenant confirms resolution. Invoice is attached to the property ledger and visible in your monthly statement." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <h4 className="font-semibold mb-1">{s.title}</h4>
                      <p className="text-foreground/70">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/property-management">Full PM Services</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href={APP_PORTAL_URL}>Owner Portal</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CityLinksGrid title="Maintenance Coordination by City" servicePrefix="property-management" subServiceSlug="maintenance-coordination" />
    </main>
  )
}
