import { describe, expect, it } from "vitest"
import { TEXT_CONSENT_VERSION, textConsentText } from "./text-consent"

/**
 * Parity with OndoREBackend supabase/functions/_shared/intake-logic.ts CONSENT_WORDING_VERSIONS:
 * the API stores only TEXT_CONSENT_VERSION and rebuilds this exact string. If this test changes,
 * add a new version on both sides instead of editing the old wording.
 */
describe("textConsentText", () => {
  it("matches the server-side wording for the current version, character for character", () => {
    expect(TEXT_CONSENT_VERSION).toBe("2026-10-14")
    expect(textConsentText("finding a rental", "(801) 555-0100")).toBe(
      "By checking this box, I agree that Ondo Real Estate may call and text me at (801) 555-0100, including marketing messages and messages sent with automated technology, about finding a rental. " +
        "Consent is not a condition of any purchase or service. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.",
    )
  })

  it("falls back to 'this number' for forms that render the box before the phone is typed", () => {
    expect(textConsentText("your request")).toContain("at this number, including marketing messages")
    expect(textConsentText("your request", "   ")).toContain("at this number,")
  })
})
