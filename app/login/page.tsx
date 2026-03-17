import { redirect } from "next/navigation"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

export default function LoginPage() {
  redirect(APP_PORTAL_LOGIN_URL)
}

export const metadata = {
  robots: { index: false },
}
