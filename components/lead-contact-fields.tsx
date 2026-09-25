"use client"

import { useId, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { analytics } from "@/lib/analytics"
import { submitContactLead, type SubmitContactLeadPayload } from "@/lib/leads-api"
import { isValidEmail } from "@/lib/security"

/**
 * Name, email, phone and texting consent, shared by the homebuyer quiz follow-up,
 * the Loan Estimate second look and the refinance rate watch. Texting consent is its
 * own unchecked box so nobody is opted in to texts just by asking a question.
 */
export type ContactValues = { name: string; email: string; phone: string; textConsent: boolean }

export const EMPTY_CONTACT: ContactValues = { name: "", email: "", phone: "", textConsent: false }

export function contactIsComplete(contact: ContactValues): boolean {
  return contact.name.trim().length > 0 && isValidEmail(contact.email.trim())
}

export function contactPayload(contact: ContactValues): Pick<SubmitContactLeadPayload, "name" | "email" | "phone"> {
  return {
    name: contact.name.trim(),
    email: contact.email.trim().toLowerCase(),
    phone: contact.phone.trim() || undefined,
  }
}

export const leadInputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"

export function LeadContactFields({
  value,
  onChange,
  consentLabel,
}: {
  value: ContactValues
  onChange: (next: ContactValues) => void
  consentLabel: string
}) {
  const ids = { name: useId(), email: useId(), phone: useId(), consent: useId() }
  const set = (patch: Partial<ContactValues>) => onChange({ ...value, ...patch })

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={ids.name} className="text-sm font-medium">
          Name
        </label>
        <input id={ids.name} value={value.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" className={leadInputClass} />
      </div>
      <div>
        <label htmlFor={ids.email} className="text-sm font-medium">
          Email
        </label>
        <input
          id={ids.email}
          type="email"
          value={value.email}
          onChange={(e) => set({ email: e.target.value })}
          autoComplete="email"
          className={leadInputClass}
        />
      </div>
      <div>
        <label htmlFor={ids.phone} className="text-sm font-medium">
          Phone (optional)
        </label>
        <input
          id={ids.phone}
          type="tel"
          value={value.phone}
          onChange={(e) => set({ phone: e.target.value })}
          autoComplete="tel"
          className={leadInputClass}
        />
      </div>
      <div className="flex items-start gap-2.5">
        <input
          id={ids.consent}
          type="checkbox"
          checked={value.textConsent}
          onChange={(e) => set({ textConsent: e.target.checked })}
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />
        <label htmlFor={ids.consent} className="text-xs leading-relaxed text-muted-foreground">
          {consentLabel} Message and data rates may apply. Reply STOP to opt out.
        </label>
      </div>
    </div>
  )
}

/** Posts through lib/leads-api (attribution included by the caller) and tracks the outcome. */
export function useLeadSubmission(formName: string) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  async function send(payload: SubmitContactLeadPayload) {
    if (status === "sending") return
    setStatus("sending")
    setError(null)
    const result = await submitContactLead(payload)
    if ("error" in result) {
      setError(result.error || "That didn't go through. Call or text us instead.")
      setStatus("idle")
      analytics.trackFormSubmission(formName, false)
      return
    }
    setStatus("sent")
    analytics.trackFormSubmission(formName, true)
    analytics.trackLeadGeneration(formName)
  }

  return { status, error, send }
}

export function LeadFormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-destructive-emphasis" role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      {message}
    </p>
  )
}

export function LeadSentNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5" role="status">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  )
}
