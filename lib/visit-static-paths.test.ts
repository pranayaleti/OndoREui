import { describe, expect, it } from "vitest"
import {
  CONFIRM_EXPORT_SHELL,
  SCHEDULE_EXPORT_SHELL,
  confirmTokenFromPathname,
  scheduleTokenFromPathname,
  tokenFromRouteParam,
  visitClientRouteFromPathname,
} from "./visit-static-paths"

describe("visit static-export path recovery", () => {
  it("reads schedule and confirm tokens from trailing-slash paths", () => {
    expect(scheduleTokenFromPathname("/visit/schedule/abc-token/")).toBe("abc-token")
    expect(confirmTokenFromPathname("/visit/confirm/xyz-token/")).toBe("xyz-token")
    expect(visitClientRouteFromPathname("/visit/schedule/abc-token")).toEqual({
      kind: "schedule",
      token: "abc-token",
    })
    expect(visitClientRouteFromPathname("/visit/confirm/xyz-token/")).toEqual({
      kind: "confirm",
      token: "xyz-token",
    })
  })

  it("ignores build placeholders and nested paths", () => {
    expect(scheduleTokenFromPathname(`/visit/schedule/${SCHEDULE_EXPORT_SHELL}/`)).toBeNull()
    expect(confirmTokenFromPathname(`/visit/confirm/${CONFIRM_EXPORT_SHELL}/`)).toBeNull()
    expect(scheduleTokenFromPathname("/visit/schedule")).toBeNull()
    expect(scheduleTokenFromPathname("/visit/schedule/abc/extra")).toBeNull()
    expect(visitClientRouteFromPathname("/visit")).toBeNull()
  })

  it("prefers an explicit token over the route param", () => {
    expect(tokenFromRouteParam("from-404", "from-params")).toBe("from-404")
    expect(tokenFromRouteParam(undefined, "from-params")).toBe("from-params")
    expect(tokenFromRouteParam(undefined, ["first", "second"])).toBe("first")
    expect(tokenFromRouteParam(undefined, undefined)).toBe("")
  })
})
