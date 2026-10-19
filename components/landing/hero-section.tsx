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
    <section
      className="relative w-full overflow-hidden bg-gradient-to-r from-background to-card py-16 dark:bg-gradient-to-b dark:from-background dark:to-card md:py-24"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <Image
          src="/modern-office-building.webp"
          alt=""
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 id="hero-heading" className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Rent, buy, sell, finance or notarize.
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-foreground/70">
          One local team in Lehi for your home and your rental, across 55 Wasatch Front cities.
        </p>
        <ul
          aria-label="What do you need?"
          className="mx-auto grid max-w-4xl grid-cols-2 gap-3 text-left sm:grid-cols-3 md:gap-4"
        >
          {SERVICE_TILES.map(({ href, label, line, icon: Icon, id }) => (
            <li key={id}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-xl border border-border bg-card/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:p-5"
                {...analyticsAttributes("hero_audience_click", "home_hero", id)}
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-lg font-semibold text-foreground">{label}</span>
                <span className="mt-1 text-sm text-foreground/70">{line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
