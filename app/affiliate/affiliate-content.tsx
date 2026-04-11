"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import {
  CheckCircle2,
  Gift,
  Share2,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { backendUrl } from "@/lib/backend"

const affiliateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  website: z.string().optional(),
  audienceSize: z.enum(["under_100", "100_500", "500_2000", "2000_plus"]),
  why: z.string().optional(),
})

type AffiliateFormValues = z.infer<typeof affiliateSchema>

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-foreground"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-foreground/60 shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-foreground/60 shrink-0" aria-hidden />
        )}
      </button>
      {open && (
        <p className="mt-3 text-sm text-foreground/70">{answer}</p>
      )}
    </div>
  )
}

export function AffiliateContent() {
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: { audienceSize: "under_100" },
  })

  const onSubmit = async (values: AffiliateFormValues) => {
    setServerError(null)
    try {
      const res = await fetch(backendUrl("/api/referrals/affiliate/apply"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}))
        setServerError(data.error ?? t("affiliate.submitError"))
        return
      }
      setSubmitted(true)
    } catch {
      setServerError(t("affiliate.submitError"))
    }
  }

  const steps = [
    { icon: ClipboardCheck, label: t("affiliate.step1"), desc: t("affiliate.step1Desc") },
    { icon: CheckCircle2, label: t("affiliate.step2"), desc: t("affiliate.step2Desc") },
    { icon: Share2, label: t("affiliate.step3"), desc: t("affiliate.step3Desc") },
  ]

  const benefits = [
    { title: t("affiliate.benefit1Title"), desc: t("affiliate.benefit1Desc") },
    { title: t("affiliate.benefit2Title"), desc: t("affiliate.benefit2Desc") },
    { title: t("affiliate.benefit3Title"), desc: t("affiliate.benefit3Desc") },
  ]

  const faqs = [
    { q: t("affiliate.faq1Q"), a: t("affiliate.faq1A") },
    { q: t("affiliate.faq2Q"), a: t("affiliate.faq2A") },
    { q: t("affiliate.faq3Q"), a: t("affiliate.faq3A") },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-red-800 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-card/70 px-4 py-1.5 text-sm font-medium text-white">
            <Gift className="h-4 w-4" aria-hidden="true" />
            <span>{t("affiliate.heroBadge")}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {t("affiliate.heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            {t("affiliate.heroSubtitle")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-16">
        {/* How it works */}
        <section aria-labelledby="how-it-works-heading">
          <h2
            id="how-it-works-heading"
            className="mb-10 text-center text-2xl font-bold text-foreground"
          >
            {t("affiliate.howItWorksTitle")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="flex flex-col items-center text-center">
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{label}</h3>
                <p className="text-sm text-foreground/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section aria-labelledby="benefits-heading">
          <h2
            id="benefits-heading"
            className="mb-8 text-center text-2xl font-bold text-foreground"
          >
            {t("affiliate.benefitsTitle")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-foreground/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application form */}
        <section aria-labelledby="form-heading">
          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 shadow-sm">
            <h2
              id="form-heading"
              className="mb-6 text-xl font-bold text-foreground"
            >
              {t("affiliate.formTitle")}
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("affiliate.successTitle")}
                </h3>
                <p className="text-sm text-foreground/70">{t("affiliate.successDesc")}</p>
                <Button asChild variant="outline">
                  <Link href="/">{t("affiliate.backHome")}</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label
                    htmlFor="aff-name"
                    className="block text-sm font-medium text-foreground"
                  >
                    {t("affiliate.nameLabel")} *
                  </label>
                  <input
                    id="aff-name"
                    type="text"
                    autoComplete="name"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{t("affiliate.nameRequired")}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="aff-email"
                    className="block text-sm font-medium text-foreground"
                  >
                    {t("affiliate.emailLabel")} *
                  </label>
                  <input
                    id="aff-email"
                    type="email"
                    autoComplete="email"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{t("affiliate.emailInvalid")}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="aff-website"
                    className="block text-sm font-medium text-foreground"
                  >
                    {t("affiliate.websiteLabel")}
                  </label>
                  <input
                    id="aff-website"
                    type="url"
                    autoComplete="url"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    placeholder="https://"
                    {...register("website")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="aff-audience"
                    className="block text-sm font-medium text-foreground"
                  >
                    {t("affiliate.audienceSizeLabel")} *
                  </label>
                  <select
                    id="aff-audience"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    {...register("audienceSize")}
                  >
                    <option value="under_100">{t("affiliate.audienceUnder100")}</option>
                    <option value="100_500">{t("affiliate.audience100_500")}</option>
                    <option value="500_2000">{t("affiliate.audience500_2000")}</option>
                    <option value="2000_plus">{t("affiliate.audience2000Plus")}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="aff-why"
                    className="block text-sm font-medium text-foreground"
                  >
                    {t("affiliate.whyLabel")}
                  </label>
                  <textarea
                    id="aff-why"
                    rows={4}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    {...register("why")}
                  />
                </div>

                {serverError && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-700 hover:from-orange-600 hover:to-red-800 text-white border-0"
                >
                  {isSubmitting ? t("affiliate.submitting") : t("affiliate.submitBtn")}
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mx-auto max-w-2xl">
          <h2
            id="faq-heading"
            className="mb-6 text-2xl font-bold text-foreground"
          >
            {t("affiliate.faqTitle")}
          </h2>
          {faqs.map(({ q, a }) => (
            <FaqItem key={q} question={q} answer={a} />
          ))}
        </section>
      </div>
    </main>
  )
}
