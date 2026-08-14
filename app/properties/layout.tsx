import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "Utah Properties for Sale & Rent | Ondo Real Estate",
  description:
    "Browse homes, condos, and investment properties across Utah. Updated listings with photos, pricing, and neighborhood info.",
  alternates: {
    canonical: `${SITE_URL}/properties/`,
    // Markdown twin for AI agents (the HTML page is a client-only widget).
    types: { "text/markdown": `${SITE_URL}/properties.md` },
  },
  openGraph: {
    title: "Utah Properties for Sale & Rent | Ondo Real Estate",
    description:
      "Browse homes, condos, and investment properties across Utah. Updated listings with photos, pricing, and neighborhood info.",
  },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
