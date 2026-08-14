import PropertiesClient from "./page-client"
import { PropertiesAgentIntro } from "@/components/properties/properties-agent-intro"

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
