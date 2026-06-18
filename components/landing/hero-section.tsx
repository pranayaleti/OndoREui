import Image from "next/image"
import Link from "next/link"
import { Calculator } from "lucide-react"
import { HeroZipServiceSelectorLazy } from "@/components/landing/hero-zip-service-selector-lazy"

export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-background to-card dark:bg-gradient-to-b dark:from-background dark:to-card py-20 md:py-32 overflow-hidden" role="banner" aria-label="Hero section">
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <Image
          src="/modern-office-building.webp"
          alt="Ondo RE headquarters in Lehi, Utah — property management, mortgage, and real estate services along the Wasatch Front"
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
        <p className="mt-6 text-sm text-foreground/50">
          Trusted by property owners from North Ogden to Nephi &bull; 4.9★ average rating
        </p>
        {/*
          Secondary CTA: owners shopping a property manager need a number to
          chew on before they'll book a call. The ROI calculator is that
          number. Kept low-key so it doesn't compete with the primary ZIP search.
        */}
        <p className="mt-5 text-sm text-foreground/80">
          <Link
            href="/calculators/owner-vs-self"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Are you a Utah landlord? Run the numbers: self-manage vs Ondo
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </p>
      </div>
    </section>
  )
}
