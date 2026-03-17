import { redirect } from "next/navigation"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

// Auth is handled entirely by OndoREDashboard.
// Any visitor to /auth on the marketing site is redirected there.
export default function AuthPage() {
  redirect(APP_PORTAL_LOGIN_URL)
}

export const metadata = {
  robots: { index: false },
}
