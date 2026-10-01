import { ProtectedPortalNotice } from "@/components/portal/protected-portal-notice"
import { portalGateMetadata } from "@/components/portal/portal-gate"

export const metadata = portalGateMetadata(
  "Secure staff portal",
  "Sign in to access the secure Ondo Real Estate staff portal.",
)

export default function BlockedDashboardPage() {
  return (
    <ProtectedPortalNotice
      title="Staff portal access is handled in the secure app"
      description="Sign in through the secure portal to continue."
    />
  )
}
