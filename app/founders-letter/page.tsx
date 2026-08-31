import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import FoundersLetterClient from "./founders-letter-client"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Founder's Letter | Ondo Real Estate",
  description: "A personal letter from the founder of Ondo Real Estate on our mission, values, and the future of property management.",
  alternates: { canonical: `${SITE_URL}/founders-letter/` },
  openGraph: {
    title: "Founder's Letter | Ondo Real Estate",
    description: "A personal letter from the founder of Ondo Real Estate on our mission, values, and the future of property management.",
    url: `${SITE_URL}/founders-letter/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function FoundersLetterPage() {
  return <FoundersLetterClient />
}
