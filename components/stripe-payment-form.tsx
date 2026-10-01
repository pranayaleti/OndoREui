"use client"

import { useEffect, useRef, useState } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import {
  isStripeConfigured,
  stripePromise,
  stripeReturnClientSecret,
  stripeReturnUrl,
  withoutStripeReturnParams,
} from "@/lib/stripe"
import { SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site"
import { Button } from "@/components/ui/button"

/** Payment statuses that mean the payer is done: paid, being processed, or authorized. */
const PAID_STATUSES = new Set(["succeeded", "processing", "requires_capture"])

interface PaymentFormInnerProps {
  clientSecret: string
  amount?: number
  onSuccess?: () => void
  onError?: (message: string) => void
  submitLabel?: string
}

function PaymentFormInner({ clientSecret, amount, onSuccess, onError, submitLabel }: PaymentFormInnerProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // The latest callbacks, so the return-from-redirect check below runs once per payment intent.
  const callbacks = useRef({ onSuccess, onError })
  callbacks.current = { onSuccess, onError }

  // After a redirect-based payment (3-D Secure, bank redirect) Stripe sends the payer back to this
  // page with redirect_status in the URL. Ask Stripe for the real status of this payment intent
  // (the URL can be edited) and report it, then drop the parameters so a refresh does not replay it.
  useEffect(() => {
    if (!stripe) return
    const returnedSecret = stripeReturnClientSecret(window.location.search)
    if (!returnedSecret || returnedSecret !== clientSecret) return
    let cancelled = false
    void stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        if (cancelled) return
        window.history.replaceState(null, "", withoutStripeReturnParams(window.location.href))
        const status = paymentIntent?.status
        if (status && PAID_STATUSES.has(status)) {
          callbacks.current.onSuccess?.()
        } else if (status === "requires_payment_method") {
          const msg = "Your payment did not go through. Please try again or use another payment method."
          setErrorMessage(msg)
          callbacks.current.onError?.(msg)
        }
      })
      .catch(() => {
        // Could not reach Stripe: the form stays usable and the server record decides.
      })
    return () => {
      cancelled = true
    }
  }, [stripe, clientSecret])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        const msg = submitError.message || "Please check your payment details."
        setErrorMessage(msg)
        onError?.(msg)
        return
      }

      // Keep the page's own query (for example ?screeningId=) across a redirect.
      const confirmUrl = stripeReturnUrl(window.location)

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: confirmUrl,
        },
        redirect: "if_required",
      })

      if (error) {
        const msg = error.message || "Payment failed. Please try again."
        setErrorMessage(msg)
        onError?.(msg)
        return
      }

      const status = paymentIntent?.status
      if (status && PAID_STATUSES.has(status)) {
        onSuccess?.()
        return
      }

      const msg = "Payment did not complete. Please try again."
      setErrorMessage(msg)
      onError?.(msg)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed. Please try again."
      setErrorMessage(msg)
      onError?.(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Payment form">
      <PaymentElement />
      {errorMessage && (
        <p role="alert" className="text-sm text-red-600">{errorMessage}</p>
      )}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        aria-busy={isProcessing}
        className="w-full"
      >
        {isProcessing
          ? "Processing..."
          : submitLabel || (amount ? `Pay $${(amount / 100).toFixed(2)}` : "Pay Now")}
      </Button>
    </form>
  )
}

interface StripePaymentFormProps {
  clientSecret: string
  amount?: number
  onSuccess?: () => void
  onError?: (message: string) => void
  submitLabel?: string
}

export function StripePaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
  submitLabel,
}: StripePaymentFormProps) {
  if (!isStripeConfigured) {
    return (
      <p role="alert" className="text-sm text-muted-foreground">
        Online payment is not available right now. Please call us at{" "}
        <a href={`tel:${SITE_PHONE_TEL}`} className="font-medium underline">
          {SITE_PHONE}
        </a>{" "}
        and we will take the payment with you.
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#F97316",
          },
        },
      }}
    >
      <PaymentFormInner
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        submitLabel={submitLabel}
      />
    </Elements>
  )
}
