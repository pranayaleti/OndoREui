"use client"

interface Announcement {
  id: string
  title: string
  body: string
  priority: string
  publishAt: string
  expiresAt: string | null
}

interface AnnouncementFeedProps {
  announcements: Announcement[]
  onMarkRead?: (id: string) => void
}

const priorityStyles: Record<string, { bg: string; border: string; icon: string }> = {
  urgent: { bg: "bg-red-50", border: "border-red-200", icon: "text-red-500" },
  high: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-500" },
  normal: { bg: "bg-white", border: "border-gray-200", icon: "text-blue-500" },
  low: { bg: "bg-gray-50", border: "border-gray-200", icon: "text-gray-400" },
}

export function AnnouncementFeed({ announcements, onMarkRead }: AnnouncementFeedProps) {
  if (announcements.length === 0) {
    return <p className="text-center text-gray-500 py-6 text-sm">No announcements</p>
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
      {announcements.map((a) => {
        const style = priorityStyles[a.priority] || priorityStyles.normal
        return (
          <div
            key={a.id}
            className={`${style.bg} border ${style.border} rounded-lg p-4`}
            onClick={() => onMarkRead?.(a.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 text-lg ${style.icon}`}>
                {a.priority === "urgent" ? "!" : a.priority === "high" ? "▲" : "●"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-gray-900">{a.title}</h4>
                  <span className="text-xs text-gray-400">
                    {new Date(a.publishAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{a.body}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
