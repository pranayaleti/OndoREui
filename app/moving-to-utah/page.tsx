import type { Metadata } from "next"
import { UtahArrivalDesk } from "@/components/moving-to-utah/utah-arrival-desk"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ARRIVAL_FAIR_HOUSING, ARRIVAL_LENDING_DISCLOSURE, ARRIVAL_REAL_ESTATE_DISCLOSURE } from "@/lib/utah-arrival"

const title = "New to Utah: commute, rent, and buy"
const description =
  "Starting a Wasatch Front job? See commute minutes and typical rents across 55 Utah cities, then rent with invite-only apply, buy with help on the loan, or leave a home with Ondo management."

export const metadata: Metadata = pageCanonicalMetadata("/moving-to-utah", {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/moving-to-utah/`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}: New to Utah arrival desk`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/modern-office-building.webp`],
  },
})

export default function MovingToUtahPage() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        pathname="/moving-to-utah"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "New to Utah", url: `${SITE_URL}/moving-to-utah` },
          ]),
          generateServiceJsonLd({
            name: `${SITE_NAME}, Utah arrival desk`,
            description,
            serviceType: "Relocation housing guidance",
            areaServed: "Utah",
          }),
        ]}
      />
      <header className="border-b border-border bg-muted/20">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-800" aria-hidden="true" />
        <div className="container mx-auto px-4 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Wasatch Front start dates</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Where will you spend the workweek?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground/70">
            Ondo covers 55 cities with rentals, brokerage, home loans, remote notary and management.
            Pick the weekday workplace. We line up nearby housing cities with typical rents, then you rent, buy, or leave a home on the books.
          </p>
        </div>
      </header>
      <div className="container mx-auto px-4 py-10 md:py-14">
        <UtahArrivalDesk />
        <section className="mt-14 max-w-3xl" aria-labelledby="why-utah-heading">
          <h2 id="why-utah-heading" className="mb-3 text-2xl font-bold text-foreground">Why people move here</h2>
          <ul className="list-disc space-y-2 pl-5 text-foreground/70">
            <li>Jobs: the Wasatch Front keeps adding employers, from Silicon Slopes in Lehi to the Salt Lake core.</li>
            <li>Commute math: most of the 55 cities we cover sit within 45 minutes of a major job center.</li>
            <li>Housing mix: new-build townhomes in the south, older single-family stock near the city, and rentals in both.</li>
          </ul>
          <p className="mt-3 text-sm text-foreground/60">
            Prices and rents vary by city and move with the market. City figures are on the{" "}
            <Link href="/market-reports/" className="prose-link">market reports</Link>.
          </p>
        </section>
        <p className="mt-10 max-w-3xl text-sm text-foreground/70">
          Buying before the first Utah paycheck is a seasoning question:{" "}
          <Link href="/blog/relocating-to-utah-job-seasoning" className="prose-link">
            income when the job starts in 60 days
          </Link>
          . Utah purchase-contract clocks are separate from underwriting:{" "}
          <Link href="/blog/utah-repc-deadline-and-your-loan" className="prose-link">
            what a REPC deadline does to your loan
          </Link>
          . {ARRIVAL_LENDING_DISCLOSURE} {ARRIVAL_REAL_ESTATE_DISCLOSURE} {ARRIVAL_FAIR_HOUSING}
        </p>
      </div>
    </main>
  )
}
