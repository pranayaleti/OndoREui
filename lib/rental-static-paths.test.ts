import { describe, expect, it } from "vitest"
import {
  applicationIdFromPathname,
  applyStartPropertyIdFromPathname,
  applyTokenFromPathname,
  coApplicantTokenFromPathname,
  isClientOnlyRentalPath,
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

describe("isClientOnlyRentalPath", () => {
  it("is true for token links the static export cannot contain", () => {
    expect(isClientOnlyRentalPath("/apply/feb60c21-1637-4d69-b23e-47d7020e088d")).toBe(true)
    expect(isClientOnlyRentalPath("/apply/feb60c21-1637-4d69-b23e-47d7020e088d/?utm_source=x")).toBe(true)
    expect(isClientOnlyRentalPath("/apply/co/abc")).toBe(true)
    expect(isClientOnlyRentalPath("/applications/abc")).toBe(true)
  })

  // generateStaticParams exports /apply/start/<id>/ only for listings public at build time, so a
  // listing published since the last deploy (or every listing, when that fetch failed) has none.
  it("is true for /apply/start/<property>, which only build-time listings have a page for", () => {
    expect(isClientOnlyRentalPath("/apply/start/6f32d9ae-be1b-4df7-b53d-5cbbb408af96")).toBe(true)
    expect(isClientOnlyRentalPath("/apply/start/6f32d9ae-be1b-4df7-b53d-5cbbb408af96/#step-1")).toBe(true)
  })

  it("matches same-origin absolute URLs by their path", () => {
    expect(isClientOnlyRentalPath("https://www.ondorealestate.com/apply/feb60c21-1637-4d69-b23e-47d7020e088d")).toBe(true)
    expect(isClientOnlyRentalPath("http://localhost:3000/applications/abc/?x=1")).toBe(true)
    expect(isClientOnlyRentalPath("https://www.ondorealestate.com/contact/")).toBe(false)
  })

  it("is false for exported pages", () => {
    expect(isClientOnlyRentalPath("/apply/start/_")).toBe(false)
    expect(isClientOnlyRentalPath("/properties/")).toBe(false)
    expect(isClientOnlyRentalPath("/contact")).toBe(false)
  })
})
