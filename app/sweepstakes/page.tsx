import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: there are no published official rules, so no sweepstakes is running.
// Not linked from navigation, the site index or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/sweepstakes", {
  title: pageTitle("Sweepstakes | Ondo Real Estate"),
  description: "Ondo Real Estate is not running a sweepstakes right now.",
  robots: { index: false, follow: true },
})

export default function SweepstakesPage() {
  return (
    <UnpublishedPageNotice title="No sweepstakes right now">
      <p>Ondo Real Estate is not running a sweepstakes or giveaway, and we are not accepting entries.</p>
      <p>If you have a question about a promotion you saw, send it through the contact page.</p>
    </UnpublishedPageNotice>
  )
}
