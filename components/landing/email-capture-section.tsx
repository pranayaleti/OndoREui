"use client"

import { useState, useCallback } from "react"
import { FileText, ArrowRight } from "lucide-react"

export function EmailCaptureSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!email) return
      // Fire-and-forget to backend (or HubSpot form endpoint)
      // For now just show success — wire to /api/leads or HubSpot later
      setSubmitted(true)
    },
    [email]
  )

  return (
    <section className="py-16 bg-primary/5 dark:bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">
            Free guide: The Utah Landlord&apos;s Property Management Checklist
          </h2>
          <p className="text-foreground/70 mb-3">
            Join our mailing list and get this actionable PDF instantly.
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
            <p className="text-primary font-semibold py-4">
              Check your inbox — the guide is on its way.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Get the guide
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
          <p className="text-xs text-foreground/50 mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
