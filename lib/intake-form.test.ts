import { describe, expect, it } from "vitest"
import { parseIntakeLeadBody } from "@/test/edge-lead-schemas"
import {
  buildIntakePayload,
  clearIntakeDraft,
  formatPhone,
  readIntakeDraft,
  resolvedValue,
  validateFields,
  writeIntakeDraft,
} from "./intake-form"
import { CONTACT_SECTION, SECTIONS_BY_TYPE, type IntakeField } from "./intake-questions"

const contact = {
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  phone: "(801) 555-0100",
  phone_type: "Mobile",
  preferred_contact: "Text",
  referral_source: "Referral from someone",
  referred_by: "Grace",
}

describe("validateFields", () => {
  it("requires the contact basics and a real email and phone", () => {
    const errors = validateFields(CONTACT_SECTION.fields, { email: "nope", phone: "555" })
    expect(errors).toMatchObject({
      first_name: "This one is required.",
      email: expect.stringContaining("email address"),
      phone: "Enter a 10-digit phone number.",
      phone_type: "Pick one.",
    })
  })

  it("asks for the Other text when Other is picked", () => {
    const field = CONTACT_SECTION.fields.find((f) => f.id === "referral_source")!
    expect(validateFields([field], { referral_source: "Other" })).toEqual({ referral_source: "Fill in the Other box." })
    expect(validateFields([field], { referral_source: "Other", referral_source__other: "Podcast" })).toEqual({})
  })

  it("skips hidden questions", () => {
    const lender = SECTIONS_BY_TYPE.buyer.flatMap((s) => s.fields).find((f) => f.id === "lender")!
    expect(validateFields([{ ...lender, required: true }], { financing: "Paying cash" })).toEqual({})
  })
})

describe("resolvedValue", () => {
  it("drops answers that no longer fit after switching questionnaire", () => {
    const field: IntakeField = { id: "bedrooms", label: "Bedrooms", type: "radio", options: ["1", "2"] }
    expect(resolvedValue(field, { bedrooms: "Studio" })).toBeUndefined()
  })
})

describe("formatPhone", () => {
  it("formats US numbers and drops a leading 1", () => {
    expect(formatPhone("18015550100")).toBe("(801) 555-0100")
    expect(formatPhone("801")).toBe("801")
  })
})

describe("buildIntakePayload", () => {
  it("builds a body the Edge intake schema accepts", () => {
    const payload = buildIntakePayload(
      "buyer",
      {
        ...contact,
        financing: "Paying cash",
        lender: "should be dropped, hidden",
        price_range: "$500K to $1M",
        cities: ["Lehi", "Other"],
        cities__other: "Orem",
        anything_else: "  ",
      },
      { textConsent: true, consentText: "By checking this box..." },
    )
    const body = parseIntakeLeadBody(JSON.parse(JSON.stringify(payload)))
    expect(body).toMatchObject({
      intakeType: "buyer",
      firstName: "Ada",
      referredBy: "Grace",
      textConsent: true,
      consentText: "By checking this box...",
      answers: { financing: "Paying cash", price_range: "$500K to $1M", cities: ["Lehi", "Other: Orem"] },
      labels: { price_range: "Price range" },
    })
    expect(body.answers).not.toHaveProperty("lender")
    expect(body.answers).not.toHaveProperty("anything_else")
    expect(body.answers).not.toHaveProperty("first_name")
  })

  it("leaves the consent wording out when the box is not ticked", () => {
    const payload = buildIntakePayload("tenant", contact, { textConsent: false, consentText: "x" })
    expect(payload.textConsent).toBe(false)
    expect(payload).not.toHaveProperty("consentText")
  })
})

describe("session draft", () => {
  it("round-trips a draft and clears it", () => {
    writeIntakeDraft({ type: "buyer", answers: { first_name: "Ada" }, step: 2 })
    expect(readIntakeDraft()).toEqual({ type: "buyer", answers: { first_name: "Ada" }, step: 2 })
    clearIntakeDraft()
    expect(readIntakeDraft()).toBeNull()
  })

  it("ignores corrupt or foreign drafts instead of throwing", () => {
    window.sessionStorage.setItem("ondo.intake_draft.v1", "{not json")
    expect(readIntakeDraft()).toBeNull()
    window.sessionStorage.setItem("ondo.intake_draft.v1", JSON.stringify({ type: "landlord", answers: "x", step: -4 }))
    expect(readIntakeDraft()).toEqual({ type: null, answers: {}, step: 0 })
    clearIntakeDraft()
  })
})
