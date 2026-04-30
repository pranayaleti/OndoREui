"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Building2, Users, Home, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.ondorealestate.com"

export function ReferralContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const refCode = searchParams?.get("ref") ?? ""

  /** Invite signup is `/signup/:inviteToken`; we pass program ref via query so it survives until signup API call. */
  const signupUrl = refCode
    ? `${DASHBOARD_URL}/login?ref=${encodeURIComponent(refCode)}`
    : `${DASHBOARD_URL}/login`

  const benefits = [
    {
      icon: Building2,
      title: t("referral.managerTitle"),
      desc: t("referral.managerDesc"),
    },
    {
      icon: Home,
      title: t("referral.ownerTitle"),
      desc: t("referral.ownerDesc"),
    },
    {
      icon: Users,
      title: t("referral.tenantTitle"),
      desc: t("referral.tenantDesc"),
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={t("referral.heroTitle")}
        description={t("referral.heroSubtitle")}
        pathname="/referral/"
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-red-800 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-1.5 text-sm font-medium text-white">
            <Star className="h-4 w-4" aria-hidden="true" />
            <span>{t("referral.invitedBadge")}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {t("referral.heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            {t("referral.heroSubtitle")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
        {/* Benefits */}
        <section aria-labelledby="benefits-heading">
          <h2
            id="benefits-heading"
            className="mb-8 text-center text-2xl font-bold text-foreground"
          >
            {t("referral.benefitsTitle")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-foreground/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Referral bonus banner */}
        {refCode && (
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
        )}

        {/* CTA buttons */}
        <section className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-red-700 hover:from-orange-600 hover:to-red-800 text-white border-0 px-8">
            <a href={signupUrl}>{t("referral.signUpNow")}</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sweepstakes">{t("referral.enterSweepstakes")}</Link>
          </Button>
        </section>

        {/* Trusted by */}
        <section className="rounded-xl border border-border bg-card/60 p-8 text-center">
          <h2 className="mb-3 text-xl font-semibold text-foreground">
            {t("referral.trustedTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-foreground/70">
            {t("referral.trustedDesc")}
          </p>
        </section>
      </div>
    </main>
  )
}
