"use client"

import { useState, useEffect } from "react"
import { getTenantPackages, markPackagePickedUp, unwrapData } from "../../lib/api/tenant-services"

interface Package {
  id: string
  carrier: string
  trackingNumber: string
  description?: string
  location?: string
  status: "delivered" | "notified" | "picked_up" | "returned" | string
  deliveredAt?: string
}

const statusBadge: Record<string, string> = {
  delivered: "bg-blue-100 text-blue-700",
  notified: "bg-yellow-100 text-yellow-700",
  picked_up: "bg-green-100 text-green-700",
  returned: "bg-muted text-gray-500",
}

const statusLabel: Record<string, string> = {
  delivered: "Delivered",
  notified: "Notified",
  picked_up: "Picked Up",
  returned: "Returned",
}

export function PackageTracker() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [pickingUp, setPickingUp] = useState<string | null>(null)
  const [error, setError] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTenantPackages()
      const list = unwrapData<Package[]>(res) ?? (res as Package[] | null) ?? []
      setPackages(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handlePickUp = async (id: string) => {
    setPickingUp(id)
    try {
      await markPackagePickedUp(id)
      setPackages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "picked_up" } : p))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark picked up")
    } finally {
      setPickingUp(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading packages...
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Package Tracker</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {packages.length === 0 ? (
        <p className="text-center text-gray-500 py-6 text-sm">No packages on record.</p>
      ) : (
        <div className="space-y-3">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-3 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {pkg.carrier}
                    {pkg.description && (
                      <span className="text-gray-500 font-normal"> — {pkg.description}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{pkg.trackingNumber}</p>
                  {pkg.location && (
                    <p className="text-xs text-gray-500 mt-0.5">Location: {pkg.location}</p>
                  )}
                  {pkg.deliveredAt && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(pkg.deliveredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                    statusBadge[pkg.status] ?? "bg-muted text-gray-500"
                  }`}
                >
                  {statusLabel[pkg.status] ?? pkg.status}
                </span>
              </div>

              {pkg.status === "delivered" && (
                <button
                  onClick={() => handlePickUp(pkg.id)}
                  disabled={pickingUp === pkg.id}
                  className="mt-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {pickingUp === pkg.id ? "Marking..." : "Mark Picked Up"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
