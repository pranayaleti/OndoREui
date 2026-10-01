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
import { SITE_PHONE } from "@/lib/site"
import { useAntiSpam } from "@/lib/anti-spam"
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
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [alreadyCaptured, setAlreadyCaptured] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const emailId = useId()
  const { honeypotProps, gate } = useAntiSpam()

  useEffect(() => {
    if (hasLeadBeenCaptured()) {
      setAlreadyCaptured(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || sending) return

    // A filled honeypot or an instant submit is a bot. Show success so it cannot probe the gate,
    // and do not remember it as a captured lead.
    if (gate.isLikelyBot()) {
      gate.recordAttempt()
      setSubmitted(true)
      return
    }

    setSending(true)
    setFailed(false)
    const saved = await submitLead({
      email,
      source: calculatorName,
      calculatorSlug,
    })
    setSending(false)

    // Only a saved lead counts: a failed send keeps the card so they can retry.
    if (!saved) {
      setFailed(true)
      return
    }
    markLeadCaptured()
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
          Thanks. We will follow up by email.
        </p>
      ) : (
        <>
          <h2 id={`${emailId}-heading`} className="text-lg font-semibold text-foreground">
            Want a follow-up?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Leave your email and the Ondo team will follow up about your {calculatorName} numbers. We do not email the results.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            {/* Honeypot: visually hidden, not focusable. Bots fill it; humans don't. */}
            <input {...honeypotProps} />
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
              <Button type="submit" disabled={sending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {sending ? "Sending..." : "Send my email"}
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
          {failed && (
            <p role="alert" className="mt-3 text-sm text-destructive-emphasis">
              That did not go through. Please try again, or call us at {SITE_PHONE}.
            </p>
          )}
        </>
      )}
    </section>
  )
}
