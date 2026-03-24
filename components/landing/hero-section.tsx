"use client"

import { SearchForm } from "@/components/search-form"
import { LazyImage } from "@/components/lazy-image"

export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-background to-card dark:bg-gradient-to-b dark:from-black dark:to-gray-900 py-20 md:py-32 overflow-hidden" role="banner" aria-label="Hero section">
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <LazyImage
          src="/modern-office-building.webp"
          alt="Modern professional office building representing Ondo Real Estate's headquarters and property management services in Utah"
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
            Ondo RE — real estate, simplified for Utah and beyond
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">
            Ondo Real Estate unites property management, home loans, and investing in one modern platform—so owners keep
            clarity, tenants stay supported, and investors see how assets are run.
          </p>
        </header>
        <section aria-label="Property search" className="flex justify-center">
          <SearchForm />
        </section>
      </div>
    </section>
  )
}