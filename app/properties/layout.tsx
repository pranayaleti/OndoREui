import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Utah Properties for Sale & Rent | Ondo Real Estate",
  description:
    "Browse homes, condos, and investment properties across Utah. Updated listings with photos, pricing, and neighborhood info.",
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
