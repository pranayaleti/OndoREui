"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LazyImage } from "@/components/lazy-image"
import { useOfflineStatus } from "@/hooks/use-offline-status"
import { fetchPropertyById, getFavoritePropertyIds, toggleFavoriteProperty } from "@/lib/api/properties"
import { requestErrorMessage } from "@/lib/api/http"
import { analytics } from "@/lib/analytics"
import { submitPropertyInquiry } from "@/lib/api/inquiries"
import type { PropertySummary } from "@/lib/api/types"
import { SITE_PHONE } from "@/lib/site"

export function PropertyDetailsClientPage({ propertyId }: { propertyId: string }) {
  const [property, setProperty] = useState<PropertySummary | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOffline } = useOfflineStatus()

  useEffect(() => {
    void fetchPropertyById(propertyId).then(setProperty)
    void getFavoritePropertyIds().then(setFavoriteIds)
  }, [propertyId])

  const isFavorite = useMemo(() => favoriteIds.includes(propertyId), [favoriteIds, propertyId])

  const handleToggleFavorite = () => {
    void toggleFavoriteProperty(propertyId).then(setFavoriteIds)
  }

  const handleSubmitInquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatusMessage(null)
    try {
      const result = await submitPropertyInquiry({
        propertyId,
        fullName: formState.fullName,
        email: formState.email,
        phone: formState.phone,
        message: formState.message,
      })
      // One conversion per saved lead. A queued inquiry is not saved yet, so it does not count.
      if (!result.queued) {
        analytics.trackFormSubmission("property_inquiry", true)
        analytics.trackLeadGeneration("property_inquiry", propertyId)
      }
      setStatusMessage(
        result.queued
          ? "Inquiry saved offline. It will sync automatically when your connection is restored."
          : "Inquiry submitted successfully."
      )
      setFormState({ fullName: "", email: "", phone: "", message: "" })
    } catch (error) {
      analytics.trackFormSubmission("property_inquiry", false)
      // Keep what they typed so they can fix it and send again.
      setStatusMessage(
        requestErrorMessage(error) ??
          `We could not send your inquiry. Please try again, or call us at ${SITE_PHONE}.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!property) {
    return <p className="text-foreground/70">Property not found or unavailable offline.</p>
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">{property.title}</h1>
        <p className="text-foreground/70">{property.location}</p>
        <p className="text-sm text-foreground/70">
          ${property.price.toLocaleString()} / month · {property.bedrooms} bedrooms · {property.propertyType}
        </p>
        {isOffline ? <p className="text-sm text-amber-500">Offline mode active.</p> : null}
      </header>

      <div className="flex gap-2">
        <Button type="button" variant={isFavorite ? "default" : "outline"} onClick={handleToggleFavorite}>
          <Heart className="mr-2 h-4 w-4" />
          {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>{property.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <LazyImage
            src={property.image}
            alt={property.title}
            width={960}
            height={520}
            className="mb-4 h-56 w-full overflow-hidden rounded-md object-cover"
          />
          <p className="text-sm text-foreground/80">
            This page is cached by the service worker and tracked as one of your last viewed properties.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Agent</CardTitle>
          <CardDescription>Works online and offline with automatic background sync.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmitInquiry}>
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                required
                value={formState.fullName}
                onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formState.phone}
                onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                value={formState.message}
                onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
            {statusMessage ? <p className="text-sm text-foreground/80">{statusMessage}</p> : null}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
