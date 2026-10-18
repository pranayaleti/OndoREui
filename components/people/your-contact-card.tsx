import Image from "next/image"
import Link from "next/link"
import { Calendar, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoanOfficerLine } from "@/components/lending/loan-officer-line"
import { analyticsAttributes } from "@/lib/analytics"
import { LICENSING_LIVE, SITE_BROKERAGE_NAME, SITE_CALENDLY_URL, SITE_LENDER_NAME, SITE_PHONE_TEL } from "@/lib/site"
import { FOUNDER_PROFILE_PATH, founderRoleLabel, getFounder } from "@/lib/team-data"

export type ContactKind = "agent" | "loan"

type YourContactCardProps = {
  /** Which license the card speaks to once live: the brokerage (agent) or the NMLS line (loan). */
  kind: ContactKind
  live?: boolean
}

/**
 * "Your contact" on buy, sell, loan and refinance pages: the founder's photo, name and profile link,
 * so every page that matches agent or lender searches points at one person. License titles render
 * only once licensing is live (LICENSING_LIVE in lib/site.ts).
 */
export function YourContactCard({ kind, live = LICENSING_LIVE }: YourContactCardProps) {
  const founder = getFounder()
  return (
    <section aria-labelledby="your-contact-heading" className="container mx-auto px-4 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary">
          <Image
            src={founder.image ?? "/founder-image.webp"}
            alt={`${founder.name}, founder of Ondo Real Estate`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="your-contact-heading" className="text-sm font-medium uppercase tracking-wide text-foreground/60">
            Your contact
          </h2>
          <p className="mt-1 text-xl font-semibold text-foreground">
            <Link href={FOUNDER_PROFILE_PATH} className="underline-offset-4 hover:text-primary hover:underline">
              {founder.name}
            </Link>
          </p>
          <p className="text-sm text-foreground/70">{founderRoleLabel(live)}</p>
          {live && kind === "agent" ? (
            <p className="mt-1 text-sm text-foreground/70">Brokered by {SITE_BROKERAGE_NAME}</p>
          ) : null}
          {kind === "loan" ? (
            <>
              <LoanOfficerLine live={live} className="mt-1 text-sm text-foreground/70" />
              {live ? <p className="text-sm text-foreground/70">with {SITE_LENDER_NAME}</p> : null}
            </>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:w-44">
          <Button asChild>
            <a href={`tel:${SITE_PHONE_TEL}`} {...analyticsAttributes("contact_click", "your_contact_card", "call")}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Call
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={SITE_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              {...analyticsAttributes("contact_click", "your_contact_card", "book")}
            >
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Book a call
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
