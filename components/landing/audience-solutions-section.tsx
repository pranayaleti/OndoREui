import Link from "next/link"
import { Building2, Home, LineChart } from "lucide-react"
import { SITE_BRAND_SHORT } from "@/lib/site"

/**
 * Persona-focused services (tenants, investors, lending) with semantic H2/H3 for homepage SEO.
 */
export function AudienceSolutionsSection() {
  return (
    <section
      className="border-y border-border bg-card/30 py-16 dark:bg-[var(--gradient-overlay)]"
      aria-labelledby="audience-solutions-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="audience-solutions-heading"
          className="mb-4 text-center text-3xl font-bold tracking-tight dark:text-foreground"
        >
          {SITE_BRAND_SHORT} solutions for tenants, investors &amp; home buyers
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-foreground/70">
          One tech-forward real estate platform—rooted in Utah, built to scale with you across markets.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-background p-6 dark:bg-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Home className="h-6 w-6" aria-hidden />
              <h3 className="text-xl font-semibold dark:text-foreground">Tenants</h3>
            </div>
            <p className="text-foreground/70">
              Pay rent, request maintenance, and stay organized in one place—backed by responsive property management.
            </p>
            <p className="mt-4">
              <Link href="/solutions/tenants" className="font-medium text-primary underline-offset-4 hover:underline">
                Tenant solutions
              </Link>
            </p>
          </article>
          <article className="rounded-xl border border-border bg-background p-6 dark:bg-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <LineChart className="h-6 w-6" aria-hidden />
              <h3 className="text-xl font-semibold dark:text-foreground">Investors</h3>
            </div>
            <p className="text-foreground/70">
              Evaluate opportunities with clearer operations: reporting, coordination, and tools designed for portfolio
              visibility.
            </p>
            <p className="mt-4">
              <Link
                href="/solutions/investors"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Investor solutions
              </Link>
            </p>
          </article>
          <article className="rounded-xl border border-border bg-background p-6 dark:bg-card">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Building2 className="h-6 w-6" aria-hidden />
              <h3 className="text-xl font-semibold dark:text-foreground">Buying &amp; loans</h3>
            </div>
            <p className="text-foreground/70">
              Education-first guidance for purchases and refinances—loan programs and calculators to match your goals.
            </p>
            <p className="mt-4">
              <Link href="/loans" className="mr-4 font-medium text-primary underline-offset-4 hover:underline">
                Mortgages
              </Link>
              <Link href="/buy" className="font-medium text-primary underline-offset-4 hover:underline">
                Buy a home
              </Link>
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
