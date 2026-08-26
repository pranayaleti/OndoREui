import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { RenterAvailabilityNote } from "./renter-availability-note"

vi.mock("@/components/contact/contact-lead-form", () => ({
  ContactLeadForm: (props: {
    defaultInquiryType?: string
    routeAfterSubmit?: boolean
    prefillMessage?: string
  }) => (
    <div
      data-testid="renter-lead-form"
      data-inquiry={props.defaultInquiryType}
      data-route={String(props.routeAfterSubmit)}
    >
      {props.prefillMessage}
    </div>
  ),
}))

describe("RenterAvailabilityNote", () => {
  it("embeds the existing renter ContactLeadForm and does not clone waitlist copy", () => {
    render(
      <RenterAvailabilityNote prefillMessage="I'm looking for an Ondo-managed rental (area: Lehi)." />,
    )
    const form = screen.getByTestId("renter-lead-form")
    expect(form).toHaveAttribute("data-inquiry", "renter")
    expect(form).toHaveAttribute("data-route", "false")
    expect(form).toHaveTextContent(/area: Lehi/)
    expect(screen.getByRole("heading", { name: /different street or move-in date/i })).toBeInTheDocument()
    expect(screen.queryByText(/get notified of new listings/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/don't see what you're looking for/i)).not.toBeInTheDocument()
    expect(screen.getByText(/equal housing opportunity/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /call leasing/i })).toHaveAttribute("href", expect.stringMatching(/^tel:/))
  })

  it("uses empty-state copy that still points people to leasing, not a waitlist", () => {
    render(<RenterAvailabilityNote variant="empty" prefillMessage="generic" />)
    expect(screen.getByRole("heading", { name: /nothing in this filter set/i })).toBeInTheDocument()
    expect(screen.getByText(/do not keep a public waitlist/i)).toBeInTheDocument()
  })
})
