import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { RentalApplyNowLink } from "./rental-listing-funnel"

// Marks next/link output so a test can tell it from a plain anchor.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-next-link="" {...rest}>
      {children}
    </a>
  ),
}))

const trackRentalFunnel = vi.fn()
vi.mock("@/lib/rental-analytics", () => ({
  trackRentalFunnel: (...args: unknown[]) => trackRentalFunnel(...args),
}))

describe("RentalApplyNowLink", () => {
  it.each([
    ["an apply token link", "/apply/feb60c21-1637-4d69-b23e-47d7020e088d"],
    // Only listings public at build time have /apply/start/<id>/ exported; a newer one 404s the prefetch.
    ["the start link of a listing that may be newer than the build", "/apply/start/c2e653bf-1b6a-4f0c-9654-82a4896cb137"],
  ])("renders %s as a plain anchor and still tracks the click", (_label, href) => {
    render(
      <RentalApplyNowLink href={href} propertyRef="pub-1">
        Apply now
      </RentalApplyNowLink>,
    )
    const link = screen.getByRole("link", { name: "Apply now" })
    expect(link).toHaveAttribute("href", href)
    expect(link).not.toHaveAttribute("data-next-link")
    link.addEventListener("click", (event) => event.preventDefault()) // jsdom cannot navigate
    fireEvent.click(link)
    expect(trackRentalFunnel).toHaveBeenLastCalledWith("apply_click", "pub-1")
  })

  it("keeps next/link for an exported page", () => {
    render(
      <RentalApplyNowLink href="/contact/" propertyRef="pub-1">
        Ask a question
      </RentalApplyNowLink>,
    )
    expect(screen.getByRole("link", { name: "Ask a question" })).toHaveAttribute("data-next-link")
  })
})
