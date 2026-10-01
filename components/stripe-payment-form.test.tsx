import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

const state = vi.hoisted(() => {
  const retrievePaymentIntent = vi.fn()
  return { configured: true, retrievePaymentIntent, stripe: { retrievePaymentIntent } }
})

vi.mock("@/lib/stripe", async () => {
  const actual = await vi.importActual<typeof import("@/lib/stripe")>("@/lib/stripe")
  return {
    ...actual,
    get isStripeConfigured() {
      return state.configured
    },
    stripePromise: Promise.resolve(null),
  }
})

vi.mock("@stripe/react-stripe-js", () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => state.stripe,
  useElements: () => ({}),
}))

import { StripePaymentForm } from "./stripe-payment-form"
import { SITE_PHONE } from "@/lib/site"

describe("StripePaymentForm", () => {
  beforeEach(() => {
    state.configured = true
    state.retrievePaymentIntent.mockReset()
    window.history.replaceState({}, "", "/apply/")
  })

  it("shows the office phone number, not a developer message, when Stripe is not configured", () => {
    state.configured = false
    render(<StripePaymentForm clientSecret="pi_1_secret_x" />)
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent(SITE_PHONE)
    expect(alert).not.toHaveTextContent(/NEXT_PUBLIC|environment|not configured/i)
    expect(screen.queryByTestId("payment-element")).not.toBeInTheDocument()
  })

  it("reports a paid redirect return once and removes Stripe's URL parameters", async () => {
    window.history.replaceState(
      {},
      "",
      "/apply/?screeningId=s1&payment_intent=pi_1&payment_intent_client_secret=pi_1_secret_x&redirect_status=succeeded",
    )
    state.retrievePaymentIntent.mockResolvedValue({ paymentIntent: { status: "succeeded" } })
    const onSuccess = vi.fn()
    render(<StripePaymentForm clientSecret="pi_1_secret_x" onSuccess={onSuccess} />)
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1))
    expect(state.retrievePaymentIntent).toHaveBeenCalledWith("pi_1_secret_x")
    expect(window.location.search).toBe("?screeningId=s1")
  })

  it("shows an error when the redirect payment failed", async () => {
    window.history.replaceState(
      {},
      "",
      "/apply/?payment_intent_client_secret=pi_1_secret_x&redirect_status=failed",
    )
    state.retrievePaymentIntent.mockResolvedValue({ paymentIntent: { status: "requires_payment_method" } })
    const onError = vi.fn()
    const onSuccess = vi.fn()
    render(<StripePaymentForm clientSecret="pi_1_secret_x" onSuccess={onSuccess} onError={onError} />)
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1))
    expect(onSuccess).not.toHaveBeenCalled()
    expect(screen.getByRole("alert")).toHaveTextContent(/did not go through/i)
  })

  it("ignores a return for a different payment intent", async () => {
    window.history.replaceState({}, "", "/apply/?payment_intent_client_secret=pi_OLD_secret_x&redirect_status=succeeded")
    const onSuccess = vi.fn()
    render(<StripePaymentForm clientSecret="pi_NEW_secret_y" onSuccess={onSuccess} />)
    await Promise.resolve()
    expect(state.retrievePaymentIntent).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it("does not check anything on a normal page load", async () => {
    render(<StripePaymentForm clientSecret="pi_1_secret_x" />)
    await Promise.resolve()
    expect(state.retrievePaymentIntent).not.toHaveBeenCalled()
  })
})
