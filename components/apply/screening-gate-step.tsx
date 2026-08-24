"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { StripePaymentForm } from "@/components/stripe-payment-form"
import {
  createScreeningFeeIntent,
  ensureApplicantScreening,
  findTenantScreeningIdForProperty,
  formatScreeningFeeCents,
  listPortableScreenings,
  sendPortableScreening,
  type PortableScreeningStatus,
  type ScreeningCta,
} from "@/lib/api/screening"

export type ScreeningGateMode =
  | "loading"
  | "portable"
  | "pay"
  | "done"
  | "blocked"
  | "not_required"

interface ScreeningGateStepProps {
  propertyId: string
  applicationId: string
  /** Deep-link screening id, used only after property match is confirmed. */
  screeningIdHint?: string | null
  screeningEnabled: boolean
  feeCents: number
  onComplete: () => void
  labels: {
    portableTitle: string
    portableBody: string
    useExisting: string
    runNew: string
    sending: string
    startingPay: string
    payTitle: string
    payBody: string
    continueLabel: string
    expiresLabel: string
    blockedTitle: string
    blockedBody: string
    retryLabel: string
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

function isFeeDue(screeningEnabled: boolean, feeCents: number): boolean {
  return screeningEnabled && feeCents > 0
}

/**
 * Post-submit gate: portable reuse and/or pay for a property-scoped screening.
 * When fee is due, continue is blocked until portable send, paid, waived, or not_required.
 */
export function ScreeningGateStep({
  propertyId,
  applicationId,
  screeningIdHint,
  screeningEnabled,
  feeCents,
  onComplete,
  labels,
}: ScreeningGateStepProps) {
  const feeDue = isFeeDue(screeningEnabled, feeCents)
  const [mode, setMode] = useState<ScreeningGateMode>("loading")
  const [portable, setPortable] = useState<PortableScreeningStatus[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [payScreeningId, setPayScreeningId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [blockedDetail, setBlockedDetail] = useState("")

  const tryOpenPayForScreeningId = useCallback(
    async (screeningId: string): Promise<"pay" | "done" | "fail"> => {
      try {
        const intent = await createScreeningFeeIntent(screeningId)
        if (intent.alreadySettled) return "done"
        if (intent.clientSecret) {
          setPayScreeningId(screeningId)
          setClientSecret(intent.clientSecret)
          return "pay"
        }
        return "fail"
      } catch {
        return "fail"
      }
    },
    []
  )

  /**
   * Resolve a payable screening for THIS property only.
   * Never uses invited screenings from other properties.
   */
  const resolvePayScreening = useCallback(async (): Promise<"pay" | "done" | "fail"> => {
    if (screeningIdHint) {
      const scopedId = await findTenantScreeningIdForProperty(screeningIdHint, propertyId)
      if (scopedId) {
        const fromHint = await tryOpenPayForScreeningId(scopedId)
        if (fromHint !== "fail") return fromHint
      }
    }

    try {
      const created = await ensureApplicantScreening(applicationId)
      if (
        created.feeStatus === "paid" ||
        created.feeStatus === "waived" ||
        created.feeStatus === "not_required" ||
        created.needsPayment === false
      ) {
        return "done"
      }
      return tryOpenPayForScreeningId(created.screeningId)
    } catch (err) {
      setBlockedDetail(
        err instanceof Error
          ? err.message
          : "Could not start a screening fee payment for this property."
      )
      return "fail"
    }
  }, [applicationId, propertyId, screeningIdHint, tryOpenPayForScreeningId])

  useEffect(() => {
    let cancelled = false

    async function resolveGate() {
      if (!screeningEnabled || !feeDue) {
        setMode("not_required")
        return
      }

      const packages = await listPortableScreenings()
      if (cancelled) return

      if (packages.length > 0) {
        setPortable(packages)
        setMode("portable")
        return
      }

      const payResult = await resolvePayScreening()
      if (cancelled) return
      if (payResult === "done") {
        setMode("done")
        return
      }
      if (payResult === "pay") {
        setMode("pay")
        return
      }
      setMode("blocked")
    }

    void resolveGate()
    return () => {
      cancelled = true
    }
  }, [feeDue, resolvePayScreening, screeningEnabled])

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

  async function handleRunNewScreening() {
    setBusy(true)
    setError("")
    setBlockedDetail("")
    try {
      const payResult = await resolvePayScreening()
      if (payResult === "done") {
        onComplete()
        return
      }
      if (payResult === "pay") {
        setMode("pay")
        return
      }
      setMode("blocked")
    } finally {
      setBusy(false)
    }
  }

  async function handleRetryBlocked() {
    setBusy(true)
    setError("")
    setBlockedDetail("")
    setMode("loading")
    try {
      const payResult = await resolvePayScreening()
      if (payResult === "done") {
        setMode("done")
        return
      }
      if (payResult === "pay") {
        setMode("pay")
        return
      }
      setMode("blocked")
    } finally {
      setBusy(false)
    }
  }

  if (mode === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm text-foreground/70">Checking screening options…</p>
      </div>
    )
  }

  if (mode === "not_required" || mode === "done") {
    return (
      <div className="space-y-4">
        <p className="text-sm leading-6 text-foreground/70">
          {mode === "done"
            ? "Your screening fee is already settled. You can continue."
            : "No screening fee is due for this listing. You can continue."}
        </p>
        <Button onClick={onComplete} className="sm:min-w-44">
          {labels.continueLabel}
        </Button>
      </div>
    )
  }

  if (mode === "blocked") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">{labels.blockedTitle}</h2>
          <p className="text-sm leading-6 text-foreground/70">{labels.blockedBody}</p>
          {blockedDetail ? (
            <p className="text-sm text-destructive">{blockedDetail}</p>
          ) : null}
        </div>
        <p className="text-sm text-foreground/60">
          Screening fee due: {formatScreeningFeeCents(feeCents)}. You cannot continue until the fee
          is paid, waived, or you send a portable package.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => void handleRetryBlocked()} disabled={busy} className="sm:min-w-44">
            {busy ? labels.startingPay : labels.retryLabel}
          </Button>
          {portable.length > 0 ? (
            <Button variant="outline" onClick={() => setMode("portable")} disabled={busy}>
              Back to portable screening
            </Button>
          ) : null}
        </div>
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

        <Button
          variant="outline"
          onClick={() => void handleRunNewScreening()}
          disabled={busy}
          className="w-full sm:w-auto"
        >
          {busy ? labels.startingPay : labels.runNew}
        </Button>
      </div>
    )
  }

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
      ) : (
        <p className="text-sm text-destructive">
          Payment form is unavailable. Retry or contact the property team.
        </p>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {portable.length > 0 ? (
        <Button variant="outline" onClick={() => setMode("portable")} disabled={busy}>
          Back to portable screening
        </Button>
      ) : null}
    </div>
  )
}

/** Build English fee / reuse disclosure lines from a loaded public CTA. */
export function buildScreeningFeeDisclosure(cta: ScreeningCta): {
  feeCollectionStatus: string
  futureFeeNotice: string
  refundRecoveryInstructions: string
} {
  const refundRecoveryInstructions =
    "Screening fees cover the cost of obtaining consumer reports. To request a copy of your report or dispute inaccurate information, use the contact details on any adverse-action notice you receive. Fee refunds are handled case-by-case by the property team."

  if (!cta.enabled) {
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
