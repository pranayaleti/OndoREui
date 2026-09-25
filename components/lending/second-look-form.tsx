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
import { CREDIT_BANDS } from "@/lib/homebuyer-quiz"
import {
  CASH_SOURCES,
  NEW_CONSTRUCTION_OPTIONS,
  parseOptionalAmount,
  secondLookMessage,
  type SecondLookAnswers,
} from "@/lib/lending-leads"

type NumberKey = "interestRate" | "points" | "originationCharges" | "apr" | "cashToClose"

/** Where each number sits on the standard CFPB Loan Estimate, so buyers can find it fast. */
const NUMBER_FIELDS: readonly { key: NumberKey; label: string; hint: string }[] = [
  { key: "interestRate", label: "Interest rate (%)", hint: "Page 1, Loan Terms" },
  { key: "points", label: "Points ($)", hint: "Page 2, Section A, the \"% of loan amount (points)\" line" },
  { key: "originationCharges", label: "Origination charges ($)", hint: "Page 2, the Section A total" },
  { key: "apr", label: "APR (%)", hint: "Page 3, Comparisons" },
  { key: "cashToClose", label: "Estimated cash to close ($)", hint: "Page 1, Costs at Closing" },
]

const selectClass = leadInputClass

export function SecondLookForm() {
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const [closingDate, setClosingDate] = useState("")
  const [numbers, setNumbers] = useState<Record<NumberKey, string>>({
    interestRate: "",
    points: "",
    originationCharges: "",
    apr: "",
    cashToClose: "",
  })
  const [credit, setCredit] = useState<SecondLookAnswers["credit"]>("unsure")
  const [cashSource, setCashSource] = useState<SecondLookAnswers["cashSource"]>("savings")
  const [newConstruction, setNewConstruction] = useState<SecondLookAnswers["newConstruction"]>("unsure")
  const [notes, setNotes] = useState("")
  const { status, error, send } = useLeadSubmission("loan_estimate_second_look")
  const idPrefix = useId()

  const canSend = contactIsComplete(contact) && /^\d{4}-\d{2}-\d{2}$/.test(closingDate)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSend) return
    const answers: SecondLookAnswers = {
      closingDate,
      interestRate: parseOptionalAmount(numbers.interestRate),
      points: parseOptionalAmount(numbers.points),
      originationCharges: parseOptionalAmount(numbers.originationCharges),
      apr: parseOptionalAmount(numbers.apr),
      cashToClose: parseOptionalAmount(numbers.cashToClose),
      credit,
      cashSource,
      newConstruction,
      notes,
    }
    await send({
      ...contactPayload(contact),
      source: "website",
      inquiryType: "buyer",
      message: secondLookMessage(answers, contact.textConsent),
      attribution: getAttributionPayloadForApi(),
    })
  }

  if (status === "sent") {
    return <LeadSentNotice>Got it. A loan officer will reach out within one business day, ahead of your closing date.</LeadSentNotice>
  }

  const fieldId = (key: string) => `${idPrefix}-${key}`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <LeadContactFields value={contact} onChange={setContact} consentLabel="Text me about my loan." />

      <div>
        <label htmlFor={fieldId("closing")} className="text-sm font-medium">
          Closing date
        </label>
        <input
          id={fieldId("closing")}
          type="date"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          className={leadInputClass}
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">From your Loan Estimate (skip any you don&apos;t have handy)</legend>
        {NUMBER_FIELDS.map((field) => (
          <div key={field.key}>
            <label htmlFor={fieldId(field.key)} className="text-sm">
              {field.label}
            </label>
            <input
              id={fieldId(field.key)}
              inputMode="decimal"
              autoComplete="off"
              aria-describedby={`${fieldId(field.key)}-hint`}
              value={numbers[field.key]}
              onChange={(e) => setNumbers((current) => ({ ...current, [field.key]: e.target.value }))}
              className={leadInputClass}
            />
            <p id={`${fieldId(field.key)}-hint`} className="mt-1 text-xs text-muted-foreground">
              {field.hint}
            </p>
          </div>
        ))}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("credit")} className="text-sm font-medium">
            Credit score, roughly
          </label>
          <select id={fieldId("credit")} value={credit} onChange={(e) => setCredit(e.target.value as SecondLookAnswers["credit"])} className={selectClass}>
            {CREDIT_BANDS.map((band) => (
              <option key={band.value} value={band.value}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={fieldId("cash")} className="text-sm font-medium">
            Cash to close comes from
          </label>
          <select
            id={fieldId("cash")}
            value={cashSource}
            onChange={(e) => setCashSource(e.target.value as SecondLookAnswers["cashSource"])}
            className={selectClass}
          >
            {CASH_SOURCES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={fieldId("construction")} className="text-sm font-medium">
            New construction?
          </label>
          <select
            id={fieldId("construction")}
            value={newConstruction}
            onChange={(e) => setNewConstruction(e.target.value as SecondLookAnswers["newConstruction"])}
            className={selectClass}
          >
            {NEW_CONSTRUCTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("notes")} className="text-sm font-medium">
          Anything else we should know? (optional)
        </label>
        <textarea id={fieldId("notes")} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={leadInputClass} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Please don&apos;t upload or paste your whole Loan Estimate here. If we need the PDF, we&apos;ll send you a secure way
        to share it.
      </p>

      <LeadFormError message={error} />
      <button
        type="submit"
        disabled={!canSend || status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Get my second look
      </button>
    </form>
  )
}
