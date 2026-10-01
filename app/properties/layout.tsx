import type { Metadata } from "next"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

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
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
