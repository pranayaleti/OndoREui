import type { Metadata } from "next"
import { FounderProfile, FOUNDER_PROFILE_DESCRIPTION, founderProfileTitle } from "@/components/people/founder-profile"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { LICENSING_LIVE, pageTitle } from "@/lib/site"
import { FOUNDER_PROFILE_PATH } from "@/lib/team-data"
import { toAbsoluteSiteUrl } from "@/lib/url"

const founderImage = {
  url: toAbsoluteSiteUrl("/founder-image.webp"),
  width: 1770,
  height: 1354,
  alt: "Pranay Reddy Aleti, founder of Ondo Real Estate",
}

export const metadata: Metadata = pageCanonicalMetadata(FOUNDER_PROFILE_PATH, {
  title: pageTitle(founderProfileTitle(LICENSING_LIVE)),
  description: FOUNDER_PROFILE_DESCRIPTION,
  openGraph: { type: "profile", images: [founderImage] },
  twitter: { images: [founderImage.url] },
})

export default function FounderProfilePage() {
  return <FounderProfile live={LICENSING_LIVE} />
}
