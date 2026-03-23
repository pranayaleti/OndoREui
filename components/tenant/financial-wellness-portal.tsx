"use client"

import { useState, useEffect } from "react"
import {
  getFinancialWellness,
  getPaymentScore,
  updateSavingsGoal,
  getCreditReportingStatus,
} from "../../lib/api/tenant-services"

interface PaymentScore {
  score: number
  onTimeCount: number
  lateCount: number
  totalPayments: number
}

interface SavingsGoal {
  id: string
  label: string
  currentAmount: number
  targetAmount: number
}

interface FinancialData {
  monthlyRent: number
  monthlyIncome: number
  rentToIncomeRatio: number
  savingsGoals: SavingsGoal[]
  creditEnrolled: boolean
  tips: string[]
}

const BUDGET_TIPS_DEFAULT = [
  "Set up autopay to never miss a rent payment and protect your score.",
  "Keep rent below 30% of gross income to maintain a healthy budget.",
  "Build 3 months of rent in an emergency fund before other savings goals.",
  "Enroll in credit reporting to turn on-time payments into credit history.",
]

export function FinancialWellnessPortal() {
  const [scoreData, setScoreData] = useState<PaymentScore | null>(null)
  const [financial, setFinancial] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingGoal, setAddingGoal] = useState(false)
  const [goalForm, setGoalForm] = useState({ label: "", currentAmount: "", targetAmount: "" })
  const [savingGoal, setSavingGoal] = useState(false)

  useEffect(() => {
    Promise.all([getFinancialWellness(), getPaymentScore()])
      .then(([fw, ps]: any) => {
        setFinancial(fw?.data ?? fw ?? null)
        setScoreData(ps?.data ?? ps ?? null)
      })
      .catch(() => setError("Failed to load financial data."))
      .finally(() => setLoading(false))
  }, [])

  const handleAddGoal = async () => {
    if (!goalForm.label.trim()) return
    setSavingGoal(true)
    try {
      const res: any = await updateSavingsGoal({
        label: goalForm.label,
        currentAmount: parseFloat(goalForm.currentAmount) || 0,
        targetAmount: parseFloat(goalForm.targetAmount) || 0,
      })
      const updated = res?.data?.savingsGoals ?? res?.savingsGoals
      if (updated && financial) setFinancial({ ...financial, savingsGoals: updated })
      setAddingGoal(false)
      setGoalForm({ label: "", currentAmount: "", targetAmount: "" })
    } catch {
      setError("Failed to save goal.")
    } finally {
      setSavingGoal(false)
    }
  }

  const scoreColor = (s: number) =>
    s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-500" : "text-red-500"

  const scoreRingColor = (s: number) =>
    s >= 80 ? "border-green-500" : s >= 60 ? "border-yellow-400" : "border-red-400"

  const scoreLabel = (s: number) =>
    s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Attention"

  const rtiColor = (ratio: number) =>
    ratio <= 30 ? "bg-green-500" : ratio <= 40 ? "bg-yellow-400" : "bg-red-500"

  if (loading) return <div className="bg-white border rounded-lg p-6 text-center text-sm text-gray-500">Loading financial data...</div>
  if (error) return <div className="bg-white border rounded-lg p-6 text-center text-sm text-red-500">{error}</div>

  const score = scoreData?.score ?? 0
  const goals = financial?.savingsGoals ?? []
  const rti = financial?.rentToIncomeRatio ?? 0
  const tips = financial?.tips?.length ? financial.tips : BUDGET_TIPS_DEFAULT

  return (
    <div className="space-y-4">
      {/* Payment Score */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Score</h2>
        <div className="flex items-center gap-6">
          <div className={`w-24 h-24 rounded-full border-8 ${scoreRingColor(score)} flex flex-col items-center justify-center flex-shrink-0`}>
            <span className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</span>
            <span className="text-xs text-gray-500">/ 100</span>
          </div>
          <div className="space-y-1">
            <p className={`font-semibold text-lg ${scoreColor(score)}`}>{scoreLabel(score)}</p>
            <p className="text-sm text-gray-600">
              <span className="text-green-600 font-medium">{scoreData?.onTimeCount ?? 0} on-time</span>
              {" · "}
              <span className="text-red-500 font-medium">{scoreData?.lateCount ?? 0} late</span>
              {" "}of {scoreData?.totalPayments ?? 0} total payments
            </p>
          </div>
        </div>
      </div>

      {/* Rent-to-Income Gauge */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Rent-to-Income Ratio</h3>
          <span className={`text-sm font-bold ${rti > 30 ? "text-red-500" : "text-green-600"}`}>{rti.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all ${rtiColor(rti)}`}
            style={{ width: `${Math.min(rti, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className="text-green-600">30% target</span>
          <span>100%</span>
        </div>
        {rti > 30 && (
          <p className="text-xs text-red-600 mt-2 bg-red-50 border border-red-100 rounded px-3 py-2">
            Your rent exceeds 30% of income. Consider budgeting strategies to reduce financial strain.
          </p>
        )}
      </div>

      {/* Savings Goals */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Savings Goals</h3>
          <button onClick={() => setAddingGoal(true)} className="text-sm text-blue-600 hover:underline">+ Add Goal</button>
        </div>

        {goals.length === 0 && !addingGoal && (
          <p className="text-sm text-gray-500 text-center py-4">No savings goals yet. Add one to start tracking.</p>
        )}

        {goals.map((goal) => {
          const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
          return (
            <div key={goal.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-800">{goal.label}</span>
                <span className="text-gray-500">${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 text-right">{pct.toFixed(0)}% reached</p>
            </div>
          )
        })}

        {addingGoal && (
          <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
            <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Goal label (e.g. Emergency Fund)" value={goalForm.label} onChange={(e) => setGoalForm((f) => ({ ...f, label: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Current ($)" value={goalForm.currentAmount} onChange={(e) => setGoalForm((f) => ({ ...f, currentAmount: e.target.value }))} />
              <input type="number" className="border rounded-lg px-3 py-2 text-sm" placeholder="Target ($)" value={goalForm.targetAmount} onChange={(e) => setGoalForm((f) => ({ ...f, targetAmount: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddGoal} disabled={savingGoal} className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                {savingGoal ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setAddingGoal(false)} className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-100 transition">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Budget Tips */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Budget Tips</h3>
        <ul className="space-y-2">
          {tips.slice(0, 4).map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Credit Reporting CTA */}
      {!financial?.creditEnrolled && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-1">Build Credit With Every Payment</h3>
          <p className="text-sm text-blue-100 mb-3">Enroll in credit reporting to have your on-time rent payments reported to major bureaus — free of charge.</p>
          <a href="/tenant/credit-reporting" className="inline-block bg-white text-blue-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            Enroll Now
          </a>
        </div>
      )}
    </div>
  )
}
