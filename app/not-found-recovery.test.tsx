import { Suspense, lazy, type ComponentType, type ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({ usePathname: () => window.location.pathname }))

// Resolve the loader the way next/dynamic does at runtime, without the Next loadable runtime.
vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<ComponentType<Record<string, unknown>>>) => {
    const Lazy = lazy(async () => ({ default: await loader() }))
    return function DynamicStub(props: Record<string, unknown>): ReactNode {
      return (
        <Suspense fallback={null}>
          <Lazy {...props} />
        </Suspense>
      )
    }
  },
}))

vi.mock("@/components/not-found-suggestions", () => ({ NotFoundSuggestions: () => null }))

function marker(name: string, key: string) {
  return (props: Record<string, string | undefined>) => <div data-testid={name}>{props[key]}</div>
}

vi.mock("@/components/properties/property-listing-detail-client", () => ({
  PropertyListingDetailClient: marker("listing", "publicId"),
}))
vi.mock("@/components/rental/rental-start-client", () => ({ RentalStartClient: marker("apply-start", "propertyId") }))
vi.mock("@/components/rental/apply-token-client", () => ({ ApplyTokenClient: marker("apply-token", "token") }))
vi.mock("@/components/rental/co-applicant-client", () => ({ CoApplicantClient: marker("co-applicant", "token") }))
vi.mock("@/components/rental/resume-application-client", () => ({
  ResumeApplicationClient: marker("application", "applicationId"),
}))
vi.mock("@/app/visit/schedule/[token]/visit-schedule-client", () => ({
  VisitScheduleClient: marker("visit-schedule", "token"),
}))
vi.mock("@/app/visit/confirm/[token]/visit-confirm-client", () => ({
  VisitConfirmClient: marker("visit-confirm", "token"),
}))

import NotFound from "@/app/not-found"

function renderAt(pathname: string) {
  window.history.replaceState(null, "", pathname)
  return render(<NotFound />)
}

describe("static-export 404 shell recovers dynamic routes", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("[]", { status: 200 })))
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    window.history.replaceState(null, "", "/")
  })

  const cases: Array<[string, string, string]> = [
    ["/properties/abc123/", "listing", "abc123"],
    ["/apply/start/prop-1/", "apply-start", "prop-1"],
    ["/apply/tok-9/", "apply-token", "tok-9"],
    ["/apply/co/tok-7/", "co-applicant", "tok-7"],
    ["/applications/app-5/", "application", "app-5"],
    ["/visit/schedule/sched-1/", "visit-schedule", "sched-1"],
    ["/visit/confirm/conf-2/", "visit-confirm", "conf-2"],
  ]

  it.each(cases)("%s renders the %s client with its id", async (pathname, testId, id) => {
    renderAt(pathname)
    const client = await screen.findByTestId(testId)
    expect(client).toHaveTextContent(id)
  })

  it("shows the 404 page, not a client, for an unknown path", async () => {
    renderAt("/no-such-page/")
    expect(await screen.findByRole("heading", { name: /Page Not Found/i })).toBeInTheDocument()
    expect(screen.queryByTestId("listing")).not.toBeInTheDocument()
  })

  it("shows the 404 page for the build-time placeholders", async () => {
    renderAt("/apply/_/")
    expect(await screen.findByRole("heading", { name: /Page Not Found/i })).toBeInTheDocument()
    expect(screen.queryByTestId("apply-token")).not.toBeInTheDocument()
  })
})
