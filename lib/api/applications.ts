import { backendUrl } from "@/lib/backend"

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "screening"
  | "passed"
  | "failed"
  | "approved"
  | "rejected"
  | "withdrawn"
  | "waitlisted"

export interface ApplicationLink {
  id: string
  propertyId: string
  linkType: "email" | "public"
  token: string
  tenantEmail: string | null
  expiresAt: string
  maxUses: number
  useCount: number
  isActive: boolean
  applyUrl: string
}

export interface PropertySummary {
  id: string
  title: string
  description: string | null
  address: string
  availability: string | null
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  amenities: string | null
  photos: { url: string; caption: string | null }[]
}

export interface ScreeningQuestion {
  id: string
  questionText: string
  questionType: "text" | "multiple_choice" | "yes_no" | "number"
  options: unknown[] | null
  isRequired: boolean
}

export type VerificationCheckType =
  | "credit"
  | "criminal"
  | "eviction"
  | "income"
  | "identity"
  | "references"

export interface AcceptanceCriteria {
  minimumCreditScore: number | null
  minimumIncomeRatio: number | null
  noEvictionHistory: boolean
  noCriminalHistory: boolean
  requiredDocuments: string[]
  applicationFee: number | null
  feeRefundable: boolean
  processingTime: string
  ownerCriteria: string[]
}

export interface ApplicationLinkValidation {
  valid: boolean
  link?: { token: string; propertyId: string; linkType: string }
  property?: PropertySummary
  questions?: ScreeningQuestion[]
  applicationDisclosure?: ApplicationDisclosure
  screeningCriteriaSummary?: string[]
  requiredChecks?: VerificationCheckType[]
  consentCopy?: ConsentCopy
  disclosureSnapshot?: ApplicationDisclosureSnapshot
  acceptanceCriteria?: AcceptanceCriteria
  error?: string
}

export interface ApplicationDisclosure {
  rentAmount: number | null
  availability: string | null
  fixedNonRentCharges: Array<{ label: string; amount: number | null; frequency: string | null }>
  useBasedChargeCategories: string[]
  ownerCriteria: string[]
  applicantDisclosureNotes: string | null
  feeCollectionStatus: string
  refundRecoveryInstructions: string
}

export interface ConsentCopy {
  version: string
  disclosureTitle: string
  disclosureBody: string
  criteriaAcknowledgementLabel: string
  screeningConsentLabel: string
  futureFeeNotice: string
}

export interface ApplicationDisclosureSnapshot {
  version: string
  locale: string
  generatedAt: string
  applicationDisclosure: ApplicationDisclosure
  screeningCriteriaSummary: string[]
  requiredChecks: VerificationCheckType[]
  consentCopy: ConsentCopy
}

export interface TenantApplication {
  id: string
  propertyId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  status: ApplicationStatus
  recommendationScore: number | null
  submittedAt: string | null
  reviewedAt: string | null
  ownerNotes: string | null
  createdAt: string
}

export interface ApplicationAnswer {
  questionId: string
  answer: unknown
  passes?: boolean | null
  questionText?: string
  questionType?: string
}

export interface VerificationCheck {
  id: string
  checkType: VerificationCheckType
  status: string
  passes: boolean | null
  completedAt: string | null
}

export interface ApplicationDetail extends TenantApplication {
  answers?: ApplicationAnswer[]
  checks?: VerificationCheck[]
}

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  }
  return fetch(backendUrl(path), { ...init, headers, credentials: "include" })
}

// ── Public endpoints ──────────────────────────────────────────────────────────

export async function validateApplyToken(
  token: string,
  locale?: string
): Promise<ApplicationLinkValidation> {
  const headers = locale ? { "Accept-Language": locale } : undefined
  const res = await fetch(backendUrl(`/api/apply/${token}`), { headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "" }))
    return { valid: false, error: err.message }
  }
  const data = await res.json()
  return data.data
}

export async function createApplication(payload: {
  token: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  currentAddress?: string
  employer?: string
  annualIncome?: number
  desiredMoveIn?: string
}): Promise<TenantApplication> {
  const res = await authFetch("/api/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "")
  }
  const data = await res.json()
  return data.data
}

export async function submitApplication(
  applicationId: string,
  payload: {
    token: string
    answers: { questionId: string; answer: unknown }[]
    criteriaAcknowledged: true
    screeningConsent: true
    consentVersion: string
    disclosureSnapshot: ApplicationDisclosureSnapshot
  }
): Promise<TenantApplication> {
  const res = await authFetch(`/api/applications/${applicationId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "")
  }
  const data = await res.json()
  return data.data
}

// ── Authenticated tenant endpoints ────────────────────────────────────────────

export async function getMyApplications(): Promise<TenantApplication[]> {
  const res = await authFetch("/api/applications/my")
  if (!res.ok) throw new Error("Failed to fetch applications")
  const data = await res.json()
  return data.data ?? []
}

export async function getApplication(applicationId: string): Promise<ApplicationDetail> {
  const res = await authFetch(`/api/applications/${applicationId}`)
  if (!res.ok) throw new Error("Failed to fetch application")
  const data = await res.json()
  return data.data
}

export async function withdrawApplication(applicationId: string): Promise<TenantApplication> {
  const res = await authFetch(`/api/applications/${applicationId}/withdraw`, {
    method: "POST",
  })
  if (!res.ok) throw new Error("Failed to withdraw application")
  const data = await res.json()
  return data.data
}

export async function getVerificationChecks(applicationId: string): Promise<VerificationCheck[]> {
  const res = await authFetch(`/api/applications/${applicationId}/checks`)
  if (!res.ok) throw new Error("Failed to fetch verification checks")
  const data = await res.json()
  return data.data ?? []
}

// ─── Apply-flow drafts (anonymous, keyed on token + email) ───────────────────

export interface ApplyDraft {
  id: string
  applyToken: string
  applicantEmail: string
  payload: Record<string, unknown>
  currentStep: string | null
  createdAt: string
  updatedAt: string
}

export async function saveApplyDraft(args: {
  applyToken: string
  applicantEmail: string
  payload: Record<string, unknown>
  currentStep?: string
}): Promise<ApplyDraft> {
  const res = await fetch(backendUrl(`/api/apply/${encodeURIComponent(args.applyToken)}/draft`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicantEmail: args.applicantEmail,
      payload: args.payload,
      currentStep: args.currentStep,
    }),
  })
  if (!res.ok) throw new Error("Failed to save apply draft")
  const data = await res.json()
  return data.data
}

export async function loadApplyDraft(args: {
  applyToken: string
  applicantEmail: string
}): Promise<ApplyDraft | null> {
  const url = backendUrl(
    `/api/apply/${encodeURIComponent(args.applyToken)}/draft?email=${encodeURIComponent(args.applicantEmail)}`
  )
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load apply draft")
  const data = await res.json()
  return data.data ?? null
}

export async function discardApplyDraft(args: {
  applyToken: string
  applicantEmail: string
}): Promise<void> {
  const url = backendUrl(
    `/api/apply/${encodeURIComponent(args.applyToken)}/draft?email=${encodeURIComponent(args.applicantEmail)}`
  )
  await fetch(url, { method: "DELETE" })
}

// ─── Co-applicants ───────────────────────────────────────────────────────────

export interface CoApplicant {
  id: string
  applicationId: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  dateOfBirth?: string | null
  currentAddress?: string | null
  employer?: string | null
  monthlyIncomeCents?: number | null
  relationship?: string | null
  screeningConsentAt?: string | null
  disclosureAcknowledgedAt?: string | null
  createdAt: string
  updatedAt: string
}

export async function listCoApplicants(applicationId: string): Promise<CoApplicant[]> {
  const res = await authFetch(`/api/applications/${applicationId}/co-applicants`)
  if (!res.ok) throw new Error("Failed to list co-applicants")
  const data = await res.json()
  return data.data ?? []
}

export async function addCoApplicant(
  applicationId: string,
  input: Omit<Partial<CoApplicant>, "id" | "applicationId" | "createdAt" | "updatedAt">
): Promise<CoApplicant> {
  const res = await authFetch(`/api/applications/${applicationId}/co-applicants`, {
    method: "POST",
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("Failed to add co-applicant")
  const data = await res.json()
  return data.data
}

export async function updateCoApplicant(
  id: string,
  input: Partial<CoApplicant>
): Promise<CoApplicant> {
  const res = await authFetch(`/api/co-applicants/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("Failed to update co-applicant")
  const data = await res.json()
  return data.data
}

export async function removeCoApplicant(id: string): Promise<void> {
  const res = await authFetch(`/api/co-applicants/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to remove co-applicant")
}
