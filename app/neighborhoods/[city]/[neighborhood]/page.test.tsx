import { describe, it, expect, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
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

describe("neighborhood page — market context, map, and FAQ", () => {
  it("shows city-level market context, clearly labeled as citywide", async () => {
    render(await Page({ params }))
    expect(screen.getByText(/Salt Lake City market context/i)).toBeInTheDocument()
    expect(screen.getByText(/citywide/i)).toBeInTheDocument()
  })

  it("renders a map container", async () => {
    render(await Page({ params }))
    // The page wraps PropertyMap in next/dynamic({ ssr: false }) (matching
    // app/properties/page-client.tsx's convention), which adds its own async
    // resolution tick on top of property-map.tsx's internal `import("leaflet")`
    // gate. A bare synchronous render() sees neither branch yet, so wait for
    // the container (present in both of property-map.tsx's loading and
    // loaded branches) to actually mount.
    await waitFor(() => {
      expect(document.getElementById("property-map-container")).toBeTruthy()
    })
  })

  it("emits FAQPage JSON-LD derived from existing neighborhood fields", async () => {
    render(await Page({ params }))
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    // SEO/JsonLd merges every JSON-LD object passed to a page into a single
    // <script> tag — one object if there's only one, otherwise a JSON array
    // — rather than one script per object. Flatten before searching so this
    // works regardless of how many other JSON-LD entries the page emits.
    const allEntries = scripts.flatMap((s) => {
      try {
        const parsed = JSON.parse(s.textContent || "")
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        return []
      }
    })
    const faqEntry = allEntries.find((entry) => entry?.["@type"] === "FAQPage")
    expect(faqEntry).toBeDefined()
    expect(faqEntry.mainEntity.length).toBeGreaterThanOrEqual(4)
  })

  it("renders the FAQ answers visibly, not just in JSON-LD", async () => {
    render(await Page({ params }))
    // "Sugar House Is Best For" (the pre-existing Best For heading) and
    // "What is Sugar House known for?" (the new FAQ question) both exist on
    // the page simultaneously, so an OR-regex over both matches multiple
    // elements. Assert on the FAQ-specific text alone.
    expect(screen.getByText(/What is Sugar House known for\?/i)).toBeInTheDocument()
  })
})
