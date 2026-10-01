import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import NotaryClient from "./notary-client"
import { SITE_EMAILS, SITE_PHONE_TEL } from "@/lib/site"

vi.mock("@/components/ConsultationModal", () => ({ default: () => null }))
vi.mock("@/components/notary-booking", () => ({ NotaryBooking: () => null }))
vi.mock("@/components/notary-fees", () => ({ NotaryFees: () => null }))
vi.mock("@/components/contact/calendly-inline-embed", () => ({ CalendlyInlineEmbed: () => null }))
vi.mock("@/components/seo", () => ({ default: () => null }))

describe("notary contact block", () => {
  it("links the phone, text and email instead of showing plain text", () => {
    const { container } = render(<NotaryClient imageUrl="/img.webp" />)
    const contact = container.querySelector("#contact") as HTMLElement
    const links = within(contact).getAllByRole("link")
    const hrefs = links.map((a) => a.getAttribute("href"))
    expect(hrefs).toContain(`tel:${SITE_PHONE_TEL}`)
    expect(hrefs).toContain(`sms:${SITE_PHONE_TEL}`)
    expect(hrefs).toContain(`mailto:${SITE_EMAILS.notary}`)
    expect(screen.getAllByText(SITE_EMAILS.notary).length).toBeGreaterThan(0)
  })
})
