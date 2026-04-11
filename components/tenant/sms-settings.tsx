"use client"

import { useState, useEffect } from "react"
import {
  getSmsPreferences,
  updateSmsPreferences,
  requestSmsVerification,
  verifySmsCode,
} from "../../lib/api/tenant-services"

interface SmsPrefs {
  phoneNumber?: string
  phoneVerified?: boolean
  rentReminders?: boolean
  maintenanceUpdates?: boolean
  leaseAlerts?: boolean
  emergencyAlerts?: boolean
}

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}

function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-blue-600" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-card shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export function SmsSettings() {
  const [prefs, setPrefs] = useState<SmsPrefs>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Phone verification
  const [phone, setPhone] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState("")
  const [sendingCode, setSendingCode] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSmsPreferences()
        const data: SmsPrefs = (res as any)?.data ?? (res as any) ?? {}
        setPrefs(data)
        setPhone(data.phoneNumber ?? "")
      } catch (err: any) {
        setError(err.message || "Failed to load SMS preferences")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleToggle = (key: keyof SmsPrefs) => (val: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      await updateSmsPreferences({
        rentReminders: prefs.rentReminders ?? false,
        maintenanceUpdates: prefs.maintenanceUpdates ?? false,
        leaseAlerts: prefs.leaseAlerts ?? false,
        emergencyAlerts: prefs.emergencyAlerts ?? false,
      })
      setSuccess("Preferences saved.")
    } catch (err: any) {
      setError(err.message || "Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  const handleSendCode = async () => {
    if (!phone) return
    setSendingCode(true)
    setVerifyError("")
    try {
      await requestSmsVerification(phone)
      setCodeSent(true)
    } catch (err: any) {
      setVerifyError(err.message || "Failed to send code")
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerify = async () => {
    if (!code) return
    setVerifying(true)
    setVerifyError("")
    try {
      await verifySmsCode(code)
      setPrefs((prev) => ({ ...prev, phoneNumber: phone, phoneVerified: true }))
      setCodeSent(false)
      setCode("")
    } catch (err: any) {
      setVerifyError(err.message || "Invalid code")
    } finally {
      setVerifying(false)
    }
  }

  const inputClass =
    "flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading SMS settings...
      </div>
    )
  }

  const toggleRows = [
    { key: "rentReminders" as const, label: "Rent Reminders" },
    { key: "maintenanceUpdates" as const, label: "Maintenance Updates" },
    { key: "leaseAlerts" as const, label: "Lease Alerts" },
    { key: "emergencyAlerts" as const, label: "Emergency Alerts" },
  ]

  return (
    <div className="bg-card border rounded-lg p-4 space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">SMS Settings</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Phone number */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <div className="flex gap-2 items-center">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 000 0000"
            className={inputClass}
            disabled={prefs.phoneVerified}
          />
          {prefs.phoneVerified ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </span>
          ) : (
            <button
              onClick={handleSendCode}
              disabled={sendingCode || !phone}
              className="flex-shrink-0 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {sendingCode ? "Sending..." : "Send Code"}
            </button>
          )}
        </div>

        {codeSent && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter verification code"
              className={inputClass}
              maxLength={6}
            />
            <button
              onClick={handleVerify}
              disabled={verifying || !code}
              className="flex-shrink-0 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition"
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {verifyError && <p className="text-xs text-red-500">{verifyError}</p>}
      </div>

      {/* Notification toggles */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Notification Preferences</p>
        {toggleRows.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-800">{label}</span>
            <Toggle
              checked={prefs[key] ?? false}
              onChange={handleToggle(key)}
            />
          </div>
        ))}
      </div>

      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  )
}
