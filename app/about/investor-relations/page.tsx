import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: the original financials, reports and events could not be verified. Not linked from navigation or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/about/investor-relations", {
  title: pageTitle("Investor Information | Ondo Real Estate"),
  description: "Ondo Real Estate does not publish financial reports or investor events. Contact us with investor questions.",
  robots: { index: false, follow: true },
})

export default function InvestorRelationsPage() {
  return (
    <UnpublishedPageNotice
      title="Investor information"
      alternative={{ href: "/investments/", label: "Investment information" }}
    >
      <p>Ondo Real Estate does not publish financial reports, earnings or investor events on this site.</p>
      <p>If you have an investor question, send it through the contact page.</p>
    </UnpublishedPageNotice>
  )
}
