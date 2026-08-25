import Link from "next/link"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"
import { OwnerServicesTabs } from "@/components/landing/owner-services-tabs"

export function PropertyOwnerSection() {
  return (
    <section className="py-16 bg-background dark:bg-[var(--gradient-overlay)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-foreground">
              Property management for Utah owners &amp; landlords
            </h2>
            <p className="text-lg mb-6 dark:text-foreground/70">
              Ondo RE delivers full-service property management across the Wasatch Front &mdash;
              leasing, tenant screening, rent collection, maintenance, and real-time owner
              reporting. From Salt Lake City to Payson, we handle the operations so you focus on
              growing your portfolio.
            </p>
            <h3 className="sr-only">Property management services</h3>
            <OwnerServicesTabs />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/whats-my-home-worth">Free rental analysis</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/property-management">Property management services</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/contact">Talk to our team</Link>
              </Button>
            </div>
            <Link
              href="/calculators/owner-vs-self"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Run the numbers: self-manage vs Ondo
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                &rarr;
              </span>
            </Link>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <LazyImage
              src="/city-map-with-pin.webp"
              alt="Ondo RE property management service area: Salt Lake City, Provo, Draper, Sandy, and Wasatch Front communities in Utah"
              fill
              className="object-cover"
              quality={80}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
