import { describe, expect, it } from "vitest"
import { isNavItemActive } from "./navigation"

describe("isNavItemActive", () => {
  it("matches the exact path with or without trailing slashes", () => {
    expect(isNavItemActive("/buy", "/buy")).toBe(true)
    expect(isNavItemActive("/buy/", "/buy")).toBe(true)
    expect(isNavItemActive("/buy", "/buy/")).toBe(true)
  })

  it("matches nested routes on a segment boundary", () => {
    expect(isNavItemActive("/buy/first-time-buyer/", "/buy")).toBe(true)
    expect(isNavItemActive("/property-management/zip/84101/", "/property-management")).toBe(true)
  })

  it("does not match sibling routes that share a prefix", () => {
    expect(isNavItemActive("/buying-guide/", "/buy")).toBe(false)
    expect(isNavItemActive("/property-management-software/", "/property-management")).toBe(false)
    expect(isNavItemActive("/sellers/", "/sell")).toBe(false)
    expect(isNavItemActive("/loans-faq", "/loans")).toBe(false)
  })

  it("only matches the home link on the home page", () => {
    expect(isNavItemActive("/", "/")).toBe(true)
    expect(isNavItemActive("/buy/", "/")).toBe(false)
  })

  it("is inactive without a pathname", () => {
    expect(isNavItemActive(null, "/buy")).toBe(false)
    expect(isNavItemActive(undefined, "/buy")).toBe(false)
  })
})
