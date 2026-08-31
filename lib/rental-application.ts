export const FAIR_HOUSING_STATEMENT =
  "Equal Housing Opportunity. Ondo Real Estate and participating owners consider every complete application using the same written, property-specific criteria. We do not discriminate on the basis of race, color, national origin, religion, sex (including gender identity and sexual orientation), familial status, disability, or other characteristics protected by the federal Fair Housing Act or applicable state or local law. Lawful source of income is evaluated consistently with those written criteria. Assistance animals that provide disability-related assistance are not pets; we do not charge pet rent or pet deposits for them. A readiness check or written criterion is not an approval, denial, or guarantee."

export const WIZARD_STEPS = [
  { id: "property", number: 1, title: "Property" },
  { id: "applicant", number: 2, title: "Applicant" },
  { id: "household", number: 3, title: "Household" },
  { id: "employment", number: 4, title: "Employment & Income" },
  { id: "rental_history", number: 5, title: "Rental History" },
  { id: "pets", number: 6, title: "Pets" },
  { id: "documents", number: 7, title: "Documents" },
  { id: "authorization", number: 8, title: "Authorization" },
  { id: "review", number: 9, title: "Review" },
  { id: "submit", number: 10, title: "Submit" },
] as const

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"]

export const CREDIT_SCORE_RANGES = [
  { id: "below_580", label: "Below 580" },
  { id: "580_619", label: "580–619" },
  { id: "620_659", label: "620–659" },
  { id: "660_699", label: "660–699" },
  { id: "700_739", label: "700–739" },
  { id: "740_plus", label: "740 or higher" },
  { id: "unknown", label: "I don't know" },
] as const

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  started: "Started",
  invited: "Invited",
  incomplete: "Incomplete",
  submitted: "Submitted",
  payment_pending: "Payment pending",
  documents_required: "Documents required",
  verification_pending: "Verification pending",
  under_review: "Under review",
  additional_information_required: "Additional information required",
  approved: "Approved",
  conditionally_approved: "Conditionally approved",
  denied: "Not approved",
  withdrawn: "Withdrawn",
  expired: "Expired",
  screening: "Verification pending",
  passed: "Under review",
  failed: "Additional information required",
  rejected: "Not approved",
  waitlisted: "Under review",
}

export function formatCents(cents: number | null | undefined): string {
  if (cents == null || Number.isNaN(cents)) return "—"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100)
}

export function applicationStatusLabel(status: string): string {
  return APPLICATION_STATUS_LABELS[status] ?? "Started"
}

const STORAGE_KEY = "ondo.rental.applications"

export type StoredRentalApplication = {
  id: string
  resumeToken: string
  propertyId: string
  propertyTitle?: string
  updatedAt: string
}

export function readStoredApplications(): StoredRentalApplication[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (row): row is StoredRentalApplication =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as StoredRentalApplication).id === "string" &&
        typeof (row as StoredRentalApplication).resumeToken === "string",
    )
  } catch {
    return []
  }
}

export function rememberRentalApplication(entry: StoredRentalApplication): void {
  if (typeof window === "undefined") return
  const next = readStoredApplications().filter((row) => row.id !== entry.id)
  next.unshift(entry)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 20)))
}

export function storedApplication(id: string): StoredRentalApplication | undefined {
  return readStoredApplications().find((row) => row.id === id)
}

export function adultProgressLabel(completed: number, required: number): string {
  return `${completed} of ${required} applicants completed`
}

export function adultProgressFromListRow(row: {
  completedAdultApplicants?: number
  requiredAdults?: number
  coApplicantSummary?: string
}): string | null {
  if (typeof row.completedAdultApplicants === "number" && typeof row.requiredAdults === "number") {
    return adultProgressLabel(row.completedAdultApplicants, row.requiredAdults)
  }
  const summary = row.coApplicantSummary?.trim()
  return summary ? summary : null
}

export type HouseholdOccupant = {
  fullName?: string
  relationship?: string
  isAdult?: boolean
}

export type PetAnimal = {
  name?: string
  type?: string
  breed?: string
  ageYears?: number | null
  size?: string
  weightLbs?: number | null
  docs?: string
  isAssistanceAnimal?: boolean
}

export type EmploymentRecord = {
  employer?: string
  title?: string
  duration?: string
  startDate?: string
  endDate?: string | null
  monthlyIncomeCents?: number | null
  selfEmployed?: boolean
}

export type ResidenceRecord = {
  address?: string
  landlordName?: string
  landlordPhone?: string
  startDate?: string | null
  endDate?: string | null
  reasonForLeaving?: string
}

export type WizardPayload = {
  applicant?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    dateOfBirth?: string
    currentAddress?: string
  }
  household?: { occupants?: HouseholdOccupant[] }
  employment?: { records?: EmploymentRecord[] }
  rentalHistory?: { residences?: ResidenceRecord[] }
  pets?: { animals?: PetAnimal[] }
  insurance?: { hasPolicy?: boolean; carrier?: string; expiration?: string }
  authorizations?: {
    credit?: boolean
    background?: boolean
    rental?: boolean
    employment?: boolean
    terms?: boolean
  }
}

export function asWizardPayload(value: unknown): WizardPayload {
  return typeof value === "object" && value !== null ? (value as WizardPayload) : {}
}

export function emptyHouseholdOccupant(): HouseholdOccupant {
  return { fullName: "", relationship: "", isAdult: false }
}

export function householdOccupantsForEdit(payload: WizardPayload): HouseholdOccupant[] {
  const occupants = payload.household?.occupants
  if (Array.isArray(occupants) && occupants.length > 0) return occupants
  return [emptyHouseholdOccupant()]
}

export function emptyPetAnimal(): PetAnimal {
  return {
    name: "",
    type: "",
    breed: "",
    ageYears: null,
    size: "",
    docs: "",
    isAssistanceAnimal: false,
  }
}

export function petAnimalsForEdit(payload: WizardPayload): PetAnimal[] {
  const animals = payload.pets?.animals
  if (!Array.isArray(animals)) return [emptyPetAnimal()]
  return animals
}

export function hasNoChargeablePets(payload: WizardPayload): boolean {
  return Array.isArray(payload.pets?.animals) && payload.pets.animals.every((animal) => animal.isAssistanceAnimal)
}

export function setNoChargeablePets(payload: WizardPayload): WizardPayload {
  const kept = (payload.pets?.animals ?? []).filter((animal) => animal.isAssistanceAnimal)
  return { ...payload, pets: { animals: kept } }
}

export function restoreChargeablePetRow(payload: WizardPayload): WizardPayload {
  if (!hasNoChargeablePets(payload)) return payload
  const kept = payload.pets?.animals ?? []
  return { ...payload, pets: { animals: [...kept, emptyPetAnimal()] } }
}

export function emptyEmploymentRecord(): EmploymentRecord {
  return {
    employer: "",
    title: "",
    duration: "",
    startDate: "",
    endDate: "",
    monthlyIncomeCents: null,
    selfEmployed: false,
  }
}

export function employmentRecordsForEdit(payload: WizardPayload): EmploymentRecord[] {
  const records = payload.employment?.records
  if (Array.isArray(records) && records.length > 0) return records
  return [emptyEmploymentRecord()]
}

export function addEmploymentRecord(payload: WizardPayload): WizardPayload {
  const records = employmentRecordsForEdit(payload)
  return { ...payload, employment: { records: [...records, emptyEmploymentRecord()] } }
}

export function updateEmploymentRecord(
  payload: WizardPayload,
  index: number,
  patch: Partial<EmploymentRecord>,
): WizardPayload {
  const records = [...employmentRecordsForEdit(payload)]
  const current = records[index] ?? emptyEmploymentRecord()
  records[index] = { ...current, ...patch }
  return { ...payload, employment: { records } }
}

export function removeEmploymentRecord(payload: WizardPayload, index: number): WizardPayload {
  const records = employmentRecordsForEdit(payload).filter((_, i) => i !== index)
  return { ...payload, employment: { records } }
}

export function emptyResidence(): ResidenceRecord {
  return {
    address: "",
    landlordName: "",
    landlordPhone: "",
    startDate: "",
    endDate: "",
    reasonForLeaving: "",
  }
}

export function residencesForEdit(payload: WizardPayload): ResidenceRecord[] {
  const residences = payload.rentalHistory?.residences
  if (Array.isArray(residences) && residences.length > 0) return residences
  return [emptyResidence()]
}

export function addResidence(payload: WizardPayload): WizardPayload {
  const residences = residencesForEdit(payload)
  return { ...payload, rentalHistory: { residences: [...residences, emptyResidence()] } }
}

export function updateResidence(
  payload: WizardPayload,
  index: number,
  patch: Partial<ResidenceRecord>,
): WizardPayload {
  const residences = [...residencesForEdit(payload)]
  const current = residences[index] ?? emptyResidence()
  residences[index] = { ...current, ...patch }
  return { ...payload, rentalHistory: { residences } }
}

export function removeResidence(payload: WizardPayload, index: number): WizardPayload {
  const residences = residencesForEdit(payload).filter((_, i) => i !== index)
  return { ...payload, rentalHistory: { residences } }
}
