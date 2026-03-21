import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"

export const metadata: Metadata = {
  title: "Platform Tour | Ondo Real Estate",
  description: "Take a guided tour of the Ondo platform — owner dashboard, tenant portal, AI assistant, and vendor tools.",
}

const tourSteps = [
  { title: "Owner Dashboard", description: "See every property, tenant, and payment at a glance." },
  { title: "Tenant Portal", description: "Tenants pay rent, submit requests, and message you in one place." },
  { title: "AI Assistant", description: "Ask questions, get insights, and take action — all in natural language." },
  { title: "Vendor Tools", description: "Coordinate maintenance and manage your vendor network." },
]

export default function TourPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Platform Tour | Ondo Real Estate"
        description="Take a guided tour of the Ondo platform — owner dashboard, tenant portal, AI assistant, and vendor tools."
        pathname="/tour"
      />
      <PageBanner
        title="Take a guided tour of the Ondo platform"
        subtitle="Explore every feature — owner dashboard, tenant portal, AI assistant, and more."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex flex-col gap-14">
            {tourSteps.map(({ title, description }, i) => (
              <div key={title} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">{i + 1}</span>
                  <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                </div>
                <p className="text-foreground/70 text-base pl-14">{description}</p>
                {/* Screenshot placeholder */}
                <div className="w-full aspect-video bg-muted rounded-lg border border-border flex items-center justify-center text-foreground/40 text-sm">
                  Screenshot coming soon
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth">Try it yourself</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/demo">Book a demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
