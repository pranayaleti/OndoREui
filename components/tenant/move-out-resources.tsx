"use client"

import { useState, useEffect } from "react"
import { getMoveOutResources } from "../../lib/api/tenant-services"

interface MoveOutResource {
  id: string
  title: string
  description: string
  url: string
  category: string
}

export function MoveOutResources() {
  const [resources, setResources] = useState<MoveOutResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMoveOutResources()
      .then((res: any) => {
        const data = res?.data ?? res ?? []
        setResources(Array.isArray(data) ? data : [])
      })
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading resources...
      </div>
    )
  }

  if (resources.length === 0) return null

  const grouped = resources.reduce<Record<string, MoveOutResource[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Move-Out Resources</h2>
      <p className="text-sm text-gray-600">
        Helpful links to update your address and transfer services.
      </p>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {category}
          </h3>
          <div className="space-y-2">
            {items.map((resource) => (
              <div
                key={resource.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{resource.description}</p>
                </div>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Visit &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
