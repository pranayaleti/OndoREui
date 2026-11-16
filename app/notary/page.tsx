import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import NotaryClient from "./notary-client"
import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"

const TITLE = "Remote Online Notary – Available Nationwide"

export const metadata: Metadata = {
  title: pageTitle(TITLE),
  description: "Remote online notarization (RON) in every state: real estate, loan signings, affidavits and estate documents by secure video. No office visit, no mobile travel.",
  alternates: { canonical: `${SITE_URL}/notary/` },
  openGraph: {
    type: "website",
    title: pageTitleText(TITLE),
    description: "Remote online notarization (RON) in every state: real estate, loan signings, affidavits and estate documents by secure video. No office visit, no mobile travel.",
    url: `${SITE_URL}/notary/`,
    images: OG_IMAGES.notary,
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE_URLS.notary] },
}

export default function NotaryPage() {
  // Same image as the Open Graph preview; the schema used to point at a notary-cover.jpg that never existed.
  return <NotaryClient imageUrl={OG_IMAGE_URLS.notary} />
}
