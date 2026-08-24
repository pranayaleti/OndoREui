import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import SubscribePageClient from "./page-client"

export const metadata: Metadata = pageCanonicalMetadata("/subscribe", {
  title: "Subscribe | Ondo Real Estate",
  description: "Get Utah market updates, owner tips, and Ondo Real Estate news by email.",
})

export default function Page() {
  return <SubscribePageClient />
}
