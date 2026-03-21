import type { Metadata } from "next"
import Link from "next/link"
import { LayoutDashboard, Zap, ShieldCheck, FileBarChart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "For Property Managers | Ondo Real Estate",
  description: "Scale your property management operation with automated maintenance routing, vendor management, and owner reporting.",
}

const features = [
  { icon: LayoutDashboard, title: "Multi-property dashboard", body: "Manage every unit, tenant, and vendor from a single view." },
  { icon: Zap, title: "Automated maintenance routing", body: "Requests auto-assign to the right vendor, every time." },
  { icon: ShieldCheck, title: "Vendor & compliance management", body: "Track certifications, insurance, and work orders." },
  { icon: FileBarChart, title: "Owner reporting automation", body: "Generate and send owner reports without manual work." },
]

export default function PropertyManagersPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="For Property Managers | Ondo Real Estate"
        description="Scale your property management operation with automated maintenance routing, vendor management, and owner reporting."
        pathname="/solutions/property-managers"
      />
      <PageBanner
        title="Operate at scale. Deliver results."
        subtitle="Built for property management companies that need automation, not more spreadsheets."
      />

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-3">
                  <Icon className="h-7 w-7 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  <p className="text-foreground/70 text-sm">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scale callout */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-xl text-foreground font-medium">Built for portfolios of any size — from 20 units to 500+.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/demo">Schedule a Demo</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
