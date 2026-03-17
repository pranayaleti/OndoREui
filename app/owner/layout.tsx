import { redirect } from "next/navigation"
import { APP_PORTAL_URL } from "@/lib/site"

// Owner portal lives in OndoREDashboard, not the marketing site.
export default function OwnerLayout() {
  redirect(`${APP_PORTAL_URL}/owner`)
}

export const metadata = {
  robots: { index: false },
}
