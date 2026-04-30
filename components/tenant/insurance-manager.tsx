"use client"

import { useState } from "react"

interface Insurance {
  id: string
  provider: string
  policyNumber: string | null
  coverageAmountCents: number | null
  startDate: string
  endDate: string
  isVerified: boolean
}

interface InsuranceManagerProps {
  policies: Insurance[]
  onAdd: (data: {
    provider: string
    policyNumber?: string
    coverageAmountCents?: number
    startDate: string
    endDate: string
    propertyId: string
  }) => Promise<void>
  propertyId: string
}

export function InsuranceManager({ policies, onAdd, propertyId }: InsuranceManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [provider, setProvider] = useState("")
  const [policyNumber, setPolicyNumber] = useState("")
  const [coverage, setCoverage] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleAdd = async () => {
    if (!provider || !startDate || !endDate) return
    setSaving(true)
    try {
      await onAdd({
        provider,
        policyNumber: policyNumber || undefined,
        coverageAmountCents: coverage ? Math.round(parseFloat(coverage) * 100) : undefined,
        startDate,
        endDate,
        propertyId,
      })
      setShowForm(false)
      setProvider("")
      setPolicyNumber("")
      setCoverage("")
      setStartDate("")
      setEndDate("")
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  const isExpiringSoon = (endDate: string) => {
    const daysLeft = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysLeft > 0 && daysLeft <= 30
  }

  const isExpired = (endDate: string) => new Date(endDate) < new Date()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Renter&apos;s Insurance</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showForm ? "Cancel" : "+ Add Policy"}
        </button>
      </div>

      {showForm && (
        <div className="bg-muted rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="insurance-provider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
              <input id="insurance-provider" className={inputClass} value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Insurance company" />
            </div>
            <div>
              <label htmlFor="insurance-policy-number" className="block text-sm font-medium text-gray-700 mb-1">Policy Number</label>
              <input id="insurance-policy-number" className={inputClass} value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="insurance-coverage" className="block text-sm font-medium text-gray-700 mb-1">Coverage ($)</label>
              <input id="insurance-coverage" className={inputClass} type="number" value={coverage} onChange={(e) => setCoverage(e.target.value)} />
            </div>
            <div>
              <label htmlFor="insurance-start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input id="insurance-start-date" className={inputClass} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="insurance-end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input id="insurance-end-date" className={inputClass} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <button onClick={handleAdd} disabled={saving || !provider || !startDate || !endDate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
            {saving ? "Saving..." : "Save Policy"}
          </button>
        </div>
      )}

      {policies.length === 0 ? (
        <p className="text-center text-gray-500 py-6 text-sm">No insurance policies on file</p>
      ) : (
        <div className="space-y-2">
          {policies.map((p) => (
            <div key={p.id} className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-sm">{p.provider}</p>
                <div className="flex items-center gap-2">
                  {p.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
                  {isExpired(p.endDate) && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Expired</span>}
                  {isExpiringSoon(p.endDate) && !isExpired(p.endDate) && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Expiring Soon</span>}
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                {p.policyNumber && <p>Policy: {p.policyNumber}</p>}
                <p>Coverage: {p.coverageAmountCents ? `$${(p.coverageAmountCents / 100).toLocaleString()}` : "N/A"}</p>
                <p>Period: {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
