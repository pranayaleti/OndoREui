import { afterEach, describe, expect, it } from "vitest"
import { getCsrfToken } from "./http"

describe("getCsrfToken", () => {
  afterEach(() => {
    document.cookie = "ondo_csrf=; Max-Age=0; path=/"
  })

  it("returns undefined when cookie is absent", () => {
    expect(getCsrfToken()).toBeUndefined()
  })

  it("reads a plain token value", () => {
    document.cookie = "ondo_csrf=abc123; path=/"
    expect(getCsrfToken()).toBe("abc123")
  })

  it("decodes URI-encoded token values", () => {
    document.cookie = "ondo_csrf=abc%2Fdef%3D; path=/"
    expect(getCsrfToken()).toBe("abc/def=")
  })

  it("preserves tokens that contain equals signs", () => {
    document.cookie = "ondo_csrf=part1%3Dpart2; path=/"
    expect(getCsrfToken()).toBe("part1=part2")
  })
})
