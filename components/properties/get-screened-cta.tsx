"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  formatScreeningFeeCents,
  getScreeningCta,
  type ScreeningCta,
} from "@/lib/api/screening"
import { isClientOnlyRentalPath } from "@/lib/rental-static-paths"

const CTA_CLASS = "rounded-md bg-primary px-5 py-2.5 text-center font-medium text-primary-foreground hover:opacity-90"

interface GetScreenedCtaProps {
  /** Internal property UUID (required by screening-cta). */
  propertyId: string
}

/**
 * Listing CTA: shows **Get Screened** only when property screening is enabled.
 * Client-fetched so static export pages stay current at runtime.
 */
export function GetScreenedCta({ propertyId }: GetScreenedCtaProps) {
  const [cta, setCta] = useState<ScreeningCta | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void getScreeningCta(propertyId).then((result) => {
      if (!cancelled) {
        setCta(result)
        setLoaded(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [propertyId])

  if (!loaded || !cta?.enabled) {
    return null
  }

  const feeLabel = formatScreeningFeeCents(cta.feeCents)
  const href = cta.applyPath ?? "/contact"
  const unavailable = !cta.applyPath

  return (
    <div className="flex flex-col gap-1">
      {/* The apply link carries a token and has no exported page (see isClientOnlyRentalPath),
          so it is a plain anchor; /contact keeps the client-side link. */}
      {isClientOnlyRentalPath(href) ? (
        <a href={href} className={CTA_CLASS}>
          Get Screened
        </a>
      ) : (
        <Link href={href} className={CTA_CLASS}>
          Get Screened
        </Link>
      )}
      <p className="text-xs text-muted-foreground">
        Screening fee {feeLabel}
        {cta.reuseDays > 0
          ? ` · reusable for ${cta.reuseDays} days after completion`
          : ""}
        {unavailable ? " · contact us for an application link" : ""}
      </p>
    </div>
  )
}
