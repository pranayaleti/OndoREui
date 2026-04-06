import { backendUrl } from "@/lib/backend"

export type OnboardingStatus = "pending" | "in_progress" | "completed" | "expired"

export interface OnboardingStep {
  name: string
  label: string
  status: "pending" | "completed"
  completedAt: string | null
  data: Record<string, unknown>
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface TenantOnboarding {
  id: string
  propertyId: string
  tenantId: string
  leaseId: string | null
  applicationId: string | null
  token: string
  status: OnboardingStatus
  steps: OnboardingStep[]
  currentStep: number
  expiresAt: string
  completedAt: string | null
  createdAt: string
  updatedAt: string
  propertyAccess?: Record<string, unknown> | null
}

export interface OnboardingDocument {
  id: string
  onboardingId: string
  documentType: string
  storagePath: string
  status: "pending" | "verified" | "rejected"
  signedUrl?: string
  createdAt: string
}

export async function validateOnboardingToken(
  token: string,
): Promise<{ data: TenantOnboarding } | { error: string }> {
  const response = await fetch(backendUrl(`/api/tenant-onboarding/validate/${token}`), {
    method: "GET",
    credentials: "include",
  })

  const json = await response.json()

  if (!response.ok) {
    return { error: json.error || "Invalid or expired link" }
  }

  return json as { data: TenantOnboarding }
}

export async function completeStep(
  onboardingId: string,
  stepName: string,
  data: Record<string, unknown> = {},
  token?: string,
): Promise<{ data: TenantOnboarding }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(
    backendUrl(`/api/tenant-onboarding/${onboardingId}/steps/${stepName}`),
    {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify({ data }),
    },
  )

  if (!response.ok) {
    const json = await response.json()
    throw new Error(json.error || "Failed to complete step")
  }

  return response.json()
}

export async function uploadIdDocument(
  onboardingId: string,
  file: File,
  documentType: string = "government_id",
  token?: string,
): Promise<{ data: OnboardingDocument }> {
  const formData = new FormData()
  formData.append("document", file)
  formData.append("documentType", documentType)

  const headers: Record<string, string> = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(
    backendUrl(`/api/tenant-onboarding/${onboardingId}/documents`),
    {
      method: "POST",
      headers,
      credentials: "include",
      body: formData,
    },
  )

  if (!response.ok) {
    const json = await response.json()
    throw new Error(json.error || "Failed to upload document")
  }

  return response.json()
}

export async function triggerBackgroundCheck(
  onboardingId: string,
  token?: string,
): Promise<{ message: string }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(
    backendUrl(`/api/tenant-onboarding/${onboardingId}/background-check`),
    {
      method: "POST",
      headers,
      credentials: "include",
    },
  )

  if (!response.ok) {
    const json = await response.json()
    throw new Error(json.error || "Failed to trigger background check")
  }

  return response.json()
}

export async function saveEmergencyContacts(
  onboardingId: string,
  contacts: EmergencyContact[],
  token?: string,
): Promise<{ data: TenantOnboarding }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(
    backendUrl(`/api/tenant-onboarding/${onboardingId}/emergency-contacts`),
    {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ contacts }),
    },
  )

  if (!response.ok) {
    const json = await response.json()
    throw new Error(json.error || "Failed to save emergency contacts")
  }

  return response.json()
}
