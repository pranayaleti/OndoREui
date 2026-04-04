// TODO(i18n): server component — SEO metadata kept in English
import type { Metadata } from "next"
import { AffiliateContent } from "./affiliate-content"

export const metadata: Metadata = {
  title: "Become an Ondo RE Affiliate | Ondo Real Estate",
  description:
    "Join the Ondo RE affiliate program. Help property professionals discover our platform and earn up to 24 free months of portal access plus prize draw entries.",
  robots: { index: true, follow: true },
}

export default function AffiliatePage() {
  return <AffiliateContent />
}
