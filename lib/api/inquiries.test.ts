import { beforeEach, describe, expect, it, vi } from "vitest"

const submitOrQueue = vi.hoisted(() => vi.fn())
vi.mock("@/lib/api/offline-submit", () => ({ submitOrQueue }))

import { submitPropertyInquiry } from "./inquiries"

describe("submitPropertyInquiry", () => {
  beforeEach(() => {
    submitOrQueue.mockReset().mockResolvedValue({ success: true, queued: false })
    localStorage.clear()
  })

  it("sends a payload the contact lead schema accepts, through /api/leads/contact", async () => {
    await submitPropertyInquiry({
      propertyId: "6f1b3c1e-4a53-4f4b-9d0b-0a3f7f6f3a11",
      fullName: "  Pat Tenant ",
      email: " pat@example.com ",
      phone: " ",
      message: "Is it still available?",
    })
    expect(submitOrQueue).toHaveBeenCalledTimes(1)
    const [type, endpoint, body] = submitOrQueue.mock.calls[0]!
    expect(type).toBe("propertyInquiry")
    expect(endpoint).toBe("/api/leads/contact")
    expect(body).toEqual({
      name: "Pat Tenant",
      email: "pat@example.com",
      message: "Is it still available?",
      propertyId: "6f1b3c1e-4a53-4f4b-9d0b-0a3f7f6f3a11",
      source: "website",
      inquiryType: "renter",
    })
    // The old payload keys the API rejected must be gone.
    expect(body).not.toHaveProperty("fullName")
    expect(body).not.toHaveProperty("submittedAt")
  })

  it("keeps a phone number the visitor gave and fills an empty message", async () => {
    await submitPropertyInquiry({ propertyId: "p1", fullName: "Pat", email: "p@x.co", phone: "801-555-0100", message: "" })
    const body = submitOrQueue.mock.calls[0]![2]
    expect(body.phone).toBe("801-555-0100")
    expect(body.message).toBe("Inquiry about this property.")
  })
})
