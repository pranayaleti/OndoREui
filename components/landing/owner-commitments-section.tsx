import Link from "next/link"
import { Building2, Clock, ShieldCheck, Wallet } from "lucide-react"

/**
 * Owner commitments — every bullet must map to a promise that is *already*
 * documented on `/pricing` or the property-management pages. We call these
 * "commitments" rather than "guarantees" on purpose: Ondo has no leasing /
 * eviction / maintenance-rework guarantee product to back a stronger word,
 * and Reg Z + brokerage advertising rules don't reward invention.
 *
 * When copy here changes, run the license-compliance-guard subagent so we
 * don't drift into unsubstantiated claims.
 */
interface Commitment {
  icon: typeof Wallet
  title: string
  body: string
  href: string
  linkLabel: string
}

const commitments: Commitment[] = [
  {
    icon: Wallet,
    title: "You pay when rent is collected",
    body:
      "Management fee is a percentage of collected rent — not a flat retainer, not a per-door subscription. When your tenants pay, we get paid.",
    href: "/pricing",
    linkLabel: "See pricing tiers",
  },
  {
    icon: Clock,
    title: "30-day notice, no long-term lock-in",
    body:
      "Cancel with 30 days' written notice. We earn your business month to month, not with a five-page contract.",
    href: "/pricing",
    linkLabel: "Read the cancellation terms",
  },
  {
    icon: Building2,
    title: "24/7 emergency maintenance line",
    body:
      "After-hours line for burst pipes, no-heat, and lockout emergencies. Included in every management plan so urgent issues don't wait until Monday.",
    href: "/property-management/maintenance-coordination",
    linkLabel: "See maintenance coordination",
  },
  {
    icon: ShieldCheck,
    title: "Fair Housing–compliant screening",
    body:
      "Credit, criminal, eviction, and income checks applied to every applicant against consistent, documented criteria — with HUD-aligned handling of criminal records.",
    href: "/property-management/tenant-screening",
    linkLabel: "See our screening process",
  },
]

export function OwnerCommitmentsSection() {
  return (
    <section
      className="border-y border-border/40 bg-muted/30 py-16 md:py-20"
      aria-labelledby="owner-commitments-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            What owners can count on
          </p>
          <h2
            id="owner-commitments-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Four commitments, written down
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            No fine print. No franchise promises we can&rsquo;t back. Just the
            terms every Ondo owner sees in writing before signing.
          </p>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
          {commitments.map((commitment) => {
            const Icon = commitment.icon
            return (
              <li
                key={commitment.title}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {commitment.title}
                </h3>
                <p className="mb-4 text-sm text-foreground/70">{commitment.body}</p>
                <Link
                  href={commitment.href}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {commitment.linkLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
