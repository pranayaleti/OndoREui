"use client"

import { useState } from "react"
import { updateChecklistItem } from "../../lib/api/tenant-services"

interface ChecklistItem {
  id: string
  category: string
  title: string
  description?: string
  isCompleted: boolean
  notes?: string
}

interface Checklist {
  id: string
  checklistType: string
  status: string
  items: ChecklistItem[]
}

interface MoveInChecklistProps {
  checklist: Checklist
  onUpdate?: () => void
}

export function MoveInChecklist({ checklist, onUpdate }: MoveInChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(checklist.items)
  const [updating, setUpdating] = useState<string | null>(null)

  const completed = items.filter((i) => i.isCompleted).length
  const total = items.length
  const allDone = completed === total && total > 0
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const typeLabel =
    checklist.checklistType === "move_out"
      ? "Move-Out Checklist"
      : "Move-In Checklist"

  const categories = Array.from(new Set(items.map((i) => i.category)))

  const handleToggle = async (item: ChecklistItem) => {
    if (updating) return
    setUpdating(item.id)
    const next = !item.isCompleted
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isCompleted: next } : i))
    )
    try {
      await updateChecklistItem(item.id, { isCompleted: next })
      onUpdate?.()
    } catch {
      // revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isCompleted: !next } : i))
      )
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{typeLabel}</h2>
        <span className="text-sm text-gray-500">
          {completed} / {total} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* All Done banner */}
      {allDone && (
        <div className="bg-green-500/10 dark:bg-green-500/15 border border-green-200 dark:border-green-500/30 rounded-lg px-4 py-3 text-green-700 dark:text-green-400 font-medium text-sm">
          All Done!
        </div>
      )}

      {/* Items grouped by category */}
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
            {cat}
          </h3>
          <div className="space-y-2">
            {items
              .filter((i) => i.category === cat)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 bg-muted rounded-lg px-3 py-2"
                >
                  <button
                    onClick={() => handleToggle(item)}
                    disabled={updating === item.id}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${
                      item.isCompleted
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 bg-card"
                    } disabled:opacity-50`}
                    aria-label={item.isCompleted ? "Mark incomplete" : "Mark complete"}
                  >
                    {item.isCompleted && (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        item.isCompleted ? "line-through text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {total === 0 && (
        <p className="text-center text-gray-500 py-6 text-sm">No checklist items found.</p>
      )}
    </div>
  )
}
