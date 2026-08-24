import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import BlogPageClient from "./page-client"

export const metadata: Metadata = pageCanonicalMetadata("/blog", {
  title: "Utah Real Estate Blog | Ondo RE",
  description: "Guides on Utah property management, mortgages, buying, selling, and notary from the Ondo Real Estate team.",
})

export default function Page() {
  return <BlogPageClient />
}
