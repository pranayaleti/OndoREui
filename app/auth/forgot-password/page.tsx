import { redirect } from "next/navigation"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

// Auth is handled entirely by OndoREDashboard.
// Redirect visitors to the dashboard forgot-password flow.
export default function ForgotPasswordPage() {
  redirect(`${APP_PORTAL_LOGIN_URL.replace(/\/login$/, "")}/forgot-password`)
}

export const metadata = { robots: { index: false } }
