"use client"

import { useEffect, useState } from "react"
import { Columns2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { accessibility } from "@/lib/accessibility"
import {
  LISTING_COMPARE_EVENT,
  LISTING_COMPARE_MAX,
  isInCompare,
  toggleCompareId,
} from "@/lib/listing-compare"
import { cn } from "@/lib/utils"

type ListingCompareToggleProps = {
  publicId: string
  title?: string
  compact?: boolean
  /** Keep the text label for screen readers but show only the icon below the sm breakpoint. */
  iconOnlyOnMobile?: boolean
  className?: string
}

export function ListingCompareToggle({
  publicId,
  title,
  compact = false,
  iconOnlyOnMobile = false,
  className,
}: ListingCompareToggleProps) {
  const { toast } = useToast()
  const [selected, setSelected] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    const sync = () => setSelected(isInCompare(publicId))
    sync()
    window.addEventListener(LISTING_COMPARE_EVENT, sync)
    return () => window.removeEventListener(LISTING_COMPARE_EVENT, sync)
  }, [publicId])

  const onToggle = () => {
    const result = toggleCompareId(publicId)
    setSelected(result.ids.includes(publicId))
    if (result.status === "full") {
      const message = `You can compare up to ${LISTING_COMPARE_MAX} listings`
      setStatus(message)
      accessibility.announceToScreenReader(message)
      toast({ title: message, description: "Remove one listing from compare first." })
      return
    }
    const message =
      result.status === "added"
        ? title
          ? `Added ${title} to compare`
          : "Added to compare"
        : title
          ? `Removed ${title} from compare`
          : "Removed from compare"
    setStatus(message)
    accessibility.announceToScreenReader(message)
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      <Button
        type="button"
        variant={selected ? "secondary" : "outline"}
        size={compact ? "icon" : "default"}
        className={cn(compact ? "min-h-11 min-w-11" : "min-h-11", iconOnlyOnMobile && "max-sm:min-w-11 max-sm:px-0", className)}
        aria-pressed={selected}
        aria-label={
          compact
            ? selected
              ? "Remove from compare"
              : "Add to compare"
            : undefined
        }
        onClick={onToggle}
      >
        <Columns2 className="h-4 w-4" aria-hidden="true" />
        {compact ? null : <span className={cn(iconOnlyOnMobile && "max-sm:sr-only")}>{selected ? "In compare" : "Compare"}</span>}
      </Button>
    </>
  )
}
