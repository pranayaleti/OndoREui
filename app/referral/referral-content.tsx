"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { ClipboardCheck, House, Sparkles } from "lucide-react"
import SEO from "@/components/seo"
import { Button } from "@/components/ui/button"
import { OndoMural } from "@/components/art/ondo-mural"
import {
  ReferralBonusBanner,
  ReferralSignupButton,
  ReferralSignupButtonFallback,
} from "./referral-ref-code"

/**
 * /referral/: where a tenant's share link lands (?ref=CODE). Ondo rents out its
 * own homes, so the page invites a renter, not a property professional. The
 * referrer earns Ondo Rewards points when this visitor signs a lease, which only
 * counts if they create their account through the button here (it carries ?ref).
 */
export function ReferralContent() {
  const { t } = useTranslation()

  const benefits = [
    { icon: ClipboardCheck, title: t("referral.applyTitle"), desc: t("referral.applyDesc") },
    { icon: House, title: t("referral.homeTitle"), desc: t("referral.homeDesc") },
    { icon: Sparkles, title: t("referral.rewardsTitle"), desc: t("referral.rewardsDesc") },
  ]

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={t("referral.heroTitle")}
        description={t("referral.heroSubtitle")}
        pathname="/referral/"
      />

      <section className="mx-auto max-w-5xl px-4 pt-8 sm:pt-12">
        {/* Two homes joined by a string of lights: a friend bringing a friend. */}
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="aspect-[12/5] sm:aspect-[12/4]">
            <OndoMural scene="neighbors" />
          </div>
        </div>

        <div className="mt-8 max-w-2xl sm:mt-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {t("referral.heroTitle")}
          </h1>
          <p className="mt-4 text-lg text-foreground/80">{t("referral.heroSubtitle")}</p>

          {/* Depends on `?ref=`, so it resolves after hydration. */}
          <Suspense fallback={null}>
            <ReferralBonusBanner />
          </Suspense>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Suspense fallback={<ReferralSignupButtonFallback />}>
              <ReferralSignupButton />
            </Suspense>
            <Button asChild size="lg" variant="outline">
              <Link href="/properties/">{t("referral.browseHomes")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="benefits-heading" className="mx-auto max-w-5xl px-4 py-16">
        <h2 id="benefits-heading" className="text-2xl font-bold text-foreground">
          {t("referral.benefitsTitle")}
        </h2>
        <ul className="mt-6 grid gap-8 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="border-t border-border pt-5">
              <Icon className="h-5 w-5 text-foreground/70" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-foreground/70">{desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{t("referral.trustedTitle")}</h2>
            <p className="mt-1 text-foreground/70">{t("referral.trustedDesc")}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/contact/">{t("referral.contactCta")}</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
