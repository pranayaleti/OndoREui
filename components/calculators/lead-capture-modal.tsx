"use client"

/**
 * Inline "save your results" capture for calculator pages.
 *
 * This was a Dialog that opened itself 1.5s after `hasCalculated` went true.
 * Every calculator runs its calculation from a mount effect, so `hasCalculated`
 * was true immediately and the modal fired 1.5 seconds after page load, across
 * 19 calculators, before the visitor had typed anything. It stole focus from
 * the first input on the page while they were still reading it.
 *
 * It is now a card in the page flow next to the results it refers to. The name
 * and props are unchanged so the 19 call sites did not have to move; only the
 * presentation changed. `hasCalculated` still gates it, so the offer appears
 * with the numbers rather than before them.
 */

import { useEffect, useId, useState } from "react"
import { Button } from "@/components/ui/button"
import { hasLeadBeenCaptured, markLeadCaptured, submitLead } from "@/lib/api/leads"

interface LeadCaptureModalProps {
  calculatorSlug: string
  calculatorName: string
  hasCalculated: boolean
}

export function LeadCaptureModal({
  calculatorSlug,
  calculatorName,
  hasCalculated,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [alreadyCaptured, setAlreadyCaptured] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const emailId = useId()

  useEffect(() => {
    if (hasLeadBeenCaptured()) {
      setAlreadyCaptured(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    markLeadCaptured(email)
    await submitLead({
      email,
      source: calculatorName,
      calculatorSlug,
    })

    setSubmitted(true)
  }

  if (alreadyCaptured || dismissed || !hasCalculated) return null

  return (
    <section
      aria-labelledby={`${emailId}-heading`}
      className="mt-8 rounded-xl border border-border bg-muted/50 px-6 py-6"
    >
      {submitted ? (
        <p role="status" className="text-center font-medium text-primary">
          Results saved. Check your inbox.
        </p>
      ) : (
        <>
          <h2 id={`${emailId}-heading`} className="text-lg font-semibold text-foreground">
            Save your results
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Email yourself these {calculatorName} numbers so you can pick up where you left off.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label htmlFor={emailId} className="sr-only">
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Email my results
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDismissed(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                No thanks
              </Button>
            </div>
          </form>
        </>
      )}
    </section>
  )
}
