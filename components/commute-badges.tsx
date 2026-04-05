import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type CommuteBadgesProps = {
  commuteTimes: { destination: string; minutes: number }[]
}

export function CommuteBadges({ commuteTimes }: CommuteBadgesProps) {
  if (!commuteTimes.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {commuteTimes.map((ct) => (
        <Badge key={ct.destination} variant="secondary" className="text-sm py-1 px-3">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          {ct.minutes} min to {ct.destination}
        </Badge>
      ))}
    </div>
  )
}
