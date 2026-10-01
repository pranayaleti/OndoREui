import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: the original timeline could not be verified. Not linked from navigation or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/about/history", {
  title: pageTitle("Company History | Ondo Real Estate"),
  description: "Ondo Real Estate does not publish a company timeline. Read the founder's letter or contact us.",
  robots: { index: false, follow: true },
})

export default function HistoryPage() {
  return (
    <UnpublishedPageNotice
      title="Company history"
      alternative={{ href: "/founders-letter/", label: "Read the founder's letter" }}
    >
      <p>We do not publish a company timeline. The founder&apos;s letter explains how Ondo Real Estate started.</p>
      <p>If you have a question about the company, send it through the contact page.</p>
    </UnpublishedPageNotice>
  )
}
