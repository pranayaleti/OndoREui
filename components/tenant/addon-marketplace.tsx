"use client"

import { useState, useEffect } from "react"
import { networkFirstGet, postJson, deleteJson } from "../../lib/api/http"

interface Addon {
  id: string
  name: string
  description: string
  price_cents: number
  category?: string
}

interface ActiveAddon {
  id: string
  addon_id: string
  addon: Addon
  status: string
  subscribed_at: string
}

export function AddonMarketplace() {
  const [available, setAvailable] = useState<Addon[]>([])
  const [active, setActive] = useState<ActiveAddon[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState<string | null>(null)

  async function fetchData() {
    try {
      const [avail, mine] = await Promise.all([
        networkFirstGet<{ data?: Addon[] }>("/tenant-addons/available", "available-addons"),
        networkFirstGet<{ data?: ActiveAddon[] }>("/tenant-addons", "my-addons"),
      ])
      setAvailable(Array.isArray(avail) ? avail : (avail as any)?.data ?? [])
      setActive(Array.isArray(mine) ? mine : (mine as any)?.data ?? [])
    } catch {
      /* keep existing state */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const activeAddonIds = new Set(active.map((a) => a.addon_id))

  async function handleSubscribe(addonId: string) {
    setSubscribing(addonId)
    try {
      await postJson("/tenant-addons", { addonId })
      await fetchData()
    } catch {
      /* silent */
    } finally {
      setSubscribing(null)
    }
  }

  async function handleCancel(subscriptionId: string) {
    setCancelling(subscriptionId)
    try {
      await deleteJson(`/tenant-addons/${subscriptionId}`)
      await fetchData()
    } catch {
      /* silent */
    } finally {
      setCancelling(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading add-ons…
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Active subscriptions */}
      {active.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Add-ons</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((sub) => (
              <div
                key={sub.id}
                className="border rounded-lg p-4 bg-orange-50 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{sub.addon.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{sub.addon.description}</p>
                  <p className="text-sm font-semibold text-orange-700 mt-2">
                    ${(sub.addon.price_cents / 100).toFixed(2)}/mo
                  </p>
                </div>
                <button
                  onClick={() => handleCancel(sub.id)}
                  disabled={cancelling === sub.id}
                  className="mt-4 w-full rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                >
                  {cancelling === sub.id ? "Cancelling…" : "Cancel"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available add-ons */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Available Add-ons</h2>
        {available.length === 0 ? (
          <p className="text-sm text-gray-500">No add-ons available right now.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((addon) => {
              const subscribed = activeAddonIds.has(addon.id)
              return (
                <div
                  key={addon.id}
                  className="border rounded-lg p-4 bg-white flex flex-col justify-between hover:shadow-sm transition"
                >
                  <div>
                    {addon.category && (
                      <span className="inline-block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {addon.category}
                      </span>
                    )}
                    <h3 className="font-medium text-gray-900">{addon.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      ${(addon.price_cents / 100).toFixed(2)}/mo
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubscribe(addon.id)}
                    disabled={subscribed || subscribing === addon.id}
                    className="mt-4 w-full rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50 transition"
                  >
                    {subscribed
                      ? "Subscribed"
                      : subscribing === addon.id
                        ? "Subscribing…"
                        : "Subscribe"}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
