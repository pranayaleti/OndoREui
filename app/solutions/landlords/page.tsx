import type { Metadata } from "next"
import Link from "next/link"
import { LayoutDashboard, UserCheck, Wrench, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "For Landlords | Ondo Real Estate",
  description: "Full-service property management for Utah landlords — tenant screening, rent tracking, maintenance, and more.",
}

const features = [
  { icon: LayoutDashboard, title: "Owner dashboard & rent tracking", body: "See every payment, lease, and maintenance request in one place." },
  { icon: UserCheck, title: "Tenant screening & lease management", body: "Background checks, credit reports, and digital leases." },
  { icon: Wrench, title: "Maintenance coordination", body: "Submit, track, and resolve requests with your vendor network." },
  { icon: FileText, title: "Document storage & reporting", body: "Store leases, inspections, and tax docs securely." },
]

export default function LandlordsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="For Landlords | Ondo Real Estate"
        description="Full-service property management for Utah landlords — tenant screening, rent tracking, maintenance, and more."
        pathname="/solutions/landlords"
      />
      <PageBanner
        title="Manage your properties. Stress-free."
        subtitle="From tenant screening to rent collection — Ondo runs your rentals so you don't have to."
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

      {/* Portal callout */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-background border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Your owner portal, ready now</h2>
            <p className="text-foreground/70 mb-6">Log in to see your properties, tenants, and financials in real time.</p>
            <Button asChild>
              <Link href="/owner">Go to Owner Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
