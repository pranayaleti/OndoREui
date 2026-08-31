import { describe, expect, it } from "vitest"
import {
  applicationIdFromPathname,
  applyStartPropertyIdFromPathname,
  applyTokenFromPathname,
  coApplicantTokenFromPathname,
  rentalClientRouteFromPathname,
} from "./rental-static-paths"

describe("rental static-export path recovery", () => {
  it("reads apply/start, apply token, co-applicant, and application ids", () => {
    expect(applyStartPropertyIdFromPathname("/apply/start/c2e653bf-1b6a-4f0c-9654-82a4896cb137/")).toBe(
      "c2e653bf-1b6a-4f0c-9654-82a4896cb137",
    )
    expect(applyTokenFromPathname("/apply/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/")).toBe(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    )
    expect(coApplicantTokenFromPathname("/apply/co/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/")).toBe(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    )
    expect(applicationIdFromPathname("/applications/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/")).toBe(
      "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    )
  })

  it("ignores build placeholders and nested paths", () => {
    expect(applyStartPropertyIdFromPathname("/apply/start/_/")).toBeNull()
    expect(applyTokenFromPathname("/apply/start/c2e653bf-1b6a-4f0c-9654-82a4896cb137/")).toBeNull()
    expect(applyTokenFromPathname("/apply/co/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/")).toBeNull()
    expect(rentalClientRouteFromPathname("/applications")).toBeNull()
  })

  it("prefers start and co-applicant over the generic apply token", () => {
    expect(rentalClientRouteFromPathname("/apply/start/abc")).toEqual({
      kind: "apply-start",
      propertyId: "abc",
    })
    expect(rentalClientRouteFromPathname("/apply/co/tok")).toEqual({
      kind: "co-applicant",
      token: "tok",
    })
  })
})
