"use client"

/**
 * Public 5-question lead qualifier wizard.
 *
 * Maps to playbook idea #7 ("AI lead-qualifying chatbot · 5 Qs → Calendly if
 * hot, drip if cold"). Implemented as a multi-step wizard rather than a true
 * LLM chat because:
 *   - Backend lead-qualify endpoint currently requires a pre-issued session
 *     token (invite flow only).
 *   - Multi-step wizards convert better than single forms for high-intent
 *     CTAs (commitment escalation + visible progress).
 *   - Honest framing — we're guiding, not pretending the bot is AI.
 *
 * Behavior:
 *   - Q1–Q5 collect role, intent, location, units, urgency, contact info.
 *   - Hot leads (owner / signing soon) → "Book a call now" CTA → Calendly.
 *   - Warm + cold leads → submit + show next-step resources.
 *   - All submissions POST to /api/leads/contact via lib/leads-api with a
 *     structured message so HubSpot sees the full qualification trail.
 *
 * NOTE(i18n): user-facing copy is English-only for now. Migrate to
 * react-i18next when we add full locale routing for marketing pages.
 */

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle, Calendar, Phone } from "lucide-react"
import { submitContactLead } from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { isValidEmail } from "@/lib/security"
import { analytics } from "@/lib/analytics"
import { SITE_CALENDLY_URL, SITE_PHONE } from "@/lib/site"

type Role = "owner" | "tenant" | "buyer" | "seller" | "investor" | "other"
type Intent = "manage_rental" | "find_rental" | "buy_home" | "sell_home" | "loan" | "notary" | "other"
type Urgency = "now" | "30_days" | "90_days" | "exploring"

interface Answers {
  role: Role | null
  intent: Intent | null
  location: string
  units: string
  urgency: Urgency | null
  name: string
  email: string
  phone: string
}

const INITIAL: Answers = {
  role: null,
  intent: null,
  location: "",
  units: "",
  urgency: null,
  name: "",
  email: "",
  phone: "",
}

type Step =
  | { id: "role"; title: string; type: "single"; options: { value: Role; label: string; emoji: string }[] }
  | { id: "intent"; title: string; type: "single"; options: { value: Intent; label: string; emoji: string }[] }
  | { id: "location"; title: string; type: "text"; placeholder: string }
  | { id: "units"; title: string; type: "text"; placeholder: string; optional?: boolean }
  | { id: "urgency"; title: string; type: "single"; options: { value: Urgency; label: string; emoji: string }[] }
  | { id: "contact"; title: string; type: "contact" }

const STEPS: Step[] = [
  {
    id: "role",
    title: "Which best describes you?",
    type: "single",
    options: [
      { value: "owner", label: "Property owner / landlord", emoji: "🏠" },
      { value: "investor", label: "Investor", emoji: "📈" },
      { value: "buyer", label: "Home buyer", emoji: "🔑" },
      { value: "seller", label: "Home seller", emoji: "🏡" },
      { value: "tenant", label: "Renter / tenant", emoji: "🛋️" },
      { value: "other", label: "Something else", emoji: "🤔" },
    ],
  },
  {
    id: "intent",
    title: "What brings you to Ondo RE?",
    type: "single",
    options: [
      { value: "manage_rental", label: "Manage my rental property", emoji: "🛠️" },
      { value: "find_rental", label: "Find a place to rent", emoji: "🔍" },
      { value: "buy_home", label: "Buy a home", emoji: "🏡" },
      { value: "sell_home", label: "Sell my home", emoji: "📝" },
      { value: "loan", label: "Mortgage or refinance", emoji: "💸" },
      { value: "notary", label: "Mobile / remote notary", emoji: "✍️" },
      { value: "other", label: "Just exploring", emoji: "👀" },
    ],
  },
  {
    id: "location",
    title: "Which Utah city or ZIP?",
    type: "text",
    placeholder: "e.g. Lehi, Provo, 84043",
  },
  {
    id: "units",
    title: "How many rental units (if any)?",
    type: "text",
    placeholder: "e.g. 1, 3, 12 — or leave blank",
    optional: true,
  },
  {
    id: "urgency",
    title: "When do you want to move on this?",
    type: "single",
    options: [
      { value: "now", label: "ASAP — this week", emoji: "🔥" },
      { value: "30_days", label: "Within 30 days", emoji: "⏱️" },
      { value: "90_days", label: "Within 90 days", emoji: "📅" },
      { value: "exploring", label: "Just exploring", emoji: "💭" },
    ],
  },
  {
    id: "contact",
    title: "Where should we send your match?",
    type: "contact",
  },
]

/** Routing logic — determines whether this is a HOT lead worth pushing to Calendly. */
function classifyLead(a: Answers): "hot" | "warm" | "cold" {
  const isOwnerOrInvestor = a.role === "owner" || a.role === "investor"
  const isManageRental = a.intent === "manage_rental"
  const isReadyNow = a.urgency === "now" || a.urgency === "30_days"

  if (isOwnerOrInvestor && isManageRental && isReadyNow) return "hot"
  if (isOwnerOrInvestor || isReadyNow) return "warm"
  return "cold"
}

export function LeadQualifierWizard() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const current = STEPS[step]
  const progress = Math.round(((step + 1) / STEPS.length) * 100)

  const canAdvance = useMemo(() => {
    switch (current.id) {
      case "role":
        return answers.role !== null
      case "intent":
        return answers.intent !== null
      case "location":
        return answers.location.trim().length >= 2
      case "units":
        return true
      case "urgency":
        return answers.urgency !== null
      case "contact":
        return answers.name.trim().length > 0 && isValidEmail(answers.email.trim())
      default:
        return false
    }
  }, [current, answers])

  const goNext = useCallback(() => {
    if (!canAdvance) return
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
      analytics.trackEvent("wizard_step_complete", "lead_qualifier", current.id, step + 1)
    }
  }, [canAdvance, step, current])

  const goBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1)
  }, [step])

  const handleSubmit = useCallback(async () => {
    if (!canAdvance || submitting) return
    setSubmitting(true)
    setSubmitError(null)

    const classification = classifyLead(answers)
    const messageParts: string[] = [
      `Lead qualifier wizard — classification: ${classification.toUpperCase()}`,
      `Role: ${answers.role}`,
      `Intent: ${answers.intent}`,
      `Location: ${answers.location}`,
      answers.units ? `Units: ${answers.units}` : null,
      `Urgency: ${answers.urgency}`,
      answers.phone ? `Phone: ${answers.phone}` : null,
    ].filter(Boolean) as string[]

    const result = await submitContactLead({
      name: answers.name.trim(),
      email: answers.email.trim().toLowerCase(),
      phone: answers.phone.trim() || undefined,
      source: "website",
      message: messageParts.join("\n"),
      attribution: getAttributionPayloadForApi(),
    })

    if ("error" in result) {
      setSubmitError(result.error || "Something went wrong. Please try again or call us directly.")
      setSubmitting(false)
      analytics.trackFormSubmission("lead_qualifier_wizard", false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
    analytics.trackFormSubmission("lead_qualifier_wizard", true)
    analytics.trackLeadGeneration(`wizard_${classification}`)
  }, [answers, canAdvance, submitting])

  // ---------- Success state ----------
  if (submitted) {
    const classification = classifyLead(answers)
    const isHot = classification === "hot"

    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <CheckCircle2 className="h-9 w-9 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-3">
          {isHot ? "We're a great fit. Pick a time below." : "Got it — we'll be in touch."}
        </h2>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">
          {isHot
            ? `Based on your answers, the fastest path is a 30-minute call. Pick whatever works — we'll have your file open before we dial in.`
            : `We'll send a personalized recommendation to ${answers.email} within one business day, along with the next steps tailored to your situation.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isHot ? (
            <>
              <a
                href={SITE_CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Book a 30-minute call
              </a>
              <a
                href={`tel:${SITE_PHONE.replace(/[^+\d]/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Or call {SITE_PHONE}
              </a>
            </>
          ) : (
            <>
              <Link
                href="/calculators/owner-vs-self"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Run the Self-Manage vs Ondo numbers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Read the Utah landlord blog
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  // ---------- Wizard ----------
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-foreground/50 mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-8 text-center">
        {current.title}
      </h1>

      {/* Step body */}
      {current.type === "single" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label={current.title}>
          {current.options.map((opt) => {
            const selected =
              (current.id === "role" && answers.role === opt.value) ||
              (current.id === "intent" && answers.intent === opt.value) ||
              (current.id === "urgency" && answers.urgency === opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  if (current.id === "role") setAnswers((a) => ({ ...a, role: opt.value as Role }))
                  if (current.id === "intent") setAnswers((a) => ({ ...a, intent: opt.value as Intent }))
                  if (current.id === "urgency") setAnswers((a) => ({ ...a, urgency: opt.value as Urgency }))
                }}
                className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                  selected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{opt.emoji}</span>
                <span className="font-medium text-foreground">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {current.type === "text" && (
        <div>
          <input
            type="text"
            value={current.id === "location" ? answers.location : answers.units}
            onChange={(e) => {
              if (current.id === "location") setAnswers((a) => ({ ...a, location: e.target.value }))
              if (current.id === "units") setAnswers((a) => ({ ...a, units: e.target.value }))
            }}
            placeholder={current.placeholder}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && canAdvance) goNext()
            }}
          />
          {current.id === "units" && (
            <p className="text-xs text-foreground/50 mt-2">Optional — skip if not applicable.</p>
          )}
        </div>
      )}

      {current.type === "contact" && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-foreground/90">Name</span>
            <input
              type="text"
              required
              value={answers.name}
              onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground/90">Email</span>
            <input
              type="email"
              required
              value={answers.email}
              onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-foreground/90">Phone (optional)</span>
            <input
              type="tel"
              value={answers.phone}
              onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
              className="mt-1.5 w-full rounded-md border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+1 (XXX) XXX-XXXX"
            />
          </label>
          <p className="text-xs text-foreground/50">
            No spam. We'll use this to send your personalized match within one business day.
          </p>
          {submitError && (
            <p className="text-sm text-destructive inline-flex items-center gap-1.5" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex justify-between items-center">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        {current.id === "contact" ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canAdvance || submitting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting…
              </>
            ) : (
              <>
                Get my match
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
