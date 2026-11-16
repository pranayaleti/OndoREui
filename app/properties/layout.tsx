import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"

const TITLE = "Utah Rental Properties | Ondo Real Estate"
const DESCRIPTION =
  "Browse available rental homes, apartments, condos, and townhomes managed by Ondo Real Estate across the Wasatch Front."

export const metadata: Metadata = {
  title: pageTitle(TITLE),
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/properties/`,
    // Markdown twin for AI agents (the HTML page is a client-only widget).
    types: { "text/markdown": `${SITE_URL}/properties.md` },
  },
  openGraph: {
    title: pageTitleText(TITLE),
    description: DESCRIPTION,
    images: OG_IMAGES.rent,
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE_URLS.rent] },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
