import type { Metadata } from "next"
import { DemoPageClient } from "./demo-page-client"

export const metadata: Metadata = {
  title: "Platform Demo | Ondo Real Estate",
  description: "Explore the Ondo self-serve demo, watch the walkthrough video, and use seeded Manager, Owner, and Tenant demo accounts.",
}

export default function DemoPage() {
  return <DemoPageClient />
}
