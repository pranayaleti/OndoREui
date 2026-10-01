import type { Metadata } from "next"
import { UnpublishedPageNotice } from "@/components/unpublished-page-notice"
import { pageTitle } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

// Noindex: the earlier example stories were composites with invented names and ratings, so they were removed.
// Not linked from navigation, the footer or the sitemap.
export const metadata: Metadata = pageCanonicalMetadata("/about/testimonials", {
  title: pageTitle("Reviews | Ondo Real Estate"),
  description: "Ondo Real Estate does not publish customer reviews on this site. Contact us with questions.",
  robots: { index: false, follow: true },
})

export default function TestimonialsPage() {
  return (
    <UnpublishedPageNotice title="Reviews">
      <p>We do not publish customer reviews or testimonials on this site yet.</p>
      <p>If you want to know how we work, send a question through the contact page and we will answer it directly.</p>
    </UnpublishedPageNotice>
  )
}
