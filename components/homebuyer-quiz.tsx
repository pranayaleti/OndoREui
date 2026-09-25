"use client"

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Loader2, RotateCcw } from "lucide-react"
import {
  EMPTY_CONTACT,
  LeadContactFields,
  LeadFormError,
  LeadSentNotice,
  contactIsComplete,
  contactPayload,
  useLeadSubmission,
  type ContactValues,
} from "@/components/lead-contact-fields"
import { analytics, analyticsAttributes } from "@/lib/analytics"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { formatCurrency } from "@/lib/cost-of-living"
import {
  BUYER_STAGES,
  BUYING_AREAS,
  CREDIT_BANDS,
  MIN_DOWN_PERCENT,
  PRE_APPROVAL_OPTIONS,
  PROGRAM_LABELS,
  QUIZ_ASSUMPTIONS,
  estimateForAnswers,
  leadMessageFor,
  type QuizAnswers,
  type QuizEstimate,
} from "@/lib/homebuyer-quiz"
import { SITE_CALENDLY_URL, SITE_PHONE } from "@/lib/site"
import { ARRIVAL_LENDING_DISCLOSURE, ARRIVAL_REAL_ESTATE_DISCLOSURE } from "@/lib/utah-arrival"

type ChoiceKey = "stage" | "preApproved" | "area" | "veteran" | "credit"
type AmountKey = "annualIncome" | "monthlyDebts" | "downPayment"

type Step =
  | {
      kind: "choice"
      key: ChoiceKey
      question: string
      hint?: string
      options: readonly { value: string | boolean; label: string }[]
    }
  | { kind: "amount"; key: AmountKey; question: string; hint: string; min: number }

const STEPS: readonly Step[] = [
  { kind: "choice", key: "stage", question: "Where are you in the process?", options: BUYER_STAGES },
  { kind: "choice", key: "preApproved", question: "Have you been pre-approved yet?", options: PRE_APPROVAL_OPTIONS },
  { kind: "choice", key: "area", question: "Where are you looking to buy?", options: BUYING_AREAS },
  {
    kind: "choice",
    key: "veteran",
    question: "Are you a veteran, on active duty, or an eligible surviving spouse?",
    hint: "VA loans can mean no down payment.",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    kind: "amount",
    key: "annualIncome",
    question: "What's your yearly household income before taxes?",
    hint: "Add up everyone who'll be on the loan.",
    min: 1,
  },
  {
    kind: "amount",
    key: "monthlyDebts",
    question: "What are your monthly debt payments?",
    hint: "Car, student loans and minimum card payments. Not rent. $0 is fine.",
    min: 0,
  },
  {
    kind: "amount",
    key: "downPayment",
    question: "How much have you saved for a down payment?",
    hint: "$0 is fine.",
    min: 0,
  },
  {
    kind: "choice",
    key: "credit",
    question: "Roughly, what's your credit score?",
    hint: "A guess is fine. We don't check your credit.",
    options: CREDIT_BANDS,
  },
]

const NEXT_STEPS: Record<QuizAnswers["stage"], { title: string; body: string; actions: ("book" | "call" | "text" | "browse")[] }> = {
  starting: {
    title: "Start touring with a plan",
    body: "Browse homes in your range, then book a call when you want a second set of eyes.",
    actions: ["browse", "book"],
  },
  offers: {
    title: "Let's find the right one in your range",
    body: "Book a 30-minute call and we'll line up tours and a plan for your offer.",
    actions: ["book", "call", "text"],
  },
  under_contract: {
    title: "Questions before closing?",
    body: "Call or text and we'll help you sort out what comes next.",
    actions: ["call", "text", "book"],
  },
  questions: {
    title: "Ask us anything",
    body: "No forms needed. Call, text, or pick a time that works.",
    actions: ["call", "text", "book"],
  },
}

const NO_ESTIMATE_COPY: Record<Extract<QuizEstimate, { ok: false }>["reason"], string> = {
  no_income: "We need your income to estimate a price range.",
  debts:
    "Your monthly debts already use the budget lenders typically allow for this income. Paying down a debt or adding a co-borrower changes the math, so talk it through with us.",
  down_payment:
    "Most loans other than VA need at least 3% down. Once you have some savings set aside, run this again, or ask us what options fit.",
}

const phoneDigits = SITE_PHONE.replace(/[^+\d]/g, "")
const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/** Estimates are rounded so they never read as more precise than they are. */
function roughly(amount: number, step: number): string {
  return formatCurrency(Math.round(amount / step) * step)
}

function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "")
  return digits ? Number(digits) : Number.NaN
}

export function HomebuyerQuiz() {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [drafts, setDrafts] = useState<Record<AmountKey, string>>({ annualIncome: "", monthlyDebts: "", downPayment: "" })
  const [finished, setFinished] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const hasNavigated = useRef(false)
  const headingId = useId()
  const hintId = useId()

  // Move focus to each new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus()
  }, [stepIndex, finished])

  const step = STEPS[stepIndex]!

  function advance(next: Partial<QuizAnswers>) {
    hasNavigated.current = true
    analytics.trackEvent("quiz_step_complete", "homebuyer_quiz", step.key, stepIndex + 1)
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1)
      return
    }
    const estimate = estimateForAnswers(next as QuizAnswers)
    analytics.trackEvent("quiz_result", "homebuyer_quiz", estimate.ok ? estimate.program : estimate.reason)
    setFinished(true)
  }

  function choose(value: string | boolean) {
    const next = { ...answers, [step.key]: value }
    setAnswers(next)
    advance(next)
  }

  function commitAmount(event: FormEvent) {
    event.preventDefault()
    if (step.kind !== "amount") return
    const value = parseAmount(drafts[step.key])
    if (!(value >= step.min)) return
    const next = { ...answers, [step.key]: value }
    setAnswers(next)
    advance(next)
  }

  function goBack() {
    hasNavigated.current = true
    setStepIndex((index) => Math.max(0, index - 1))
  }

  function restart() {
    hasNavigated.current = true
    setAnswers({})
    setDrafts({ annualIncome: "", monthlyDebts: "", downPayment: "" })
    setStepIndex(0)
    setFinished(false)
  }

  if (finished) {
    return <QuizResult answers={answers as QuizAnswers} headingRef={headingRef} onRestart={restart} />
  }

  const progress = Math.round(((stepIndex + 1) / STEPS.length) * 100)
  const amountValue = step.kind === "amount" ? parseAmount(drafts[step.key]) : Number.NaN

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>
            Question {stepIndex + 1} of {STEPS.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <h2 id={headingId} ref={headingRef} tabIndex={-1} className="font-outfit text-2xl font-bold leading-snug focus:outline-none md:text-3xl">
        {step.question}
      </h2>
      {step.hint ? (
        <p id={hintId} className="mt-2 text-sm text-muted-foreground">
          {step.hint}
        </p>
      ) : null}

      {step.kind === "choice" ? (
        <div role="radiogroup" aria-labelledby={headingId} className="mt-6 grid gap-3">
          {step.options.map((option) => {
            const selected = answers[step.key] === option.value
            return (
              <button
                key={String(option.value)}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(option.value)}
                className={`flex min-h-[3.5rem] items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.95rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
                }`}
              >
                {option.label}
                <ArrowRight className="h-4 w-4 opacity-50" aria-hidden="true" />
              </button>
            )
          })}
        </div>
      ) : (
        <form onSubmit={commitAmount} className="mt-6">
          <div className="flex items-center rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-ring">
            <span className="pl-4 text-lg text-muted-foreground" aria-hidden="true">
              $
            </span>
            <input
              inputMode="numeric"
              autoComplete="off"
              aria-labelledby={headingId}
              aria-describedby={hintId}
              value={drafts[step.key]}
              onChange={(event) => setDrafts((current) => ({ ...current, [step.key]: event.target.value }))}
              className="w-full bg-transparent px-2 py-3 text-lg text-foreground focus:outline-none"
            />
          </div>
          <button type="submit" disabled={!(amountValue >= step.min)} className={`${primaryButton} mt-4 w-full`}>
            Next
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={goBack}
        disabled={stepIndex === 0}
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>
    </div>
  )
}

function QuizResult({
  answers,
  headingRef,
  onRestart,
}: {
  answers: QuizAnswers
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onRestart: () => void
}) {
  const estimate = useMemo(() => estimateForAnswers(answers), [answers])
  const next = NEXT_STEPS[answers.stage]
  const { interestRate, termYears, propertyTaxRatePercent, insuranceRatePercent } = QUIZ_ASSUMPTIONS

  return (
    <section className="mx-auto max-w-xl" aria-labelledby="quiz-result-heading">
      <h2
        id="quiz-result-heading"
        ref={headingRef}
        tabIndex={-1}
        className="font-outfit text-2xl font-bold focus:outline-none md:text-3xl"
      >
        Your estimate
      </h2>

      {estimate.ok ? (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <dt className="text-sm text-muted-foreground">Comfortable</dt>
              <dd className="mt-1 font-outfit text-2xl font-bold sm:text-3xl">{roughly(estimate.comfortablePrice, 1000)}</dd>
            </div>
            <div className="rounded-2xl border border-primary/60 bg-card p-5">
              <dt className="text-sm text-muted-foreground">Upper end</dt>
              <dd className="mt-1 font-outfit text-2xl font-bold sm:text-3xl">{roughly(estimate.upperPrice, 1000)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            About {roughly(estimate.monthlyAtUpper, 10)} a month at the upper end, including tax, insurance and any
            mortgage insurance.
            {estimate.limitedBy === "down_payment"
              ? ` Your savings set the ceiling here: ${PROGRAM_LABELS[estimate.program]} loans need at least ${MIN_DOWN_PERCENT[estimate.program]}% down.`
              : null}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            A loan type that may fit:{" "}
            <Link
              href={`/loans/${estimate.program}/`}
              className="font-medium text-primary underline-offset-4 hover:underline"
              {...analyticsAttributes("quiz_cta_click", "homebuyer_quiz", `program_${estimate.program}`)}
            >
              {PROGRAM_LABELS[estimate.program]}
            </Link>
            .
          </p>
          <p className="mt-4 rounded-xl bg-muted/60 px-4 py-3 text-sm font-medium">
            This is an estimate from your answers, not a pre-approval or a loan offer.
          </p>
        </>
      ) : (
        <p className="mt-6 rounded-2xl border border-border bg-card p-5 text-[0.95rem] leading-relaxed">
          {NO_ESTIMATE_COPY[estimate.reason]}
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-outfit text-lg font-semibold">{next.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {next.body}
          {answers.stage === "offers" && answers.preApproved !== "yes"
            ? " Sellers usually want a pre-approval letter with your offer, so line that up first."
            : null}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {next.actions.map((action, index) => {
            const className = index === 0 ? primaryButton : secondaryButton
            const ctaTracking = analyticsAttributes("quiz_cta_click", "homebuyer_quiz", action)
            switch (action) {
              case "book":
                return (
                  <a key={action} href={SITE_CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={className} {...ctaTracking}>
                    Book a free call
                  </a>
                )
              case "call":
                return (
                  <a key={action} href={`tel:${phoneDigits}`} className={className} {...ctaTracking}>
                    Call us
                  </a>
                )
              case "text":
                return (
                  <a key={action} href={`sms:${phoneDigits}`} className={className} {...ctaTracking}>
                    Text us
                  </a>
                )
              case "browse":
                return (
                  <Link key={action} href="/properties/" className={className} {...ctaTracking}>
                    Browse homes
                  </Link>
                )
            }
          })}
        </div>
      </div>

      <FollowUpForm answers={answers} estimate={estimate} />

      <div className="mt-8 space-y-2 text-xs leading-relaxed text-muted-foreground">
        <p>
          Assumes a {interestRate}% interest rate on a {termYears}-year fixed loan (an illustration, not today&apos;s rate
          or a quote), property tax of {propertyTaxRatePercent}% and homeowners insurance of {insuranceRatePercent}% of the
          price per year, and mortgage insurance where the loan type requires it.
        </p>
        <p>{ARRIVAL_LENDING_DISCLOSURE}</p>
        <p>{ARRIVAL_REAL_ESTATE_DISCLOSURE}</p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Start over
      </button>
    </section>
  )
}

function FollowUpForm({ answers, estimate }: { answers: QuizAnswers; estimate: QuizEstimate }) {
  const [contact, setContact] = useState<ContactValues>(EMPTY_CONTACT)
  const { status, error, send } = useLeadSubmission("homebuyer_quiz")
  const canSend = contactIsComplete(contact)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!canSend) return
    await send({
      ...contactPayload(contact),
      source: "website",
      inquiryType: "buyer",
      message: leadMessageFor(answers, estimate, contact.textConsent),
      attribution: getAttributionPayloadForApi(),
    })
  }

  if (status === "sent") {
    return (
      <div className="mt-8">
        <LeadSentNotice>Got it. We&apos;ll reach out within one business day.</LeadSentNotice>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-5" aria-labelledby="quiz-follow-up" noValidate>
      <h3 id="quiz-follow-up" className="font-outfit text-lg font-semibold">
        Want us to follow up?
      </h3>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">We&apos;ll send homes in your range and answer your questions. No obligation.</p>
      <LeadContactFields value={contact} onChange={setContact} consentLabel="Text me about my search." />
      <LeadFormError message={error} />
      <button type="submit" disabled={!canSend || status === "sending"} className={`${primaryButton} mt-4 w-full`}>
        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        Send my results
      </button>
    </form>
  )
}
