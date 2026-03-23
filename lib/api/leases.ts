import { backendUrl } from "@/lib/backend"

export interface Lease {
  id: string
  propertyId: string
  tenantId: string
  ownerId: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  securityDeposit: number | null
  terms: Record<string, unknown>
  status: string
  esignStatus: Record<string, unknown>
  ownerSignedAt: string | null
  tenantSignedAt: string | null
  createdAt: string
  updatedAt: string
}

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  }
  return fetch(backendUrl(path), { ...init, headers })
}

export async function getMyLease(): Promise<Lease | null> {
  const res = await authFetch("/api/leases/my")
  if (!res.ok) throw new Error("Failed to fetch lease")
  const data = await res.json()
  return data.data ?? null
}

export async function getLease(leaseId: string): Promise<Lease> {
  const res = await authFetch(`/api/leases/${leaseId}`)
  if (!res.ok) throw new Error("Failed to fetch lease")
  const data = await res.json()
  return data.data
}

export async function signLease(leaseId: string): Promise<Lease> {
  const res = await authFetch(`/api/leases/${leaseId}/sign`, {
    method: "POST",
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? "Failed to sign lease")
  }
  const data = await res.json()
  return data.data
}
