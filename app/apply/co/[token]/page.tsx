import type { Metadata } from "next"
import { Suspense } from "react"
import { CoApplicantClient } from "@/components/rental/co-applicant-client"
import { RENTAL_STATIC_PLACEHOLDER } from "@/lib/rental-static-paths"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * Required under `output: "export"`. Invite tokens are not enumerable at
 * build time. Omit `dynamicParams = false` so next dev still renders this
 * page; GitHub Pages recovers via `app/not-found.tsx`.
 */
export function generateStaticParams() {
  return [{ token: RENTAL_STATIC_PLACEHOLDER }]
}

export default function CoApplicantPage() {
  return (
    <Suspense fallback={<div className="px-4 py-12">Loading…</div>}>
      <CoApplicantClient />
    </Suspense>
  )
}
