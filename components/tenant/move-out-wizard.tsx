"use client"

import { useState, useEffect } from "react"
import { getTenantMoveOut, submitMoveOut, cancelMoveOut } from "../../lib/api/tenant-services"

interface MoveOut {
  id: string
  status: string
  requestedMoveOutDate: string
  forwardingAddress?: string
  reason?: string
}

const STEPS = [
  "Submitted",
  "Approved",
  "Inspection Scheduled",
  "Inspection Complete",
  "Deposit Processing",
  "Completed",
]

const STATUS_STEP: Record<string, number> = {
  submitted: 0,
  approved: 1,
  inspection_scheduled: 2,
  inspection_complete: 3,
  deposit_processing: 4,
  completed: 5,
}

const REASON_OPTIONS = [
  { value: "lease_end", label: "Lease End" },
  { value: "relocation", label: "Relocation" },
  { value: "upgrade", label: "Upgrading Unit" },
  { value: "pricing", label: "Pricing" },
  { value: "other", label: "Other" },
]

export function MoveOutWizard() {
  const [moveOut, setMoveOut] = useState<MoveOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form state
  const [date, setDate] = useState("")
  const [address, setAddress] = useState("")
  const [reason, setReason] = useState("lease_end")
  const [submitting, setSubmitting] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTenantMoveOut()
      const data = (res as any)?.data ?? (res as any) ?? null
      setMoveOut(data && data.id ? data : null)
    } catch {
      setMoveOut(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async () => {
    if (!date) return
    setSubmitting(true)
    setError("")
    try {
      await submitMoveOut({ requestedMoveOutDate: date, forwardingAddress: address, reason })
      await load()
    } catch (err: any) {
      setError(err.message || "Failed to submit move-out request")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = async () => {
    if (!moveOut) return
    setCancelling(true)
    setError("")
    try {
      await cancelMoveOut(moveOut.id)
      setMoveOut(null)
    } catch (err: any) {
      setError(err.message || "Failed to cancel move-out")
    } finally {
      setCancelling(false)
    }
  }

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Move-Out</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!moveOut ? (
        /* Request form */
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Ready to move out? Fill in the details below to start the process.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requested Move-Out Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forwarding Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Enter your new address..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={inputClass}
            >
              {REASON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || !date}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? "Submitting..." : "Request Move-Out"}
          </button>
        </div>
      ) : (
        /* Status tracker */
        <div className="space-y-4">
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Move-Out Date:</span>{" "}
              {new Date(moveOut.requestedMoveOutDate).toLocaleDateString()}
            </p>
            {moveOut.forwardingAddress && (
              <p>
                <span className="font-medium">Forwarding Address:</span>{" "}
                {moveOut.forwardingAddress}
              </p>
            )}
          </div>

          {/* Step tracker */}
          <div className="relative">
            {STEPS.map((step, idx) => {
              const currentStep = STATUS_STEP[moveOut.status] ?? 0
              const done = idx < currentStep
              const active = idx === currentStep
              return (
                <div key={step} className="flex items-start gap-3 mb-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        done
                          ? "bg-green-500 text-white"
                          : active
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {done ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-5 mt-1 ${
                          done ? "bg-green-400" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`text-sm pt-1 ${
                      active
                        ? "font-semibold text-blue-700"
                        : done
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              )
            })}
          </div>

          {moveOut.status === "submitted" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-sm text-red-500 border border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
            >
              {cancelling ? "Cancelling..." : "Cancel Move-Out Request"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
