"use client"

import { useState, useCallback } from "react"
import { FileText, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { submitContactLead } from "@/lib/leads-api"
import { getAttributionPayloadForApi } from "@/lib/attribution"
import { isValidEmail } from "@/lib/security"
import { analytics } from "@/lib/analytics"

type Status = "idle" | "submitting" | "success" | "error"

export function EmailCaptureSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = email.trim()
      if (!trimmed || !isValidEmail(trimmed)) {
        setErrorMsg("Please enter a valid email address.")
        setStatus("error")
        return
      }
      setStatus("submitting")
      setErrorMsg(null)

      // Derive a friendly name from the email local-part — backend requires `name`.
      const localPart = trimmed.split("@")[0] ?? "Subscriber"
      const friendlyName = localPart
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .slice(0, 80) || "Lead Magnet Subscriber"

      const result = await submitContactLead({
        name: friendlyName,
        email: trimmed,
        source: "website",
        message: "Requested: Utah Landlord's Property Management Checklist (PDF lead magnet).",
        attribution: getAttributionPayloadForApi(),
      })

      if ("error" in result) {
        setErrorMsg(result.error || "Something went wrong. Please try again.")
        setStatus("error")
        analytics.trackFormSubmission("lead_magnet_landlord_checklist", false)
        return
      }
      setStatus("success")
      analytics.trackLeadGeneration("lead_magnet_landlord_checklist")
      analytics.trackFormSubmission("lead_magnet_landlord_checklist", true)
    },
    [email]
  )

  const submitted = status === "success"

  return (
    <section className="py-16 bg-primary/5 dark:bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Utah landlord checklist — stay in the loop
          </h2>
          <p className="text-foreground/70 mb-3">
            Leave your email and we&apos;ll share practical landlord tips and follow up with the
            checklist materials.
          </p>
          <ul className="text-left text-sm text-foreground/70 mb-6 space-y-1.5 max-w-xs mx-auto">
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Utah tenant screening checklist &amp; red flags</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Lease compliance requirements specific to Utah law</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Rent collection &amp; late fee procedures</span>
            </li>
            <li className="flex items-start gap-2">
              <svg className="h-4 w-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>Maintenance request response time standards</span>
            </li>
          </ul>

          {submitted ? (
            <p className="text-primary font-semibold py-4" role="status" aria-live="polite">
              Thanks — we&apos;ll follow up at your email with landlord tips and checklist materials.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
              <input
                type="email"
                required
                aria-label="Email address"
                aria-invalid={status === "error"}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === "error") {
                    setStatus("idle")
                    setErrorMsg(null)
                  }
                }}
                disabled={status === "submitting"}
                className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Get updates
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
          {status === "error" && errorMsg && (
            <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-destructive" role="alert">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {errorMsg}
            </p>
          )}
          <p className="text-xs text-foreground/50 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
