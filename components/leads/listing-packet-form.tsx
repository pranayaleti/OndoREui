"use client"

import { useId, useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { analytics } from "@/lib/analytics"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { submitContactLead } from "@/lib/leads-api"
import {
  LISTING_PACKET_TIMING_LABEL_KEYS,
  LISTING_PACKET_TIMING_VALUES,
  buildListingPacketMessage,
  isListingPacketTiming,
  type ListingPacketTiming,
} from "@/lib/listing-packet"
import { isValidEmail } from "@/lib/security"

type Status = "idle" | "submitting" | "success" | "error"

export function ListingPacketForm() {
  const { t } = useTranslation()
  const instanceId = useId().replace(/:/g, "")
  const fieldId = (name: string) => `listing-packet-${name}-${instanceId}`

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [timing, setTiming] = useState<ListingPacketTiming | "">("")
  const [notes, setNotes] = useState("")
  const [photosNote, setPhotosNote] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedAddress = address.trim()

    if (!trimmedName) {
      setStatus("error")
      setErrorMsg(t("listingPacket.nameRequired"))
      return
    }
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setStatus("error")
      setErrorMsg(t("listingPacket.emailInvalid"))
      return
    }
    if (!trimmedAddress) {
      setStatus("error")
      setErrorMsg(t("listingPacket.addressRequired"))
      return
    }
    if (!timing || !isListingPacketTiming(timing)) {
      setStatus("error")
      setErrorMsg(t("listingPacket.timingRequired"))
      return
    }

    setStatus("submitting")
    setErrorMsg(null)

    const trimmedPhone = phone.trim()
    const attribution = getAttributionPayloadForApi()
    const result = await submitContactLead({
      name: trimmedName,
      email: trimmedEmail,
      ...(trimmedPhone.length >= 7 && { phone: trimmedPhone }),
      source: "website",
      inquiryType: "seller",
      message: buildListingPacketMessage({
        address: trimmedAddress,
        timing,
        notes,
        photosNote,
      }),
      ...(attribution && { attribution }),
    })

    if ("error" in result) {
      analytics.trackFormSubmission("listing_packet", false)
      setStatus("error")
      setErrorMsg(result.error || t("listingPacket.errorFallback"))
      return
    }

    analytics.trackLeadGeneration("listing_packet")
    analytics.trackFormSubmission("listing_packet", true)
    setStatus("success")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("listingPacket.title")}</CardTitle>
        <CardDescription>{t("listingPacket.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <div role="status" aria-live="polite" className="space-y-2">
            <p className="font-semibold text-foreground">{t("listingPacket.successTitle")}</p>
            <p className="text-sm text-foreground/70">{t("listingPacket.successBody")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
            {status === "error" && errorMsg ? (
              <p className="flex items-start gap-2 text-sm text-destructive" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {errorMsg}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={fieldId("name")}>{t("listingPacket.nameLabel")}</Label>
                <Input
                  id={fieldId("name")}
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={status === "submitting"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={fieldId("email")}>{t("listingPacket.emailLabel")}</Label>
                <Input
                  id={fieldId("email")}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={status === "submitting"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("phone")}>{t("listingPacket.phoneLabel")}</Label>
              <Input
                id={fieldId("phone")}
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={status === "submitting"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("address")}>{t("listingPacket.addressLabel")}</Label>
              <Input
                id={fieldId("address")}
                autoComplete="street-address"
                placeholder={t("listingPacket.addressPlaceholder")}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                disabled={status === "submitting"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("timing")}>{t("listingPacket.timingLabel")}</Label>
              <select
                id={fieldId("timing")}
                value={timing}
                onChange={(event) => {
                  const next = event.target.value
                  setTiming(isListingPacketTiming(next) ? next : "")
                }}
                disabled={status === "submitting"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">{t("listingPacket.timingPlaceholder")}</option>
                {LISTING_PACKET_TIMING_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {t(LISTING_PACKET_TIMING_LABEL_KEYS[value])}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("notes")}>{t("listingPacket.notesLabel")}</Label>
              <Textarea
                id={fieldId("notes")}
                placeholder={t("listingPacket.notesPlaceholder")}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={status === "submitting"}
                className="min-h-[88px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("photos")}>{t("listingPacket.photosLabel")}</Label>
              <Textarea
                id={fieldId("photos")}
                placeholder={t("listingPacket.photosPlaceholder")}
                value={photosNote}
                onChange={(event) => setPhotosNote(event.target.value)}
                disabled={status === "submitting"}
                className="min-h-[72px]"
              />
              <p className="text-xs text-foreground/60">{t("listingPacket.photosHint")}</p>
            </div>

            <Button type="submit" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("listingPacket.sending")}
                </>
              ) : (
                t("listingPacket.submit")
              )}
            </Button>
            <p className="text-xs text-foreground/60">{t("listingPacket.inviteOnly")}</p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
