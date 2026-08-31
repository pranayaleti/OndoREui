"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createRentalFeeIntent,
  getRentalApplication,
  inviteCoApplicant,
  saveRentalProgress,
  submitRentalApplication,
  type ApplicationBundle,
} from "@/lib/api/rental"
import {
  WIZARD_STEPS,
  asWizardPayload,
  formatCents,
  hasNoChargeablePets,
  householdOccupantsForEdit,
  employmentRecordsForEdit,
  petAnimalsForEdit,
  residencesForEdit,
  rememberRentalApplication,
  restoreChargeablePetRow,
  setNoChargeablePets,
  type WizardPayload,
  type WizardStepId,
} from "@/lib/rental-application"
import { ApplicationProgress } from "@/components/rental/application-progress"
import { ApplicationChecklist } from "@/components/rental/application-checklist"
import { ApplicationStatusBadge } from "@/components/rental/application-status"
import { DocumentUploader } from "@/components/rental/document-uploader"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"
import { FeeSummary } from "@/components/rental/fee-summary"
import { HouseholdOccupants } from "@/components/rental/household-occupants"
import { EmploymentRecords } from "@/components/rental/employment-records"
import { RentalResidences } from "@/components/rental/rental-residences"
import { PetAnimals } from "@/components/rental/pet-animals"
import { PetInformation } from "@/components/rental/pet-information"
import { PropertyRequirements } from "@/components/rental/property-requirements"
import { InsuranceStatus } from "@/components/rental/insurance-status"
import { ApplicationTimeline } from "@/components/rental/application-timeline"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import { analytics } from "@/lib/analytics"
import { trackRentalFunnel } from "@/lib/rental-analytics"

type Payload = WizardPayload

function asPayload(value: unknown): Payload {
  return asWizardPayload(value)
}

export function RentalApplicationWizard({
  applicationId,
  resumeToken,
  applyToken,
}: {
  applicationId: string
  resumeToken?: string
  applyToken?: string
}) {
  const [bundle, setBundle] = useState<ApplicationBundle | null>(null)
  const [payload, setPayload] = useState<Payload>({})
  const [step, setStep] = useState<WizardStepId>("property")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [coEmail, setCoEmail] = useState("")
  const [coFirst, setCoFirst] = useState("")
  const [coLast, setCoLast] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [feeMessage, setFeeMessage] = useState("")

  const load = useCallback(async () => {
    const next = await getRentalApplication(applicationId, resumeToken)
    setBundle(next)
    const stored = asPayload(next.application.wizardPayload)
    setPayload(stored)
    const current = WIZARD_STEPS.some((s) => s.id === next.application.currentStep)
      ? (next.application.currentStep as WizardStepId)
      : "applicant"
    setStep(current)
    rememberRentalApplication({
      id: applicationId,
      resumeToken: resumeToken ?? "",
      propertyId: next.application.propertyId,
      propertyTitle: next.property?.title,
      updatedAt: new Date().toISOString(),
    })
  }, [applicationId, resumeToken])

  useEffect(() => {
    void load().catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load application"))
  }, [load])

  useEffect(() => {
    const onPageHide = (event: Event) => {
      const persisted = "persisted" in event && Boolean((event as { persisted?: boolean }).persisted)
      if (persisted || submitted) return
      const propertyRef = bundle?.property?.publicId || bundle?.property?.id
      trackRentalFunnel("application_abandoned", propertyRef)
    }
    window.addEventListener("pagehide", onPageHide)
    return () => window.removeEventListener("pagehide", onPageHide)
  }, [submitted, bundle?.property?.publicId, bundle?.property?.id])

  const persist = async (nextStep: WizardStepId, nextPayload = payload) => {
    setBusy(true)
    setError("")
    try {
      const saved = await saveRentalProgress({
        applicationId,
        resumeToken,
        currentStep: nextStep,
        payload: nextPayload,
      })
      setBundle(saved)
      setPayload(asPayload(saved.application.wizardPayload))
      setStep(nextStep)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save")
    } finally {
      setBusy(false)
    }
  }

  const index = WIZARD_STEPS.findIndex((s) => s.id === step)
  const current = WIZARD_STEPS[index] ?? WIZARD_STEPS[0]

  const applicant = payload.applicant ?? {}
  const occupants = householdOccupantsForEdit(payload)
  const jobs = employmentRecordsForEdit(payload)
  const residences = residencesForEdit(payload)
  const animals = petAnimalsForEdit(payload)
  const auths = payload.authorizations ?? {}

  const completedLabel = useMemo(() => {
    if (!bundle) return ""
    return `${bundle.completedAdultApplicants} of ${bundle.requiredAdults} applicants completed`
  }, [bundle])

  if (error && !bundle) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12">
        <p className="text-destructive">{error}</p>
      </main>
    )
  }

  if (!bundle) {
    return (
      <main className="mx-auto max-w-xl px-4 py-12" aria-busy="true">
        <p>Loading application…</p>
      </main>
    )
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-xl space-y-4 px-4 py-12">
        <h1 className="text-2xl font-bold">Application received</h1>
        <ApplicationStatusBadge status={bundle.application.status} />
        <p className="text-sm text-muted-foreground">{bundle.nextAction}</p>
        <Link href="/applications" className="inline-flex min-h-11 items-center text-sm font-medium underline">
          View my applications
        </Link>
        <FairHousingNotice />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      <header className="mb-6 space-y-3">
        <p className="text-sm text-muted-foreground">Step {current.number} of {WIZARD_STEPS.length}</p>
        <h1 className="text-2xl font-bold">{current.title}</h1>
        <ApplicationProgress currentStep={step} percent={bundle.application.completionPercent} />
        <div className="flex flex-wrap items-center gap-2">
          <ApplicationStatusBadge status={bundle.application.status} />
          <span className="text-sm text-muted-foreground">{completedLabel}</span>
        </div>
      </header>

      {step === "property" ? (
        <section className="space-y-4">
          <p className="font-medium">{bundle.property?.title}</p>
          <p className="text-sm text-muted-foreground">{bundle.property?.address}</p>
          <p>Rent {formatCents(bundle.property?.monthlyRentCents ?? bundle.requirements.monthlyRentCents)}</p>
          <p>Available {bundle.property?.availability || "Ask leasing"}</p>
          <p>Deposit {formatCents(bundle.requirements.securityDepositCents)}</p>
          <PropertyRequirements categories={bundle.requirements.categories} />
        </section>
      ) : null}

      {step === "applicant" ? (
        <section className="space-y-3">
          <div>
            <Label htmlFor="fn">First name</Label>
            <Input id="fn" className="mt-1" value={applicant.firstName ?? ""} onChange={(e) => setPayload((p) => ({ ...p, applicant: { ...applicant, firstName: e.target.value } }))} />
          </div>
          <div>
            <Label htmlFor="ln">Last name</Label>
            <Input id="ln" className="mt-1" value={applicant.lastName ?? ""} onChange={(e) => setPayload((p) => ({ ...p, applicant: { ...applicant, lastName: e.target.value } }))} />
          </div>
          <div>
            <Label htmlFor="em">Email</Label>
            <Input id="em" type="email" className="mt-1" value={applicant.email ?? ""} onChange={(e) => setPayload((p) => ({ ...p, applicant: { ...applicant, email: e.target.value } }))} />
          </div>
          <div>
            <Label htmlFor="ph">Phone</Label>
            <Input id="ph" className="mt-1" value={applicant.phone ?? ""} onChange={(e) => setPayload((p) => ({ ...p, applicant: { ...applicant, phone: e.target.value } }))} />
          </div>
          <div>
            <Label htmlFor="addr">Current address</Label>
            <Input id="addr" className="mt-1" value={applicant.currentAddress ?? ""} onChange={(e) => setPayload((p) => ({ ...p, applicant: { ...applicant, currentAddress: e.target.value } }))} />
          </div>
        </section>
      ) : null}

      {step === "household" ? (
        <section className="space-y-4">
          <HouseholdOccupants
            occupants={occupants}
            onChange={(next) => setPayload((p) => ({ ...p, household: { occupants: next } }))}
          />
          <div className="rounded-xl border border-border p-4">
            <h2 className="font-semibold">Invite a co-applicant</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Input placeholder="First name" value={coFirst} onChange={(e) => setCoFirst(e.target.value)} />
              <Input placeholder="Last name" value={coLast} onChange={(e) => setCoLast(e.target.value)} />
              <Input placeholder="Email" type="email" value={coEmail} onChange={(e) => setCoEmail(e.target.value)} />
            </div>
            <Button
              type="button"
              className="mt-3 min-h-11"
              disabled={busy || !coEmail}
              onClick={async () => {
                setBusy(true)
                try {
                  await inviteCoApplicant(applicationId, {
                    firstName: coFirst || "Co-applicant",
                    lastName: coLast || "Applicant",
                    email: coEmail,
                    resumeToken,
                  })
                  setCoEmail("")
                  await load()
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Invite failed")
                } finally {
                  setBusy(false)
                }
              }}
            >
              Send invite
            </Button>
            <ul className="mt-3 space-y-1 text-sm">
              {bundle.coApplicants.map((co) => (
                <li key={co.id}>
                  {co.firstName} {co.lastName} · {co.email} · {co.status} · {co.completionPercent}%
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {step === "employment" ? (
        <section className="space-y-3">
          <EmploymentRecords
            records={jobs}
            onChange={(next) => setPayload((p) => ({ ...p, employment: { records: next } }))}
          />
        </section>
      ) : null}

      {step === "rental_history" ? (
        <section className="space-y-3">
          <RentalResidences
            residences={residences}
            onChange={(next) => setPayload((p) => ({ ...p, rentalHistory: { residences: next } }))}
          />
        </section>
      ) : null}

      {step === "pets" ? (
        <section className="space-y-3">
          <PetInformation pets={bundle.requirements.pets} assistanceAnimals={bundle.requirements.assistanceAnimals} />
          {bundle.petFees ? (
            <p className="text-sm text-muted-foreground">
              Chargeable pets: {bundle.petFees.chargeablePetCount}. Assistance animals: {bundle.petFees.assistanceAnimalCount}.
            </p>
          ) : null}
          <PetAnimals
            animals={animals}
            onChange={(next) => setPayload((p) => ({ ...p, pets: { animals: next } }))}
          />
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasNoChargeablePets(payload)}
              onChange={() =>
                setPayload((p) => (hasNoChargeablePets(p) ? restoreChargeablePetRow(p) : setNoChargeablePets(p)))
              }
            />
            I have no pets (assistance animals can still be listed above)
          </label>
        </section>
      ) : null}

      {step === "documents" ? (
        <section className="space-y-3">
          {bundle.insurance ? (
            <InsuranceStatus
              status={bundle.insurance.status}
              label={bundle.insurance.label}
              carrier={payload.insurance?.carrier}
              expiration={payload.insurance?.expiration}
            />
          ) : null}
          <div>
            <Label htmlFor="carrier">Insurance carrier (optional)</Label>
            <Input
              id="carrier"
              className="mt-1"
              value={payload.insurance?.carrier ?? ""}
              onChange={(e) =>
                setPayload((p) => ({ ...p, insurance: { ...p.insurance, carrier: e.target.value } }))
              }
            />
          </div>
          <div>
            <Label htmlFor="inexp">Policy expiration</Label>
            <Input
              id="inexp"
              type="date"
              className="mt-1"
              value={payload.insurance?.expiration ?? ""}
              onChange={(e) =>
                setPayload((p) => ({
                  ...p,
                  insurance: { ...p.insurance, expiration: e.target.value, hasPolicy: Boolean(e.target.value) },
                }))
              }
            />
          </div>
          <ApplicationChecklist items={bundle.checklist} />
          {bundle.checklist.map((item) => {
            const current = bundle.documents.find((doc) => doc.documentType === item.type)
            return (
              <DocumentUploader
                key={item.type}
                applicationId={applicationId}
                resumeToken={resumeToken}
                documentType={item.type}
                label={item.label}
                required={item.required}
                current={current}
                onUploaded={() => void load()}
              />
            )
          })}
        </section>
      ) : null}

      {step === "authorization" ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Ondo does not run credit, background, rental, or employment screening itself. Checking these boxes
            authorizes the property&apos;s screening provider to verify the information you provided. This is not an approval.
          </p>
          {(["credit", "background", "rental", "employment", "terms"] as const).map((key) => (
            <label key={key} className="flex min-h-11 items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(auths[key])}
                onChange={(e) => setPayload((p) => ({ ...p, authorizations: { ...auths, [key]: e.target.checked } }))}
              />
              {key === "terms"
                ? "I confirm the information is accurate and I have read the Equal Housing Opportunity statement."
                : `I authorize ${key} verification.`}
            </label>
          ))}
          <FairHousingNotice />
        </section>
      ) : null}

      {step === "review" ? (
        <section className="space-y-3 text-sm">
          <p>
            {applicant.firstName} {applicant.lastName} · {applicant.email}
          </p>
          {(payload.employment?.records ?? []).length === 0 ? <p>No employment records listed.</p> : null}
          {(payload.employment?.records ?? []).map((job, index) => (
            <p key={`review-job-${index}`}>
              {job.employer || "Employer"}
              {job.title ? ` · ${job.title}` : ""}
              {job.duration ? ` · ${job.duration}` : ""}
              {job.selfEmployed ? " (self-employed)" : ""} · {formatCents(job.monthlyIncomeCents)}
            </p>
          ))}
          {(payload.rentalHistory?.residences ?? []).map((row, index) => (
            <p key={`review-res-${index}`}>
              {row.address || "Address"}
              {row.landlordName ? ` · ${row.landlordName}` : ""}
              {row.landlordPhone ? ` · ${row.landlordPhone}` : ""}
              {row.startDate ? ` · ${row.startDate}` : ""}
              {row.endDate ? ` – ${row.endDate}` : ""}
            </p>
          ))}
          <p>{completedLabel}. The application is not complete if required adults are missing.</p>
          <ApplicationChecklist items={bundle.checklist} />
          <FeeSummary requirements={bundle.requirements} />
          <ApplicationTimeline events={bundle.events} />
        </section>
      ) : null}

      {step === "submit" ? (
        <section className="space-y-4">
          <FeeSummary requirements={bundle.requirements} />
          {(bundle.payments ?? []).map((pay) => (
            <p key={pay.id} className="text-sm">
              {pay.paymentType.replace(/_/g, " ")} · {pay.statusLabel}
              {pay.transactionId ? ` · ${pay.transactionId}` : ""}
            </p>
          ))}
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={async () => {
              setBusy(true)
              try {
                const intent = await createRentalFeeIntent(applicationId, resumeToken)
                if (!intent.required) {
                  setFeeMessage("No application fee is due for this home.")
                  return
                }
                if (!intent.configured) setFeeMessage(intent.message || "Pay the listed fee with leasing.")
                else if (intent.clientSecret) {
                  setClientSecret(intent.clientSecret)
                  analytics.trackEvent("rental_fee_intent", "rental_application", "stripe")
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : "Fee step failed")
              } finally {
                setBusy(false)
              }
            }}
          >
            Review payment
          </Button>
          {feeMessage ? <p className="text-sm text-muted-foreground">{feeMessage}</p> : null}
          {clientSecret ? (
            <StripePaymentForm
              clientSecret={clientSecret}
              onSuccess={() => {
                setFeeMessage("Payment successful.")
                setClientSecret(null)
                void load()
              }}
            />
          ) : null}
          <Button
            type="button"
            className="min-h-11 w-full"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              setError("")
              try {
                await persist("submit")
                await submitRentalApplication(applicationId, resumeToken, applyToken)
                analytics.trackEvent("rental_application_submitted", "rental_application", "submit")
                trackRentalFunnel("application_completed", bundle?.property?.publicId || bundle?.property?.id)
                trackRentalFunnel("application_submitted", bundle?.property?.publicId || bundle?.property?.id)
                await load()
                setSubmitted(true)
              } catch (err) {
                setError(err instanceof Error ? err.message : "Submit failed")
              } finally {
                setBusy(false)
              }
            }}
          >
            Submit application
          </Button>
        </section>
      ) : null}

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11 flex-1"
            disabled={busy || index <= 0}
            onClick={() => void persist(WIZARD_STEPS[index - 1]!.id, payload)}
          >
            Back
          </Button>
          <Button
            type="button"
            className="min-h-11 flex-1"
            disabled={busy}
            onClick={() => {
              const next = WIZARD_STEPS[Math.min(index + 1, WIZARD_STEPS.length - 1)]!.id
              void persist(next, payload)
            }}
          >
            {step === "submit" ? "Save" : "Save and continue"}
          </Button>
        </div>
      </div>
    </main>
  )
}
