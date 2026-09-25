"use client"

/**
 * Public lead qualifier behind /get-matched (the "60-second quiz" on /links).
 *
 * One tap per answer, and a question only when it applies: rental owners and
 * investors get the unit count, everyone else skips it. Rental owners ready within
 * 30 days (hot) get a call link; everyone else gets next steps matched to what they
 * asked for. Every submission posts to /api/leads/contact through lib/leads-api with
 * the same "Role / Intent / Location / Units / Urgency" trail HubSpot already reads.
 *
 * NOTE(i18n): user-facing copy is English-only, per OndoREui/CLAUDE.md.
 */

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Loader2, Phone } from "lucide-react"
import {
  EMPTY_CONTACT,
  LeadContactFields,
  LeadFormError,
  contactIsComplete,
  contactPayload,
  useLeadSubmission,
  type ContactValues,
} from "@/components/lead-contact-fields"
import { analytics, analyticsAttributes } from "@/lib/analytics"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import type { ContactInquiryType } from "@/lib/leads-api"
import { SITE_CALENDLY_URL, SITE_PHONE } from "@/lib/site"

type Intent = "manage_rental" | "buy_home" | "sell_home" | "find_rental" | "invest" | "loan" | "notary" | "other"
type Urgency = "now" | "30_days" | "90_days" | "exploring"
type StepId = "intent" | "units" | "location" | "urgency" | "contact"

/** `role` keeps the HubSpot trail's "Role:" line; `inquiryType` routes the lead in the CRM. */
const INTENTS: readonly { value: Intent; label: string; role: string; inquiryType: ContactInquiryType }[] = [
  { value: "manage_rental", label: "Manage my rental property", role: "owner", inquiryType: "owner" },
  { value: "buy_home", label: "Buy a home", role: "buyer", inquiryType: "buyer" },
  { value: "sell_home", label: "Sell a home", role: "seller", inquiryType: "seller" },
  { value: "find_rental", label: "Find a place to rent", role: "tenant", inquiryType: "renter" },
  { value: "invest", label: "Invest in rental property", role: "investor", inquiryType: "owner" },
  { value: "loan", label: "Home loan or refinance", role: "other", inquiryType: "other" },
  { value: "notary", label: "Notary service", role: "other", inquiryType: "other" },
  { value: "other", label: "Something else", role: "other", inquiryType: "other" },
]

const UNIT_OPTIONS = ["None yet", "1", "2 to 4", "5 to 20", "More than 20"] as const

const URGENCY_OPTIONS: readonly { value: Urgency; label: string }[] = [
  { value: "now", label: "This week" },
  { value: "30_days", label: "Within 30 days" },
  { value: "90_days", label: "Within 3 months" },
  { value: "exploring", label: "Just exploring" },
]

const QUESTIONS: Record<StepId, string> = {
  intent: "What can we help you with?",
  units: "How many rental units do you own?",
  location: "Which city or ZIP code?",
  urgency: "How soon do you want to get started?",
  contact: "Where should we send your match?",
}

/** Next steps after sending, matched to what the visitor asked for. */
const NEXT_STEPS: Record<Intent, readonly { id: string; label: string; href: string }[]> = {
  manage_rental: [
    { id: "owner_vs_self", label: "Run the self-manage vs Ondo numbers", href: "/calculators/owner-vs-self/" },
    { id: "rent_estimate", label: "Get a free rent estimate", href: "/whats-my-home-worth/" },
  ],
  invest: [
    { id: "new_investors", label: "Read the new investor guide", href: "/new-investors/" },
    { id: "browse", label: "Browse homes", href: "/properties/" },
  ],
  buy_home: [
    { id: "afford_quiz", label: "See how much home you can afford", href: "/buy/quiz/" },
    { id: "browse", label: "Browse homes", href: "/properties/" },
  ],
  sell_home: [
    { id: "home_value", label: "See what your home is worth", href: "/whats-my-home-worth/" },
    { id: "sell", label: "How we sell homes", href: "/sell/" },
  ],
  find_rental: [{ id: "browse", label: "Browse homes for rent", href: "/properties/" }],
  loan: [{ id: "loans", label: "Explore home loans", href: "/loans/" }],
  notary: [{ id: "notary", label: "See notary options", href: "/notary/" }],
  other: [{ id: "home", label: "Browse all our services", href: "/" }],
}

function stepsFor(intent: Intent | undefined): StepId[] {
  const needsUnits = intent === "manage_rental" || intent === "invest"
  return needsUnits ? ["intent", "units", "location", "urgency", "contact"] : ["intent", "location", "urgency", "contact"]
}

/** HOT: a rental owner ready within 30 days, the fastest path to a management client. */
function classify(intent: Intent | undefined, urgency: Urgency | undefined): "hot" | "warm" | "cold" {
  const ready = urgency === "now" || urgency === "30_days"
  if (intent === "manage_rental" && ready) return "hot"
  if (intent === "manage_rental" || intent === "invest" || ready) return "warm"
  return "cold"
}

const phoneDigits = SITE_PHONE.replace(/[^+\d]/g, "")
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

export function LeadQualifierWizard() {
  const [stepIndex, setStepIndex] = useState(0)
  const [intent, setIntent] = useState<Intent>()
  const [units, setUnits] = useState<string>()
  const [location, setLocation] = useState("")
  const [urgency, setUrgency] = useState<Urgency>()
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const { status, error, send } = useLeadSubmission("lead_qualifier_wizard")
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasNavigated = useRef(false)
  const headingId = useId()

  const steps = stepsFor(intent)
  const step = steps[Math.min(stepIndex, steps.length - 1)]!

  // Move focus to each new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus()
  }, [stepIndex, status])

  function goTo(index: number) {
    hasNavigated.current = true
    setStepIndex(index)
  }

  function next(completed: StepId, nextSteps: StepId[] = steps) {
    analytics.trackEvent("wizard_step_complete", "lead_qualifier", completed, stepIndex + 1)
    goTo(Math.min(stepIndex + 1, nextSteps.length - 1))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!intent || !urgency || !contactIsComplete(contact)) return
    const chosen = INTENTS.find((option) => option.value === intent)!
    const classification = classify(intent, urgency)
    const message = [
      `Lead qualifier wizard, classification: ${classification.toUpperCase()}`,
      `Role: ${chosen.role}`,
      `Intent: ${intent}`,
      `Location: ${location.trim()}`,
      units ? `Units: ${units}` : null,
      `Urgency: ${urgency}`,
      contact.phone.trim() ? `Phone: ${contact.phone.trim()}` : null,
      `OK to text: ${contact.textConsent ? "Yes" : "No"}`,
    ]
      .filter((line): line is string => line !== null)
      .join("\n")

    const sent = await send({
      ...contactPayload(contact),
      source: "website",
      inquiryType: chosen.inquiryType,
      message,
      attribution: getAttributionPayloadForApi(),
    })
    if (sent) analytics.trackEvent("lead_classified", "lead_qualifier", classification)
  }

  if (status === "sent") {
    const isHot = classify(intent, urgency) === "hot"
    return (
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="font-outfit text-2xl font-bold focus:outline-none md:text-3xl">
          {isHot ? "You're a great fit. Pick a time." : "Got it. We'll be in touch."}
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          {isHot
            ? "The fastest path is a 30-minute call. Pick a time and we'll have your details open before we dial in."
            : `We'll send your match to ${contact.email.trim()} within one business day. In the meantime:`}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {isHot ? (
            <>
              <a
                href={SITE_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButton}
                {...analyticsAttributes("quiz_cta_click", "get_matched", "book")}
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Book a 30-minute call
              </a>
              <a href={`tel:${phoneDigits}`} className={secondaryButton} {...analyticsAttributes("quiz_cta_click", "get_matched", "call")}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {SITE_PHONE}
              </a>
            </>
          ) : (
            (intent ? NEXT_STEPS[intent] : NEXT_STEPS.other).map((action, index) => (
              <Link
                key={action.id}
                href={action.href}
                className={index === 0 ? primaryButton : secondaryButton}
                {...analyticsAttributes("quiz_cta_click", "get_matched", action.id)}
              >
                {action.label}
              </Link>
            ))
          )}
        </div>
      </div>
    )
  }

  const progress = Math.round(((stepIndex + 1) / steps.length) * 100)

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>
            Question {stepIndex + 1} of {steps.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 id={headingId} ref={headingRef} tabIndex={-1} className="font-outfit text-2xl font-bold leading-snug focus:outline-none md:text-3xl">
        {QUESTIONS[step]}
      </h2>

      {step === "intent" ? (
        <Choices
          labelledBy={headingId}
          options={INTENTS}
          selected={intent}
          onChoose={(value) => {
            setIntent(value)
            if (value !== "manage_rental" && value !== "invest") setUnits(undefined)
            next("intent", stepsFor(value))
          }}
        />
      ) : null}

      {step === "units" ? (
        <Choices
          labelledBy={headingId}
          options={UNIT_OPTIONS.filter((option) => intent === "invest" || option !== "None yet").map((option) => ({
            value: option,
            label: option,
          }))}
          selected={units}
          onChoose={(value) => {
            setUnits(value)
            next("units")
          }}
        />
      ) : null}

      {step === "location" ? (
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault()
            if (location.trim().length >= 2) next("location")
          }}
        >
          <input
            aria-labelledby={headingId}
            autoComplete="address-level2"
            placeholder="For example, Lehi or 84043"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="submit" disabled={location.trim().length < 2} className={`${primaryButton} mt-4 w-full`}>
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      ) : null}

      {step === "urgency" ? (
        <Choices
          labelledBy={headingId}
          options={URGENCY_OPTIONS}
          selected={urgency}
          onChoose={(value) => {
            setUrgency(value)
            next("urgency")
          }}
        />
      ) : null}

      {step === "contact" ? (
        <form onSubmit={handleSubmit} className="mt-6" noValidate>
          <LeadContactFields value={contact} onChange={setContact} consentLabel="Text me about my match." />
          <LeadFormError message={error} />
          <button
            type="submit"
            disabled={!contactIsComplete(contact) || status === "sending"}
            className={`${primaryButton} mt-5 w-full`}
          >
            {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Get my match
          </button>
          <p className="mt-3 text-xs text-muted-foreground">No spam. A real person follows up within one business day.</p>
        </form>
      ) : null}

      <button
        type="button"
        onClick={() => goTo(Math.max(0, stepIndex - 1))}
        disabled={stepIndex === 0}
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>
    </div>
  )
}

function Choices<T extends string>({
  labelledBy,
  options,
  selected,
  onChoose,
}: {
  labelledBy: string
  options: readonly { value: T; label: string }[]
  selected: T | undefined
  onChoose: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="mt-6 grid gap-3">
      {options.map((option) => {
        const isSelected = selected === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChoose(option.value)}
            className={`flex min-h-[3.5rem] items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.95rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
            }`}
          >
            {option.label}
            <ArrowRight className="h-4 w-4 opacity-50" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
