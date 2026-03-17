import { redirect } from "next/navigation"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

// Auth is handled entirely by OndoREDashboard.
// Redirect visitors to the dashboard reset-password flow.
export default function ResetPasswordPage() {
  redirect(`${APP_PORTAL_LOGIN_URL.replace(/\/login$/, "")}/reset-password`)
}

export const metadata = { robots: { index: false } }
