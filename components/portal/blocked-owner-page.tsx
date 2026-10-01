import { ProtectedPortalNotice } from "@/components/portal/protected-portal-notice"
import { portalGateMetadata } from "@/components/portal/portal-gate"

export const metadata = portalGateMetadata(
  "Secure owner portal",
  "Sign in to access the secure Ondo Real Estate owner portal.",
)

export default function BlockedOwnerPage() {
  return (
    <ProtectedPortalNotice
      title="Owner portal access is available after secure sign in"
      description="Sign in through the secure portal to reach your owner workspace."
    />
  )
}
