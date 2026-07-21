import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Page, { generateMetadata } from "./page"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ message: "ok", leadId: "1" })) }
})

const params = Promise.resolve({ city: "salt-lake-city", neighborhood: "sugar-house" })

describe("neighborhood page metadata", () => {
  it("keeps the meta description within Google's ~155-character display budget", async () => {
    const meta = await generateMetadata({ params })
    expect((meta.description as string).length).toBeLessThanOrEqual(155)
  })
})

describe("neighborhood page content", () => {
  it("renders a lead-capture form", async () => {
    render(await Page({ params }))
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it("renders the city team section and testimonials", async () => {
    render(await Page({ params }))
    // CityTeamSection renders "Your {cityName} Real Estate Team" and
    // CityTestimonials renders "What {cityName} Clients Say" — assert on
    // both components' actual headings rather than guessed copy.
    expect(screen.getByText(/Real Estate Team/i)).toBeInTheDocument()
    expect(screen.getByText(/Clients Say/i)).toBeInTheDocument()
  })

  it("links to a calculator", async () => {
    render(await Page({ params }))
    const calcLink = screen.getByRole("link", { name: /calculator/i })
    expect(calcLink.getAttribute("href")).toMatch(/^\/calculators\//)
  })
})
