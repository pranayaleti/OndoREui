import Link from "next/link"
import { Clock, MapPin, ShieldCheck } from "lucide-react"
import {
  EMERGENCY_LINE_CHIP_LABEL,
  LICENSING_CHIP_LABEL,
  LICENSING_HREF,
  UTAH_CITIES_SERVED,
} from "@/lib/social-proof-stats"

/**
 * Compact factual chips for city / PM pages. Numbers match the homepage
 * social-proof bar. Do not add Google ratings or placeholder NMLS IDs.
 */
export function CityTrustChips() {
  return (
    <nav aria-label="Trust and licensing facts">
      <ul className="mt-4 flex flex-wrap gap-2">
        <li>
          <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm text-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {UTAH_CITIES_SERVED}+ Utah cities
          </span>
        </li>
        <li>
          <Link
            href={LICENSING_HREF}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {LICENSING_CHIP_LABEL}
          </Link>
        </li>
        <li>
          <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm text-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {EMERGENCY_LINE_CHIP_LABEL}
          </span>
        </li>
      </ul>
    </nav>
  )
}
