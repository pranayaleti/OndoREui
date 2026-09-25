"use client"

import { useId, useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import {
  EMPTY_CONTACT,
  LeadContactFields,
  LeadFormError,
  LeadSentNotice,
  contactIsComplete,
  contactPayload,
  leadInputClass,
  useLeadSubmission,
  type ContactValues,
} from "@/components/lead-contact-fields"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { parseOptionalAmount, rateWatchMessage } from "@/lib/lending-leads"

export function RateWatchForm() {
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const [currentRate, setCurrentRate] = useState("")
  const [targetRate, setTargetRate] = useState("")
  const [balance, setBalance] = useState("")
  const [city, setCity] = useState("")
  const { status, error, send } = useLeadSubmission("refinance_rate_watch")
  const idPrefix = useId()

  const parsedCurrentRate = parseOptionalAmount(currentRate)
  const canSend = contactIsComplete(contact) && parsedCurrentRate !== undefined && parsedCurrentRate > 0

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSend || parsedCurrentRate === undefined) return
    await send({
      ...contactPayload(contact),
      source: "website",
      inquiryType: "other",
      message: rateWatchMessage(
        {
          currentRate: parsedCurrentRate,
          targetRate: parseOptionalAmount(targetRate),
          balance: parseOptionalAmount(balance),
          city,
        },
        contact.textConsent,
      ),
      attribution: getAttributionPayloadForApi(),
    })
  }

  if (status === "sent") {
    return <LeadSentNotice>You&apos;re on the list. We&apos;ll reach out when rates get close to your number.</LeadSentNotice>
  }

  const fieldId = (key: string) => `${idPrefix}-${key}`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
          />
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

      <LeadContactFields value={contact} onChange={setContact} consentLabel="Text me when rates move." />

      <LeadFormError message={error} />
      <button
        type="submit"
        disabled={!canSend || status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Add me to the watch list
      </button>
    </form>
  )
}
