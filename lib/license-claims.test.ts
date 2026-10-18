import { describe, it, expect } from "vitest"
import { findLicenseClaims } from "./license-claims"

const rules = (content: string, kind: "html" | "text" = "html") => findLicenseClaims(content, kind).map((c) => c.rule)

describe("findLicenseClaims", () => {
  it("catches the Oct 12 /links sentence, even split by <strong> tags", () => {
    const html = '<p>As a Utah <strong class="text-primary">real estate agent</strong> and <strong>loan officer</strong> (NMLS #2699085), I help you buy a home.</p>'
    expect(rules(html)).toEqual(expect.arrayContaining(["nmls-number", "first-person-title"]))
  })

  it("catches the old LoanOfficerLine output", () => {
    expect(rules("<p>Loan officer: Pranay Reddy Aleti, NMLS #2699085</p>")).toEqual(
      expect.arrayContaining(["nmls-number", "name-after-title"]),
    )
  })

  it("catches a license title in schema jobTitle, as a string or an array", () => {
    expect(rules('<script type="application/ld+json">{"jobTitle":"Loan Officer"}</script>')).toContain("schema-job-title")
    expect(rules('<script type="application/ld+json">{"jobTitle":["Founder","Real Estate Agent"]}</script>')).toContain(
      "schema-job-title",
    )
  })

  it("catches a title right after the name, and a first-person claim with an HTML apostrophe", () => {
    expect(rules("<h1>Pranay Reddy Aleti, Utah real estate agent</h1>")).toContain("title-next-to-name")
    expect(rules("<p>I&#x27;m a licensed loan officer in Lehi.</p>")).toContain("first-person-title")
  })

  it("ignores general advice, glossary text, the on-file disclosure and the current placeholders", () => {
    for (const html of [
      "<p>Ask a loan officer before you file a dispute mid-file.</p>",
      "<p>A loan officer, also called a mortgage loan originator, takes the application.</p>",
      "<p>Loan information is provided by Ondo Real Estate (NMLS ID on file).</p>",
      '<p>Reviewed by <a href="/about/team/pranay-reddy-aleti/">Pranay Reddy Aleti</a>, Founder · Last reviewed March 4, 2026</p>',
      "<h2>Hi, I&#x27;m Pranay</h2><p>I spent over a decade building software. I built Ondo to make real estate simpler.</p><p>I help Utah owners manage their rentals today, and I&#x27;m here to talk buying, selling and home loans while my real estate and loan officer licenses finalize.</p>",
      '<script type="application/ld+json">{"jobTitle":"Founder"}</script>',
      "<p>Real estate agents, property managers, and mortgage experts working as one team.</p>",
      // A visitor's choice in the contact form's "How can we help you?" radios (lib/contact-audiences.ts).
      '<label>I am a <strong>real estate agent</strong>, interested in referrals.</label>',
    ]) {
      expect(rules(html), html).toEqual([])
    }
  })

  it("still catches a plain first-person claim that is not the contact form's visitor option", () => {
    expect(rules("<p>I am a real estate agent based in Lehi.</p>")).toContain("first-person-title")
  })

  it("scans Markdown and plain text as-is", () => {
    expect(rules("- Loan officer: Pranay Reddy Aleti, NMLS #2699085", "text")).toContain("nmls-number")
    expect(rules("- Pranay Reddy Aleti, founder.", "text")).toEqual([])
  })
})
