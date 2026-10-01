import { ProtectedPortalNotice } from "@/components/portal/protected-portal-notice"
import { portalGateMetadata } from "@/components/portal/portal-gate"

export const PLATFORM_GATE_TITLE = "See the Ondo platform in the demo hub"
export const PLATFORM_GATE_DESCRIPTION =
  "The live owner and tenant portals are behind sign in. To see what the platform does first, open the demo hub, where you can also ask us for a walkthrough."

export const metadata = portalGateMetadata("Platform demo and sign in", PLATFORM_GATE_DESCRIPTION)

export default function BlockedPlatformPage() {
  return <ProtectedPortalNotice title={PLATFORM_GATE_TITLE} description={PLATFORM_GATE_DESCRIPTION} showDemoLink />
}
