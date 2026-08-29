"use client"

import { useState, type FormEvent } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { analytics } from "@/lib/analytics"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { submitContactLead, type ContactInquiryType } from "@/lib/leads-api"
import { isValidEmail } from "@/lib/security"

type Status = "idle" | "submitting" | "success" | "error"

type TemplateRequestFormProps = {
  templateId: string
  templateTitle: string
  inquiryType?: ContactInquiryType
}

export function TemplateRequestForm({
  templateId,
  templateTitle,
  inquiryType = "owner",
}: TemplateRequestFormProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const resetForm = () => {
    setName("")
    setEmail("")
    setStatus("idle")
    setErrorMsg(null)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      resetForm()
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setStatus("error")
      setErrorMsg("Please enter your name.")
      return
    }
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setStatus("error")
      setErrorMsg("Please enter a valid email address.")
      return
    }

    setStatus("submitting")
    setErrorMsg(null)

    const formName = `template_request_${templateId}`
    const attribution = getAttributionPayloadForApi()
    const result = await submitContactLead({
      name: trimmedName,
      email: trimmedEmail,
      source: "website",
      inquiryType,
      message: `Requested template: ${templateTitle}`,
      ...(attribution && { attribution }),
    })

    if ("error" in result) {
      analytics.trackFormSubmission(formName, false)
      setStatus("error")
      setErrorMsg(result.error || "Something went wrong. Please try again.")
      return
    }

    analytics.trackLeadGeneration("template_request")
    analytics.trackFormSubmission(formName, true)
    setStatus("success")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="self-start">
          Request the file
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request {templateTitle}</DialogTitle>
          <DialogDescription>
            Leave your name and email and we&apos;ll follow up with the file. This is a sample for
            reference only — not an instant download and not legal advice. It must be reviewed
            through appropriate legal channels before it can be approved or used.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <p className="text-sm font-medium text-foreground" role="status" aria-live="polite">
            Thanks. We&apos;ll follow up at your email with the {templateTitle} materials.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {status === "error" && errorMsg ? (
              <p className="flex items-start gap-2 text-sm text-destructive" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {errorMsg}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor={`template-name-${templateId}`}>Name</Label>
              <Input
                id={`template-name-${templateId}`}
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)
                  if (status === "error") {
                    setStatus("idle")
                    setErrorMsg(null)
                  }
                }}
                disabled={status === "submitting"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`template-email-${templateId}`}>Email</Label>
              <Input
                id={`template-email-${templateId}`}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status === "error") {
                    setStatus("idle")
                    setErrorMsg(null)
                  }
                }}
                disabled={status === "submitting"}
              />
            </div>
            <Button type="submit" disabled={status === "submitting"} className="w-full">
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                "Request the file"
              )}
            </Button>
            <p className="text-xs text-foreground/60">
              We use this to send the template and related landlord notes. No spam. Unsubscribe
              anytime.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
