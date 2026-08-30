import Link from "next/link"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"
import { LICENSING_HREF } from "@/lib/social-proof-stats"
import { LENDING_FACTS_VERIFY } from "@/lib/content"

type LendingDisclaimerProps = {
  className?: string
}

export function LendingDisclaimer({ className = "" }: LendingDisclaimerProps) {
  return (
    <p className={`text-xs leading-relaxed text-foreground/60 ${className}`.trim()}>
      {ARRIVAL_LENDING_DISCLOSURE} {LENDING_FACTS_VERIFY}{" "}
      <Link href={LICENSING_HREF} className="font-medium text-primary underline underline-offset-4">
        Licensing and disclosures
      </Link>
    </p>
  )
}
