import { backendUrl } from "@/lib/backend"
import type { WizardStepId } from "@/lib/rental-application"

export type RentalRequirementCategory = { id: string; title: string; items: string[] }

export interface PublicRentalRequirements {
  applicationsOpen: boolean
  whoCanApply: {
    minAge: number
    everyAdultMustApply: boolean
    maxUnrelatedOccupants: number | null
    tourRequiredBeforeApply: boolean
  }
  documents: { types: Array<{ type: string; label: string; required: boolean }> }
  pets: {
    allowed: boolean
    maxCount: number | null
    types?: string[]
    extraDepositCents: number | null
    monthlyPetRentCents: number | null
    notes: string | null
  }
  assistanceAnimals: { documentationMayBeRequested: boolean; additionalFeesOrDeposits: boolean }
  securityDeposit: { monthsOfRent: number | null; amountCents: number | null }
  rentersInsurance: { required: boolean; additionalInsuredName: string | null }
  applicationFees: {
    applicationFeeCents: number
    screeningFeeCents: number
    otherFees: Array<{ label: string; amountCents: number }>
  }
  smoking: { allowed: boolean }
  otherRequirements: string[]
  customDisclosures: string[]
  monthlyRentCents: number | null
  securityDepositCents: number | null
  fairHousingStatement: string
  categories: RentalRequirementCategory[]
}

export interface RentalPublicProfile {
  property: {
    id: string
    publicId: string | null
    title: string
    address: string
    monthlyRentCents: number | null
    availability: string | null
    bedrooms: number | null
    bathrooms: number | null
    sqft: number | null
    amenities: unknown
    leaseTerms: string | null
    fees: string | null
    parking: string | null
  }
  requirements: PublicRentalRequirements
  applyPath: string | null
  applicationsOpen: boolean
}

export interface ReadinessAnswers {
  isAtLeast18: boolean
  adultCount: number
  employed: boolean
  selfEmployed: boolean
  approximateMonthlyIncomeCents: number | null
  creditScoreRangeId: string
  hasRentalHistory: boolean
  hasPets: boolean
  hasAssistanceAnimal: boolean
  smokesOrVapes: boolean
  canObtainRentersInsurance: boolean
}

export interface ReadinessResult {
  outcome: "ready" | "needs_more"
  guaranteesApproval: false
  headline: string
  body: string
  missing: string[]
  notes: string[]
  fairHousingStatement: string
}

export interface RentalApplicationSummary {
  id: string
  propertyId: string
  firstName: string
  lastName: string
  email: string
  status: string
  statusLabel: string
  currentStep: string
  completionPercent: number
  applicantNextAction: string | null
  submittedAt: string | null
  createdAt: string
  updatedAt: string
  resumeToken?: string
  completedAdultApplicants?: number
  requiredAdults?: number
  coApplicantSummary?: string
  property?: RentalPublicProfile["property"]
}

export interface ChecklistItem {
  type: string
  label: string
  required: boolean
  status: string
  isComplete: boolean
}

export interface ApplicationBundle {
  application: RentalApplicationSummary & { wizardPayload?: Record<string, unknown> }
  property: RentalPublicProfile["property"] | null
  requirements: PublicRentalRequirements
  coApplicants: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    status: string
    completionPercent: number
  }>
  documents: Array<{
    id: string
    documentType: string
    status: string
    fileName: string
    uploadedAt: string
    expiresAt?: string | null
    uploadedBy?: string | null
    url?: string
  }>
  checklist: ChecklistItem[]
  events: Array<{ id: string; action: string; actionLabel?: string; createdAt: string }>
  fullyComplete: boolean
  completedAdultApplicants: number
  requiredAdults: number
  nextAction: string
  insurance?: { status: string; label: string }
  petFees?: {
    extraDepositCents: number
    monthlyPetRentCents: number
    assistanceAnimalCount: number
    chargeablePetCount: number
  }
  payments?: Array<{
    id: string
    amountCents: number
    statusLabel: string
    paymentType: string
    transactionId?: string | null
    createdAt: string
  }>
}

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json().catch(() => ({}))) as { data?: T; message?: string }
  if (!res.ok) {
    throw new Error(body.message || `Request failed (${res.status})`)
  }
  return (body.data ?? body) as T
}

export async function fetchRentalProfile(propertyId: string): Promise<RentalPublicProfile> {
  const res = await fetch(backendUrl(`/api/rental/properties/${encodeURIComponent(propertyId)}/profile`))
  return parseJson<RentalPublicProfile>(res)
}

export async function postReadiness(propertyId: string, answers: ReadinessAnswers): Promise<ReadinessResult> {
  const res = await fetch(backendUrl(`/api/rental/properties/${encodeURIComponent(propertyId)}/readiness`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  })
  return parseJson<ReadinessResult>(res)
}

export async function requestRentalTour(
  propertyId: string,
  input: { tourKind: "in_person" | "video"; preferredAt?: string; name: string; email: string; phone?: string },
): Promise<unknown> {
  const res = await fetch(backendUrl(`/api/rental/properties/${encodeURIComponent(propertyId)}/tours`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return parseJson(res)
}

export async function submitRentalLead(
  propertyId: string,
  input: {
    kind: "property_inquiry" | "application_question" | "pm_contact"
    name: string
    email: string
    phone?: string
    message?: string
  },
): Promise<unknown> {
  const res = await fetch(backendUrl(`/api/rental/properties/${encodeURIComponent(propertyId)}/leads`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  return parseJson(res)
}

export async function startRentalApplication(input: {
  propertyId?: string
  token?: string
  firstName: string
  lastName: string
  email: string
}): Promise<RentalApplicationSummary> {
  const res = await fetch(backendUrl("/api/rental/applications/start"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  })
  return parseJson<RentalApplicationSummary>(res)
}

export async function listMyRentalApplications(): Promise<RentalApplicationSummary[]> {
  const res = await fetch(backendUrl("/api/rental/applications/my"), { credentials: "include" })
  if (res.status === 401) return []
  return parseJson<RentalApplicationSummary[]>(res)
}

export async function getRentalApplication(applicationId: string, resumeToken?: string): Promise<ApplicationBundle> {
  const url = new URL(backendUrl(`/api/rental/applications/${encodeURIComponent(applicationId)}`))
  if (resumeToken) url.searchParams.set("resumeToken", resumeToken)
  const res = await fetch(url.toString(), {
    credentials: "include",
    headers: resumeToken ? { "X-Resume-Token": resumeToken } : undefined,
  })
  return parseJson<ApplicationBundle>(res)
}

export async function saveRentalProgress(input: {
  applicationId: string
  resumeToken?: string
  currentStep?: WizardStepId | string
  payload?: Record<string, unknown>
}): Promise<ApplicationBundle> {
  const res = await fetch(backendUrl(`/api/rental/applications/${encodeURIComponent(input.applicationId)}/progress`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(input.resumeToken ? { "X-Resume-Token": input.resumeToken } : {}),
    },
    credentials: "include",
    body: JSON.stringify({
      currentStep: input.currentStep,
      payload: input.payload,
      resumeToken: input.resumeToken,
    }),
  })
  return parseJson<ApplicationBundle>(res)
}

export async function submitRentalApplication(applicationId: string, resumeToken?: string, token?: string) {
  const res = await fetch(backendUrl(`/api/rental/applications/${encodeURIComponent(applicationId)}/submit`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resumeToken ? { "X-Resume-Token": resumeToken } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ resumeToken, token }),
  })
  return parseJson<RentalApplicationSummary>(res)
}

export async function inviteCoApplicant(
  applicationId: string,
  input: { firstName: string; lastName: string; email: string; resumeToken?: string },
) {
  const res = await fetch(backendUrl(`/api/rental/applications/${encodeURIComponent(applicationId)}/co-applicants`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(input.resumeToken ? { "X-Resume-Token": input.resumeToken } : {}),
    },
    credentials: "include",
    body: JSON.stringify(input),
  })
  return parseJson<{ id: string; email: string; status: string; inviteUrl: string }>(res)
}

export async function uploadRentalDocument(
  applicationId: string,
  file: File,
  documentType: string,
  resumeToken?: string,
) {
  const form = new FormData()
  form.append("file", file)
  form.append("documentType", documentType)
  if (resumeToken) form.append("resumeToken", resumeToken)
  const res = await fetch(backendUrl(`/api/rental/applications/${encodeURIComponent(applicationId)}/documents`), {
    method: "POST",
    credentials: "include",
    headers: resumeToken ? { "X-Resume-Token": resumeToken } : undefined,
    body: form,
  })
  return parseJson(res)
}

export async function createRentalFeeIntent(applicationId: string, resumeToken?: string) {
  const res = await fetch(backendUrl(`/api/rental/applications/${encodeURIComponent(applicationId)}/fee-intent`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(resumeToken ? { "X-Resume-Token": resumeToken } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ resumeToken }),
  })
  return parseJson<{
    configured: boolean
    required: boolean
    amountCents: number
    clientSecret: string | null
    message?: string
  }>(res)
}

export async function getCoApplicantInvite(token: string) {
  const res = await fetch(backendUrl(`/api/rental/co-applicants/${encodeURIComponent(token)}`))
  return parseJson<{
    coApplicant: { id: string; firstName: string; lastName: string; email: string; wizardPayload: Record<string, unknown> }
    applicationId: string
    property: RentalPublicProfile["property"]
    requirements: PublicRentalRequirements
    fairHousingStatement: string
  }>(res)
}

export async function saveCoApplicantProgress(token: string, payload: Record<string, unknown>, currentStep?: string) {
  const res = await fetch(backendUrl(`/api/rental/co-applicants/${encodeURIComponent(token)}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ payload, currentStep }),
  })
  return parseJson(res)
}
