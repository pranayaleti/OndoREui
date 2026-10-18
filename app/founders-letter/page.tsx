import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"
import { toAbsoluteSiteUrl } from "@/lib/url"
import FoundersLetterClient, {
  FOUNDER_IMAGE_PATH,
  FOUNDERS_LETTER_DESCRIPTION,
  FOUNDERS_LETTER_PATH,
  FOUNDERS_LETTER_TITLE,
} from "./founders-letter-client"

const founderOgImage = {
  url: toAbsoluteSiteUrl(FOUNDER_IMAGE_PATH),
  width: 1770,
  height: 1354,
  alt: "Pranay Reddy Aleti, founder of Ondo Real Estate",
}

export const metadata: Metadata = pageCanonicalMetadata(FOUNDERS_LETTER_PATH, {
  title: pageTitle(FOUNDERS_LETTER_TITLE),
  description: FOUNDERS_LETTER_DESCRIPTION,
  openGraph: { type: "profile", images: [founderOgImage] },
  twitter: { images: [founderOgImage.url] },
})

export default function FoundersLetterPage() {
  return <FoundersLetterClient />
}
