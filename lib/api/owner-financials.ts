import { networkFirstGet, postJson } from "@/lib/api/http"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StatementLineItem {
  description: string
  amountCents: number
  type: "income" | "expense"
  propertyId: string
  date: string
}

export interface OwnerStatement {
  id: string
  ownerId: string
  periodStart: string
  periodEnd: string
  totalIncomeCents: number
  totalExpenseCents: number
  netCents: number
  lineItems: StatementLineItem[]
  generatedAt: string
}

export interface TaxForm1099 {
  id: string
  ownerId: string
  recipientType: string
  recipientId: string
  formType: string
  taxYear: number
  totalAmountCents: number
  recipientName: string | null
  status: string
}

/* ------------------------------------------------------------------ */
/*  Statements                                                         */
/* ------------------------------------------------------------------ */

export async function getStatements(limit = 12): Promise<OwnerStatement[]> {
  const res = await networkFirstGet<{ data: OwnerStatement[] }>(
    `/api/owner-statements?limit=${limit}`,
    `owner-statements-${limit}`
  )
  return res.data
}

export async function generateStatement(
  periodStart: string,
  periodEnd: string
): Promise<OwnerStatement> {
  const res = await postJson<{ data: OwnerStatement }>(
    "/api/owner-statements/generate",
    { periodStart, periodEnd }
  )
  return res.data
}

export async function emailStatement(
  statementId: string,
  customMessage?: string
): Promise<{ sent: boolean; email: string }> {
  const res = await postJson<{ data: { sent: boolean; email: string } }>(
    `/api/owner-statements/${statementId}/email`,
    { customMessage }
  )
  return res.data
}

/* ------------------------------------------------------------------ */
/*  Tax Documents                                                      */
/* ------------------------------------------------------------------ */

export async function get1099s(year?: number): Promise<TaxForm1099[]> {
  const path = year
    ? `/api/advanced/financial/owner/tax-forms/1099?year=${year}`
    : "/api/advanced/financial/owner/tax-forms/1099"
  const res = await networkFirstGet<{ data: TaxForm1099[] }>(
    path,
    `1099s-${year ?? "all"}`
  )
  return res.data
}

export async function generate1099s(
  year: number
): Promise<{ generated: number; forms: TaxForm1099[] }> {
  const res = await postJson<{ data: { generated: number; forms: TaxForm1099[] } }>(
    "/api/advanced/financial/owner/tax-forms/1099/generate",
    { year }
  )
  return res.data
}
