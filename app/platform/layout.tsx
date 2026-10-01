import { ProtectedPortalNotice } from "@/components/portal/protected-portal-notice"
import { portalGateMetadata } from "@/components/portal/portal-gate"
import { PLATFORM_GATE_DESCRIPTION, PLATFORM_GATE_TITLE } from "@/components/portal/blocked-platform-page"

// Every /platform/* page is a gate, so the layout renders the notice and ignores its children. The
// page files set their own titles; this one only has to keep the whole subtree noindexed.
export const metadata = portalGateMetadata("Platform demo and sign in", PLATFORM_GATE_DESCRIPTION)

export default function PlatformLayout() {
  return <ProtectedPortalNotice title={PLATFORM_GATE_TITLE} description={PLATFORM_GATE_DESCRIPTION} showDemoLink />
}
