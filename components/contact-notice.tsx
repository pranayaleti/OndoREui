import Link from "next/link"
import { CONTACT_NOTICE_TEXT } from "@/lib/text-consent"

/** One-line notice under forms that collect contact details but have no texting checkbox. */
export function ContactNotice({ className = "text-xs text-muted-foreground" }: { className?: string }) {
  return (
    <p className={className}>
      {CONTACT_NOTICE_TEXT} See our{" "}
      <Link href="/privacy-policy/" className="underline hover:text-foreground">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link href="/terms-of-service/" className="underline hover:text-foreground">
        Terms of Use
      </Link>
      .
    </p>
  )
}
