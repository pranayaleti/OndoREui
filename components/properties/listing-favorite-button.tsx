"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getFavoritePropertyIds, toggleFavoriteProperty } from "@/lib/api/properties"
import { accessibility } from "@/lib/accessibility"
import { cn } from "@/lib/utils"

type ListingFavoriteButtonProps = {
  publicId: string
  compact?: boolean
  className?: string
}

export function ListingFavoriteButton({
  publicId,
  compact = false,
  className,
}: ListingFavoriteButtonProps) {
  const { toast } = useToast()
  const [saved, setSaved] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    let cancelled = false
    void getFavoritePropertyIds().then((ids) => {
      if (!cancelled) setSaved(ids.includes(publicId))
    })
    return () => {
      cancelled = true
    }
  }, [publicId])

  const onToggleSave = async () => {
    try {
      const next = await toggleFavoriteProperty(publicId)
      const isSaved = next.includes(publicId)
      setSaved(isSaved)
      const message = isSaved ? "Saved to your list" : "Removed from your list"
      setStatus(message)
      accessibility.announceToScreenReader(message)
      toast({ title: message })
    } catch {
      toast({
        title: "Could not save",
        description: "Try again in a moment.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon" : "default"}
        className={cn(compact ? "min-h-11 min-w-11" : "min-h-11", className)}
        aria-pressed={saved}
        aria-label={compact ? (saved ? "Remove from saved listings" : "Save listing") : undefined}
        onClick={() => void onToggleSave()}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
        {compact ? null : saved ? "Saved" : "Save"}
      </Button>
    </>
  )
}
