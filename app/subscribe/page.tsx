import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import SubscribePageClient from "./page-client"
import { pageTitle } from "@/lib/site"

export const metadata: Metadata = pageCanonicalMetadata("/subscribe", {
  title: pageTitle("Subscribe | Ondo Real Estate"),
  description: "Get Utah market updates, owner tips, and Ondo Real Estate news by email.",
})

export default function Page() {
  return <SubscribePageClient />
}
