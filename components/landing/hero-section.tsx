"use client"

import { SearchForm } from "@/components/search-form"
import { LazyImage } from "@/components/lazy-image"

export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-background to-card dark:bg-gradient-to-b dark:from-black dark:to-gray-900 py-20 md:py-32 overflow-hidden" role="banner" aria-label="Hero section">
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <LazyImage
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
            Ondo RE — Utah property management, loans &amp; real estate
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">
            Ondo Real Estate is a full-service property management, mortgage, and brokerage team serving the Wasatch
            Front. Owners get real-time visibility, tenants get responsive support, and investors see exactly how assets
            perform.
          </p>
        </header>
        <section aria-label="Property search" className="flex justify-center">
          <SearchForm />
        </section>
      </div>
    </section>
  )
}