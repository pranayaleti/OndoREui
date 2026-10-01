"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import { ChevronDown, Loader2, MessageCircle } from "lucide-react"
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
  useLeadSubmission,
  type ContactValues,
} from "@/components/lead-contact-fields"
import { getAttributionPayloadForApi, type MarketingAttribution } from "@/lib/attribution"
import type { ContactInquiryType, ContactLeadSource } from "@/lib/leads-api"
import { useRadioGroup } from "@/lib/use-radio-group"

/**
 * The /links lead form for visitors who won't book a call or browse: what they need,
 * how to reach them, one optional note. Collapsed until asked for so the page stays short.
 */
const NEEDS: readonly { value: string; label: string; inquiryType: ContactInquiryType }[] = [
  { value: "buy", label: "Buy a home", inquiryType: "buyer" },
  { value: "sell", label: "Sell a home", inquiryType: "seller" },
  { value: "loan", label: "Home loan or refinance", inquiryType: "other" },
  { value: "manage", label: "Rental management", inquiryType: "owner" },
  { value: "other", label: "Something else", inquiryType: "other" },
]

/** "social" when the visit came through a tagged social link; QR scans and direct visits count as website. */
function leadSource(attribution: MarketingAttribution | undefined): ContactLeadSource {
  const medium = attribution?.last?.utm_medium ?? attribution?.first?.utm_medium
  return medium === "social" ? "social" : "website"
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function LinksQuickMessage() {
  const [open, setOpen] = useState(false)
  const [need, setNeed] = useState<string>()
  const [note, setNote] = useState("")
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { status, error, send } = useLeadSubmission("links_quick_message")
  const formId = useId()
  const needLabelId = useId()
  const noteId = useId()
  const needErrorId = useId()
  const { groupProps, itemProps } = useRadioGroup(
    NEEDS.map((option) => option.value),
    need,
    setNeed,
  )

  const chosen = NEEDS.find((option) => option.value === need)
  // Errors show after the first Send and then follow the fields as they are fixed.
  const errors = submitted ? contactErrors(contact) : {}
  const needError = submitted && !chosen ? "Choose what you need." : undefined

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    if (!chosen || Object.keys(contactErrors(contact)).length > 0) {
      focusFirstInvalid(formRef.current)
      return
    }
    const attribution = getAttributionPayloadForApi()
    await send({
      ...contactPayload(contact),
      source: leadSource(attribution),
      inquiryType: chosen.inquiryType,
      message: [
        "Quick message from /links",
        `Need: ${chosen.label}`,
        note.trim() ? `Note: ${note.trim()}` : null,
        `OK to text: ${contact.textConsent ? "Yes" : "No"}`,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
      attribution,
    })
  }

  if (status === "sent") {
    const firstName = contact.name.trim().split(/\s+/)[0]
    return (
      <div className="mb-3">
        <LeadSentNotice>
          Got it, {firstName}. I&apos;ll reach out within one business day.
        </LeadSentNotice>
      </div>
    )
  }

  return (
    <div className="mb-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={formId}
        onClick={() => setOpen((value) => !value)}
        className={`flex min-h-[3.5rem] w-full items-center justify-between gap-3 rounded-2xl border border-primary/70 bg-card px-4 py-3 text-left text-[0.95rem] font-medium transition-colors hover:bg-muted/60 ${focusRing}`}
      >
        <span className="flex items-center gap-2.5">
          <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
          Send me a quick message
        </span>
        <ChevronDown className={`h-4 w-4 opacity-70 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open ? (
        <form
          id={formId}
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="mt-2 rounded-2xl border border-primary/70 bg-card p-4"
        >
          <p id={needLabelId} className="text-sm font-medium">
            What do you need?
          </p>
          <div
            role="radiogroup"
            aria-labelledby={needLabelId}
            aria-required="true"
            aria-invalid={needError ? true : undefined}
            aria-describedby={needError ? needErrorId : undefined}
            tabIndex={-1}
            className="mt-2 flex flex-wrap gap-2 focus:outline-none"
            {...groupProps}
          >
            {NEEDS.map((option) => {
              const selected = option.value === need
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setNeed(option.value)}
                  {...itemProps(option.value)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${focusRing} ${
                    selected ? "border-primary bg-primary/15 text-foreground" : "border-border text-foreground/85 hover:border-primary/60"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          <FieldError id={needErrorId} message={needError} />

          <div className="mt-4">
            <LeadContactFields value={contact} onChange={setContact} consentLabel="Text me back." errors={errors} />
          </div>

          <div className="mt-3">
            <label htmlFor={noteId} className="text-sm font-medium">
              Anything we should know? (optional)
            </label>
            <textarea
              id={noteId}
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className={leadInputClass}
            />
          </div>

          <LeadFormError message={error} />
          <button
            type="submit"
            disabled={status === "sending"}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
          >
            {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Send
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">I reply within one business day. No spam.</p>
        </form>
      ) : null}
    </div>
  )
}
