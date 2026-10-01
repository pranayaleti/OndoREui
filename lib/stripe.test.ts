import { describe, expect, it } from "vitest"
import {
  stripeReturnClientSecret,
  stripeReturnUrl,
  usablePublishableKey,
  withoutStripeReturnParams,
} from "@/lib/stripe"

describe("usablePublishableKey", () => {
  it("accepts real test and live keys", () => {
    expect(usablePublishableKey("pk_test_51Nabc123XYZdef456")).toBe("pk_test_51Nabc123XYZdef456")
    expect(usablePublishableKey("  pk_live_51Nabc123XYZdef456 ")).toBe("pk_live_51Nabc123XYZdef456")
  })

  it("rejects unset, empty and placeholder keys", () => {
    expect(usablePublishableKey(undefined)).toBeNull()
    expect(usablePublishableKey("")).toBeNull()
    expect(usablePublishableKey("   ")).toBeNull()
    expect(usablePublishableKey("pk_test_your_stripe_publishable_key")).toBeNull()
    expect(usablePublishableKey("pk_test_xxx")).toBeNull()
    expect(usablePublishableKey("sk_test_51Nabc123XYZdef456")).toBeNull()
  })
})

describe("stripeReturnUrl", () => {
  it("keeps the path and the page's own query", () => {
    expect(
      stripeReturnUrl({ origin: "https://ondorealestate.com", pathname: "/apply/screening/", search: "?screeningId=s1" }),
    ).toBe("https://ondorealestate.com/apply/screening/?screeningId=s1")
  })

  it("has no query mark when there is no query", () => {
    expect(stripeReturnUrl({ origin: "https://x.test", pathname: "/apply/", search: "" })).toBe("https://x.test/apply/")
  })

  it("drops Stripe's parameters from an earlier return", () => {
    expect(
      stripeReturnUrl({
        origin: "https://x.test",
        pathname: "/apply/",
        search: "?screeningId=s1&payment_intent=pi_1&payment_intent_client_secret=pi_1_secret_x&redirect_status=failed",
      }),
    ).toBe("https://x.test/apply/?screeningId=s1")
  })
})

describe("return from a redirect payment", () => {
  it("reads the client secret only when Stripe sent the payer back", () => {
    expect(stripeReturnClientSecret("?payment_intent_client_secret=pi_1_secret_x&redirect_status=succeeded")).toBe("pi_1_secret_x")
    expect(stripeReturnClientSecret("?screeningId=s1")).toBeNull()
    expect(stripeReturnClientSecret("?payment_intent_client_secret=pi_1_secret_x")).toBeNull()
  })

  it("strips Stripe's parameters and keeps the rest and the hash", () => {
    expect(
      withoutStripeReturnParams(
        "https://x.test/apply/?screeningId=s1&payment_intent=pi_1&payment_intent_client_secret=s&redirect_status=succeeded#pay",
      ),
    ).toBe("/apply/?screeningId=s1#pay")
  })
})
