import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"
import { toAbsoluteSiteUrl } from "@/lib/url"
import {
  FOUNDERS_LETTER_DESCRIPTION,
  FOUNDERS_LETTER_OG_IMAGE_ALT,
  FOUNDERS_LETTER_OG_IMAGE_PATH,
  FOUNDERS_LETTER_PATH,
  FOUNDERS_LETTER_TITLE,
} from "@/lib/content/founders-letter"
import FoundersLetter from "./founders-letter-client"

/**
 * Bump when the letter's wording changes. lib/sitemap-lastmod.cjs reads it from this file for
 * <lastmod>, and the letter prints it under the signature and as the Article's dateModified.
 */
const modified = "2026-10-20"

const ogImage = {
  url: toAbsoluteSiteUrl(FOUNDERS_LETTER_OG_IMAGE_PATH),
  width: 1200,
  height: 630,
  alt: FOUNDERS_LETTER_OG_IMAGE_ALT,
}

export const metadata: Metadata = pageCanonicalMetadata(FOUNDERS_LETTER_PATH, {
  title: pageTitle(FOUNDERS_LETTER_TITLE),
  description: FOUNDERS_LETTER_DESCRIPTION,
  openGraph: { type: "article", images: [ogImage] },
  twitter: { images: [ogImage.url] },
})

export default function FoundersLetterPage() {
  return <FoundersLetter modified={modified} />
}
