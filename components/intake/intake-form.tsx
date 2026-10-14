"use client"

/**
 * Client intake questionnaire behind /intake: one flow for buyers, sellers, rental owners and
 * renters. Questions live in lib/intake-questions.ts; this component only renders them.
 *
 * `/intake/?type=buyer|seller|owner|tenant` skips the first screen (links sent from Gmail).
 * Answers survive a refresh through a session draft. Submits to POST /api/leads/intake through
 * lib/leads-api, which saves a website lead the team sees in the dashboard inbox.
 *
 * NOTE(i18n): user-facing copy is English-only, per OndoREui/CLAUDE.md.
 */

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Building2, Calendar, Check, CheckCircle2, KeyRound, Loader2, MapPin, Signpost } from "lucide-react"
import { CalendlyLink } from "@/components/calendly-link"
import { FieldError, LeadFormError, leadInputClass } from "@/components/lead-contact-fields"
import { analytics, analyticsAttributes } from "@/lib/analytics"
import { useAntiSpam } from "@/lib/anti-spam"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import {
  PAYLOAD_TO_CONTACT_FIELD,
  buildIntakePayload,
  clearIntakeDraft,
  currentValue,
  formatPhone,
  isVisible,
  otherKey,
  readIntakeDraft,
  validateFields,
  writeIntakeDraft,
  type IntakeErrors,
} from "@/lib/intake-form"
import {
  CONTACT_SECTION,
  INTAKE_CONSENT_TOPIC,
  INTAKE_TYPES,
  OTHER,
  SECTIONS_BY_TYPE,
  isIntakeTypeId,
  type IntakeField,
  type IntakeFormAnswers,
  type IntakeSection,
  type IntakeTypeId,
} from "@/lib/intake-questions"
import { submitIntakeLead } from "@/lib/leads-api"
import { textConsentText } from "@/lib/text-consent"

const FORM_NAME = "client_intake"
const PICKER: IntakeSection = { id: "type", title: "What can we help you with?", fields: [] }

const TYPE_ICONS: Record<IntakeTypeId, typeof KeyRound> = {
  buyer: KeyRound,
  seller: Signpost,
  owner: Building2,
  tenant: MapPin,
}

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"

// A simplified Wasatch ridgeline. Progress climbs it from left to right.
const RIDGE_POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 52], [60, 44], [110, 47], [170, 30], [215, 38], [260, 18], [300, 30], [345, 24], [390, 6],
  [430, 26], [480, 20], [530, 34], [575, 14], [620, 28], [670, 22], [720, 36], [770, 26],
  [820, 40], [870, 32], [930, 44], [1000, 40],
]
const RIDGE_PATH = RIDGE_POINTS.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ")

function ridgeY(x: number): number {
  for (let i = 1; i < RIDGE_POINTS.length; i++) {
    const [x1, y1] = RIDGE_POINTS[i - 1]!
    const [x2, y2] = RIDGE_POINTS[i]!
    if (x <= x2) return y1 + ((x - x1) / (x2 - x1 || 1)) * (y2 - y1)
  }
  return RIDGE_POINTS[RIDGE_POINTS.length - 1]![1]
}

function Ridgeline({ progress, label }: { progress: number; label: string }) {
  const clipId = `intake-ridge-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const pct = Math.max(0, Math.min(1, progress))
  return (
    <div
      className="relative mb-6 h-12 w-full"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
    >
      <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
        <path d={RIDGE_PATH} className="fill-none stroke-border" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <clipPath id={clipId}>
          <rect x="0" y="0" height="60" width={1000 * pct} className="transition-[width] duration-500 motion-reduce:transition-none" />
        </clipPath>
        <path d={`${RIDGE_PATH} L1000 60 L0 60 Z`} className="fill-primary/15" clipPath={`url(#${clipId})`} />
        <path d={RIDGE_PATH} className="fill-none stroke-primary" strokeWidth={2.5} clipPath={`url(#${clipId})`} vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        aria-hidden="true"
        className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow transition-[left,top] duration-500 motion-reduce:transition-none"
        style={{ left: `${pct * 100}%`, top: `${(ridgeY(pct * 1000) / 60) * 100}%` }}
      />
    </div>
  )
}

function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <>
      {children}
      {required ? (
        <span className="text-destructive-emphasis" aria-hidden="true">
          {" "}
          *
        </span>
      ) : null}
    </>
  )
}

function Field({
  field,
  answers,
  error,
  onChange,
}: {
  field: IntakeField
  answers: IntakeFormAnswers
  error: string | undefined
  onChange: (id: string, value: string | string[]) => void
}) {
  const id = `intake-${field.id}`
  const helpId = field.help ? `${id}-help` : undefined
  const errId = `${id}-error`
  const describedBy = [helpId, error ? errId : undefined].filter(Boolean).join(" ") || undefined
  const value = currentValue(field, answers)
  const wrapClass = field.half ? "sm:col-span-1" : "sm:col-span-2"
  const help = field.help ? (
    <p id={helpId} className="mt-0.5 text-xs text-muted-foreground">
      {field.help}
    </p>
  ) : null

  if (field.type === "radio" || field.type === "checkboxes") {
    const multi = field.type === "checkboxes"
    const options = field.other ? [...(field.options ?? []), OTHER] : (field.options ?? [])
    const selected = Array.isArray(value) ? value : value ? [value] : []
    const otherOn = selected.includes(OTHER)
    const chips = field.layout === "chips"
    const toggle = (opt: string) => {
      if (!multi) return onChange(field.id, opt)
      onChange(field.id, selected.includes(opt) ? selected.filter((x) => x !== opt) : [...selected, opt])
    }

    return (
      <fieldset className={wrapClass} data-field={field.id} aria-describedby={describedBy}>
        <legend className="text-sm font-medium">
          <Label required={field.required}>{field.label}</Label>
          {field.required ? <span className="sr-only"> (required)</span> : null}
        </legend>
        {help}
        <div className={chips ? "mt-2 flex flex-wrap gap-2" : "mt-2 grid gap-2"}>
          {options.map((opt) => {
            const checked = selected.includes(opt)
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-2.5 border text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                  chips ? "rounded-full px-3.5 py-2" : "rounded-xl px-4 py-3"
                } ${checked ? "border-primary bg-primary/10 font-medium" : "border-border bg-card hover:border-primary/60"}`}
              >
                <input
                  type={multi ? "checkbox" : "radio"}
                  name={id}
                  value={opt}
                  checked={checked}
                  aria-invalid={error ? true : undefined}
                  onChange={() => toggle(opt)}
                  className={chips ? "sr-only" : "h-4 w-4 shrink-0 accent-primary"}
                />
                {chips && checked ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
                {opt}
              </label>
            )
          })}
        </div>
        {field.other && otherOn ? (
          <input
            className={leadInputClass}
            type="text"
            aria-label={`${field.label}, other`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            data-other="true"
            placeholder="Type your answer"
            maxLength={200}
            value={typeof answers[otherKey(field.id)] === "string" ? (answers[otherKey(field.id)] as string) : ""}
            onChange={(e) => onChange(otherKey(field.id), e.target.value)}
          />
        ) : null}
        <FieldError id={errId} message={error} />
      </fieldset>
    )
  }

  const text = typeof value === "string" ? value : ""
  const common = {
    id,
    name: field.id,
    value: text,
    autoComplete: field.autoComplete,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    "aria-required": field.required ? (true as const) : undefined,
    className: leadInputClass,
  }

  let control: ReactNode
  if (field.type === "textarea") {
    control = <textarea {...common} rows={3} maxLength={2000} onChange={(e) => onChange(field.id, e.target.value)} />
  } else if (field.type === "tel") {
    control = (
      <input {...common} type="tel" inputMode="tel" placeholder="(801) 555-0123" onChange={(e) => onChange(field.id, formatPhone(e.target.value))} />
    )
  } else if (field.type === "number") {
    control = (
      <input {...common} type="text" inputMode="numeric" maxLength={12} onChange={(e) => onChange(field.id, e.target.value.replace(/[^\d,]/g, ""))} />
    )
  } else {
    control = (
      <input
        {...common}
        type={field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
        maxLength={field.type === "date" ? undefined : 300}
        onChange={(e) => onChange(field.id, e.target.value)}
      />
    )
  }

  return (
    <div className={wrapClass} data-field={field.id}>
      <label htmlFor={id} className="text-sm font-medium">
        <Label required={field.required}>{field.label}</Label>
      </label>
      {help}
      {control}
      <FieldError id={errId} message={error} />
    </div>
  )
}

export function IntakeForm() {
  const [hydrated, setHydrated] = useState(false)
  const [type, setType] = useState<IntakeTypeId | null>(null)
  const [answers, setAnswers] = useState<IntakeFormAnswers>({})
  const [step, setStep] = useState(0)
  const [textConsent, setTextConsent] = useState(false)
  const [errors, setErrors] = useState<IntakeErrors>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [serverError, setServerError] = useState<string | null>(null)
  const { honeypotProps, gate } = useAntiSpam()
  const rootRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const headingId = useId()
  const consentId = useId()
  const moved = useRef(false)

  // Read ?type= and the session draft after mount (static export: no URL on the server).
  useEffect(() => {
    const urlType = new URLSearchParams(window.location.search).get("type")
    const draft = readIntakeDraft()
    const initialType = isIntakeTypeId(urlType) ? urlType : (draft?.type ?? null)
    if (draft) setAnswers(draft.answers)
    if (initialType) {
      setType(initialType)
      setStep(draft && draft.type === initialType ? Math.max(1, draft.step) : 1)
      if (isIntakeTypeId(urlType)) analytics.trackEvent("intake_start", FORM_NAME, `${urlType}_link`)
    }
    setHydrated(true)
  }, [])

  const steps = useMemo(() => (type ? [PICKER, CONTACT_SECTION, ...SECTIONS_BY_TYPE[type]] : [PICKER]), [type])
  const safeStep = Math.min(step, steps.length - 1)
  const section = steps[safeStep]!
  const isLast = Boolean(type) && safeStep === steps.length - 1
  const done = status === "sent"
  const progress = done ? 1 : type ? safeStep / (steps.length - 1) : 0
  const consentText = textConsentText(type ? INTAKE_CONSENT_TOPIC[type] : "your request")

  useEffect(() => {
    if (!hydrated || done) return
    writeIntakeDraft({ type, answers, step: safeStep })
  }, [hydrated, type, answers, safeStep, done])

  // New step: bring it into view and move focus to its heading for keyboard and screen readers.
  useEffect(() => {
    if (!moved.current) return
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    rootRef.current?.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "start" })
    headingRef.current?.focus({ preventScroll: true })
  }, [safeStep, done])

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    const key = id.replace(/__other$/, "")
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const goTo = (n: number) => {
    moved.current = true
    setErrors({})
    setServerError(null)
    setStep(n)
  }

  const focusFirstError = (errs: IntakeErrors) => {
    const first = Object.keys(errs)[0]
    if (!first) return
    requestAnimationFrame(() => {
      const scope = `[data-field="${first}"]`
      // "Fill in the Other box." belongs to the Other text input, not the first option.
      const other = errs[first] === "Fill in the Other box." ? rootRef.current?.querySelector<HTMLElement>(`${scope} input[data-other]`) : null
      const target = other ?? rootRef.current?.querySelector<HTMLElement>(`${scope} input, ${scope} textarea`)
      target?.focus()
    })
  }

  const chooseType = (id: IntakeTypeId) => {
    setType(id)
    analytics.trackEvent("intake_start", FORM_NAME, id)
    goTo(1)
  }

  const submit = async () => {
    if (!type) return
    if (gate.isLikelyBot()) {
      // Pretend success; bots aren't told why.
      gate.recordAttempt()
      clearIntakeDraft()
      setStatus("sent")
      return
    }
    setStatus("sending")
    setServerError(null)
    const payload = buildIntakePayload(type, answers, { textConsent, consentText }, getAttributionPayloadForApi())
    const result = await submitIntakeLead(payload)
    if ("error" in result) {
      setStatus("idle")
      const contactErrors: IntakeErrors = {}
      for (const [key, messages] of Object.entries(result.details ?? {})) {
        const fieldId = PAYLOAD_TO_CONTACT_FIELD[key]
        if (fieldId) contactErrors[fieldId] = messages[0] ?? "Check this answer."
      }
      if (Object.keys(contactErrors).length) {
        goTo(1)
        setErrors(contactErrors)
        focusFirstError(contactErrors)
        return
      }
      setServerError(
        result.error === "Validation failed"
          ? "Some answers need a fix. Check each step and try again."
          : result.error || "Your answers didn't go through. Try again, or call or text us.",
      )
      return
    }
    clearIntakeDraft()
    moved.current = true
    setStatus("sent")
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status === "sending" || safeStep === 0) return
    const errs = validateFields(section.fields, answers)
    if (Object.keys(errs).length) {
      setErrors(errs)
      focusFirstError(errs)
      return
    }
    analytics.trackEvent("intake_step_complete", FORM_NAME, `${type}:${section.id}`)
    if (isLast) void submit()
    else goTo(safeStep + 1)
  }

  const startOver = () => {
    clearIntakeDraft()
    const keep: IntakeFormAnswers = {}
    for (const f of CONTACT_SECTION.fields) if (answers[f.id] !== undefined) keep[f.id] = answers[f.id]
    setAnswers(keep)
    setType(null)
    setTextConsent(false)
    setStatus("idle")
    goTo(0)
  }

  if (done) {
    const firstName = typeof answers["first_name"] === "string" ? answers["first_name"].trim() : ""
    const preferred = String(answers["preferred_contact"] ?? "")
    // Never promise a text without recorded consent (TCPA): fall back to a call or email.
    const via = ({ Text: textConsent ? "text" : undefined, "Phone call": "phone", Email: "email" } as Record<string, string | undefined>)[preferred]
    const textWithoutConsent = preferred === "Text" && !textConsent
    return (
      <div ref={rootRef} className="mx-auto max-w-2xl scroll-mt-24">
        <Ridgeline progress={1} label="Questionnaire complete" />
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8" role="status">
          <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
          <h2 ref={headingRef} tabIndex={-1} className="mt-3 font-outfit text-2xl font-bold focus:outline-none md:text-3xl">
            Answers sent
          </h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            Thanks{firstName ? `, ${firstName}` : ""}. We have what we need and will reach out{via ? ` by ${via}` : ""} within one
            business day.
            {textWithoutConsent ? " You picked text but left the texting box unticked, so we'll call or email instead." : ""} A copy of
            next steps is on its way to your inbox.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CalendlyLink
              contentLabel={`intake_${type ?? "unknown"}`}
              className={primaryButton}
              {...analyticsAttributes("intake_cta_click", FORM_NAME, "book")}
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Pick a time to talk
            </CalendlyLink>
            <button type="button" className={secondaryButton} onClick={startOver}>
              Start another questionnaire
            </button>
          </div>
        </div>
      </div>
    )
  }

  const errorCount = Object.keys(errors).length
  const visibleFields = section.fields.filter((f) => isVisible(f, answers))

  return (
    <div ref={rootRef} className="mx-auto max-w-2xl scroll-mt-24">
      <Ridgeline progress={progress} label="Questionnaire progress" />

      <form onSubmit={handleSubmit} noValidate aria-labelledby={headingId} className="rounded-2xl border border-border bg-card p-6 md:p-8">
        {type && safeStep > 0 ? (
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Step {safeStep} of {steps.length - 1}
          </p>
        ) : null}
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="mt-1 font-outfit text-2xl font-bold leading-snug focus:outline-none md:text-3xl">
          {section.title}
        </h2>
        {section.intro ? <p className="mt-2 text-sm text-muted-foreground">{section.intro}</p> : null}

        {errorCount > 0 ? (
          <p className="mt-4 text-sm font-medium text-destructive-emphasis" role="alert">
            {errorCount === 1 ? "One answer needs attention." : `${errorCount} answers need attention.`}
          </p>
        ) : null}

        {safeStep === 0 ? (
          <div role="group" aria-labelledby={headingId} className="mt-6 grid gap-3 sm:grid-cols-2">
            {INTAKE_TYPES.map((t) => {
              const Icon = TYPE_ICONS[t.id]
              const checked = type === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-current={checked ? "true" : undefined}
                  disabled={!hydrated}
                  onClick={() => chooseType(t.id)}
                  className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    checked ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/60"
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="font-semibold">{t.title}</span>
                  <span className="text-sm text-muted-foreground">{t.blurb}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {visibleFields.map((f) => (
              <Field key={f.id} field={f} answers={answers} error={errors[f.id]} onChange={setAnswer} />
            ))}

            {isLast ? (
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <input
                  id={consentId}
                  type="checkbox"
                  checked={textConsent}
                  onChange={(e) => setTextConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
                <label htmlFor={consentId} className="text-xs leading-relaxed text-muted-foreground">
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
            ) : null}
          </div>
        )}

        <input {...honeypotProps} />

        <LeadFormError message={serverError} />
        {/* Always mounted so screen readers hear the change when sending starts. */}
        <p className="sr-only" role="status" aria-live="polite">
          {status === "sending" ? "Sending your answers." : ""}
        </p>

        {safeStep > 0 ? (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => goTo(safeStep - 1)}
              disabled={status === "sending"}
              className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
            {/* aria-disabled keeps focus on the button while sending; the submit handler ignores repeats. */}
            <button type="submit" aria-disabled={status === "sending"} className={`${primaryButton} aria-disabled:cursor-not-allowed aria-disabled:opacity-60`}>
              {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              {isLast ? (status === "sending" ? "Sending…" : "Send my answers") : "Continue"}
              {!isLast ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
            </button>
          </div>
        ) : null}
      </form>
    </div>
  )
}
