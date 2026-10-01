import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { FoundersNoteSection } from "./founders-note-section"

describe("FoundersNoteSection", () => {
  it("lazy-loads the founder photo: it sits below the hero, so it must not be preloaded", () => {
    const { container } = render(<FoundersNoteSection />)
    const img = container.querySelector("img")
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute("loading", "lazy")
  })
})
