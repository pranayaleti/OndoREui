"use client"

import { useState, useEffect } from "react"
import { networkFirstGet, putJson } from "../../lib/api/http"

interface Preferences {
  categories: Record<string, boolean>
  channels: Record<string, boolean>
}

const CATEGORY_LABELS: Record<string, string> = {
  maintenance_updates: "Maintenance Updates",
  payment_reminders: "Payment Reminders",
  lease_alerts: "Lease Alerts",
  document_uploads: "Document Uploads",
  community_updates: "Community Updates",
}

const CHANNEL_LABELS: Record<string, string> = {
  email: "Email",
  push: "Push Notifications",
  sms: "SMS",
}

const DEFAULT_PREFS: Preferences = {
  categories: Object.fromEntries(Object.keys(CATEGORY_LABELS).map((k) => [k, true])),
  channels: Object.fromEntries(Object.keys(CHANNEL_LABELS).map((k) => [k, true])),
}

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    networkFirstGet<{ data?: Preferences }>("/notifications/preferences", "notif-prefs")
      .then((res: any) => {
        const data = res?.data ?? res
        if (data?.categories) setPrefs(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function persist(next: Preferences) {
    setPrefs(next)
    setSaving(true)
    try {
      await putJson("/notifications/preferences", next)
    } catch {
      /* silent */
    } finally {
      setSaving(false)
    }
  }

  function toggleCategory(key: string) {
    persist({
      ...prefs,
      categories: { ...prefs.categories, [key]: !prefs.categories[key] },
    })
  }

  function toggleChannel(key: string) {
    persist({
      ...prefs,
      channels: { ...prefs.channels, [key]: !prefs.channels[key] },
    })
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading preferences…
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg divide-y">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        {saving && <span className="text-xs text-gray-400">Saving…</span>}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Categories</h3>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Toggle
            key={key}
            label={label}
            enabled={!!prefs.categories[key]}
            onChange={() => toggleCategory(key)}
          />
        ))}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Channels</h3>
        {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
          <Toggle
            key={key}
            label={label}
            enabled={!!prefs.channels[key]}
            onChange={() => toggleChannel(key)}
          />
        ))}
      </div>
    </div>
  )
}

function Toggle({
  label,
  enabled,
  onChange,
}: {
  label: string
  enabled: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
          enabled ? "bg-orange-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition ${
            enabled ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  )
}
