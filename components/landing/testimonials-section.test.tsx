import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { TestimonialsSection } from "./testimonials-section"
import { CityTestimonials } from "@/components/city-testimonials"
import { OperatorsSection } from "./operators-section"

describe("no invented testimonials", () => {
  it("homepage testimonials section renders nothing while there are no real reviews", () => {
    const { container } = render(<TestimonialsSection />)
    expect(container).toBeEmptyDOMElement()
  })

  it("city testimonials render nothing while there are no real reviews", () => {
    const { container } = render(<CityTestimonials cityName="Lehi" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("operators section carries no customer quote", () => {
    const { container } = render(<OperatorsSection />)
    expect(container.querySelector("blockquote")).toBeNull()
    expect(screen.queryByText(/launched autopay/i)).not.toBeInTheDocument()
  })
})
