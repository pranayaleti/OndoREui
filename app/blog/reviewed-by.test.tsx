import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { FOUNDER_PERSON_ID } from "@/lib/seo"
import { FOUNDER_PROFILE_PATH } from "@/lib/team-data"

const pages = import.meta.glob("/app/blog/*/page.tsx")

type Node = { "@type"?: string | string[]; reviewedBy?: { "@id"?: string }; lastReviewed?: string }

function jsonLdNodes(container: HTMLElement): Node[] {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((script) => {
    const parsed = JSON.parse(script.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })
}

describe("every blog post credits the founder as reviewer", () => {
  it("shows a dated 'Reviewed by' link to the profile and marks the WebPage reviewedBy", async () => {
    const problems: string[] = []
    let checked = 0
    for (const [path, load] of Object.entries(pages)) {
      const slug = path.split("/")[3]!
      const mod = (await load()) as { default: (props: object) => ReactElement | Promise<ReactElement> }
      const { container, unmount } = render(await mod.default({}))
      checked += 1
      const text = container.textContent ?? ""
      const link = Array.from(container.querySelectorAll("a")).find(
        (a) => a.textContent === "Pranay Reddy Aleti" && a.getAttribute("href") === FOUNDER_PROFILE_PATH,
      )
      if (!/Reviewed by/.test(text) || !link) problems.push(`${slug}: no visible "Reviewed by" profile link`)
      if (/Invalid Date/.test(text)) problems.push(`${slug}: byline renders "Invalid Date"`)
      if (/Written by Pranay/i.test(text)) problems.push(`${slug}: says "Written by"`)
      const webPage = jsonLdNodes(container).find((node) => node["@type"] === "WebPage")
      if (webPage?.reviewedBy?.["@id"] !== FOUNDER_PERSON_ID) problems.push(`${slug}: WebPage.reviewedBy missing`)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(webPage?.lastReviewed ?? "")) problems.push(`${slug}: lastReviewed not YYYY-MM-DD`)
      unmount()
    }
    expect(checked).toBeGreaterThan(150)
    expect(problems).toEqual([])
  }, 180_000)
})
