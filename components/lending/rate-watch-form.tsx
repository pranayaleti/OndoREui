"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import {
  EMPTY_CONTACT,
  FieldError,
  LeadContactFields,
  LeadFormError,
  LeadSentNotice,
  contactErrors,
  contactPayload,
  focusFirstInvalid,
  leadInputClass,
  requiredFieldProps,
  useLeadSubmission,
  type ContactValues,
} from "@/components/lead-contact-fields"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { withConsentRecord } from "@/lib/text-consent"
import { parseOptionalAmount, rateWatchMessage } from "@/lib/lending-leads"

export function RateWatchForm() {
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const [currentRate, setCurrentRate] = useState("")
  const [targetRate, setTargetRate] = useState("")
  const [balance, setBalance] = useState("")
  const [city, setCity] = useState("")
  const { status, error, send } = useLeadSubmission("refinance_rate_watch")
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const idPrefix = useId()

  const parsedCurrentRate = parseOptionalAmount(currentRate)
  const rateIsValid = parsedCurrentRate !== undefined && parsedCurrentRate > 0
  // Errors show after the first submit and then follow the fields as they are fixed.
  const errors = submitted ? contactErrors(contact) : {}
  const rateError = submitted && !rateIsValid ? "Enter your current rate, like 7.25." : undefined

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(contactErrors(contact)).length > 0 || !rateIsValid) {
      focusFirstInvalid(formRef.current)
      return
    }
    await send({
      ...contactPayload(contact),
      source: "website",
      inquiryType: "other",
      message: withConsentRecord(
        rateWatchMessage(
          {
            currentRate: parsedCurrentRate,
            targetRate: parseOptionalAmount(targetRate),
            balance: parseOptionalAmount(balance),
            city,
          },
          contact.textConsent,
        ),
        contact,
      ),
      attribution: getAttributionPayloadForApi(),
    })
  }

  if (status === "sent") {
    return <LeadSentNotice>You&apos;re on the list. We&apos;ll reach out when rates get close to your number.</LeadSentNotice>
  }

  const fieldId = (key: string) => `${idPrefix}-${key}`

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("current")} className="text-sm font-medium">
            Current interest rate (%)
          </label>
          <input
            id={fieldId("current")}
            inputMode="decimal"
            autoComplete="off"
            value={currentRate}
            onChange={(e) => setCurrentRate(e.target.value)}
            className={leadInputClass}
            {...requiredFieldProps(fieldId("current-error"), rateError)}
          />
          <FieldError id={fieldId("current-error")} message={rateError} />
        </div>
        <div>
          <label htmlFor={fieldId("target")} className="text-sm font-medium">
            Rate that makes it worth it (%)
          </label>
          <input
            id={fieldId("target")}
            inputMode="decimal"
            autoComplete="off"
            value={targetRate}
            onChange={(e) => setTargetRate(e.target.value)}
            className={leadInputClass}
          />
        </div>
        <div>
          <label htmlFor={fieldId("balance")} className="text-sm font-medium">
            Loan balance, roughly ($, optional)
          </label>
          <input
            id={fieldId("balance")}
            inputMode="numeric"
            autoComplete="off"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className={leadInputClass}
          />
        </div>
        <div>
          <label htmlFor={fieldId("city")} className="text-sm font-medium">
            City (optional)
          </label>
          <input id={fieldId("city")} value={city} onChange={(e) => setCity(e.target.value)} className={leadInputClass} />
        </div>
      </div>

      <LeadContactFields value={contact} onChange={setContact} topic="mortgage rate changes" errors={errors} />

      <LeadFormError message={error} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Add me to the watch list
      </button>
    </form>
  )
}
