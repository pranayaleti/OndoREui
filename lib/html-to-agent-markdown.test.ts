import { describe, expect, it } from "vitest"
import {
  exportedHtmlRelToMarkdownRel,
  htmlPathToMarkdownPath,
  htmlToAgentMarkdown,
} from "./html-to-agent-markdown"

describe("htmlPathToMarkdownPath", () => {
  it("maps HTML routes to sibling .md files", () => {
    expect(htmlPathToMarkdownPath("/")).toBe("/index.md")
    expect(htmlPathToMarkdownPath("/about/")).toBe("/about.md")
    expect(htmlPathToMarkdownPath("/about")).toBe("/about.md")
    expect(htmlPathToMarkdownPath("/calculators/mortgage-payment/")).toBe(
      "/calculators/mortgage-payment.md",
    )
  })

  it("returns the path unchanged when it is already markdown", () => {
    expect(htmlPathToMarkdownPath("/about.md")).toBe("/about.md")
  })

  it("returns null for non-HTML machine files and private assets", () => {
    expect(htmlPathToMarkdownPath("/llms.txt")).toBeNull()
    expect(htmlPathToMarkdownPath("/sitemap.xml")).toBeNull()
    expect(htmlPathToMarkdownPath("/llms.json")).toBeNull()
    expect(htmlPathToMarkdownPath("/_next/static/chunks/app.html")).toBeNull()
  })
})

describe("exportedHtmlRelToMarkdownRel", () => {
  it("maps static-export HTML files to sibling markdown", () => {
    expect(exportedHtmlRelToMarkdownRel("index.html")).toBe("index.md")
    expect(exportedHtmlRelToMarkdownRel("about/index.html")).toBe("about.md")
    expect(exportedHtmlRelToMarkdownRel("calculators/mortgage-payment/index.html")).toBe(
      "calculators/mortgage-payment.md",
    )
  })

  it("skips error pages and bundler output", () => {
    expect(exportedHtmlRelToMarkdownRel("404.html")).toBeNull()
    expect(exportedHtmlRelToMarkdownRel("404/index.html")).toBeNull()
    expect(exportedHtmlRelToMarkdownRel("_next/static/foo.html")).toBeNull()
  })
})

describe("htmlToAgentMarkdown", () => {
  it("extracts #main-content, keeps headings/links, and drops chrome plus scripts", () => {
    const html = `<!doctype html><html><head><title>About</title><script>alert(1)</script></head>
<body>
<header>Site nav</header>
<div id="main-content" class="flex-1">
  <h1>About Ondo</h1>
  <p>We help <a href="/buy/">buyers</a> in Utah.</p>
  <section class="hidden" data-agent-intro="about"><p>Agent-only summary</p></section>
</div>
<footer>Site footer</footer>
</body></html>`

    const md = htmlToAgentMarkdown(html, {
      canonical: "https://www.ondorealestate.com/about/",
      title: "About Ondo",
    })

    expect(md.startsWith("---\n")).toBe(true)
    expect(md).toContain("canonical: https://www.ondorealestate.com/about/")
    expect(md).toMatch(/^# About Ondo/m)
    expect(md).toContain("[buyers](/buy/)")
    expect(md).toContain("Agent-only summary")
    expect(md).not.toContain("Site nav")
    expect(md).not.toContain("Site footer")
    expect(md).not.toContain("alert(1)")
  })

  it("uses Next.js completed suspense slots instead of the Loading... fallback", () => {
    const html = `<!doctype html><html><body>
<div id="main-content"><!--$?--><template id="B:0"></template><p>Loading...</p><!--/$--></div>
<footer>Site footer</footer>
<div hidden id="S:0"><h1>About Ondo</h1><p>We help <a href="/buy/">buyers</a> in Utah.</p></div>
</body></html>`

    const md = htmlToAgentMarkdown(html, {
      canonical: "https://www.ondorealestate.com/about/",
      title: "About Ondo",
    })

    expect(md).toMatch(/^# About Ondo/m)
    expect(md).toContain("[buyers](/buy/)")
    expect(md).not.toContain("Loading...")
    expect(md).not.toContain("Site footer")
  })
})
