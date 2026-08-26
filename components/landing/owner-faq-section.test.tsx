import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { OwnerFaqSection } from "./owner-faq-section"
import { getHomepageOwnerFaqs } from "@/lib/service-faq"

describe("OwnerFaqSection", () => {
  it("renders the six homepage FAQs from the property-management bank", () => {
    render(<OwnerFaqSection />)
    const faqs = getHomepageOwnerFaqs()
    expect(faqs).toHaveLength(6)
    for (const faq of faqs) {
      expect(screen.getByRole("button", { name: faq.q })).toBeInTheDocument()
    }
  })

  it("expands an accordion item to reveal the bank answer", () => {
    render(<OwnerFaqSection />)
    const first = getHomepageOwnerFaqs()[0]
    fireEvent.click(screen.getByRole("button", { name: first.q }))
    expect(screen.getByText(first.a)).toBeInTheDocument()
  })

  it("does not number questions 01/02/03 or call them guarantees", () => {
    const { container } = render(<OwnerFaqSection />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/\b01\b/)
    expect(screen.getByRole("heading", { level: 2 }).textContent).not.toMatch(/guarantee/i)
  })
})
