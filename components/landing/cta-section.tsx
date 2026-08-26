import Link from "next/link"
import { Calculator, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Bottom-of-homepage conversion block.
 *
 * Landlords need a number before they'll book a call; renters just want the
 * listing search. Both paths are one click from here. The prior ZIP form
 * had no submit handler; we route ZIP intent to /search where the search
 * page owns the interaction.
 */
export function CTASection() {
  return (
    <section
      className="py-16 bg-muted dark:bg-[var(--gradient-overlay)] text-foreground"
      aria-labelledby="home-cta-heading"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 id="home-cta-heading" className="text-3xl font-bold mb-4">
          What could your Utah rental earn?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/80">
          See a free rent and sale estimate for your property, or book a 30-minute call to
          talk through management, buying, or loans with the Ondo team.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/whats-my-home-worth" className="inline-flex items-center gap-2">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Free rental analysis
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact#book-a-call" className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Book a call
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/search" className="inline-flex items-center gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              Search rentals by ZIP
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-foreground/50">
          Estimates are informational only and are not an appraisal, BPO, or CMA.
        </p>
      </div>
    </section>
  )
}
