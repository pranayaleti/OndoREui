import Link from "next/link"
import { Building2, Calculator, Home } from "lucide-react"

interface JourneyCard {
  href: string
  eyebrow: string
  title: string
  description: string
  icon: typeof Building2
  cta: string
}

const cards: JourneyCard[] = [
  {
    href: "/property-management",
    eyebrow: "Owners & investors",
    title: "Property management",
    description:
      "Full-service leasing, screening, rent collection, maintenance, and owner reporting across 55+ Utah cities.",
    icon: Building2,
    cta: "See what we handle",
  },
  {
    href: "/whats-my-home-worth",
    eyebrow: "Free rental analysis",
    title: "What could your home earn?",
    description:
      "Instant rent and sale estimate for any Wasatch Front city. No signup to see your number.",
    icon: Calculator,
    cta: "Get my estimate",
  },
  {
    href: "/properties",
    eyebrow: "Renters",
    title: "Available rentals",
    description:
      "Browse Ondo-managed homes and apartments from Salt Lake City to Provo, Lehi to Ogden.",
    icon: Home,
    cta: "Browse rentals",
  },
]

export function JourneyCardsSection() {
  return (
    <section
      className="border-b border-border/40 bg-background py-12 md:py-16"
      aria-labelledby="journey-cards-heading"
    >
      <div className="container mx-auto px-4">
        <h2 id="journey-cards-heading" className="sr-only">
          Choose your next step
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <li key={card.href}>
                <Link
                  href={card.href}
                  className="group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    {card.eyebrow}
                  </p>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm text-foreground/70">{card.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {card.cta}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="mt-6 text-center text-xs text-foreground/50">
          Rental estimates are informational only and are not an appraisal, BPO, or CMA.
        </p>
      </div>
    </section>
  )
}
