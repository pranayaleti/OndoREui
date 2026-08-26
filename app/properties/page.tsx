import type { Metadata } from "next"
import PropertiesClient from "./page-client"
import { PropertiesAgentIntro } from "@/components/properties/properties-agent-intro"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/properties", {
  title: "Utah Rental Properties",
  description: "Browse available rental homes, apartments, condos, and townhomes managed by Ondo Real Estate across the Wasatch Front.",
})


export default function PropertiesPage() {
  return (
    <>
      {/* Server-rendered summary so AI agents (and no-JS visitors) get the
          search description and WebMCP tool pointer before the client widget
          hydrates. See components/properties/properties-agent-intro.tsx. */}
      <PropertiesAgentIntro />
      <PropertiesClient />
    </>
  )
}
