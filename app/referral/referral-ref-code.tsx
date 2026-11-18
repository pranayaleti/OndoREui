"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"
import { rememberReferralCode } from "@/lib/referral-code"

/**
 * `?ref=` handling for `/referral/`.
 *
 * `useSearchParams()` makes its closest Suspense boundary render the fallback
 * during static export, so the two ref-dependent pieces live here behind their
 * own small boundaries. Wrapping the whole page instead left `/referral/` with
 * no server-rendered body at all, an indexable page with only nav and footer.
 */
function useRefCode(): string {
  const searchParams = useSearchParams()
  return searchParams?.get("ref") ?? ""
}

/** The page's main action, so it is the one solid orange button. */
function SignupButton({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild size="lg" className="px-8">
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
  // Remember the code so a rental application started later fills it in.
  useEffect(() => {
    if (refCode) rememberReferralCode(refCode)
  }, [refCode])
  if (!refCode) return null
  return (
    <section
      aria-labelledby="referral-bonus-heading"
      className="mt-6 border-l-4 border-primary pl-4"
    >
      <h2 id="referral-bonus-heading" className="text-base font-semibold text-foreground">
        {t("referral.bonusTitle")}
      </h2>
      <p className="mt-1 text-sm text-foreground/80">
        {t("referral.bonusDesc", { code: refCode })}
      </p>
    </section>
  )
}
