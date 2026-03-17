import { redirect } from "next/navigation"
import { APP_PORTAL_URL } from "@/lib/site"

// Tenant portal lives in OndoREDashboard, not the marketing site.
export default function TenantLayout() {
  redirect(`${APP_PORTAL_URL}/tenant`)
}

export const metadata = {
  robots: { index: false },
}
