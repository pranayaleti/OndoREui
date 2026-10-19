import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import NotaryClient from "./notary-client"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

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
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function NotaryPage() {
  // Same image as the Open Graph preview; the schema used to point at a notary-cover.jpg that never existed.
  return <NotaryClient imageUrl={DEFAULT_OG_IMAGE_URL} />
}
