import type { Metadata } from "next"
import { DemoPageClient } from "./demo-page-client"
import { toCanonicalPageUrl } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/demo") },
  title: pageTitle("Platform Demo | Ondo Real Estate"),
  description: "Explore the Ondo self-serve demo, watch the walkthrough video, and use seeded Manager, Owner, and Tenant demo accounts.",
}

export default function DemoPage() {
  return <DemoPageClient />
}
