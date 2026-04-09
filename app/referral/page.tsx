import { Suspense } from "react"
import type { Metadata } from "next"
import { ReferralContent } from "./referral-content"
import { SITE_URL } from "@/lib/site"
import { SUPPORTED_LOCALES } from "@/lib/locales"

const title = "You've Been Invited to Ondo RE | Ondo Real Estate"
const description =
  "Your friend invited you to Ondo RE — the platform connecting property managers, owners, and tenants. Sign up now and your friend earns a free month."
const canonical = `${SITE_URL}/referral/`

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}/referral/`])
    ),
  },
  openGraph: { title, description, url: canonical },
}

export default function ReferralPage() {
  return (
    <Suspense>
      <ReferralContent />
    </Suspense>
  )
}
