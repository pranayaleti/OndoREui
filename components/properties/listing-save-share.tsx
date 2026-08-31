"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { accessibility } from "@/lib/accessibility"
import { ListingFavoriteButton } from "@/components/properties/listing-favorite-button"
import { useState } from "react"

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
  const [status, setStatus] = useState("")

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
      <ListingFavoriteButton publicId={publicId} />
      <Button type="button" variant="outline" className="min-h-11" onClick={() => void onShare()}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Share
      </Button>
    </div>
  )
}
