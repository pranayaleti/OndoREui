import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"

export function PropertyOwnerSection() {
  return (
    <section className="py-16 bg-background dark:bg-[var(--gradient-overlay)]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-foreground">Property owners &amp; landlords</h2>
            <p className="text-lg mb-6 dark:text-foreground/70">
              Let Ondo RE handle day-to-day management with owner-grade reporting—leasing, maintenance, and financials in
              one place across the Wasatch Front and expanding markets.
            </p>
            <h3 className="sr-only">Property management services</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-foreground dark:text-foreground/70 mr-2 flex-shrink-0" />
                <span className="dark:text-foreground/70">Professional tenant screening and placement</span>
              </li>
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-foreground dark:text-foreground/70 mr-2 flex-shrink-0" />
                <span className="dark:text-foreground/70">Rent collection and transparent financial reporting</span>
              </li>
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-foreground dark:text-foreground/70 mr-2 flex-shrink-0" />
                <span className="dark:text-foreground/70">Maintenance coordination and 24/7 emergency response</span>
              </li>
              <li className="flex items-start">
                <Shield className="h-6 w-6 text-foreground dark:text-foreground/70 mr-2 flex-shrink-0" />
                <span className="dark:text-foreground/70">Regular property inspections and detailed owner reports</span>
              </li>
            </ul>
            <Button asChild className="bg-background hover:bg-muted dark:hover:bg-muted text-foreground">
              <Link href="/contact">Learn More</Link>
            </Button>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <LazyImage
              src="/city-map-with-pin.webp"
              alt="Utah property management service areas map showing Salt Lake City, Holladay, Midvale and surrounding communities served by Ondo Real Estate"
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