import { loadStripe, type Stripe } from "@stripe/stripe-js"

/**
 * A real publishable key is `pk_test_` or `pk_live_` followed by letters and digits only.
 * Anything else (unset, empty, or the `pk_test_your_stripe_publishable_key` placeholder from
 * .env.example, which local builds inline) is treated as not configured.
 */
export function usablePublishableKey(raw: string | undefined): string | null {
  const key = raw?.trim()
  return key && /^pk_(test|live)_[A-Za-z0-9]{8,}$/.test(key) ? key : null
}

const publishableKey = usablePublishableKey(process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"])

/** False when the build has no usable publishable key; callers show a fallback instead of Elements. */
export const isStripeConfigured = publishableKey !== null

/** null when unset, Elements must not load a fake pk_test_xxx key. */
export const stripePromise: Promise<Stripe | null> = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null)

/** Query parameters Stripe appends to return_url after a redirect-based payment. */
const STRIPE_RETURN_PARAMS = ["payment_intent", "payment_intent_client_secret", "redirect_status", "setup_intent", "setup_intent_client_secret"]

/**
 * Where Stripe sends the payer back after a redirect (3-D Secure, bank redirects). Keeps the
 * path and the page's own query (for example ?screeningId=) but drops Stripe's parameters from
 * an earlier return, so they are not stacked.
 */
export function stripeReturnUrl(location: Pick<Location, "origin" | "pathname" | "search">): string {
  const params = new URLSearchParams(location.search)
  for (const name of STRIPE_RETURN_PARAMS) params.delete(name)
  const query = params.toString()
  return `${location.origin}${location.pathname}${query ? `?${query}` : ""}`
}

/**
 * The client secret Stripe put in the URL when it sent the payer back after a redirect, or
 * null when this page load is not a return from Stripe.
 */
export function stripeReturnClientSecret(search: string): string | null {
  const params = new URLSearchParams(search)
  return params.get("redirect_status") ? params.get("payment_intent_client_secret") : null
}

/** The current URL without Stripe's return parameters, so a refresh does not replay them. */
export function withoutStripeReturnParams(href: string): string {
  const url = new URL(href)
  for (const name of STRIPE_RETURN_PARAMS) url.searchParams.delete(name)
  return `${url.pathname}${url.search}${url.hash}`
}
