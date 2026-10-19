import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { HomeFaqSection } from "./owner-faq-section"
import { HOMEPAGE_FAQS } from "@/lib/home-faq"

describe("HomeFaqSection", () => {
  it("renders five questions that between them cover every service", () => {
    render(<HomeFaqSection />)
    expect(HOMEPAGE_FAQS).toHaveLength(5)
    for (const faq of HOMEPAGE_FAQS) {
      expect(screen.getByRole("button", { name: faq.q })).toBeInTheDocument()
    }
    const blob = HOMEPAGE_FAQS.map((f) => `${f.q} ${f.a}`).join(" ")
    for (const word of [/management/i, /rental/i, /home is worth/i, /loan/i, /notar/i]) expect(blob).toMatch(word)
  })

  it("expands an accordion item to reveal the answer", () => {
    render(<HomeFaqSection />)
    const first = HOMEPAGE_FAQS[0]
    fireEvent.click(screen.getByRole("button", { name: first.q }))
    expect(screen.getByText(first.a)).toBeInTheDocument()
  })

  it("makes no promises the site cannot keep", () => {
    const blob = HOMEPAGE_FAQS.map((f) => f.a).join(" ")
    expect(blob).not.toMatch(/24\/7|guarantee|instant approval|pre-approved in/i)
  })
})
