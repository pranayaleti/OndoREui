export type TimelineEvent = {
  id: string
  action: string
  actionLabel?: string
  createdAt: string
}

export function ApplicationTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No application history yet.</p>
  }
  return (
    <ol className="space-y-2 text-sm">
      {events.map((event) => (
        <li key={event.id}>
          <span className="font-medium">{event.actionLabel || event.action.replace(/_/g, " ")}</span>
          <span className="text-muted-foreground"> · {event.createdAt.slice(0, 16).replace("T", " ")}</span>
        </li>
      ))}
    </ol>
  )
}
