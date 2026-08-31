import type { Metadata } from "next"
import { Suspense } from "react"
import { ApplyTokenClient } from "@/components/rental/apply-token-client"
import { RENTAL_STATIC_PLACEHOLDER } from "@/lib/rental-static-paths"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * Required under `output: "export"`. Tokens are not enumerable at build time.
 * Omit `dynamicParams = false` so next dev still renders this page; GitHub
 * Pages recovers via `app/not-found.tsx`.
 */
export function generateStaticParams() {
  return [{ token: RENTAL_STATIC_PLACEHOLDER }]
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      }
    >
      <ApplyTokenClient />
    </Suspense>
  )
}
