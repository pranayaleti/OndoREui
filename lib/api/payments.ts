import { networkFirstGet, postJson } from "./http"

export interface PaymentMethod {
  id: string
  stripePaymentMethodId: string
  type: "card" | "us_bank_account"
  brand?: string
  last4?: string
  expMonth?: number
  expYear?: number
  bankName?: string
  isDefault?: boolean
  createdAt?: string
}

export interface PaymentHistoryItem {
  id: string
  stripePaymentIntentId: string
  amountCents: number
  currency: string
  status: "pending" | "processing" | "succeeded" | "failed"
  paymentType: "rent" | "one_time" | "investment"
  propertyId?: string | null
  description?: string | null
  createdAt: string
}

export async function fetchPaymentMethods() {
  return networkFirstGet<{ success: boolean; data: PaymentMethod[] }>(
    "/api/payments/payment-methods",
    "tenant:payment-methods"
  )
}

export async function createSetupIntent(propertyId?: string) {
  return postJson<{ success: boolean; clientSecret: string }>(
    "/api/payments/setup-intent",
    propertyId ? { propertyId } : {}
  )
}

export async function createRentPaymentIntent(args: {
  amountCents: number
  propertyId?: string
  description?: string
  paymentMethodId?: string
}) {
  return postJson<{ success: boolean; clientSecret: string; paymentId?: string }>(
    "/api/payments/create-payment-intent",
    { paymentType: "rent", ...args }
  )
}

export async function fetchPaymentHistory(page = 1, limit = 20) {
  return networkFirstGet<{
    success: boolean
    data: PaymentHistoryItem[]
    pagination: { page: number; limit: number; total: number; hasMore: boolean }
  }>(
    `/api/payments/history?page=${page}&limit=${limit}`,
    `tenant:payment-history:${page}:${limit}`
  )
}

// ─── Plaid ─────────────────────────────────────────────────────────────────

export async function plaidIsConfigured() {
  return networkFirstGet<{ success: boolean; configured: boolean }>(
    "/api/plaid/configured",
    "plaid:configured"
  )
}

export async function createPlaidLinkToken() {
  return postJson<{ success: boolean; linkToken: string }>(
    "/api/plaid/link-token",
    {}
  )
}

export async function exchangePlaidPublicToken(args: {
  publicToken: string
  selectedAccountId?: string
}) {
  return postJson<{
    success: boolean
    data: { bankSourceId: string; bankName: string; last4: string; plaidItemRowId: string }
  }>("/api/plaid/exchange-public-token", args)
}
