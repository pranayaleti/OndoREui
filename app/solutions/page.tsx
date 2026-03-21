import type { Metadata } from "next"
import Link from "next/link"
import { TrendingUp, Home, Building2, Key, Bot, LayoutGrid, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "Solutions | Ondo Real Estate",
  description: "One platform built for investors, landlords, property managers, and tenants across Utah.",
}

const audiences = [
  {
    icon: TrendingUp,
    title: "Investors",
    description: "Grow your portfolio with AI-powered analytics",
    href: "/solutions/investors",
  },
  {
    icon: Home,
    title: "Landlords",
    description: "Full-service management without the headaches",
    href: "/solutions/landlords",
  },
  {
    icon: Building2,
    title: "Property Managers",
    description: "Scale your operation with automation",
    href: "/solutions/property-managers",
  },
  {
    icon: Key,
    title: "Tenants",
    description: "Your home. Your portal. Zero friction.",
    href: "/solutions/tenants",
  },
]

const differentiators = [
  { icon: Bot, heading: "AI assistant", body: "Ask questions, get portfolio insights, and take action — all in plain English." },
  { icon: LayoutGrid, heading: "One unified platform", body: "Owners, tenants, investors, and managers — one login, one source of truth." },
  { icon: MapPin, heading: "Utah expertise", body: "Deep local knowledge of Utah's fastest-growing real estate markets." },
]

export default function SolutionsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Solutions | Ondo Real Estate"
        description="One platform built for investors, landlords, property managers, and tenants across Utah."
        pathname="/solutions"
      />
      <PageBanner
        title="The platform built for every role in real estate"
        subtitle="One platform. Every stakeholder. Zero fragmentation."
      />

      {/* Audience grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {audiences.map(({ icon: Icon, title, description, href }) => (
              <Card key={href} className="border border-border">
                <CardContent className="p-6 flex flex-col gap-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">{title}</h2>
                    <p className="text-foreground/70 text-sm">{description}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-fit">
                    <Link href={href}>Learn more</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ondo */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Why Ondo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {differentiators.map(({ icon: Icon, heading, body }) => (
              <div key={heading} className="flex flex-col items-center text-center gap-3">
                <Icon className="h-10 w-10 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
                <p className="text-foreground/70 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to get started?</h2>
          <Button asChild size="lg">
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
