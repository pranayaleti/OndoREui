import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: the original program and impact figures could not be verified. Not linked from navigation or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/about/giving-back", {
  title: pageTitle("Community | Ondo Real Estate"),
  description: "Ondo Real Estate does not publish community program figures. Contact us with questions.",
  robots: { index: false, follow: true },
})

export default function GivingBackPage() {
  return (
    <UnpublishedPageNotice title="Community">
      <p>We do not publish community program details or impact figures on this site.</p>
      <p>If you want to ask about community work or partnerships, send a message through the contact page.</p>
    </UnpublishedPageNotice>
  )
}
