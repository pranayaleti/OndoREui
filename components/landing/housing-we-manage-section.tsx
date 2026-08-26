import Link from "next/link"
import { OWNER_HOUSING_TYPES } from "@/lib/owner-housing-types"
import { UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"

export function HousingWeManageSection() {
  const [featured, ...rest] = OWNER_HOUSING_TYPES

  return (
    <section
      className="bg-background py-16 md:py-20"
      aria-labelledby="housing-we-manage-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            Wasatch housing we actually take on
          </p>
          <h2
            id="housing-we-manage-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Four stock types. Long-term residential only.
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Single-family, townhomes, condos with HOAs, and small multifamily
            across {UTAH_CITIES_SERVED}+ Utah cities. Each note below is pulled from housing we
            already document — not a generic &ldquo;we manage everything&rdquo; grid.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5 lg:gap-6">
          {featured && (
            <article className="flex flex-col border border-border bg-card p-6 lg:col-span-3 lg:p-8">
              <h3 className="text-2xl font-semibold text-foreground">
                {featured.title}
              </h3>
              <p className="mt-3 text-foreground/80">{featured.utahHook}</p>
              <p className="mt-3 text-sm text-foreground/70">{featured.opsNote}</p>
              <Link
                href={featured.href}
                className="mt-6 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {featured.linkLabel}
              </Link>
            </article>
          )}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {rest.map((type) => (
              <article
                key={type.id}
                className="flex flex-1 flex-col border-l-4 border-l-primary border-y border-r border-y-border border-r-border bg-card p-5"
              >
                <h3 className="text-lg font-semibold text-foreground">{type.title}</h3>
                <p className="mt-2 text-sm text-foreground/80">{type.utahHook}</p>
                <p className="mt-2 text-sm text-foreground/70">{type.opsNote}</p>
                <Link
                  href={type.href}
                  className="mt-3 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {type.linkLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
