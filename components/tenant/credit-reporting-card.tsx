"use client"

import { useState, useEffect } from "react"
import { getCreditReportingStatus, enrollCreditReporting } from "../../lib/api/tenant-services"

interface CreditStatus {
  enrolled: boolean
  enrolledAt?: string
  bureau?: string
  reportingStatus?: string
  nextReportDate?: string
}

const BUREAU_OPTIONS = ["Experian", "Equifax", "TransUnion"]

export function CreditReportingCard() {
  const [status, setStatus] = useState<CreditStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [ssnLast4, setSsnLast4] = useState("")
  const [consent, setConsent] = useState(false)
  const [bureau, setBureau] = useState("Experian")
  const [enrolling, setEnrolling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCreditReportingStatus()
      .then((res: any) => setStatus(res?.data ?? res ?? null))
      .catch(() => setStatus({ enrolled: false }))
      .finally(() => setLoading(false))
  }, [])

  const handleEnroll = async () => {
    if (ssnLast4.length !== 4 || !consent) return
    setEnrolling(true)
    setError(null)
    try {
      const res: any = await enrollCreditReporting({ ssnLast4, bureau, consentGiven: true })
      const updated = res?.data ?? res
      setStatus(updated?.status ?? { enrolled: true, bureau, enrolledAt: new Date().toISOString().slice(0, 10), reportingStatus: "active" })
      setShowForm(false)
    } catch {
      setError("Enrollment failed. Please try again.")
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return <div className="bg-card border rounded-lg p-6 text-center text-sm text-gray-500">Loading credit reporting status...</div>

  const enrolled = status?.enrolled ?? false

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Credit Reporting</h2>
        {enrolled ? (
          <span className="text-xs bg-green-500/10 dark:bg-green-500/15 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium">Enrolled</span>
        ) : (
          <span className="text-xs bg-muted text-gray-600 px-2.5 py-1 rounded-full font-medium">Not Enrolled</span>
        )}
      </div>

      {!enrolled && !showForm && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Turn your on-time rent payments into positive credit history — automatically, every month.</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { icon: "📈", title: "Builds Credit History", desc: "Payments reported monthly to credit bureaus" },
              { icon: "🆓", title: "Free of Charge", desc: "No fees for enrollment or ongoing reporting" },
              { icon: "⚡", title: "Automated Monthly Reporting", desc: "Happens automatically — no action needed" },
            ].map((benefit) => (
              <div key={benefit.title} className="flex gap-3 items-start bg-blue-500/10 dark:bg-blue-500/15 rounded-lg px-3 py-2.5">
                <span className="text-lg leading-none mt-0.5">{benefit.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{benefit.title}</p>
                  <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 text-white text-sm py-2.5 rounded-lg hover:bg-blue-700 transition font-medium">
            Enroll in Credit Reporting
          </button>
        </div>
      )}

      {!enrolled && showForm && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">Enrollment Details</h3>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Reporting Bureau</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm" value={bureau} onChange={(e) => setBureau(e.target.value)}>
              {BUREAU_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Last 4 digits of SSN</label>
            <input
              type="password"
              maxLength={4}
              className="w-full border rounded-lg px-3 py-2 text-sm tracking-widest"
              placeholder="••••"
              value={ssnLast4}
              onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" className="mt-0.5 w-4 h-4 rounded" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="text-xs text-gray-600 leading-relaxed">
              I authorize Ondo Real Estate to report my rental payment history to {bureau} for credit building purposes. I understand this will create a tradeline on my credit report.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              onClick={handleEnroll}
              disabled={enrolling || ssnLast4.length !== 4 || !consent}
              className="flex-1 bg-blue-600 text-white text-sm py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {enrolling ? "Enrolling..." : "Confirm Enrollment"}
            </button>
            <button onClick={() => setShowForm(false)} className="flex-1 border text-sm py-2.5 rounded-lg hover:bg-muted transition">Cancel</button>
          </div>
        </div>
      )}

      {enrolled && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Bureau", value: status?.bureau ?? "—" },
              { label: "Status", value: status?.reportingStatus ?? "Active" },
              { label: "Enrolled On", value: status?.enrolledAt ? new Date(status.enrolledAt).toLocaleDateString() : "—" },
              { label: "Next Report", value: status?.nextReportDate ? new Date(status.nextReportDate).toLocaleDateString() : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-800 capitalize">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-500/10 dark:bg-green-500/15 border border-green-200 dark:border-green-500/30 rounded-lg px-3 py-2.5 text-sm text-green-700 dark:text-green-400">
            Your rent payments are being reported monthly. On-time payments positively impact your credit score.
          </div>

          <button
            onClick={async () => {
              if (!confirm("Are you sure you want to unenroll from credit reporting?")) return
              try {
                await enrollCreditReporting({ action: "unenroll" })
                setStatus({ enrolled: false })
              } catch {
                setError("Failed to unenroll.")
              }
            }}
            className="text-xs text-red-500 hover:underline"
          >
            Unenroll from credit reporting
          </button>
        </div>
      )}
    </div>
  )
}
