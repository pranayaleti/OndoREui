"use client"

import { ArrowRight, CirclePlay, KeyRound, LayoutDashboard, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DEMO_DASHBOARD_URL, DEMO_VIDEO_EMBED_URL } from "@/lib/site"
import { DemoForm } from "./demo-form"

type DemoRoleKey = "manager" | "owner" | "tenant"

const roleIcons = {
  manager: LayoutDashboard,
  owner: ShieldCheck,
  tenant: KeyRound,
} satisfies Record<DemoRoleKey, typeof LayoutDashboard>

function getDemoLoginUrl() {
  if (!DEMO_DASHBOARD_URL) return ""
  return DEMO_DASHBOARD_URL.endsWith("/login")
    ? DEMO_DASHBOARD_URL
    : `${DEMO_DASHBOARD_URL}/login`
}

export function DemoPageClient() {
  const { t } = useTranslation()
  const demoLoginUrl = getDemoLoginUrl()

  const roles: Array<{
    key: DemoRoleKey
    email: string
    password: string
  }> = [
    { key: "manager", email: "admin@ondorealestate.com", password: "ondo1234" },
    { key: "owner", email: "owner@ondorealestate.com", password: "ondo1234" },
    { key: "tenant", email: "tenant@ondorealestate.com", password: "ondo1234" },
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Platform Demo | Ondo Real Estate"
        description="Explore the Ondo self-serve demo, watch the walkthrough video, and use seeded Manager, Owner, and Tenant demo accounts."
        pathname="/demo"
      />

      <PageBanner
        title={t("demo.bannerTitle")}
        subtitle={t("demo.bannerSubtitle")}
        backgroundImage="/property-manager-meeting.webp"
      />

      <section className="bg-background py-16">
        <div className="container mx-auto flex max-w-6xl flex-col gap-12 px-4">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  {t("demo.heroKicker")}
                </p>
                <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                  {t("demo.heroTitle")}
                </h2>
                <p className="max-w-2xl text-base leading-7 text-foreground/75 md:text-lg">
                  {t("demo.heroBody")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {demoLoginUrl ? (
                  <Button asChild size="lg">
                    <a href={demoLoginUrl} target="_blank" rel="noreferrer">
                      {t("demo.openLiveDemo")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
                <Button asChild size="lg" variant={demoLoginUrl ? "outline" : "default"}>
                  <a href="#guided-demo">{t("demo.bookGuidedDemo")}</a>
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card/80 p-4 text-sm text-foreground/70">
                {t("demo.heroAvailability")}
              </div>
            </div>

            <Card className="overflow-hidden border-border shadow-lg">
              <CardHeader className="border-b border-border bg-muted/60">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CirclePlay className="h-5 w-5 text-primary" />
                  {t("demo.videoTitle")}
                </CardTitle>
                <CardDescription>{t("demo.videoBody")}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {DEMO_VIDEO_EMBED_URL ? (
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={DEMO_VIDEO_EMBED_URL}
                      title={t("demo.videoEmbedTitle")}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-center text-white">
                    <CirclePlay className="h-12 w-12 text-orange-300" />
                    <div className="space-y-2">
                      <p className="text-xl font-semibold">{t("demo.videoFallbackTitle")}</p>
                      <p className="mx-auto max-w-md text-sm text-white/75">
                        {t("demo.videoFallbackBody")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{t("demo.credentialsTitle")}</h2>
              <p className="text-foreground/70">{t("demo.credentialsBody")}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {roles.map(({ key, email, password }) => {
                const Icon = roleIcons[key]
                return (
                  <Card key={key} className="border-border bg-card/90">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/65">
                          {t(`demo.roles.${key}.badge`)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{t(`demo.roles.${key}.title`)}</CardTitle>
                        <CardDescription>{t(`demo.roles.${key}.description`)}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="space-y-2 rounded-xl border border-border bg-muted/50 p-4 text-sm">
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-foreground/60">{t("demo.labels.email")}</span>
                          <span className="font-mono text-right text-foreground">{email}</span>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-foreground/60">{t("demo.labels.password")}</span>
                          <span className="font-mono text-right text-foreground">{password}</span>
                        </div>
                      </div>

                      <ul className="space-y-3 text-sm text-foreground/75">
                        {[1, 2, 3].map((index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                            <span>{t(`demo.roles.${key}.feature${index}`)}</span>
                          </li>
                        ))}
                      </ul>

                      {demoLoginUrl ? (
                        <Button asChild variant="outline" className="w-full">
                          <a href={demoLoginUrl} target="_blank" rel="noreferrer">
                            {t("demo.openRoleLogin")}
                          </a>
                        </Button>
                      ) : null}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="max-w-3xl space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{t("demo.galleryTitle")}</h2>
              <p className="text-foreground/70">{t("demo.galleryBody")}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {roles.map(({ key }) => (
                <Card key={`preview-${key}`} className="overflow-hidden border-border bg-card/90">
                  <div className="flex items-center justify-between border-b border-border bg-slate-950 px-4 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs font-medium text-white/65">
                      {t(`demo.roles.${key}.previewTitle`)}
                    </span>
                  </div>
                  <CardContent className="space-y-5 bg-gradient-to-br from-background via-background to-muted/70 p-6">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                        {t("demo.previewEyebrow")}
                      </p>
                      <h3 className="text-xl font-semibold text-foreground">
                        {t(`demo.roles.${key}.previewHeadline`)}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {t(`demo.roles.${key}.previewBody`)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2].map((index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-border bg-card px-4 py-3"
                        >
                          <p className="text-xs uppercase tracking-wide text-foreground/50">
                            {t(`demo.roles.${key}.stat${index}Label`)}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-foreground">
                            {t(`demo.roles.${key}.stat${index}Value`)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {[1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
                        >
                          <span className="text-foreground/75">
                            {t(`demo.roles.${key}.previewItem${index}`)}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            {t("demo.previewLiveSlot")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="border-border bg-muted/40">
            <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{t("demo.sandboxTitle")}</h2>
                <p className="max-w-3xl text-sm leading-6 text-foreground/75">
                  {t("demo.sandboxBody")}
                </p>
              </div>
              {demoLoginUrl ? (
                <Button asChild variant="outline">
                  <a href={demoLoginUrl} target="_blank" rel="noreferrer">
                    {t("demo.openLiveDemo")}
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <section id="guided-demo" className="grid gap-10 rounded-3xl border border-border bg-card p-6 shadow-sm lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {t("demo.guidedKicker")}
              </p>
              <h2 className="text-3xl font-bold text-foreground">{t("demo.guidedTitle")}</h2>
              <p className="text-base leading-7 text-foreground/75">{t("demo.guidedBody")}</p>
            </div>
            <div>
              <DemoForm />
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
