"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import {
  createScreeningFeeIntent,
  formatScreeningFeeCents,
  listPortableScreenings,
  listTenantScreeningStatuses,
  sendPortableScreening,
  type PortableScreeningStatus,
  type ScreeningCta,
} from "@/lib/api/screening"

export type ScreeningGateMode = "portable" | "pay" | "done" | "loading" | "skip"

interface ScreeningGateStepProps {
  propertyId: string
  applicationId: string
  /** Optional screening id from invite deep link (?screeningId=). */
  screeningIdHint?: string | null
  feeCents: number
  onComplete: () => void
  labels: {
    portableTitle: string
    portableBody: string
    useExisting: string
    sending: string
    payTitle: string
    payBody: string
    skipPay: string
    continueLabel: string
    expiresLabel: string
  }
}

function formatExpiry(expiresAt: string | null): string | null {
  if (!expiresAt) return null
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(expiresAt))
  } catch {
    return null
  }
}

/**
 * Post-submit gate: portable reuse (no pay) → fee pay (Stripe) → continue.
 * Skips silently when the applicant is not authenticated or no fee screening exists.
 */
export function ScreeningGateStep({
  propertyId,
  applicationId,
  screeningIdHint,
  feeCents,
  onComplete,
  labels,
}: ScreeningGateStepProps) {
  const [mode, setMode] = useState<ScreeningGateMode>("loading")
  const [portable, setPortable] = useState<PortableScreeningStatus[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [payScreeningId, setPayScreeningId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function resolveGate() {
      const packages = await listPortableScreenings()
      if (cancelled) return

      if (packages.length > 0) {
        setPortable(packages)
        setMode("portable")
        return
      }

      const candidates = new Set<string>()
      if (screeningIdHint) candidates.add(screeningIdHint)

      const statuses = await listTenantScreeningStatuses(1, 50)
      if (cancelled) return
      for (const row of statuses) {
        if (row.status === "invited" || row.status === "pending" || row.status === "in_progress") {
          candidates.add(row.id)
        }
      }

      for (const screeningId of candidates) {
        try {
          const intent = await createScreeningFeeIntent(screeningId)
          if (cancelled) return
          if (intent.alreadySettled) {
            setMode("done")
            return
          }
          if (intent.clientSecret) {
            setPayScreeningId(screeningId)
            setClientSecret(intent.clientSecret)
            setMode("pay")
            return
          }
        } catch {
          // Try next candidate (auth mismatch, wrong status, etc.)
        }
      }

      // No portable package and no payable screening yet (manager may invite later).
      setMode("skip")
    }

    void resolveGate()
    return () => {
      cancelled = true
    }
  }, [screeningIdHint])

  async function handleSend(screeningId: string) {
    setBusy(true)
    setError("")
    try {
      await sendPortableScreening(screeningId, { propertyId, applicationId })
      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send screening package.")
    } finally {
      setBusy(false)
    }
  }

  if (mode === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm text-foreground/70">Checking for an existing screening…</p>
      </div>
    )
  }

  if (mode === "done" || mode === "skip") {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-foreground/70">
          {mode === "done"
            ? "Your screening fee is already settled. You can continue."
            : "Your application is in. If a screening invitation is sent, you can pay the fee from that invite or reuse a portable package when available."}
        </p>
        <Button onClick={onComplete} className="sm:min-w-44">
          {labels.continueLabel}
        </Button>
      </div>
    )
  }

  if (mode === "portable") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">{labels.portableTitle}</h2>
          <p className="text-sm leading-6 text-foreground/70">{labels.portableBody}</p>
        </div>

        <div className="space-y-3">
          {portable.map((pkg) => {
            const expiry = formatExpiry(pkg.expiresAt)
            return (
              <div
                key={pkg.id}
                className="flex flex-col gap-3 rounded-2xl border bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="text-sm text-foreground/80">
                  <div className="font-medium text-foreground">Completed screening</div>
                  {expiry ? (
                    <div className="mt-1 text-foreground/60">
                      {labels.expiresLabel}: {expiry}
                    </div>
                  ) : null}
                </div>
                <Button
                  onClick={() => void handleSend(pkg.id)}
                  disabled={busy}
                  className="sm:min-w-44"
                >
                  {busy ? labels.sending : labels.useExisting}
                </Button>
              </div>
            )
          })}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button variant="outline" onClick={onComplete} disabled={busy}>
          Continue without sending
        </Button>
      </div>
    )
  }

  // pay
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">{labels.payTitle}</h2>
        <p className="text-sm leading-6 text-foreground/70">
          {labels.payBody.replace("{{fee}}", formatScreeningFeeCents(feeCents))}
        </p>
      </div>

      {clientSecret && payScreeningId ? (
        <StripePaymentForm
          clientSecret={clientSecret}
          amount={feeCents}
          submitLabel={`Pay ${formatScreeningFeeCents(feeCents)} screening fee`}
          onSuccess={onComplete}
          onError={(message) => setError(message)}
        />
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button variant="outline" onClick={onComplete}>
        {labels.skipPay}
      </Button>
    </div>
  )
}

/** Build English fee / reuse disclosure lines from public CTA. */
export function buildScreeningFeeDisclosure(cta: ScreeningCta | null): {
  feeCollectionStatus: string
  futureFeeNotice: string
  refundRecoveryInstructions: string
} {
  const refundRecoveryInstructions =
    "Screening fees cover the cost of obtaining consumer reports. To request a copy of your report or dispute inaccurate information, use the contact details on any adverse-action notice you receive. Fee refunds are handled case-by-case by the property team."

  if (!cta?.enabled) {
    return {
      feeCollectionStatus:
        "No applicant screening fee is required for this listing at this time. A property manager may still invite you to screening later.",
      futureFeeNotice:
        "If screening is required later, the fee amount will be disclosed before any payment is requested. A completed portable screening package can be reused within its validity window without paying again.",
      refundRecoveryInstructions,
    }
  }

  const fee = formatScreeningFeeCents(cta.feeCents)
  return {
    feeCollectionStatus:
      cta.feeCents > 0
        ? `An applicant screening fee of ${fee} is collected before bureau checks run, unless a manager waives the fee or you reuse a valid portable screening package.`
        : "Screening is enabled for this listing. No screening fee is charged for this property.",
    futureFeeNotice:
      cta.feeCents > 0
        ? `Payment is collected securely via Stripe before credit, criminal, or eviction checks begin. Reusing a completed portable package within ${cta.reuseDays} days skips a second fee. Managers may waive the fee for your application.`
        : `Completed screening packages remain reusable for ${cta.reuseDays} days when portability consent was given.`,
    refundRecoveryInstructions,
  }
}
