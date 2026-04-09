import type { Metadata } from "next"
import { AffiliateContent } from "./affiliate-content"
import { SITE_URL } from "@/lib/site"
import { SUPPORTED_LOCALES } from "@/lib/locales"

const title = "Become an Ondo RE Affiliate | Ondo Real Estate"
const description =
  "Join the Ondo RE affiliate program. Help property professionals discover our platform and earn up to 24 free months of portal access plus prize draw entries."
const canonical = `${SITE_URL}/affiliate/`

export const metadata: Metadata = {
  title,
  description,
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}/affiliate/`])
    ),
  },
  openGraph: { title, description, url: canonical },
}

export default function AffiliatePage() {
  return <AffiliateContent />
}
