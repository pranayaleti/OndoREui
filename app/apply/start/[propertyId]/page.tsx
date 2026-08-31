import type { Metadata } from "next"
import { Suspense } from "react"
import { RentalStartClient } from "@/components/rental/rental-start-client"
import { backendUrl } from "@/lib/backend"
import { publicIdsFromListBody } from "@/lib/public-property"
import { RENTAL_STATIC_PLACEHOLDER } from "@/lib/rental-static-paths"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * Required under `output: "export"`. Known listing ids get an HTML file at
 * build time. Unknown ids omit `dynamicParams = false` so next dev still
 * renders this page; GitHub Pages recovers via `app/not-found.tsx`.
 */
export async function generateStaticParams(): Promise<Array<{ propertyId: string }>> {
  try {
    const res = await fetch(backendUrl("/api/properties/public"))
    if (!res.ok) return [{ propertyId: RENTAL_STATIC_PLACEHOLDER }]
    const params = publicIdsFromListBody(await res.json()).map((propertyId) => ({ propertyId }))
    return params.length > 0 ? params : [{ propertyId: RENTAL_STATIC_PLACEHOLDER }]
  } catch {
    return [{ propertyId: RENTAL_STATIC_PLACEHOLDER }]
  }
}

export default function RentalStartPage() {
  return (
    <Suspense fallback={<div className="px-4 py-12">Loading…</div>}>
      <RentalStartClient />
    </Suspense>
  )
}
