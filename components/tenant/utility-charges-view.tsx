"use client"

import { useState, useEffect } from "react"
import { getTenantCamCharges } from "../../lib/api/tenant-services"

type UtilityType = "electricity" | "gas" | "water" | "trash" | "internet" | string

interface AllocationBreakdown {
  totalBill: number
  tenantShare: number
  allocationMethod: string
  unitCount?: number
}

interface UtilityCharge {
  id: string
  utilityType: UtilityType
  period: string
  amount: number
  dueDate: string
  paid: boolean
  breakdown?: AllocationBreakdown
}

const UTILITY_ICONS: Record<string, string> = {
  electricity: "⚡",
  gas: "🔥",
  water: "💧",
  trash: "🗑️",
  internet: "📡",
}

const UTILITY_LABEL: Record<string, string> = {
  electricity: "Electricity",
  gas: "Gas",
  water: "Water",
  trash: "Trash",
  internet: "Internet",
}

function formatCurrency(n: number) {
  return "$" + n.toFixed(2)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function PaidBadge({ paid }: { paid: boolean }) {
  return paid ? (
    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Paid</span>
  ) : (
    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Outstanding</span>
  )
}

export function UtilityChargesView() {
  const [charges, setCharges] = useState<UtilityCharge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    getTenantCamCharges()
      .then((res: any) => setCharges(res?.data?.charges ?? res?.charges ?? res?.data ?? []))
      .catch(() => setError("Failed to load utility charges."))
      .finally(() => setLoading(false))
  }, [])

  const outstanding = charges.filter((c) => !c.paid).reduce((sum, c) => sum + c.amount, 0)

  if (loading) return <div className="bg-card border rounded-lg p-6 text-center text-sm text-gray-500">Loading utility charges...</div>
  if (error) return <div className="bg-card border rounded-lg p-6 text-center text-sm text-red-500">{error}</div>

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Utility Charges</h2>
        {outstanding > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Outstanding</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(outstanding)}</p>
          </div>
        )}
        {outstanding === 0 && charges.length > 0 && (
          <span className="text-sm text-green-600 font-medium">All paid</span>
        )}
      </div>

      {charges.length === 0 && (
        <p className="text-center text-gray-500 py-6 text-sm">No utility charges found.</p>
      )}

      <div className="space-y-2">
        {charges.map((charge) => {
          const icon = UTILITY_ICONS[charge.utilityType] ?? "🔌"
          const label = UTILITY_LABEL[charge.utilityType] ?? charge.utilityType
          const isExpanded = expandedId === charge.id

          return (
            <div key={charge.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Main row */}
              <div
                className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-muted transition"
                onClick={() => setExpandedId(isExpanded ? null : charge.id)}
              >
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <PaidBadge paid={charge.paid} />
                  </div>
                  <p className="text-xs text-gray-500">{charge.period} · Due {formatDate(charge.dueDate)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-sm font-semibold ${charge.paid ? "text-gray-700" : "text-red-600"}`}>
                    {formatCurrency(charge.amount)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expandable breakdown */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-muted px-4 py-3">
                  {charge.breakdown ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Allocation Breakdown</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-card rounded px-3 py-2 border border-gray-100">
                          <p className="text-xs text-gray-500">Total Bill</p>
                          <p className="font-semibold text-gray-800">{formatCurrency(charge.breakdown.totalBill)}</p>
                        </div>
                        <div className="bg-card rounded px-3 py-2 border border-gray-100">
                          <p className="text-xs text-gray-500">Your Share</p>
                          <p className="font-semibold text-blue-700">{formatCurrency(charge.breakdown.tenantShare)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Allocation method: <span className="text-gray-700 font-medium capitalize">{charge.breakdown.allocationMethod}</span></span>
                        {charge.breakdown.unitCount && <span>Across {charge.breakdown.unitCount} units</span>}
                      </div>
                      {charge.breakdown.totalBill > 0 && (
                        <div className="mt-1">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Your portion</span>
                            <span>{((charge.breakdown.tenantShare / charge.breakdown.totalBill) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min((charge.breakdown.tenantShare / charge.breakdown.totalBill) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No breakdown available for this charge.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {outstanding > 0 && (
        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">Total outstanding balance</span>
          <span className="text-base font-bold text-red-600">{formatCurrency(outstanding)}</span>
        </div>
      )}
    </div>
  )
}
