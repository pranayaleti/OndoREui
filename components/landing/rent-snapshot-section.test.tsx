import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { RentSnapshotSection } from "./rent-snapshot-section"

vi.mock("@/components/contact/contact-lead-form", () => ({
  ContactLeadForm: (props: {
    defaultInquiryType?: string
    routeAfterSubmit?: boolean
    prefillMessage?: string
  }) => (
    <div
      data-testid="owner-lead-form"
      data-inquiry={props.defaultInquiryType}
      data-route={String(props.routeAfterSubmit)}
    >
      {props.prefillMessage}
    </div>
  ),
}))

describe("RentSnapshotSection", () => {
  it("does not ask for contact until a rent range is on screen", () => {
    render(<RentSnapshotSection />)
    expect(screen.queryByTestId("owner-lead-form")).not.toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /city/i })).toBeInTheDocument()
  })

  it("shows an estimated rent range, then one owner lead form that stays on the page", () => {
    render(<RentSnapshotSection />)
    fireEvent.change(screen.getByRole("combobox", { name: /city/i }), {
      target: { value: "Salt Lake City" },
    })
    fireEvent.click(screen.getByRole("button", { name: /see estimated rent/i }))

    expect(screen.getByText(/estimated monthly rent/i)).toBeInTheDocument()
    const form = screen.getByTestId("owner-lead-form")
    expect(form).toHaveAttribute("data-inquiry", "owner")
    expect(form).toHaveAttribute("data-route", "false")
    expect(screen.getAllByTestId("owner-lead-form")).toHaveLength(1)
    expect(screen.getByText(/ondo city medians/i)).toBeInTheDocument()
  })

  it("does not lead with dual identical call-you forms or competitor copy", () => {
    const { container } = render(<RentSnapshotSection />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/we'll call you/i)
    expect(text).not.toMatch(/no bots/i)
    expect(text).not.toMatch(/guarantee/i)
    expect(screen.getAllByRole("combobox", { name: /city/i })).toHaveLength(1)
  })

  it("exposes bedroom choices as a radio group with a selected state", () => {
    render(<RentSnapshotSection />)
    expect(screen.getByRole("radio", { name: "3" })).toBeChecked()
    fireEvent.click(screen.getByRole("radio", { name: "2" }))
    expect(screen.getByRole("radio", { name: "2" })).toBeChecked()
  })
})
