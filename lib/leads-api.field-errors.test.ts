import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))

import { submitContactLead } from "./leads-api"

const PERSON_NAME_ERROR = "Please enter your name using letters only, without links or symbols."

/** A 400 from POST /api/leads/contact, shaped like the Edge route (zod flatten().fieldErrors). */
function rejectWith(details: Record<string, string[]>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: "Validation failed", details }) }),
  )
}

const payload = { name: "Jane Doe", email: "jane@example.com", phone: "call me" }

describe("submitContactLead validation errors", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("shows the API's reason a name was refused", async () => {
    rejectWith({ name: [PERSON_NAME_ERROR], phone: ["Too small: expected string to have >=7 characters"] })
    expect(await submitContactLead(payload)).toMatchObject({ error: PERSON_NAME_ERROR })
  })

  it("names the field in plain words instead of showing zod's pattern text", async () => {
    rejectWith({ phone: ["Invalid string: must match pattern /^[+\\d\\s\\-().]+$/"] })
    const result = await submitContactLead(payload)
    expect(result).toMatchObject({ error: expect.stringMatching(/valid phone number/i) })
    expect(JSON.stringify(result)).not.toMatch(/"error":"Invalid string/)
  })

  it("keeps the generic error for fields the visitor never typed", async () => {
    rejectWith({ attribution: ["Too big: expected string to have <=256 characters"], source: ["Invalid option"] })
    expect(await submitContactLead(payload)).toMatchObject({ error: "Validation failed" })
  })
})
