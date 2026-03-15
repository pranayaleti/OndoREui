import { describe, it, expect } from "vitest"
import {
  SITE_NAME,
  SITE_URL,
  APP_PORTAL_URL,
  APP_PORTAL_IS_EXTERNAL,
  APP_PORTAL_LOGIN_URL,
  SITE_PHONE,
  SITE_HOURS,
  SITE_HOURS_LABEL,
  SITE_ADDRESS,
  SITE_ADDRESS_STREET,
  SITE_ADDRESS_CITY,
  SITE_ADDRESS_REGION,
  SITE_ADDRESS_POSTAL_CODE,
  SITE_ADDRESS_COUNTRY,
  SITE_ADDRESS_OBJ,
  SITE_EMAILS,
  SITE_SOCIALS,
} from "./site"

describe("site", () => {
  it("SITE_NAME is non-empty", () => {
    expect(SITE_NAME).toBeTruthy()
  })
  it("SITE_URL is https", () => {
    expect(SITE_URL.startsWith("https://")).toBe(true)
  })
  it("portal URL points to the separate dashboard app", () => {
    expect(APP_PORTAL_IS_EXTERNAL).toBe(true)
    expect(APP_PORTAL_URL.startsWith("http")).toBe(true)
    expect(APP_PORTAL_LOGIN_URL).toContain("/login")
  })
  it("SITE_PHONE contains digits", () => {
    expect(SITE_PHONE).toMatch(/\d/)
  })
  it("SITE_HOURS and SITE_HOURS_LABEL are set", () => {
    expect(SITE_HOURS).toBeTruthy()
    expect(SITE_HOURS_LABEL).toBeTruthy()
  })
  it("SITE_ADDRESS and parts are consistent", () => {
    expect(SITE_ADDRESS).toContain(SITE_ADDRESS_CITY)
    expect(SITE_ADDRESS_OBJ.streetAddress).toBe(SITE_ADDRESS_STREET)
    expect(SITE_ADDRESS_OBJ.addressLocality).toBe(SITE_ADDRESS_CITY)
    expect(SITE_ADDRESS_OBJ.addressRegion).toBe(SITE_ADDRESS_REGION)
    expect(SITE_ADDRESS_OBJ.postalCode).toBe(SITE_ADDRESS_POSTAL_CODE)
    expect(SITE_ADDRESS_OBJ.addressCountry).toBe(SITE_ADDRESS_COUNTRY)
  })
  it("SITE_EMAILS has primary and support", () => {
    expect(SITE_EMAILS.primary).toBeTruthy()
    expect(SITE_EMAILS.support).toBeTruthy()
  })
  it("SITE_SOCIALS is non-empty array of URLs", () => {
    expect(Array.isArray(SITE_SOCIALS)).toBe(true)
    expect(SITE_SOCIALS.length).toBeGreaterThan(0)
    SITE_SOCIALS.forEach((url) => {
      expect(url.startsWith("http")).toBe(true)
    })
  })
})
