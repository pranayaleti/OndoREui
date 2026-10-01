import { afterEach, describe, expect, it, vi } from "vitest"
import { ApiRequestError, getCsrfToken, isRetryableRequestError, postJson, requestErrorMessage } from "./http"

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

describe("postJson failures", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("throws an error carrying the status and the server's message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: "Validation failed" }) }),
    )
    const error = await postJson("/api/leads/contact", {}).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiRequestError)
    expect((error as ApiRequestError).status).toBe(400)
    expect(requestErrorMessage(error)).toBe("Validation failed")
    expect((error as Error).message).toBe("Request failed: 400")
  })

  it("still throws when the error body is not JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new SyntaxError("Unexpected token <")
        },
      }),
    )
    const error = await postJson("/api/x", {}).catch((e: unknown) => e)
    expect((error as ApiRequestError).status).toBe(502)
    expect(requestErrorMessage(error)).toBeUndefined()
  })
})

describe("isRetryableRequestError", () => {
  it("retries network failures, timeouts, 5xx and rate limits", () => {
    expect(isRetryableRequestError(new TypeError("Failed to fetch"))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(500))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(503))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(408))).toBe(true)
    expect(isRetryableRequestError(new ApiRequestError(429))).toBe(true)
  })

  it("does not retry a request the API rejected", () => {
    for (const status of [400, 401, 403, 404, 409, 422]) {
      expect(isRetryableRequestError(new ApiRequestError(status))).toBe(false)
    }
  })
})
