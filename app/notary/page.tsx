import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import NotaryClient from "./notary-client"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Remote Online Notary – Available Nationwide | ONDO Notary",
  description: "Secure Remote Online Notarization (RON) nationwide. Real estate, loan signings, affidavits, and estate documents, no office visit and no mobile travel appointments.",
  alternates: { canonical: `${SITE_URL}/notary/` },
  openGraph: {
    title: "Remote Online Notary – Available Nationwide | ONDO Notary",
    description: "Secure Remote Online Notarization (RON) nationwide. Real estate, loan signings, affidavits, and estate documents, no office visit and no mobile travel appointments.",
    url: `${SITE_URL}/notary/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function NotaryPage() {
  return <NotaryClient />
}
