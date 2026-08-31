import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import WhyUtahClient from "./why-utah-client"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Why Invest in Utah Real Estate | Ondo Real Estate",
  description: "Utah's resilient economy, tech growth, and quality of life create strong real estate investment opportunities across the Wasatch Front.",
  alternates: { canonical: `${SITE_URL}/why-utah/` },
  openGraph: {
    title: "Why Invest in Utah Real Estate | Ondo Real Estate",
    description: "Utah's resilient economy, tech growth, and quality of life create strong real estate investment opportunities across the Wasatch Front.",
    url: `${SITE_URL}/why-utah/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function WhyUtahPage() {
  return <WhyUtahClient />
}
