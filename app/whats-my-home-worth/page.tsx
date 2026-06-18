// NOTE(i18n): server component — English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { HomeValueEstimator } from "@/components/home-value-estimator"

const title = "What's My Utah Home Worth? — Free Rent + Sale Estimate | Ondo RE"
const description =
  "Free instant estimate of what your Utah home would rent for AND sell for. Covers 55+ Wasatch Front cities — from Salt Lake City to Provo, Lehi to Ogden. No signup to see your number."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/whats-my-home-worth` },
  openGraph: { title, description, url: `${SITE_URL}/whats-my-home-worth` },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
}

export default function WhatsMyHomeWorthPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background py-12 md:py-20">
      <SEO
        title={title}
        description={description}
        pathname="/whats-my-home-worth"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "What's My Home Worth?", url: `${SITE_URL}/whats-my-home-worth` },
          ]),
          generateServiceJsonLd({
            name: `${SITE_NAME} — Utah Home Value Estimator`,
            description:
              "Free instant estimate of what your Utah home would rent for and sell for, based on 55+ Wasatch Front city market data.",
            serviceType: "Property Valuation Tool",
            areaServed: "Utah",
          }),
        ]}
      />
      <div className="container mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            What&apos;s my Utah home worth?
          </h1>
          <p className="text-lg text-foreground/70">
            Free instant estimate — rent <em>and</em> sale price — for any of 55+ Wasatch Front cities.
            No signup to see your number.
          </p>
        </header>
        <HomeValueEstimator />

        <div className="mt-12 max-w-3xl mx-auto text-center">
          <p className="text-sm text-foreground/60 mb-3">
            Estimates use median market data for each Utah city plus standard adjustments for bedrooms and square feet.
            Real-world value depends on condition, finishes, and current market timing — we can do a walk-through valuation for free.
          </p>
        </div>
      </div>
    </main>
  )
}
