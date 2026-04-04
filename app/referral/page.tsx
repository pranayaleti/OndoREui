// TODO(i18n): server component — SEO metadata kept in English
import { Suspense } from "react"
import type { Metadata } from "next"
import { ReferralContent } from "./referral-content"

export const metadata: Metadata = {
  title: "You've Been Invited to Ondo RE | Ondo Real Estate",
  description:
    "Your friend invited you to Ondo RE — the platform connecting property managers, owners, and tenants. Sign up now and your friend earns a free month.",
  robots: { index: true, follow: true },
}

export default function ReferralPage() {
  return (
    <Suspense>
      <ReferralContent />
    </Suspense>
  )
}
