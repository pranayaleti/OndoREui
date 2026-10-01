"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { analytics } from "@/lib/analytics"
import { submitContactLead, type SubmitContactLeadPayload } from "@/lib/leads-api"
import { isValidEmail } from "@/lib/security"
import { textConsentText } from "@/lib/text-consent"

/**
 * Name, email, phone and texting consent, shared by the homebuyer quiz follow-up,
 * the Loan Estimate second look and the refinance rate watch. Texting consent is its
 * own unchecked box so nobody is opted in to texts just by asking a question.
 */
export type ContactValues = {
  name: string
  email: string
  phone: string
  textConsent: boolean
  /** The consent wording shown and when the box was checked, sent with the lead (lib/text-consent). */
  consentText?: string
  consentAt?: string
}

export const EMPTY_CONTACT: ContactValues = { name: "", email: "", phone: "", textConsent: false }

/** What is wrong with the name and email, keyed by field. Empty when the contact is complete. */
export type ContactErrors = { name?: string; email?: string; phone?: string }

export function contactErrors(contact: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  if (contact.name.trim().length === 0) errors.name = "Enter your name."
  const email = contact.email.trim()
  if (email.length === 0) errors.email = "Enter your email."
  else if (!isValidEmail(email)) errors.email = "Enter a valid email, like name@example.com."
  if (contact.textConsent && contact.phone.trim().length === 0) errors.phone = "Enter your phone number so we can text you."
  return errors
}

export function contactIsComplete(contact: ContactValues): boolean {
  return Object.keys(contactErrors(contact)).length === 0
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

/** Inline message under a field. The field points at it with aria-describedby. */
export function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-sm text-destructive-emphasis">
      {message}
    </p>
  )
}

/**
 * Props that mark a field as required and, once it has an error, invalid and linked to its
 * message. Forms use noValidate, so this is for assistive tech; the message is the visible part.
 */
export function requiredFieldProps(errorId: string, message: string | undefined) {
  return {
    required: true,
    "aria-required": true as const,
    "aria-invalid": message ? (true as const) : undefined,
    "aria-describedby": message ? errorId : undefined,
  }
}

/**
 * After a failed submit, move focus to the first field marked invalid. Waits a tick so the
 * error state has rendered.
 */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  setTimeout(() => form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0)
}

export function LeadContactFields({
  value,
  onChange,
  topic,
  errors = {},
}: {
  value: ContactValues
  onChange: (next: ContactValues) => void
  /** What the texts and calls are about, in the consent sentence: "your loan", "rate changes". */
  topic: string
  errors?: ContactErrors
}) {
  const ids = { name: useId(), email: useId(), phone: useId(), consent: useId() }
  const set = (patch: Partial<ContactValues>) => onChange({ ...value, ...patch })
  const consentText = textConsentText(topic)

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={ids.name} className="text-sm font-medium">
          Name
        </label>
        <input
          id={ids.name}
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          autoComplete="name"
          className={leadInputClass}
          {...requiredFieldProps(`${ids.name}-error`, errors.name)}
        />
        <FieldError id={`${ids.name}-error`} message={errors.name} />
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
          {...requiredFieldProps(`${ids.email}-error`, errors.email)}
        />
        <FieldError id={`${ids.email}-error`} message={errors.email} />
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
          {...(errors.phone
            ? { "aria-invalid": true as const, "aria-describedby": `${ids.phone}-error` }
            : {})}
        />
        <FieldError id={`${ids.phone}-error`} message={errors.phone} />
      </div>
      <div className="flex items-start gap-2.5">
        <input
          id={ids.consent}
          type="checkbox"
          checked={value.textConsent}
          onChange={(e) =>
            set(
              e.target.checked
                ? { textConsent: true, consentText, consentAt: new Date().toISOString() }
                : { textConsent: false, consentText: undefined, consentAt: undefined },
            )
          }
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />
        <label htmlFor={ids.consent} className="text-xs leading-relaxed text-muted-foreground">
          {consentText} See our{" "}
          <Link href="/privacy-policy/" className="underline hover:text-foreground">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-service/" className="underline hover:text-foreground">
            Terms of Use
          </Link>
          .
        </label>
      </div>
    </div>
  )
}

/** Posts through lib/leads-api (attribution included by the caller) and tracks the outcome. */
export function useLeadSubmission(formName: string) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [error, setError] = useState<string | null>(null)

  /** Resolves true once the lead is saved, so callers can record follow-up analytics. */
  async function send(payload: SubmitContactLeadPayload): Promise<boolean> {
    if (status === "sending") return false
    setStatus("sending")
    setError(null)
    const result = await submitContactLead(payload)
    if ("error" in result) {
      setError(result.error || "That didn't go through. Call or text us instead.")
      setStatus("idle")
      analytics.trackFormSubmission(formName, false)
      return false
    }
    setStatus("sent")
    analytics.trackFormSubmission(formName, true)
    analytics.trackLeadGeneration(formName)
    return true
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
