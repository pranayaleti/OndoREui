"use client"

import { useId, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAntiSpam } from "@/lib/anti-spam"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { submitContactLead } from "@/lib/leads-api"
import { buildListingInquiryMessage, listingInquiryDraftMessage } from "@/lib/listing-presentation"
import { emailValidation, phoneValidation } from "@/lib/validations"
import { STICKY_HEADER_SCROLL_MARGIN_CLASS } from "@/lib/scroll-margins"
import { STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS } from "@/components/sticky-mobile-cta-bar"
import { cn } from "@/lib/utils"

type PreferredContact = "email" | "phone" | "text"

type ListingLeadFormsProps = {
  title: string
  address: string
  propertyId?: string
}

const TOUR_TIMES = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
] as const

function todayIsoDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

function fieldError(id: string, message: string | undefined) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  )
}

export function ListingLeadForms({ title, address, propertyId }: ListingLeadFormsProps) {
  const instanceId = useId().replace(/:/g, "")
  const infoSpam = useAntiSpam({ honeypotName: "company_url" })
  const tourSpam = useAntiSpam({ honeypotName: "company_site" })

  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "email" as PreferredContact,
    wantsTour: false,
    evaluatingAsInvestor: false,
    message: listingInquiryDraftMessage(address),
  })
  const [tour, setTour] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  })
  const [infoErrors, setInfoErrors] = useState<Record<string, string>>({})
  const [tourErrors, setTourErrors] = useState<Record<string, string>>({})
  const [infoStatus, setInfoStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [tourStatus, setTourStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [infoError, setInfoError] = useState<string | null>(null)
  const [tourError, setTourError] = useState<string | null>(null)

  const validateInfo = (): boolean => {
    const next: Record<string, string> = {}
    if (info.name.trim().length < 2) next.name = "Enter your name."
    if (!emailValidation.safeParse(info.email.trim()).success) next.email = "Enter a valid email."
    if (info.phone.trim() && !phoneValidation.safeParse(info.phone.trim()).success) {
      next.phone = "Enter a valid phone number."
    }
    if (info.preferredContact !== "email" && !info.phone.trim()) {
      next.phone = "Add a phone number for that contact method."
    }
    setInfoErrors(next)
    return Object.keys(next).length === 0
  }

  const validateTour = (): boolean => {
    const next: Record<string, string> = {}
    if (tour.name.trim().length < 2) next.name = "Enter your name."
    if (!emailValidation.safeParse(tour.email.trim()).success) next.email = "Enter a valid email."
    if (!phoneValidation.safeParse(tour.phone.trim()).success) next.phone = "Enter a phone number."
    if (!tour.date) next.date = "Choose a date."
    if (!tour.time) next.time = "Choose a time."
    setTourErrors(next)
    return Object.keys(next).length === 0
  }

  const submitInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateInfo()) return
    const data = new FormData(event.currentTarget)
    const honeypotFilled = String(data.get(infoSpam.honeypotProps.name) ?? "").trim() !== ""
    setInfoStatus("submitting")
    setInfoError(null)
    if (honeypotFilled || infoSpam.gate.isLikelyBot()) {
      infoSpam.gate.recordAttempt()
      setInfoStatus("success")
      return
    }
    const result = await submitContactLead({
      name: info.name.trim(),
      email: info.email.trim(),
      ...(info.phone.trim() && { phone: info.phone.trim() }),
      message: buildListingInquiryMessage({
        intent: info.wantsTour ? "tour" : "information",
        title,
        address,
        preferredContact: info.preferredContact,
        notes: info.message,
        evaluatingAsInvestor: info.evaluatingAsInvestor,
      }),
      ...(propertyId && { propertyId }),
      source: "website",
      inquiryType: "renter",
      attribution: getAttributionPayloadForApi(),
    })
    if ("error" in result) {
      setInfoStatus("error")
      setInfoError(result.error)
      return
    }
    setInfoStatus("success")
    setInfo({
      name: "",
      email: "",
      phone: "",
      preferredContact: "email",
      wantsTour: false,
      evaluatingAsInvestor: false,
      message: listingInquiryDraftMessage(address),
    })
  }

  const submitTour = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateTour()) return
    const data = new FormData(event.currentTarget)
    const honeypotFilled = String(data.get(tourSpam.honeypotProps.name) ?? "").trim() !== ""
    setTourStatus("submitting")
    setTourError(null)
    if (honeypotFilled || tourSpam.gate.isLikelyBot()) {
      tourSpam.gate.recordAttempt()
      setTourStatus("success")
      return
    }
    const result = await submitContactLead({
      name: tour.name.trim(),
      email: tour.email.trim(),
      phone: tour.phone.trim(),
      message: buildListingInquiryMessage({
        intent: "tour",
        title,
        address,
        tourDate: tour.date,
        tourTime: tour.time,
      }),
      ...(propertyId && { propertyId }),
      source: "website",
      inquiryType: "renter",
      attribution: getAttributionPayloadForApi(),
    })
    if ("error" in result) {
      setTourStatus("error")
      setTourError(result.error)
      return
    }
    setTourStatus("success")
    setTour({ name: "", email: "", phone: "", date: "", time: "" })
  }

  const infoNameId = `info-name-${instanceId}`
  const tourNameId = `tour-name-${instanceId}`

  return (
    <div
      id="listing-inquire"
      className={cn("scroll-mt-24", STICKY_HEADER_SCROLL_MARGIN_CLASS, STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)}
    >
      <Tabs defaultValue="information">
        <TabsList className="grid h-auto w-full grid-cols-2">
          <TabsTrigger value="information" className="min-h-11">
            Request information
          </TabsTrigger>
          <TabsTrigger value="tour" className="min-h-11">
            Schedule a tour
          </TabsTrigger>
        </TabsList>
        <TabsContent value="information">
          {infoStatus === "success" ? (
            <p className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm" role="status">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              We received your request. The leasing team will reply using the contact method you chose.
            </p>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={(e) => void submitInfo(e)} noValidate>
              <input {...infoSpam.honeypotProps} />
              <div className="space-y-1.5">
                <Label htmlFor={infoNameId}>Name</Label>
                <Input
                  id={infoNameId}
                  name="name"
                  autoComplete="name"
                  value={info.name}
                  onChange={(e) => setInfo((prev) => ({ ...prev, name: e.target.value }))}
                  aria-invalid={Boolean(infoErrors.name)}
                  aria-describedby={infoErrors.name ? `${infoNameId}-error` : undefined}
                />
                {fieldError(`${infoNameId}-error`, infoErrors.name)}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`info-email-${instanceId}`}>Email</Label>
                <Input
                  id={`info-email-${instanceId}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={info.email}
                  onChange={(e) => setInfo((prev) => ({ ...prev, email: e.target.value }))}
                  aria-invalid={Boolean(infoErrors.email)}
                  aria-describedby={infoErrors.email ? `info-email-${instanceId}-error` : undefined}
                />
                {fieldError(`info-email-${instanceId}-error`, infoErrors.email)}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`info-phone-${instanceId}`}>Phone</Label>
                <Input
                  id={`info-phone-${instanceId}`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={info.phone}
                  onChange={(e) => setInfo((prev) => ({ ...prev, phone: e.target.value }))}
                  aria-invalid={Boolean(infoErrors.phone)}
                  aria-describedby={infoErrors.phone ? `info-phone-${instanceId}-error` : undefined}
                />
                {fieldError(`info-phone-${instanceId}-error`, infoErrors.phone)}
              </div>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Preferred contact</legend>
                <RadioGroup
                  value={info.preferredContact}
                  onValueChange={(value) =>
                    setInfo((prev) => ({ ...prev, preferredContact: value as PreferredContact }))
                  }
                  className="grid grid-cols-3 gap-2"
                >
                  {(["email", "phone", "text"] as const).map((method) => (
                    <div key={method} className="flex items-center gap-2">
                      <RadioGroupItem value={method} id={`info-contact-${method}-${instanceId}`} />
                      <Label htmlFor={`info-contact-${method}-${instanceId}`} className="font-normal capitalize">
                        {method}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
              <div className="flex items-center gap-2">
                <input
                  id={`info-tour-${instanceId}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={info.wantsTour}
                  onChange={(e) => setInfo((prev) => ({ ...prev, wantsTour: e.target.checked }))}
                />
                <Label htmlFor={`info-tour-${instanceId}`} className="font-normal">
                  I would also like to tour this home
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`info-investor-${instanceId}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  checked={info.evaluatingAsInvestor}
                  onChange={(e) =>
                    setInfo((prev) => ({ ...prev, evaluatingAsInvestor: e.target.checked }))
                  }
                />
                <Label htmlFor={`info-investor-${instanceId}`} className="font-normal">
                  I&apos;m evaluating as an investor
                </Label>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`info-message-${instanceId}`}>Message</Label>
                <Textarea
                  id={`info-message-${instanceId}`}
                  name="message"
                  rows={3}
                  value={info.message}
                  onChange={(e) => setInfo((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>
              {infoStatus === "error" && infoError ? (
                <p className="flex items-start gap-2 text-sm text-destructive" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {infoError}
                </p>
              ) : null}
              <Button type="submit" className={cn("min-h-11 w-full", STICKY_MOBILE_CTA_SCROLL_MARGIN_CLASS)} disabled={infoStatus === "submitting"}>
                {infoStatus === "submitting" ? "Sending…" : "Request information"}
              </Button>
            </form>
          )}
        </TabsContent>
        <TabsContent value="tour">
          {tourStatus === "success" ? (
            <p className="mt-4 flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm" role="status">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              Tour request sent. We will confirm a time by phone or email.
            </p>
          ) : (
            <form className="mt-4 space-y-3" onSubmit={(e) => void submitTour(e)} noValidate>
              <input {...tourSpam.honeypotProps} />
              <div className="space-y-1.5">
                <Label htmlFor={tourNameId}>Name</Label>
                <Input
                  id={tourNameId}
                  name="name"
                  autoComplete="name"
                  value={tour.name}
                  onChange={(e) => setTour((prev) => ({ ...prev, name: e.target.value }))}
                  aria-invalid={Boolean(tourErrors.name)}
                  aria-describedby={tourErrors.name ? `${tourNameId}-error` : undefined}
                />
                {fieldError(`${tourNameId}-error`, tourErrors.name)}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`tour-email-${instanceId}`}>Email</Label>
                <Input
                  id={`tour-email-${instanceId}`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={tour.email}
                  onChange={(e) => setTour((prev) => ({ ...prev, email: e.target.value }))}
                  aria-invalid={Boolean(tourErrors.email)}
                  aria-describedby={tourErrors.email ? `tour-email-${instanceId}-error` : undefined}
                />
                {fieldError(`tour-email-${instanceId}-error`, tourErrors.email)}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`tour-phone-${instanceId}`}>Phone</Label>
                <Input
                  id={`tour-phone-${instanceId}`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={tour.phone}
                  onChange={(e) => setTour((prev) => ({ ...prev, phone: e.target.value }))}
                  aria-invalid={Boolean(tourErrors.phone)}
                  aria-describedby={tourErrors.phone ? `tour-phone-${instanceId}-error` : undefined}
                />
                {fieldError(`tour-phone-${instanceId}-error`, tourErrors.phone)}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor={`tour-date-${instanceId}`}>Date</Label>
                  <Input
                    id={`tour-date-${instanceId}`}
                    name="date"
                    type="date"
                    min={todayIsoDate()}
                    value={tour.date}
                    onChange={(e) => setTour((prev) => ({ ...prev, date: e.target.value }))}
                    aria-invalid={Boolean(tourErrors.date)}
                    aria-describedby={tourErrors.date ? `tour-date-${instanceId}-error` : undefined}
                  />
                  {fieldError(`tour-date-${instanceId}-error`, tourErrors.date)}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`tour-time-${instanceId}`}>Time</Label>
                  <select
                    id={`tour-time-${instanceId}`}
                    name="time"
                    value={tour.time}
                    onChange={(e) => setTour((prev) => ({ ...prev, time: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-invalid={Boolean(tourErrors.time)}
                    aria-describedby={tourErrors.time ? `tour-time-${instanceId}-error` : undefined}
                  >
                    <option value="">Select</option>
                    {TOUR_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {fieldError(`tour-time-${instanceId}-error`, tourErrors.time)}
                </div>
              </div>
              {tourStatus === "error" && tourError ? (
                <p className="flex items-start gap-2 text-sm text-destructive" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {tourError}
                </p>
              ) : null}
              <Button type="submit" className="min-h-11 w-full" disabled={tourStatus === "submitting"}>
                {tourStatus === "submitting" ? "Sending…" : "Schedule a tour"}
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
