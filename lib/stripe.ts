import { loadStripe, type Stripe } from "@stripe/stripe-js"

const publishableKey = process.env["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]

/** null when unset — Elements must not load a fake pk_test_xxx key. */
export const stripePromise: Promise<Stripe | null> = publishableKey
  ? loadStripe(publishableKey)
  : Promise.resolve(null)
