import type { Metadata } from "next"
import PropertiesClient from "./page-client"
import { PropertiesAgentIntro } from "@/components/properties/properties-agent-intro"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/properties", {
  title: "Utah Properties for Sale & Rent | Ondo Real Estate",
  description: "Browse homes, condos, and investment properties across Utah.",
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
