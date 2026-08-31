import { Suspense } from "react"
import type { Metadata } from "next"
import { ReferralContent } from "./referral-content"
import { SITE_URL } from "@/lib/site"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const title = "You've Been Invited to Ondo RE | Ondo Real Estate"
const description =
  "Your friend invited you to Ondo RE, the platform connecting property managers, owners, and tenants. Sign up now and your friend earns a free month."
const canonical = `${SITE_URL}/referral/`

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: buildMetadataLanguages("/referral"),
  },
  openGraph: { title, description, url: canonical, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function ReferralPage() {
  return (
    <Suspense>
      <ReferralContent />
    </Suspense>
  )
}
