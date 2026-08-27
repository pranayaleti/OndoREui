"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { TestimonialsCarousel } from "@/components/landing/testimonials-carousel"

export function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-muted py-16 dark:bg-[var(--gradient-overlay)]" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <h2
          id="testimonials-heading"
          className="mb-4 text-center text-3xl font-bold dark:text-foreground"
        >
          {t("testimonialUi.landingTitle")}
        </h2>
        <p className="mb-4 text-center text-foreground/70">{t("testimonialUi.landingSubtitle")}</p>
        <p className="mb-10 text-center text-sm text-foreground/60">{t("testimonialUi.compositeDisclaimer")}</p>
        <TestimonialsCarousel />
        <p className="mt-8 text-center">
          <Link
            href="/about/testimonials"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("testimonialUi.seeAll")}
          </Link>
        </p>
      </div>
    </section>
  )
}
