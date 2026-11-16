import Image from "next/image"
import Link from "next/link"
import { Building2, FileSignature, Home, KeyRound, Landmark, Tag } from "lucide-react"
import { analyticsAttributes } from "@/lib/analytics"

/** The six things a visitor can do with Ondo, in the order the header lists them. */
export const SERVICE_TILES = [
  { href: "/properties", label: "Rent", line: "Homes for rent across the Wasatch Front.", icon: KeyRound, id: "rent" },
  { href: "/buy", label: "Buy", line: "An agent on your side, start to close.", icon: Home, id: "buy" },
  { href: "/sell", label: "Sell", line: "Price it right and get it sold.", icon: Tag, id: "sell" },
  { href: "/property-management", label: "Manage", line: "Hand off your rental, keep full visibility.", icon: Building2, id: "manage" },
  { href: "/loans", label: "Loans", line: "Talk through programs before you shop.", icon: Landmark, id: "loans" },
  { href: "/notary", label: "Notary", line: "Remote online notarization, same day when open.", icon: FileSignature, id: "notary" },
] as const

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background" aria-labelledby="hero-heading">
      {/* The brush ring from the logo, cropped by the section edge. The mask keeps the outer ring and drops
          the portrait, which turns into a smudge at this size. Decorative: it never carries meaning. */}
      <div
        className="pointer-events-none absolute -bottom-64 -left-56 z-0 hidden h-[50rem] w-[50rem] opacity-[0.1] [mask-image:radial-gradient(circle_closest-side,transparent_60%,black_62%)] lg:block"
        aria-hidden="true"
      >
        <Image src="/ondo-mark.webp" alt="" fill className="object-contain" sizes="800px" loading="lazy" />
      </div>
      <div className="container relative z-10 mx-auto grid gap-10 px-4 py-14 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-24">
        <div className="lg:col-span-5">
          <h1
            id="hero-heading"
            className="text-[2.75rem] font-bold leading-[1.04] tracking-[-0.02em] text-foreground sm:text-6xl xl:text-7xl"
          >
            Rent, buy, sell, finance or notarize.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70 md:text-xl">
            One local team in Lehi for your home and your rental, across 55 Wasatch Front cities.
          </p>
        </div>
        {/* A directory, not a card grid: one row per service, read top to bottom like the header. */}
        <ul aria-label="What do you need?" className="border-t border-border lg:col-span-7">
          {SERVICE_TILES.map(({ href, label, line, icon: Icon, id }) => (
            <li key={id} className="border-b border-border">
              <Link
                href={href}
                className="group flex min-h-[4.25rem] items-center gap-4 px-1 py-3 transition-colors hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:gap-6 sm:px-3 md:min-h-[4.75rem]"
                {...analyticsAttributes("hero_audience_click", "home_hero", id)}
              >
                <span className="w-[5.5rem] shrink-0 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:w-32 md:text-3xl">
                  {label}
                </span>
                <span className="flex-1 text-sm leading-snug text-foreground/70 sm:text-base">{line}</span>
                <Icon
                  className="h-5 w-5 shrink-0 text-foreground/35 transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
