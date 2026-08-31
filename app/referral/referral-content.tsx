"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Building2, Users, Home, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import {
  ReferralBonusBanner,
  ReferralSignupButton,
  ReferralSignupButtonFallback,
} from "./referral-ref-code"

export function ReferralContent() {
  const { t } = useTranslation()

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

        {/* Referral bonus banner — depends on `?ref=`, so it resolves after hydration. */}
        <Suspense fallback={null}>
          <ReferralBonusBanner />
        </Suspense>

        {/* CTA buttons */}
        <section className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Suspense fallback={<ReferralSignupButtonFallback />}>
            <ReferralSignupButton />
          </Suspense>
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
