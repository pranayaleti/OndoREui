import Image from "next/image"
import Link from "next/link"
import { Building, Calculator, Calendar } from "lucide-react"
import { HeroZipServiceSelectorLazy } from "@/components/landing/hero-zip-service-selector-lazy"

export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-background to-card dark:bg-gradient-to-b dark:from-background dark:to-card py-20 md:py-32 overflow-hidden" role="banner" aria-label="Hero section">
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <Image
          src="/modern-office-building.webp"
          alt="Ondo RE headquarters in Lehi, Utah: property management, mortgage, and real estate services along the Wasatch Front"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <header>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Utah&apos;s Full-Service Real Estate Partner
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">
            Property management, home loans, and brokerage across 55+ Wasatch Front cities.
            Owners get real-time visibility. Tenants get responsive support. Investors see exactly how assets perform.
          </p>
        </header>
        <section aria-label="Property search" className="relative flex justify-center">
          <HeroZipServiceSelectorLazy />
        </section>
        {/*
          Trio of equal-weight CTAs mirroring what high-converting local PM
          sites use above the fold: browse rentals (renter intent), book a
          call (owner intent), free rental report (owner + investor intent).
          Sits directly under the ZIP widget so PM shoppers who aren't ready
          to type a ZIP still have three obvious next steps.
        */}
        <nav
          aria-label="Primary calls to action"
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link
            href="/properties"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-transparent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <Building className="h-4 w-4" aria-hidden="true" />
            Browse rentals
          </Link>
          <Link
            href="/contact#book-a-call"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Book a call
          </Link>
          <Link
            href="/whats-my-home-worth"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-transparent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Free rental report
          </Link>
        </nav>
        <p className="mt-6 text-sm text-foreground/50">
          Trusted by property owners from North Ogden to Nephi{" "}
          &bull;{" "}
          <Link
            href="/licensing"
            className="underline underline-offset-4 hover:text-foreground/80"
          >
            Licensed brokerage, property management, and NMLS
          </Link>
        </p>
        <p className="mt-2 text-xs text-foreground/50">
          Landlord shopping a manager?{" "}
          <Link
            href="/calculators/owner-vs-self"
            className="underline underline-offset-4 hover:text-foreground/80"
          >
            Run the numbers on self-manage vs Ondo
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
