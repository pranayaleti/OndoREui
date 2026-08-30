"use client"

import { useEffect, useState } from "react"
import { Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getFavoritePropertyIds, toggleFavoriteProperty } from "@/lib/api/properties"
import { accessibility } from "@/lib/accessibility"
import { cn } from "@/lib/utils"

type ListingSaveShareProps = {
  publicId: string
  title: string
}

async function shareListing(title: string, url: string): Promise<"shared" | "copied" | "cancelled"> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, url, text: title })
      return "shared"
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled"
      }
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url)
    return "copied"
  }
  throw new Error("Share is not available in this browser")
}

export function ListingSaveShare({ publicId, title }: ListingSaveShareProps) {
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

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      const result = await shareListing(title, url)
      if (result === "cancelled") return
      const message = result === "shared" ? "Listing shared" : "Link copied"
      setStatus(message)
      accessibility.announceToScreenReader(message)
      toast({ title: message })
    } catch {
      toast({
        title: "Could not share",
        description: "Copy the address from your browser instead.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        aria-pressed={saved}
        onClick={() => void onToggleSave()}
      >
        <Heart className={cn("h-4 w-4", saved && "fill-current")} aria-hidden="true" />
        {saved ? "Saved" : "Save"}
      </Button>
      <Button type="button" variant="outline" className="min-h-11" onClick={() => void onShare()}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </Button>
    </div>
  )
}
