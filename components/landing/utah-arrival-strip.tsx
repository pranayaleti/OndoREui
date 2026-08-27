import Link from "next/link"

export function UtahArrivalStrip() {
  return (
    <section
      className="border-b border-border/40 bg-muted/30 py-8 md:py-10"
      aria-labelledby="utah-arrival-strip-heading"
    >
      <div className="container mx-auto flex flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Wasatch Front start dates</p>
          <h2 id="utah-arrival-strip-heading" className="mt-1 text-xl font-semibold text-foreground md:text-2xl">
            Starting a job in Utah?
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            Pick the city you&apos;ll commute to. See typical rents nearby, then rent, buy, or leave a home on the books — invite-only apply after a showing.
          </p>
        </div>
        <Link
          href="/moving-to-utah/"
          className="inline-flex min-h-11 items-center rounded-md bg-gradient-to-r from-orange-500 to-red-800 px-4 text-base font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open the arrival desk
        </Link>
      </div>
    </section>
  )
}
