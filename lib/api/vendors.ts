import { backendUrl } from "@/lib/backend"
import { getCsrfToken } from "@/lib/api/http"

export type VendorSpecialty =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "appliances"
  | "flooring"
  | "windows"
  | "structural"
  | "pest_control"
  | "cleaning"
  | "general"
  | "landscaping"
  | "roofing"
  | "painting"

export type VendorStatus = "active" | "inactive" | "suspended"

export type AssignmentStatus = "scheduled" | "in_progress" | "completed" | "cancelled"

export interface Vendor {
  id: string
  name: string
  company?: string
  email?: string
  phone?: string
  specialty: VendorSpecialty
  secondary_specialties?: VendorSpecialty[]
  license_number?: string
  insurance_info?: string
  hourly_rate?: number
  rating: number
  review_count: number
  status: VendorStatus
  notes?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  service_radius_miles: number
  created_at: string
  updated_at: string
}

export interface VendorAssignment {
  id: string
  vendor_id: string
  maintenance_request_id: string
  assigned_by: string
  estimated_cost?: number
  actual_cost?: number
  scheduled_date?: string
  completed_date?: string
  notes?: string
  status: AssignmentStatus
  created_at: string
  vendor?: Vendor
}

export interface CreateVendorPayload {
  name: string
  company?: string
  email?: string
  phone?: string
  specialty: VendorSpecialty
  secondary_specialties?: VendorSpecialty[]
  license_number?: string
  insurance_info?: string
  hourly_rate?: number
  notes?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  service_radius_miles?: number
}

export interface AssignVendorPayload {
  vendor_id: string
  maintenance_request_id: string
  estimated_cost?: number
  scheduled_date?: string
  notes?: string
}

const CSRF_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"])

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const method = (init?.method ?? "GET").toUpperCase()
  const csrf = CSRF_METHODS.has(method) ? getCsrfToken() : undefined
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
    ...(csrf ? { "x-csrf-token": csrf } : {}),
  }
  return fetch(backendUrl(path), { ...init, headers, credentials: "include" })
}

export async function listVendors(params?: {
  specialty?: VendorSpecialty
  status?: VendorStatus
  city?: string
}): Promise<Vendor[]> {
  const query = params
    ? "?" + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString()
    : ""
  const res = await authFetch(`/api/vendors${query}`)
  if (!res.ok) throw new Error("Failed to fetch vendors")
  const data = await res.json()
  return data.vendors ?? data
}

export async function getVendor(id: string): Promise<Vendor> {
  const res = await authFetch(`/api/vendors/${id}`)
  if (!res.ok) throw new Error("Failed to fetch vendor")
  return res.json()
}

export async function createVendor(payload: CreateVendorPayload): Promise<Vendor> {
  const res = await authFetch("/api/vendors", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "Failed to create vendor")
  }
  const data = await res.json()
  return data.vendor ?? data
}

export async function updateVendor(id: string, payload: Partial<CreateVendorPayload>): Promise<Vendor> {
  const res = await authFetch(`/api/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to update vendor")
  const data = await res.json()
  return data.vendor ?? data
}

export async function deactivateVendor(id: string): Promise<void> {
  const res = await authFetch(`/api/vendors/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to deactivate vendor")
}

export async function assignVendor(payload: AssignVendorPayload): Promise<VendorAssignment> {
  const res = await authFetch("/api/vendors/assign", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Failed to assign vendor")
  const data = await res.json()
  return data.assignment ?? data
}

export async function suggestVendors(category: string, city?: string): Promise<Vendor[]> {
  const query = new URLSearchParams({ category, ...(city ? { city } : {}) }).toString()
  const res = await authFetch(`/api/vendors/suggest?${query}`)
  if (!res.ok) throw new Error("Failed to fetch vendor suggestions")
  const data = await res.json()
  return data.vendors ?? data
}

export async function getVendorAssignments(vendorId: string): Promise<VendorAssignment[]> {
  const res = await authFetch(`/api/vendors/${vendorId}/assignments`)
  if (!res.ok) throw new Error("Failed to fetch assignments")
  const data = await res.json()
  return data.assignments ?? data
}
