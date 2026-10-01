import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: the original open roles and benefits could not be verified. Not linked from navigation or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/about/careers", {
  title: pageTitle("Careers | Ondo Real Estate"),
  description: "Ondo Real Estate has no open roles posted right now. Contact us if you want to work with us.",
  robots: { index: false, follow: true },
})

export default function CareersPage() {
  return (
    <UnpublishedPageNotice title="Careers">
      <p>We have no open roles posted right now.</p>
      <p>If you want to work with Ondo Real Estate, send a short note through the contact page.</p>
    </UnpublishedPageNotice>
  )
}
