import { describe, it, expect } from "vitest"
import { isEligiblePath } from "./first-visit-lead-popup"

describe("first-visit popup eligibility", () => {
  // A modal asking for an email would interrupt someone who is mid-form.
  it.each(["/contact/", "/qualify/", "/buy/quiz/", "/get-matched/"])("stays out of form flows like %s", (pathname) => {
    expect(isEligiblePath(pathname)).toBe(false)
  })

  it.each(["/", "/buy/", "/sell/"])("can greet first-time visitors on %s", (pathname) => {
    expect(isEligiblePath(pathname)).toBe(true)
  })
})
