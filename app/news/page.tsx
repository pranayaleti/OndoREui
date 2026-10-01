import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import NewsPageClient from "./page-client"
import { pageTitle } from "@/lib/site"

export const metadata: Metadata = pageCanonicalMetadata("/news", {
  title: pageTitle("Real Estate News Sources We Follow"),
  description: "Links to the national and Utah real estate news and data sources we follow, including Redfin, HousingWire, KSL, Zillow Research and NAR.",
})

export default function Page() {
  return <NewsPageClient />
}
