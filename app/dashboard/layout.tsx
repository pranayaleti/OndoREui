import { redirect } from "next/navigation"
import { APP_PORTAL_URL } from "@/lib/site"

// Staff portal lives in OndoREDashboard, not the marketing site.
export default function DashboardLayout() {
  redirect(`${APP_PORTAL_URL}/dashboard`)
}

export const metadata = {
  robots: { index: false },
}
