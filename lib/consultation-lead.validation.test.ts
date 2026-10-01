import { describe, expect, it } from "vitest"
import { consultationFieldErrors } from "./consultation-lead"

const complete = { name: "Jane Doe", email: "jane@example.com", serviceType: "Buying a Home", message: "Hi" }

describe("consultationFieldErrors", () => {
  it("is empty for a complete form", () => {
    expect(consultationFieldErrors(complete)).toEqual({})
  })

  it("flags every empty required field, treating whitespace as empty", () => {
    expect(consultationFieldErrors({ name: " ", email: "", serviceType: "", message: "  " })).toEqual({
      name: "nameRequired",
      email: "emailRequired",
      serviceType: "serviceRequired",
      message: "messageRequired",
    })
  })

  it("flags a malformed email separately from a missing one", () => {
    expect(consultationFieldErrors({ ...complete, email: "jane@" })).toEqual({ email: "emailInvalid" })
  })
})
