import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { rememberRentalApplication } from "@/lib/rental-application"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"

vi.mock("@/lib/backend", () => ({ backendUrl: (path: string) => `http://backend.test${path}` }))
// Marks next/link output so a test can tell it from a plain anchor.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-next-link="" {...rest}>
      {children}
    </a>
  ),
}))

import { MyApplicationsClient } from "./my-applications-client"

const fetchMock = vi.fn()

function requestedUrls(): string[] {
  return fetchMock.mock.calls.map(([input]) => String(input))
}

describe("MyApplicationsClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
    fetchMock.mockReset()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    window.localStorage.clear()
  })

  it("shows a visitor with nothing saved the sign-in prompt without calling the API", async () => {
    render(<MyApplicationsClient />)
    expect(screen.getByRole("heading", { level: 1, name: "My applications" })).toBeInTheDocument()
    expect(await screen.findByText(/no rental applications are saved in this browser/i)).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByRole("link", { name: /sign in to the portal/i })).toHaveAttribute("href", APP_PORTAL_LOGIN_URL)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("loads an application saved in this browser by its resume token, never the signed-in list", async () => {
    rememberRentalApplication({
      id: "app-1",
      resumeToken: "resume-1",
      propertyId: "prop-1",
      propertyTitle: "12 Elm St",
      updatedAt: new Date().toISOString(),
    })
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          application: { status: "started", completionPercent: 40, submittedAt: null },
          property: { title: "12 Elm St" },
          completedAdultApplicants: 1,
          requiredAdults: 2,
          nextAction: "Upload proof of income",
        },
      }),
    })
    render(<MyApplicationsClient />)
    expect(await screen.findByText("Upload proof of income")).toBeInTheDocument()
    expect(screen.getByText("12 Elm St")).toBeInTheDocument()
    expect(screen.getByText("1 of 2 applicants completed")).toBeInTheDocument()
    const resume = screen.getByRole("link", { name: /continue application/i })
    expect(resume).toHaveAttribute("href", "/applications/app-1/")
    // /applications/<id>/ is not in the static export: a next/link would 404 its prefetch.
    expect(resume).not.toHaveAttribute("data-next-link")
    expect(requestedUrls()).toEqual(["http://backend.test/api/rental/applications/app-1?resumeToken=resume-1"])
    expect(screen.getByRole("link", { name: /sign in to the portal/i })).toHaveAttribute("href", APP_PORTAL_LOGIN_URL)
  })
})
