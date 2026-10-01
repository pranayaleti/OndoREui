import type { Metadata } from "next"
import PropertiesClient from "./page-client"
import { PropertiesAgentIntro } from "@/components/properties/properties-agent-intro"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { fetchPublicPropertyList } from "@/lib/public-property"
import { mapApiProperties } from "@/lib/mapProperty"

export const metadata: Metadata = pageCanonicalMetadata("/properties", {
  title: "Utah Rental Properties",
  description: "Browse available rental homes, apartments, condos, and townhomes managed by Ondo Real Estate across the Wasatch Front.",
})


export default async function PropertiesPage() {
  // Build-time snapshot so the static HTML has listing cards, links to each
  // listing and listing JSON-LD. The client refreshes it on load. A backend
  // outage at build time yields [] and the page falls back to the client fetch.
  const initialProperties = mapApiProperties(await fetchPublicPropertyList()).filter(
    (property) => Number.isFinite(property.dateAdded.getTime()),
  )
  return (
    <>
      {/* Server-rendered summary so AI agents (and no-JS visitors) get the
          search description and WebMCP tool pointer before the client widget
          hydrates. See components/properties/properties-agent-intro.tsx. */}
      <PropertiesAgentIntro />
      <PropertiesClient initialProperties={initialProperties} />
    </>
  )
}
