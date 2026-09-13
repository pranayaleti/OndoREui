import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import NewsPageClient from "./page-client"
import { pageTitle } from "@/lib/site"

export const metadata: Metadata = pageCanonicalMetadata("/news", {
  title: pageTitle("Utah Real Estate News & Market Updates"),
  description: "Utah housing news that affects what you pay: rate moves, new construction, zoning changes and monthly market shifts along the Wasatch Front.",
})

export default function Page() {
  return <NewsPageClient />
}
