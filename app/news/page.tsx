import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import NewsPageClient from "./page-client"

export const metadata: Metadata = pageCanonicalMetadata("/news", {
  title: "News | Ondo Real Estate",
  description: "Company news and Utah real estate updates from Ondo Real Estate.",
})

export default function Page() {
  return <NewsPageClient />
}
