"use client"

import { useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

/**
 * `?ref=` handling for `/referral/`.
 *
 * `useSearchParams()` makes its closest Suspense boundary render the fallback
 * during static export, so the two ref-dependent pieces live here behind their
 * own small boundaries. Wrapping the whole page instead left `/referral/` with
 * no server-rendered body at all — an indexable page with only nav and footer.
 */
function useRefCode(): string {
  const searchParams = useSearchParams()
  return searchParams?.get("ref") ?? ""
}

const SIGNUP_BUTTON_CLASS =
  "bg-gradient-to-r from-orange-500 to-red-700 hover:from-orange-600 hover:to-red-800 text-white border-0 px-8"

function SignupButton({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild size="lg" className={SIGNUP_BUTTON_CLASS}>
      <a href={href}>{label}</a>
    </Button>
  )
}

/** Prerendered stand-in: same markup, portal login without a referral code. */
export function ReferralSignupButtonFallback() {
  const { t } = useTranslation()
  return <SignupButton href={APP_PORTAL_LOGIN_URL} label={t("referral.signUpNow")} />
}

export function ReferralSignupButton() {
  const { t } = useTranslation()
  const refCode = useRefCode()
  const href = refCode
    ? `${APP_PORTAL_LOGIN_URL}?ref=${encodeURIComponent(refCode)}`
    : APP_PORTAL_LOGIN_URL
  return <SignupButton href={href} label={t("referral.signUpNow")} />
}

export function ReferralBonusBanner() {
  const { t } = useTranslation()
  const refCode = useRefCode()
  if (!refCode) return null
  return (
    <section
      aria-labelledby="referral-bonus-heading"
      className="rounded-xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-700 dark:bg-amber-950/40"
    >
      <h2
        id="referral-bonus-heading"
        className="mb-2 text-lg font-semibold text-amber-900 dark:text-amber-200"
      >
        {t("referral.bonusTitle")}
      </h2>
      <p className="text-sm text-amber-800 dark:text-amber-300">
        {t("referral.bonusDesc", { code: refCode })}
      </p>
    </section>
  )
}
