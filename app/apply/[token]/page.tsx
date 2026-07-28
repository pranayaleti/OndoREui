import { Suspense } from "react"
import { ApplyPageClient } from "./apply-page-client"

// Dynamic token URLs are handled client-side via the 404 fallback.
// We generate one placeholder so Next.js static export is satisfied.
export function generateStaticParams() {
  return [{ token: '_' }]
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
      <ApplyPageClient />
    </Suspense>
  )
}
