"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { SITE_EMAILS } from "@/lib/site"

type FormState = "idle" | "loading" | "success" | "error"

export function DemoForm() {
  const { t } = useTranslation()
  const [state, setState] = useState<FormState>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState("loading")
    const fd = new FormData(e.currentTarget)
    const firstName = fd.get("firstName") as string
    const lastName = fd.get("lastName") as string
    const email = fd.get("email") as string
    const phone = (fd.get("phone") as string) || undefined
    const role = fd.get("role") as string
    const units = fd.get("units") as string
    const time = fd.get("time") as string

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/leads/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${firstName} ${lastName}`,
            email,
            phone,
            source: "website-demo",
            message: `Demo request - Role: ${role}, Units: ${units || "not specified"}, Preferred time: ${time || "not specified"}`,
          }),
        }
      )
      setState(res.ok ? "success" : "error")
    } catch {
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
        <p className="text-sm text-destructive">
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
