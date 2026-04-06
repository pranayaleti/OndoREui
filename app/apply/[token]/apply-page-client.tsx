"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import {
  createApplication,
  submitApplication,
  validateApplyToken,
  type AcceptanceCriteria,
  type ApplicationDisclosure,
  type ApplicationDisclosureSnapshot,
  type ApplicationLinkValidation,
  type ScreeningQuestion,
  type VerificationCheckType,
} from "@/lib/api/applications"
import { AffordabilityCalculator } from "@/components/apply/affordability-calculator"
import { PropertyImage } from "@/components/ui/optimized-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Step =
  | "loading"
  | "property"
  | "disclosure"
  | "personal"
  | "questions"
  | "review"
  | "submitted"
  | "error"

const CHECK_TRANSLATION_KEYS: Record<VerificationCheckType, string> = {
  credit: "applyFlow.requiredChecks.credit",
  criminal: "applyFlow.requiredChecks.criminal",
  eviction: "applyFlow.requiredChecks.eviction",
  income: "applyFlow.requiredChecks.income",
  identity: "applyFlow.requiredChecks.identity",
  references: "applyFlow.requiredChecks.references",
}

function isAnswerProvided(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0
  }
  if (typeof value === "number") {
    return !Number.isNaN(value)
  }
  return value !== null && value !== undefined
}

function formatCurrency(value: number | null | undefined, locale: string) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number | null | undefined, locale: string) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null
  }

  return new Intl.NumberFormat(locale).format(value)
}

function formatAnswerValue(value: unknown, emptyLabel: string) {
  if (value === null || value === undefined || value === "") {
    return emptyLabel
  }
  return String(value)
}

export function ApplyPageClient() {
  const params = useParams()
  const { t, i18n } = useTranslation()
  const token = (params?.token ?? "") as string
  const locale = i18n.resolvedLanguage || i18n.language || "en"

  const [step, setStep] = useState<Step>("loading")
  const [validation, setValidation] = useState<ApplicationLinkValidation | null>(null)
  const [error, setError] = useState("")
  const [applicationId, setApplicationId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [criteriaAcknowledged, setCriteriaAcknowledged] = useState(false)
  const [screeningConsent, setScreeningConsent] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [currentAddress, setCurrentAddress] = useState("")
  const [employer, setEmployer] = useState("")
  const [annualIncome, setAnnualIncome] = useState("")
  const [desiredMoveIn, setDesiredMoveIn] = useState("")
  const [answers, setAnswers] = useState<Record<string, unknown>>({})

  useEffect(() => {
    let cancelled = false

    async function loadValidation() {
      try {
        const result = await validateApplyToken(token, locale)
        if (cancelled) {
          return
        }

        if (result.valid) {
          setValidation(result)
          setError("")
          setStep((currentStep) =>
            currentStep === "loading" || currentStep === "error" ? "property" : currentStep
          )
          return
        }

        setError(result.error || t("applyFlow.messages.invalidLink"))
        setStep("error")
      } catch {
        if (!cancelled) {
          setError(t("applyFlow.messages.validationFailed"))
          setStep("error")
        }
      }
    }

    void loadValidation()

    return () => {
      cancelled = true
    }
  }, [locale, t, token])

  async function handleCreateApplication() {
    setSubmitting(true)
    setError("")

    try {
      const application = await createApplication({
        token,
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        currentAddress: currentAddress || undefined,
        employer: employer || undefined,
        annualIncome: annualIncome ? Number.parseFloat(annualIncome) : undefined,
        desiredMoveIn: desiredMoveIn || undefined,
      })

      setApplicationId(application.id)
      setStep((validation?.questions?.length ?? 0) > 0 ? "questions" : "review")
    } catch (err) {
      setError(
        err instanceof Error ? err.message || t("applyFlow.messages.createFailed") : t("applyFlow.messages.createFailed")
      )
    } finally {
      setSubmitting(false)
    }
  }

  function getMissingRequiredQuestions(questions: ScreeningQuestion[]) {
    return questions.filter((question) => question.isRequired && !isAnswerProvided(answers[question.id]))
  }

  function handleContinueFromQuestions() {
    const questions = validation?.questions ?? []
    const missingQuestions = getMissingRequiredQuestions(questions)

    if (missingQuestions.length > 0) {
      setError(t("applyFlow.messages.answerRequiredQuestions"))
      return
    }

    setError("")
    setStep("review")
  }

  async function handleSubmit() {
    const disclosureSnapshot = validation?.disclosureSnapshot
    const consentVersion = validation?.consentCopy?.version

    if (!applicationId || !disclosureSnapshot || !consentVersion) {
      setError(t("applyFlow.messages.missingApplicationContext"))
      return
    }

    if (!criteriaAcknowledged || !screeningConsent) {
      setError(t("applyFlow.messages.consentRequired"))
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))

      await submitApplication(applicationId, {
        token,
        answers: answerArray,
        criteriaAcknowledged: true,
        screeningConsent: true,
        consentVersion,
        disclosureSnapshot: disclosureSnapshot as ApplicationDisclosureSnapshot,
      })

      setStep("submitted")
    } catch (err) {
      setError(
        err instanceof Error ? err.message || t("applyFlow.messages.submitFailed") : t("applyFlow.messages.submitFailed")
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleAnswerChange(questionId: string, value: unknown) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: value }))
    if (error) {
      setError("")
    }
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-12">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-2xl border bg-background p-10 text-center shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{t("applyFlow.loading.title")}</p>
            <p className="text-sm text-foreground/70">{t("applyFlow.loading.body")}</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === "error") {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-2xl font-semibold text-destructive">
            !
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-foreground">{t("applyFlow.error.title")}</h1>
          <p className="text-sm leading-6 text-foreground/70">{error}</p>
        </div>
      </div>
    )
  }

  if (step === "submitted") {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            ✓
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-foreground">{t("applyFlow.submitted.title")}</h1>
          <p className="mb-3 text-sm leading-6 text-foreground/70">
            {t("applyFlow.submitted.body", { property: validation?.property?.title ?? "" })}
          </p>
          <p className="text-sm text-foreground/60">{t("applyFlow.submitted.followUp")}</p>
        </div>
      </div>
    )
  }

  const property = validation?.property
  const disclosure = validation?.applicationDisclosure
  const questions = validation?.questions ?? []
  const hasQuestions = questions.length > 0
  const progressSteps = [
    { id: "property", label: t("applyFlow.progress.property") },
    { id: "disclosure", label: t("applyFlow.progress.disclosure") },
    { id: "personal", label: t("applyFlow.progress.personal") },
    ...(hasQuestions ? [{ id: "questions", label: t("applyFlow.progress.questions") }] : []),
    { id: "review", label: t("applyFlow.progress.review") },
  ] as Array<{ id: Exclude<Step, "loading" | "submitted" | "error">; label: string }>

  const currentStepIndex = progressSteps.findIndex((progressStep) => progressStep.id === step)
  const currentStepLabel =
    progressSteps[currentStepIndex]?.label ?? t("applyFlow.progress.property")

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground/55">
            <span>{t("applyFlow.progressLabel")}</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {currentStepLabel}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {progressSteps.map((progressStep, index) => {
              const isComplete = currentStepIndex >= index
              return (
                <div
                  key={progressStep.id}
                  className={`rounded-2xl border px-4 py-3 transition-colors ${
                    isComplete
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground/55"
                  }`}
                >
                  <div className="text-xs font-semibold">{index + 1}</div>
                  <div className="mt-1 text-sm font-medium">{progressStep.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-background/80">
              <CardTitle className="text-2xl">{property?.title}</CardTitle>
              <CardDescription>{property?.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {step === "property" && property && (
                <PropertyStep
                  property={property}
                  locale={locale}
                  description={t("applyFlow.property.description")}
                  startLabel={t("applyFlow.property.start")}
                  bedsLabel={t("applyFlow.property.bedrooms")}
                  bathsLabel={t("applyFlow.property.bathrooms")}
                  sqftLabel={t("applyFlow.property.sqft")}
                  monthlyLabel={t("applyFlow.property.monthlyRent")}
                  availabilityLabel={t("applyFlow.property.availability")}
                  onContinue={() => {
                    setError("")
                    setStep("disclosure")
                  }}
                />
              )}

              {step === "disclosure" && disclosure && (
                <DisclosureStep
                  disclosure={disclosure}
                  locale={locale}
                  criteria={validation?.screeningCriteriaSummary ?? []}
                  requiredChecks={validation?.requiredChecks ?? []}
                  acceptanceCriteria={validation?.acceptanceCriteria}
                  criteriaAcknowledged={criteriaAcknowledged}
                  screeningConsent={screeningConsent}
                  onCriteriaAcknowledgedChange={setCriteriaAcknowledged}
                  onScreeningConsentChange={setScreeningConsent}
                  disclosureTitle={validation?.consentCopy?.disclosureTitle ?? t("applyFlow.disclosure.title")}
                  disclosureBody={validation?.consentCopy?.disclosureBody ?? t("applyFlow.disclosure.body")}
                  criteriaAcknowledgementLabel={
                    validation?.consentCopy?.criteriaAcknowledgementLabel ??
                    t("applyFlow.disclosure.criteriaAcknowledgementLabel")
                  }
                  screeningConsentLabel={
                    validation?.consentCopy?.screeningConsentLabel ??
                    t("applyFlow.disclosure.screeningConsentLabel")
                  }
                  futureFeeNotice={
                    validation?.consentCopy?.futureFeeNotice ??
                    t("applyFlow.disclosure.futureFeeNotice")
                  }
                  emptyChargesLabel={t("applyFlow.disclosure.emptyCharges")}
                  emptyUseBasedChargesLabel={t("applyFlow.disclosure.emptyUseBasedCharges")}
                  emptyCriteriaLabel={t("applyFlow.disclosure.emptyCriteria")}
                  rentLabel={t("applyFlow.disclosure.rent")}
                  availabilityLabel={t("applyFlow.disclosure.availability")}
                  fixedChargesLabel={t("applyFlow.disclosure.fixedCharges")}
                  useBasedChargesLabel={t("applyFlow.disclosure.useBasedCharges")}
                  criteriaLabel={t("applyFlow.disclosure.criteria")}
                  requiredChecksLabel={t("applyFlow.disclosure.requiredChecks")}
                  feeCollectionLabel={t("applyFlow.disclosure.feeCollectionStatus")}
                  refundInstructionsLabel={t("applyFlow.disclosure.refundRecoveryInstructions")}
                  ownerNotesLabel={t("applyFlow.disclosure.ownerNotes")}
                  backLabel={t("actions.back")}
                  continueLabel={t("applyFlow.disclosure.continue")}
                  error={error}
                  onBack={() => {
                    setError("")
                    setStep("property")
                  }}
                  onContinue={() => {
                    if (!criteriaAcknowledged || !screeningConsent) {
                      setError(t("applyFlow.messages.consentRequired"))
                      return
                    }

                    setError("")
                    setStep("personal")
                  }}
                  getCheckLabel={(checkType) => t(CHECK_TRANSLATION_KEYS[checkType])}
                />
              )}

              {step === "personal" && (
                <PersonalStep
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  phone={phone}
                  dateOfBirth={dateOfBirth}
                  currentAddress={currentAddress}
                  employer={employer}
                  annualIncome={annualIncome}
                  desiredMoveIn={desiredMoveIn}
                  onFirstNameChange={setFirstName}
                  onLastNameChange={setLastName}
                  onEmailChange={setEmail}
                  onPhoneChange={setPhone}
                  onDateOfBirthChange={setDateOfBirth}
                  onCurrentAddressChange={setCurrentAddress}
                  onEmployerChange={setEmployer}
                  onAnnualIncomeChange={setAnnualIncome}
                  onDesiredMoveInChange={setDesiredMoveIn}
                  onBack={() => {
                    setError("")
                    setStep("disclosure")
                  }}
                  onContinue={handleCreateApplication}
                  submitting={submitting}
                  error={error}
                  backLabel={t("actions.back")}
                  continueLabel={t("applyFlow.personal.continue")}
                  savingLabel={t("applyFlow.personal.saving")}
                  title={t("applyFlow.personal.title")}
                  subtitle={t("applyFlow.personal.subtitle")}
                  labels={{
                    firstName: t("applyFlow.personal.fields.firstName"),
                    lastName: t("applyFlow.personal.fields.lastName"),
                    email: t("applyFlow.personal.fields.email"),
                    phone: t("applyFlow.personal.fields.phone"),
                    dateOfBirth: t("applyFlow.personal.fields.dateOfBirth"),
                    currentAddress: t("applyFlow.personal.fields.currentAddress"),
                    employer: t("applyFlow.personal.fields.employer"),
                    annualIncome: t("applyFlow.personal.fields.annualIncome"),
                    desiredMoveIn: t("applyFlow.personal.fields.desiredMoveIn"),
                  }}
                  placeholders={{
                    phone: t("applyFlow.personal.placeholders.phone"),
                    currentAddress: t("applyFlow.personal.placeholders.currentAddress"),
                    employer: t("applyFlow.personal.placeholders.employer"),
                    annualIncome: t("applyFlow.personal.placeholders.annualIncome"),
                  }}
                  affordabilityCalculator={
                    property?.price ? <AffordabilityCalculator monthlyRent={property.price} requiredRatio={3} /> : null
                  }
                />
              )}

              {step === "questions" && (
                <QuestionsStep
                  questions={questions}
                  answers={answers}
                  error={error}
                  title={t("applyFlow.questions.title")}
                  subtitle={t("applyFlow.questions.subtitle")}
                  yesLabel={t("applyFlow.questions.yes")}
                  noLabel={t("applyFlow.questions.no")}
                  requiredLabel={t("applyFlow.questions.required")}
                  backLabel={t("actions.back")}
                  continueLabel={t("applyFlow.questions.continue")}
                  onAnswerChange={handleAnswerChange}
                  onBack={() => {
                    setError("")
                    setStep("personal")
                  }}
                  onContinue={handleContinueFromQuestions}
                />
              )}

              {step === "review" && (
                <ReviewStep
                  firstName={firstName}
                  lastName={lastName}
                  email={email}
                  phone={phone}
                  employer={employer}
                  annualIncome={annualIncome}
                  desiredMoveIn={desiredMoveIn}
                  questions={questions}
                  answers={answers}
                  requiredChecks={validation?.requiredChecks ?? []}
                  onBack={() => {
                    setError("")
                    setStep(hasQuestions ? "questions" : "personal")
                  }}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={error}
                  backLabel={t("actions.back")}
                  title={t("applyFlow.review.title")}
                  submitLabel={t("applyFlow.review.submit")}
                  submittingLabel={t("applyFlow.review.submitting")}
                  personalInfoLabel={t("applyFlow.review.personalInfo")}
                  answersLabel={t("applyFlow.review.answers")}
                  screeningLabel={t("applyFlow.review.screeningChecks")}
                  consentSummaryLabel={t("applyFlow.review.consentSummary")}
                  disclosureConfirmedLabel={t("applyFlow.review.disclosureConfirmed")}
                  emptyAnswerLabel={t("applyFlow.review.emptyAnswer")}
                  fields={{
                    name: t("applyFlow.review.fields.name"),
                    email: t("applyFlow.review.fields.email"),
                    phone: t("applyFlow.review.fields.phone"),
                    employer: t("applyFlow.review.fields.employer"),
                    income: t("applyFlow.review.fields.income"),
                    moveIn: t("applyFlow.review.fields.moveIn"),
                  }}
                  getCheckLabel={(checkType) => t(CHECK_TRANSLATION_KEYS[checkType])}
                  locale={locale}
                />
              )}
            </CardContent>
          </Card>

          <ApplicationSummarySidebar
            property={property}
            disclosure={disclosure}
            locale={locale}
            title={t("applyFlow.sidebar.title")}
            rentLabel={t("applyFlow.sidebar.rent")}
            availabilityLabel={t("applyFlow.sidebar.availability")}
            checksLabel={t("applyFlow.sidebar.screeningChecks")}
            criteriaLabel={t("applyFlow.sidebar.criteria")}
            emptyCriteriaLabel={t("applyFlow.disclosure.emptyCriteria")}
            getCheckLabel={(checkType) => t(CHECK_TRANSLATION_KEYS[checkType])}
            requiredChecks={validation?.requiredChecks ?? []}
            criteria={validation?.screeningCriteriaSummary ?? []}
          />
        </div>
      </div>
    </div>
  )
}

function PropertyStep({
  property,
  locale,
  description,
  startLabel,
  bedsLabel,
  bathsLabel,
  sqftLabel,
  monthlyLabel,
  availabilityLabel,
  onContinue,
}: {
  property: NonNullable<ApplicationLinkValidation["property"]>
  locale: string
  description: string
  startLabel: string
  bedsLabel: string
  bathsLabel: string
  sqftLabel: string
  monthlyLabel: string
  availabilityLabel: string
  onContinue: () => void
}) {
  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm leading-6 text-foreground/70">{description}</p>

      {property.photos.length > 0 && (
        <div className="relative h-72 overflow-hidden rounded-2xl border">
          <PropertyImage
            src={property.photos[0]?.url || ""}
            alt={property.title}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label={bedsLabel} value={String(property.bedrooms)} />
        <StatCard label={bathsLabel} value={String(property.bathrooms)} />
        <StatCard label={sqftLabel} value={formatNumber(property.sqft, locale) || "0"} />
        <StatCard
          label={monthlyLabel}
          value={formatCurrency(property.price, locale) || ""}
          caption={availabilityLabel}
        />
      </div>

      {property.availability && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground/80">
          <span className="font-medium text-foreground">{availabilityLabel}:</span>{" "}
          {property.availability}
        </div>
      )}

      {property.description && (
        <div className="rounded-2xl border bg-muted/30 p-5 text-sm leading-6 text-foreground/75">
          {property.description}
        </div>
      )}

      <Button onClick={onContinue} size="lg" className="w-full sm:w-auto">
        {startLabel}
      </Button>
    </div>
  )
}

function DisclosureStep({
  disclosure,
  locale,
  criteria,
  requiredChecks,
  acceptanceCriteria,
  criteriaAcknowledged,
  screeningConsent,
  onCriteriaAcknowledgedChange,
  onScreeningConsentChange,
  disclosureTitle,
  disclosureBody,
  criteriaAcknowledgementLabel,
  screeningConsentLabel,
  futureFeeNotice,
  emptyChargesLabel,
  emptyUseBasedChargesLabel,
  emptyCriteriaLabel,
  rentLabel,
  availabilityLabel,
  fixedChargesLabel,
  useBasedChargesLabel,
  criteriaLabel,
  requiredChecksLabel,
  feeCollectionLabel,
  refundInstructionsLabel,
  ownerNotesLabel,
  backLabel,
  continueLabel,
  error,
  onBack,
  onContinue,
  getCheckLabel,
}: {
  disclosure: ApplicationDisclosure
  locale: string
  criteria: string[]
  requiredChecks: VerificationCheckType[]
  acceptanceCriteria?: AcceptanceCriteria
  criteriaAcknowledged: boolean
  screeningConsent: boolean
  onCriteriaAcknowledgedChange: (value: boolean) => void
  onScreeningConsentChange: (value: boolean) => void
  disclosureTitle: string
  disclosureBody: string
  criteriaAcknowledgementLabel: string
  screeningConsentLabel: string
  futureFeeNotice: string
  emptyChargesLabel: string
  emptyUseBasedChargesLabel: string
  emptyCriteriaLabel: string
  rentLabel: string
  availabilityLabel: string
  fixedChargesLabel: string
  useBasedChargesLabel: string
  criteriaLabel: string
  requiredChecksLabel: string
  feeCollectionLabel: string
  refundInstructionsLabel: string
  ownerNotesLabel: string
  backLabel: string
  continueLabel: string
  error: string
  onBack: () => void
  onContinue: () => void
  getCheckLabel: (checkType: VerificationCheckType) => string
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{disclosureTitle}</h2>
        <p className="max-w-2xl text-sm leading-6 text-foreground/70">{disclosureBody}</p>
      </div>

      {acceptanceCriteria && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-5 space-y-4">
          <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
            Acceptance Criteria — Please Review Before Proceeding
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Your application will be evaluated against the following criteria. Please ensure you meet these requirements before continuing.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {acceptanceCriteria.minimumCreditScore !== null && (
              <div className="rounded-xl border bg-background px-4 py-3">
                <div className="text-xs font-medium text-foreground/50">Minimum Credit Score</div>
                <div className="text-lg font-semibold">{acceptanceCriteria.minimumCreditScore}</div>
              </div>
            )}
            {acceptanceCriteria.minimumIncomeRatio !== null && (
              <div className="rounded-xl border bg-background px-4 py-3">
                <div className="text-xs font-medium text-foreground/50">Income Requirement</div>
                <div className="text-lg font-semibold">{acceptanceCriteria.minimumIncomeRatio}x monthly rent</div>
              </div>
            )}
            {acceptanceCriteria.noEvictionHistory && (
              <div className="rounded-xl border bg-background px-4 py-3">
                <div className="text-xs font-medium text-foreground/50">Eviction History</div>
                <div className="text-sm font-medium">No prior evictions</div>
              </div>
            )}
            {acceptanceCriteria.noCriminalHistory && (
              <div className="rounded-xl border bg-background px-4 py-3">
                <div className="text-xs font-medium text-foreground/50">Criminal History</div>
                <div className="text-sm font-medium">No disqualifying criminal history</div>
              </div>
            )}
          </div>
          {acceptanceCriteria.requiredDocuments.length > 0 && (
            <div>
              <div className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">Required Documents</div>
              <div className="flex flex-wrap gap-2">
                {acceptanceCriteria.requiredDocuments.map((doc) => (
                  <Badge key={doc} variant="outline" className="rounded-full border-amber-500/40 text-amber-800 dark:text-amber-300">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-foreground/50">Application Fee: </span>
              <span className="font-medium">
                {acceptanceCriteria.applicationFee !== null
                  ? `${formatCurrency(acceptanceCriteria.applicationFee, locale)}${acceptanceCriteria.feeRefundable ? " (refundable)" : " (non-refundable)"}`
                  : "No fee at this time"}
              </span>
            </div>
            <div>
              <span className="text-foreground/50">Processing Time: </span>
              <span className="font-medium">{acceptanceCriteria.processingTime}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <InfoPanel label={rentLabel} value={formatCurrency(disclosure.rentAmount, locale) || "—"} />
        <InfoPanel label={availabilityLabel} value={disclosure.availability || "—"} />
      </div>

      <SectionCard title={fixedChargesLabel}>
        {disclosure.fixedNonRentCharges.length === 0 ? (
          <p className="text-sm text-foreground/60">{emptyChargesLabel}</p>
        ) : (
          <div className="space-y-3">
            {disclosure.fixedNonRentCharges.map((charge, index) => (
              <div
                key={`${charge.label}-${index}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background px-4 py-3 text-sm"
              >
                <div className="font-medium text-foreground">{charge.label}</div>
                <div className="text-foreground/70">
                  {charge.amount !== null ? formatCurrency(charge.amount, locale) : "—"}
                  {charge.frequency ? ` • ${charge.frequency}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title={useBasedChargesLabel}>
        {disclosure.useBasedChargeCategories.length === 0 ? (
          <p className="text-sm text-foreground/60">{emptyUseBasedChargesLabel}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {disclosure.useBasedChargeCategories.map((category) => (
              <Badge key={category} variant="secondary" className="rounded-full px-3 py-1">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title={criteriaLabel}>
          {criteria.length === 0 ? (
            <p className="text-sm text-foreground/60">{emptyCriteriaLabel}</p>
          ) : (
            <ul className="space-y-2 text-sm leading-6 text-foreground/80">
              {criteria.map((criterion) => (
                <li key={criterion} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title={requiredChecksLabel}>
          <div className="flex flex-wrap gap-2">
            {requiredChecks.map((checkType) => (
              <Badge key={checkType} className="rounded-full px-3 py-1">
                {getCheckLabel(checkType)}
              </Badge>
            ))}
          </div>
        </SectionCard>
      </div>

      {disclosure.applicantDisclosureNotes && (
        <SectionCard title={ownerNotesLabel}>
          <p className="text-sm leading-6 text-foreground/80">{disclosure.applicantDisclosureNotes}</p>
        </SectionCard>
      )}

      <SectionCard title={feeCollectionLabel}>
        <p className="text-sm leading-6 text-foreground/80">{disclosure.feeCollectionStatus}</p>
      </SectionCard>

      <SectionCard title={refundInstructionsLabel}>
        <p className="text-sm leading-6 text-foreground/80">{disclosure.refundRecoveryInstructions}</p>
      </SectionCard>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground/80">
        {futureFeeNotice}
      </div>

      <div className="space-y-4 rounded-2xl border bg-muted/30 p-5">
        <label className="flex items-start gap-3 text-sm leading-6 text-foreground/80">
          <Checkbox
            checked={criteriaAcknowledged}
            onCheckedChange={(checked) => onCriteriaAcknowledgedChange(checked === true)}
            className="mt-1"
          />
          <span>{criteriaAcknowledgementLabel}</span>
        </label>

        <label className="flex items-start gap-3 text-sm leading-6 text-foreground/80">
          <Checkbox
            checked={screeningConsent}
            onCheckedChange={(checked) => onScreeningConsentChange(checked === true)}
            className="mt-1"
          />
          <span>{screeningConsentLabel}</span>
        </label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={onBack} className="sm:min-w-36">
          {backLabel}
        </Button>
        <Button onClick={onContinue} className="sm:min-w-44">
          {continueLabel}
        </Button>
      </div>
    </div>
  )
}

function PersonalStep({
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  currentAddress,
  employer,
  annualIncome,
  desiredMoveIn,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onDateOfBirthChange,
  onCurrentAddressChange,
  onEmployerChange,
  onAnnualIncomeChange,
  onDesiredMoveInChange,
  onBack,
  onContinue,
  submitting,
  error,
  backLabel,
  continueLabel,
  savingLabel,
  title,
  subtitle,
  labels,
  placeholders,
  affordabilityCalculator,
}: {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  currentAddress: string
  employer: string
  annualIncome: string
  desiredMoveIn: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onDateOfBirthChange: (value: string) => void
  onCurrentAddressChange: (value: string) => void
  onEmployerChange: (value: string) => void
  onAnnualIncomeChange: (value: string) => void
  onDesiredMoveInChange: (value: string) => void
  onBack: () => void
  onContinue: () => void
  submitting: boolean
  error: string
  backLabel: string
  continueLabel: string
  savingLabel: string
  title: string
  subtitle: string
  labels: Record<string, string>
  placeholders: Record<string, string>
  affordabilityCalculator: ReactNode
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-foreground/70">{subtitle}</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.firstName} required>
          <Input value={firstName} onChange={(event) => onFirstNameChange(event.target.value)} />
        </Field>
        <Field label={labels.lastName} required>
          <Input value={lastName} onChange={(event) => onLastNameChange(event.target.value)} />
        </Field>
      </div>

      <Field label={labels.email} required>
        <Input type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.phone}>
          <Input
            type="tel"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder={placeholders.phone}
          />
        </Field>
        <Field label={labels.dateOfBirth}>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(event) => onDateOfBirthChange(event.target.value)}
          />
        </Field>
      </div>

      <Field label={labels.currentAddress}>
        <Textarea
          value={currentAddress}
          onChange={(event) => onCurrentAddressChange(event.target.value)}
          placeholder={placeholders.currentAddress}
          rows={3}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={labels.employer}>
          <Input
            value={employer}
            onChange={(event) => onEmployerChange(event.target.value)}
            placeholder={placeholders.employer}
          />
        </Field>
        <Field label={labels.annualIncome}>
          <Input
            type="number"
            value={annualIncome}
            onChange={(event) => onAnnualIncomeChange(event.target.value)}
            placeholder={placeholders.annualIncome}
          />
        </Field>
      </div>

      <Field label={labels.desiredMoveIn}>
        <Input
          type="date"
          value={desiredMoveIn}
          onChange={(event) => onDesiredMoveInChange(event.target.value)}
        />
      </Field>

      {affordabilityCalculator}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={onBack} className="sm:min-w-36">
          {backLabel}
        </Button>
        <Button
          onClick={onContinue}
          disabled={!firstName || !lastName || !email || submitting}
          className="sm:min-w-44"
        >
          {submitting ? savingLabel : continueLabel}
        </Button>
      </div>
    </div>
  )
}

function QuestionsStep({
  questions,
  answers,
  error,
  title,
  subtitle,
  yesLabel,
  noLabel,
  requiredLabel,
  backLabel,
  continueLabel,
  onAnswerChange,
  onBack,
  onContinue,
}: {
  questions: ScreeningQuestion[]
  answers: Record<string, unknown>
  error: string
  title: string
  subtitle: string
  yesLabel: string
  noLabel: string
  requiredLabel: string
  backLabel: string
  continueLabel: string
  onAnswerChange: (questionId: string, value: unknown) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-foreground/70">{subtitle}</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="rounded-2xl border bg-muted/20 p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Label className="text-base font-medium leading-6 text-foreground">
                {question.questionText}
              </Label>
              {question.isRequired && <Badge variant="secondary">{requiredLabel}</Badge>}
            </div>

            {question.questionType === "text" && (
              <Textarea
                value={typeof answers[question.id] === "string" ? String(answers[question.id]) : ""}
                onChange={(event) => onAnswerChange(question.id, event.target.value)}
                rows={4}
              />
            )}

            {question.questionType === "yes_no" && (
              <div className="flex flex-wrap gap-4">
                {[
                  { label: yesLabel, value: "yes" },
                  { label: noLabel, value: "no" },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option.value}
                      onChange={() => onAnswerChange(question.id, option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.questionType === "number" && (
              <Input
                type="number"
                value={typeof answers[question.id] === "number" ? String(answers[question.id]) : ""}
                onChange={(event) =>
                  onAnswerChange(
                    question.id,
                    event.target.value === "" ? null : Number.parseFloat(event.target.value)
                  )
                }
              />
            )}

            {question.questionType === "multiple_choice" && question.options && (
              <div className="space-y-2">
                {(question.options as string[]).map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm text-foreground/80">
                    <input
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option}
                      onChange={() => onAnswerChange(question.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={onBack} className="sm:min-w-36">
          {backLabel}
        </Button>
        <Button onClick={onContinue} className="sm:min-w-44">
          {continueLabel}
        </Button>
      </div>
    </div>
  )
}

function ReviewStep({
  firstName,
  lastName,
  email,
  phone,
  employer,
  annualIncome,
  desiredMoveIn,
  questions,
  answers,
  requiredChecks,
  onBack,
  onSubmit,
  submitting,
  error,
  backLabel,
  title,
  submitLabel,
  submittingLabel,
  personalInfoLabel,
  answersLabel,
  screeningLabel,
  consentSummaryLabel,
  disclosureConfirmedLabel,
  emptyAnswerLabel,
  fields,
  getCheckLabel,
  locale,
}: {
  firstName: string
  lastName: string
  email: string
  phone: string
  employer: string
  annualIncome: string
  desiredMoveIn: string
  questions: ScreeningQuestion[]
  answers: Record<string, unknown>
  requiredChecks: VerificationCheckType[]
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
  error: string
  backLabel: string
  title: string
  submitLabel: string
  submittingLabel: string
  personalInfoLabel: string
  answersLabel: string
  screeningLabel: string
  consentSummaryLabel: string
  disclosureConfirmedLabel: string
  emptyAnswerLabel: string
  fields: Record<string, string>
  getCheckLabel: (checkType: VerificationCheckType) => string
  locale: string
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>

      <SectionCard title={personalInfoLabel}>
        <div className="grid gap-3 text-sm text-foreground/80 md:grid-cols-2">
          <ReviewField label={fields.name} value={`${firstName} ${lastName}`.trim()} />
          <ReviewField label={fields.email} value={email} />
          {phone && <ReviewField label={fields.phone} value={phone} />}
          {employer && <ReviewField label={fields.employer} value={employer} />}
          {annualIncome && (
            <ReviewField
              label={fields.income}
              value={formatCurrency(Number.parseFloat(annualIncome), locale) || annualIncome}
            />
          )}
          {desiredMoveIn && <ReviewField label={fields.moveIn} value={desiredMoveIn} />}
        </div>
      </SectionCard>

      {questions.length > 0 && (
        <SectionCard title={answersLabel}>
          <div className="space-y-3 text-sm text-foreground/80">
            {questions.map((question) => (
              <ReviewField
                key={question.id}
                label={question.questionText}
                value={formatAnswerValue(answers[question.id], emptyAnswerLabel)}
              />
            ))}
          </div>
        </SectionCard>
      )}

      <SectionCard title={screeningLabel}>
        <div className="flex flex-wrap gap-2">
          {requiredChecks.map((checkType) => (
            <Badge key={checkType} className="rounded-full px-3 py-1">
              {getCheckLabel(checkType)}
            </Badge>
          ))}
        </div>
      </SectionCard>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-foreground/80">
        <span className="font-medium text-foreground">{consentSummaryLabel}:</span>{" "}
        {disclosureConfirmedLabel}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={onBack} className="sm:min-w-36">
          {backLabel}
        </Button>
        <Button onClick={onSubmit} disabled={submitting} className="sm:min-w-52">
          {submitting ? submittingLabel : submitLabel}
        </Button>
      </div>
    </div>
  )
}

function ApplicationSummarySidebar({
  property,
  disclosure,
  locale,
  title,
  rentLabel,
  availabilityLabel,
  checksLabel,
  criteriaLabel,
  emptyCriteriaLabel,
  getCheckLabel,
  requiredChecks,
  criteria,
}: {
  property: ApplicationLinkValidation["property"]
  disclosure: ApplicationDisclosure | undefined
  locale: string
  title: string
  rentLabel: string
  availabilityLabel: string
  checksLabel: string
  criteriaLabel: string
  emptyCriteriaLabel: string
  getCheckLabel: (checkType: VerificationCheckType) => string
  requiredChecks: VerificationCheckType[]
  criteria: string[]
}) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{property?.title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <InfoPanel
          label={rentLabel}
          value={formatCurrency(disclosure?.rentAmount ?? property?.price, locale) || "—"}
        />
        <InfoPanel
          label={availabilityLabel}
          value={disclosure?.availability || property?.availability || "—"}
        />

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{checksLabel}</h3>
          <div className="flex flex-wrap gap-2">
            {requiredChecks.map((checkType) => (
              <Badge key={checkType} variant="outline" className="rounded-full px-3 py-1">
                {getCheckLabel(checkType)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{criteriaLabel}</h3>
          {criteria.length === 0 ? (
            <p className="text-sm text-foreground/60">{emptyCriteriaLabel}</p>
          ) : (
            <ul className="space-y-2 text-sm leading-6 text-foreground/75">
              {criteria.map((criterion) => (
                <li key={criterion}>{criterion}</li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
        {title}
      </h3>
      {children}
    </div>
  )
}

function StatCard({
  label,
  value,
  caption,
}: {
  label: string
  value: string
  caption?: string
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
      {caption && <div className="mt-1 text-xs text-foreground/55">{caption}</div>}
    </div>
  )
}

function InfoPanel({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border bg-background px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/50">{label}</div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

function ReviewField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border bg-background px-4 py-3">
      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-foreground/50">
        {label}
      </span>
      <span className="mt-1 block text-sm text-foreground">{value}</span>
    </div>
  )
}
