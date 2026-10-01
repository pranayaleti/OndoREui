import { describe, it, expect } from "vitest"
import { consentRecordLines, textConsentText, withConsentRecord, CONTACT_NOTICE_TEXT } from "./text-consent"

describe("textConsentText", () => {
  it("names the seller and the topic and carries the required disclosures", () => {
    const text = textConsentText("your loan")
    expect(text).toContain("Ondo Real Estate may text and call you at this number about your loan")
    expect(text).toContain("automated technology")
    expect(text).toContain("Consent is not a condition of any purchase or service")
    expect(text).toContain("Message frequency varies")
    expect(text).toContain("Message and data rates may apply")
    expect(text).toContain("Reply STOP to cancel or HELP for help")
  })
})

describe("consent record", () => {
  const base = { phone: "801-555-0100", textConsent: true, consentText: "text shown", consentAt: "2026-09-30T12:00:00.000Z" }

  it("stores the wording and the time when the box is checked and there is a number", () => {
    expect(consentRecordLines(base)).toEqual([
      "Text consent given: 2026-09-30T12:00:00.000Z",
      "Consent text shown: text shown",
    ])
    expect(withConsentRecord("hello", base)).toBe(
      "hello\nText consent given: 2026-09-30T12:00:00.000Z\nConsent text shown: text shown",
    )
  })

  it("records nothing when the box is unchecked or there is no phone number", () => {
    expect(consentRecordLines({ ...base, textConsent: false })).toEqual([])
    expect(consentRecordLines({ ...base, phone: "  " })).toEqual([])
    expect(withConsentRecord("hello", { ...base, textConsent: false })).toBe("hello")
  })
})

describe("CONTACT_NOTICE_TEXT", () => {
  it("is plain and makes no texting promise", () => {
    expect(CONTACT_NOTICE_TEXT).toMatch(/answer this request/)
    expect(CONTACT_NOTICE_TEXT).not.toMatch(/—/)
  })
})
