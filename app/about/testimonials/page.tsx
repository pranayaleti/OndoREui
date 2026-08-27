import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { TestimonialsBrowser } from "@/components/about/testimonials-browser"
import { testimonials } from "@/lib/testimonials"

export const metadata: Metadata = pageCanonicalMetadata("/about/testimonials", {
  title: "Example Stories | Ondo Real Estate",
  description:
    "Example stories from property owners, tenants, investors, buyers, and sellers across Utah. These are composites, not Google reviews.",
})

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Example stories | Ondo Real Estate"
        description="Example stories from property owners, tenants, investors, buyers, and sellers across Utah. These are composites, not Google reviews."
        pathname="/about/testimonials"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Testimonials", url: `${SITE_URL}/about/testimonials` },
        ])}
      />
      <PageBanner
        title="Example stories"
        subtitle="Illustrative composites from how Ondo works across Utah — owners, tenants, investors, buyers, and sellers. Not Google reviews."
        backgroundImage="/modern-office-building.png"
      />

      <section className="bg-background py-16" aria-labelledby="client-reviews-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 id="client-reviews-heading" className="mb-4 text-3xl font-bold">
                Example stories
              </h2>
              <p className="text-xl text-foreground/70">
                {testimonials.length} example stories. Filter by role or service. These are
                composites (first name, no review date) — not imported Google or star-platform
                reviews.
              </p>
            </div>
            <TestimonialsBrowser />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16" aria-labelledby="reviews-cta-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="reviews-cta-heading" className="mb-4 text-3xl font-bold">
              Ready to talk through your property?
            </h2>
            <p className="mb-8 text-foreground/70">
              Book a call with the team, or start with a rental report so you can see how your
              numbers look before you commit.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact#book-a-call">Book a call</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/whats-my-home-worth">Get a rental report</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
