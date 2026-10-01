import { afterEach, describe, expect, it, vi } from "vitest"
import { QualifyError, qualifyErrorKind, sendQualificationMessage } from "./qualification"
import { edgeFunctionUrl } from "@/lib/backend"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("sendQualificationMessage", () => {
  it("calls lead-qualify on the backend host, not an empty Supabase URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: "Hi", completed: false }),
    })
    vi.stubGlobal("fetch", fetchMock)

    await sendQualificationMessage("tok", "website", "Hello")

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(edgeFunctionUrl("lead-qualify"))
    expect(JSON.parse(String(init.body))).toEqual({ session_token: "tok", lead_type: "website", message: "Hello" })
  })

  it("throws a QualifyError carrying the status and the server's message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({ error: "Session expired" }) }),
    )
    await expect(sendQualificationMessage("tok", "website", "Hello")).rejects.toMatchObject({
      name: "QualifyError",
      status: 404,
      message: "Session expired",
    })
  })
})

describe("qualifyErrorKind", () => {
  it("treats only the API's explicit completed and expired answers as the end of the chat", () => {
    expect(qualifyErrorKind(new QualifyError("Session already completed", 400))).toBe("completed")
    expect(qualifyErrorKind(new QualifyError("Session expired", 404))).toBe("expired")
    expect(qualifyErrorKind(new QualifyError("Session not found or expired", 404))).toBe("expired")
  })

  it("treats a bare 404, a server error or a network failure as a failed request", () => {
    expect(qualifyErrorKind(new QualifyError("HTTP 404", 404))).toBe("failed")
    expect(qualifyErrorKind(new QualifyError("Internal error", 500))).toBe("failed")
    expect(qualifyErrorKind(new TypeError("Failed to fetch"))).toBe("failed")
    expect(qualifyErrorKind("expired")).toBe("failed")
  })
})
