import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { toCanonicalPageUrl } from "@/lib/page-canonical"
import {
  TourProductScreen,
  TOUR_SAMPLE_DISCLAIMER,
  TOUR_ASSISTANT_DISCLAIMER,
  type TourScreenId,
} from "@/components/tour/tour-product-screen"

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/tour") },
  title: "Platform Tour | Ondo Real Estate",
  description: "Take a guided tour of the Ondo platform, owner dashboard, tenant portal, AI assistant, and vendor tools.",
}

const tourSteps: {
  id: TourScreenId
  title: string
  description: string
}[] = [
  { id: "owner", title: "Owner Dashboard", description: "See every property, tenant, and payment at a glance." },
  { id: "tenant", title: "Tenant Portal", description: "Tenants pay rent, submit requests, and message you in one place." },
  { id: "assistant", title: "AI Assistant", description: "Ask questions, get insights, and take action: all in natural language." },
  { id: "vendor", title: "Vendor Tools", description: "Coordinate maintenance and manage your vendor network." },
]

export default function TourPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Platform Tour | Ondo Real Estate"
        description="Take a guided tour of the Ondo platform, owner dashboard, tenant portal, AI assistant, and vendor tools."
        pathname="/tour"
      />
      <PageBanner
        title="Take a guided tour of the Ondo platform"
        subtitle="Explore every feature: owner dashboard, tenant portal, AI assistant, and more."
      />

      <section className="bg-background py-16" aria-labelledby="tour-steps-heading">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 id="tour-steps-heading" className="sr-only">
            Platform tour steps
          </h2>
          <div className="flex flex-col gap-14">
            {tourSteps.map(({ id, title, description }, i) => (
              <article key={id} id={id} className="flex flex-col gap-4 scroll-mt-24">
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                </div>
                <p className="pl-14 text-base text-foreground/70">{description}</p>
                <div className="pl-0 sm:pl-14">
                  <TourProductScreen id={id} />
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-xs text-foreground/50">
            {TOUR_SAMPLE_DISCLAIMER} {TOUR_ASSISTANT_DISCLAIMER} Owner, tenant, and vendor
            portals are invitation-only.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/demo">Try it yourself</Link>
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
