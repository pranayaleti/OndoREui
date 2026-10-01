import { afterEach, describe, expect, it, vi } from "vitest"
import { validateInviteToken } from "./invitations"
import { bookSchedule, cancelSchedule, confirmVisit, rescheduleSchedule } from "./site-visits"

const TOKEN = "a/b?c=d&e#f"
const ENCODED = encodeURIComponent(TOKEN)

function stubFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => ({ data: {}, invitation: null }),
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

describe("tokens in request URLs are encoded", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("invitation validation", async () => {
    const fetchMock = stubFetch()
    await validateInviteToken(TOKEN)
    const url = String(fetchMock.mock.calls[0]![0])
    expect(url).toContain(`/api/auth/invitation/${ENCODED}`)
    expect(url).not.toContain(TOKEN)
  })

  it("site visit schedule calls", async () => {
    const fetchMock = stubFetch()
    await bookSchedule(TOKEN, "slot")
    await rescheduleSchedule(TOKEN, "slot")
    await cancelSchedule(TOKEN)
    for (const call of fetchMock.mock.calls) {
      const url = String(call[0])
      expect(url).toContain(`/schedule/${ENCODED}`)
      expect(url).not.toContain(TOKEN)
    }
  })

  it("visit confirmation", async () => {
    const fetchMock = stubFetch()
    await confirmVisit("v/1", TOKEN, 0)
    const url = String(fetchMock.mock.calls[0]![0])
    expect(url).toContain(`/api/site-visits/${encodeURIComponent("v/1")}/confirm?token=${ENCODED}`)
  })
})
