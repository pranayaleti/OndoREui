"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { SITE_EMAILS } from "@/lib/site"
import { postJson } from "@/lib/api/http"
import { analytics } from "@/lib/analytics"
import { useAntiSpam } from "@/lib/anti-spam"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { splitPhoneForLead } from "@/lib/consultation-lead"
import { buildLeadMessage, type ContactInquiryType } from "@/lib/leads-api"

type FormState = "idle" | "loading" | "success" | "error"

const INQUIRY_TYPE_BY_ROLE: Record<string, ContactInquiryType> = {
  Owner: "owner",
  Tenant: "renter",
}

export function DemoForm() {
  const { t } = useTranslation()
  const [state, setState] = useState<FormState>("idle")
  const { honeypotProps, gate } = useAntiSpam()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // A filled honeypot or an instant submit is a bot. Show success so it cannot probe the gate.
    if (gate.isLikelyBot()) {
      gate.recordAttempt()
      setState("success")
      return
    }
    setState("loading")
    const fd = new FormData(e.currentTarget)
    const firstName = fd.get("firstName") as string
    const lastName = fd.get("lastName") as string
    const email = fd.get("email") as string
    const rawPhone = (fd.get("phone") as string) || ""
    const role = fd.get("role") as string
    const units = fd.get("units") as string
    const time = fd.get("time") as string

    try {
      // The API only accepts its fixed source list, so the demo request is
      // identified in the message rather than by a custom source.
      const { phone, note } = splitPhoneForLead(rawPhone)
      const attribution = getAttributionPayloadForApi()
      await postJson("/api/leads/contact", {
        name: `${firstName} ${lastName}`.trim(),
        email,
        ...(phone && { phone }),
        source: "website",
        inquiryType: INQUIRY_TYPE_BY_ROLE[role] ?? "other",
        message: buildLeadMessage([
          ["Request", "Guided demo"],
          ["Role", role],
          ["Units", units || "not specified"],
          ["Preferred time", time || "not specified"],
          ["Phone (as typed)", note],
        ]),
        ...(attribution && { attribution }),
      })
      analytics.trackFormSubmission("demo_request", true)
      analytics.trackLeadGeneration("demo_request")
      setState("success")
    } catch {
      analytics.trackFormSubmission("demo_request", false)
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-lg bg-muted border border-border p-6 text-center">
        <p className="text-foreground font-medium">{t("demo.form.success")}</p>
      </div>
    )
  }

  const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot: visually hidden, not focusable. Bots fill it; humans don't. */}
      <input {...honeypotProps} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">{t("demo.form.firstNameLabel")}</label>
          <input id="firstName" name="firstName" required className={inputClass} placeholder={t("demo.form.firstNamePlaceholder")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">{t("demo.form.lastNameLabel")}</label>
          <input id="lastName" name="lastName" required className={inputClass} placeholder={t("demo.form.lastNamePlaceholder")} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-foreground">{t("demo.form.emailLabel")}</label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder={t("demo.form.emailPlaceholder")} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">{t("demo.form.phoneLabel")}</label>
        <input id="phone" name="phone" type="tel" className={inputClass} placeholder={t("demo.form.phonePlaceholder")} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="role" className="text-sm font-medium text-foreground">{t("demo.form.roleLabel")}</label>
        <select id="role" name="role" className={inputClass}>
          <option value="Owner">{t("demo.form.roleOptions.owner")}</option>
          <option value="Investor">{t("demo.form.roleOptions.investor")}</option>
          <option value="Property Manager">{t("demo.form.roleOptions.propertyManager")}</option>
          <option value="Tenant">{t("demo.form.roleOptions.tenant")}</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="units" className="text-sm font-medium text-foreground">{t("demo.form.unitsLabel")}</label>
        <input id="units" name="units" className={inputClass} placeholder={t("demo.form.unitsPlaceholder")} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="time" className="text-sm font-medium text-foreground">{t("demo.form.timeLabel")}</label>
        <input id="time" name="time" className={inputClass} placeholder={t("demo.form.timePlaceholder")} />
      </div>

      {state === "error" && (
        // role="alert" so the failure is announced: without it a screen-reader
        // user submits, nothing is spoken, and the form looks like it worked.
        <p role="alert" className="text-sm text-destructive-emphasis">
          {t("demo.form.error")}{" "}
          <a href={`mailto:${SITE_EMAILS.primary}`} className="underline">{SITE_EMAILS.primary}</a>{" "}
          {t("demo.form.errorSuffix")}
        </p>
      )}

      <Button type="submit" size="lg" disabled={state === "loading"}>
        {state === "loading" ? t("demo.form.submitting") : t("demo.form.submit")}
      </Button>
    </form>
  )
}
