import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityPageLeadCapture } from "./city-page-lead-capture"
import { SITE_PHONE } from "@/lib/site"

const contactLeadForm = vi.fn()
vi.mock("@/components/contact/contact-lead-form", () => ({
  ContactLeadForm: (props: Record<string, unknown>) => {
    contactLeadForm(props)
    return <form aria-label="Contact form" />
  },
}))

describe("CityPageLeadCapture", () => {
  it("offers a call, a booking link and the shared contact form", () => {
    render(
      <CityPageLeadCapture
        cityName="Draper"
        heading="Talk to a Draper expert"
        prefillMessage="I'm interested in Draper."
        defaultInquiryType="owner"
      />,
    )

    expect(screen.getByRole("heading", { name: "Talk to a Draper expert" })).toBeInTheDocument()
    const call = screen.getByRole("link", { name: new RegExp(`call ${SITE_PHONE.replace(/[()+]/g, "\\$&")}`, "i") })
    expect(call.getAttribute("href")).toMatch(/^tel:[+\d]+$/)
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute("href", expect.stringContaining("/contact"))
    expect(screen.getByRole("form", { name: "Contact form" })).toBeInTheDocument()
    expect(contactLeadForm).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "website",
        prefillMessage: "I'm interested in Draper.",
        defaultInquiryType: "owner",
      }),
    )
  })
})
