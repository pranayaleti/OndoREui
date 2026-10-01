import { ProtectedPortalNotice } from "@/components/portal/protected-portal-notice"
import { portalGateMetadata } from "@/components/portal/portal-gate"

export const metadata = portalGateMetadata(
  "Secure tenant portal",
  "Sign in to access the secure Ondo Real Estate tenant portal.",
)

export default function BlockedTenantPage() {
  return (
    <ProtectedPortalNotice
      title="Tenant portal access is available after secure sign in"
      description="Sign in to the secure portal to access payments, maintenance, and lease information."
    />
  )
}
