import { describe, expect, it } from "vitest"
import {
  buildConsultationLead,
  inquiryTypeForService,
  splitPhoneForLead,
  type ConsultationFormValues,
} from "./consultation-lead"

const form: ConsultationFormValues = {
  name: " Jane Doe ",
  email: "jane@example.com",
  phone: "",
  propertyType: "",
  serviceType: "",
  timeline: "",
  budget: "",
  message: "Two signers, loan package.",
  preferredTime: "",
  timezone: "MST",
}

describe("inquiryTypeForService", () => {
  it("uses buyer, seller and owner where they fit", () => {
    expect(inquiryTypeForService("Buying a Home")).toBe("buyer")
    expect(inquiryTypeForService("Selling a Home")).toBe("seller")
    expect(inquiryTypeForService("Property Management")).toBe("owner")
  })

  it("sends loans, notary, investment and blank choices as other", () => {
    for (const service of ["Home Loans/Mortgage", "Refinancing", "Investment Consulting", "Loan Signing (Real Estate)", ""]) {
      expect(inquiryTypeForService(service)).toBe("other")
    }
  })
})

describe("splitPhoneForLead", () => {
  it("omits a blank phone", () => {
    expect(splitPhoneForLead("  ")).toEqual({})
  })

  it("keeps a number the backend accepts", () => {
    expect(splitPhoneForLead("(801) 555-0100")).toEqual({ phone: "(801) 555-0100" })
  })

  it("moves a number the backend would reject into a note", () => {
    expect(splitPhoneForLead("801 555 0100 ext 5")).toEqual({ note: "801 555 0100 ext 5" })
    expect(splitPhoneForLead("12345")).toEqual({ note: "12345" })
  })
})

describe("buildConsultationLead", () => {
  it("builds a contact-lead payload with no property or rental fields", () => {
    const lead = buildConsultationLead(form, "default")
    expect(lead).toMatchObject({ name: "Jane Doe", email: "jane@example.com", source: "website", inquiryType: "other" })
    expect(lead).not.toHaveProperty("phone")
    for (const key of ["publicId", "tenantPhone", "monthlyBudget", "moveInDate"]) {
      expect(lead).not.toHaveProperty(key)
    }
  })

  it("lists the chosen details and the visitor's message", () => {
    const lead = buildConsultationLead(
      {
        ...form,
        phone: "801-555-0100",
        serviceType: "Buying a Home",
        propertyType: "Townhouse/Condo",
        timeline: "Within 3 months",
        budget: "$300,000 - $500,000",
        preferredTime: "9:00 AM - 10:00 AM",
      },
      "default",
    )
    expect(lead.phone).toBe("801-555-0100")
    expect(lead.inquiryType).toBe("buyer")
    expect(lead.message).toBe(
      [
        "Request: Consultation request",
        "Service: Buying a Home",
        "Property type: Townhouse/Condo",
        "Timeline: Within 3 months",
        "Budget: $300,000 - $500,000",
        "Preferred time: 9:00 AM - 10:00 AM MST",
        "",
        "Two signers, loan package.",
      ].join("\n"),
    )
  })

  it("always files notary requests as other and says so in the message", () => {
    const lead = buildConsultationLead({ ...form, serviceType: "Loan Signing (Real Estate)", timeline: "Today" }, "notary")
    expect(lead.inquiryType).toBe("other")
    expect(lead.message).toContain("Request: Notary booking request")
    expect(lead.message).toContain("Service: Loan Signing (Real Estate)")
    expect(lead.message).toContain("Timeline: Today")
  })

  it("keeps a phone the backend would reject in the message", () => {
    const lead = buildConsultationLead({ ...form, phone: "801 555 0100 ext 5" }, "default")
    expect(lead).not.toHaveProperty("phone")
    expect(lead.message).toContain("Phone (as typed): 801 555 0100 ext 5")
  })
})
