import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: the original press and announcement list could not be verified. Not linked from navigation or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/about/news", {
  title: pageTitle("Company News | Ondo Real Estate"),
  description: "Ondo Real Estate has no company announcements posted here. Industry news and contact options are linked.",
  robots: { index: false, follow: true },
})

export default function CompanyNewsPage() {
  return (
    <UnpublishedPageNotice
      title="Company news"
      alternative={{ href: "/news/", label: "Utah real estate news" }}
    >
      <p>There are no company announcements or press releases posted here.</p>
      <p>For media questions, send a message through the contact page.</p>
    </UnpublishedPageNotice>
  )
}
