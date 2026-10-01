import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { isValidBlogSlug } from "@/lib/blog-slugs"
import { PM_INSPECTION_ANSWER, PM_REPAIR_APPROVAL_ANSWER, PURCHASE_CLOSING_RANGE } from "@/lib/service-faq"
import { PURCHASE_TIMELINE } from "@/lib/content/lending-facts"

vi.mock("next/navigation", () => ({ usePathname: () => "/faq/" }))

import FaqHub from "./page"
import GeneralFaqs from "./general-faqs/page"
import TenantFaqs from "./tenant-faqs/page"
import OwnerFaqs from "./owner-faqs/page"
import LoansFaqs from "./loans-faqs/page"
import EscrowFaqs from "./escrow-faqs/page"
import NotaryFaqs from "./notary-faqs/page"
import BuyingSellingFaqs from "./buying-selling-faqs/page"

const faqDir = join(process.cwd(), "app/faq")
const subpages = readdirSync(faqDir).filter((d) => existsSync(join(faqDir, d, "page.tsx")))

function faqPageBlocks(container: HTMLElement) {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]'))
    .map((el) => JSON.parse(el.textContent ?? "null"))
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .flatMap((v) => (v && Array.isArray(v["@graph"]) ? v["@graph"] : [v]))
    .filter((v) => v && v["@type"] === "FAQPage")
}

describe("FAQ subpages structured data", () => {
  it("has 11 FAQ subpages and none adds a second FAQPage block through next/script", () => {
    expect(subpages.length).toBe(11)
    for (const dir of subpages) {
      const src = readFileSync(join(faqDir, dir, "page.tsx"), "utf8")
      expect(src, dir).not.toMatch(/from "next\/script"/)
      expect(src, dir).not.toMatch(/application\/ld\+json/)
      expect(src, dir).toMatch(/generateFAQJsonLd\(/)
    }
  })

  it.each([
    ["general", GeneralFaqs],
    ["owner", OwnerFaqs],
    ["loans", LoansFaqs],
    ["notary", NotaryFaqs],
  ])("%s FAQ page emits exactly one FAQPage block", (_name, Page) => {
    const { container } = render(<Page />)
    expect(faqPageBlocks(container)).toHaveLength(1)
  })

  it("the /faq hub does not mark up Q&As that are not on the page", () => {
    const { container } = render(<FaqHub />)
    expect(faqPageBlocks(container)).toHaveLength(0)
  })
})

describe("FAQ answers are in the rendered HTML while collapsed", () => {
  it("general FAQ includes the answer text and keeps panels closed", () => {
    const { container } = render(<GeneralFaqs />)
    expect(container.textContent).toContain("We manage single-family homes")
    expect(container.querySelectorAll('[role="region"][data-state="open"]')).toHaveLength(0)
    expect(container.querySelectorAll('[role="region"][data-state="closed"]').length).toBeGreaterThan(0)
  })

  it("loans FAQ includes answers that were previously unmounted", () => {
    const { container } = render(<LoansFaqs />)
    expect(container.textContent).toContain("Residual income is cash left")
  })
})

describe("FAQ copy has no dead-end pointers or authoring notes", () => {
  it.each([
    ["loans", LoansFaqs],
    ["escrow", EscrowFaqs],
    ["notary", NotaryFaqs],
  ])("%s FAQ", (_name, Page) => {
    const { container } = render(<Page />)
    // NOTARY_PRICING_SUMMARY (lib/notary-fees.ts) is shared copy owned elsewhere.
    const text = (container.textContent ?? "").replace(/See the posted schedule on \/notary#fees/g, "")
    expect(text).not.toMatch(/\bSee (the |first |how |what |why |closing |cosign |earnest |compensating |USDA |biweekly |recast |manufactured |delayed |authorized |interest-only |escrow |hazard |impounds |\/)/)
    expect(text).not.toMatch(/This FAQ (does|will) not/)
    expect(text).not.toMatch(/We will not claim a dollar savings/)
    expect(text).not.toMatch(/Link the cushion/)
    expect(text).not.toMatch(/Learn more at \/notary/)
    expect(text).not.toMatch(/ \/notary(\/on-demand)?[ .]/)
  })

  it("every guide link on loans and escrow FAQs points at a registered blog post or a real route", () => {
    for (const Page of [LoansFaqs, EscrowFaqs, NotaryFaqs]) {
      const { container, unmount } = render(<Page />)
      const related = Array.from(container.querySelectorAll("p")).filter((p) => p.textContent?.startsWith("Related:"))
      expect(related.length).toBeGreaterThan(0)
      for (const a of related.flatMap((p) => Array.from(p.querySelectorAll("a")))) {
        const href = a.getAttribute("href") ?? ""
        const blog = href.match(/^\/blog\/([^/]+)\/$/)
        if (blog) expect(isValidBlogSlug(blog[1]), href).toBe(true)
        else expect(existsSync(join(process.cwd(), "app", href.replace(/^\/|\/$/g, ""), "page.tsx")), href).toBe(true)
      }
      unmount()
    }
  })

  it("keeps the plain answer text in the FAQPage JSON-LD without the link markup", () => {
    const { container } = render(<LoansFaqs />)
    const [block] = faqPageBlocks(container)
    const answers = block.mainEntity.map((q: { acceptedAnswer: { text: string } }) => q.acceptedAnswer.text).join(" ")
    expect(answers).not.toMatch(/Related:/)
    expect(answers).not.toMatch(/\bSee the\b/)
  })
})

describe("FAQ answers agree with the single service sources", () => {
  it("owner FAQ uses the service FAQ inspection and repair-approval wording", () => {
    const { container } = render(<OwnerFaqs />)
    const text = container.textContent ?? ""
    expect(text).toContain(PM_INSPECTION_ANSWER)
    expect(text).toContain(PM_REPAIR_APPROVAL_ANSWER)
    expect(text).not.toMatch(/without owner approval/)
    expect(text).not.toMatch(/drive-by inspections monthly/)
  })

  it("tenant deposit answer matches the Utah deduction rule instead of 'fully refundable'", () => {
    const { container } = render(<TenantFaqs />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/fully refundable/)
    expect(text).toMatch(/unpaid rent, cleaning costs, damage beyond normal wear and tear/)
  })

  it("general FAQ service area includes the whole Wasatch Front, not only Salt Lake City", () => {
    const { container } = render(<GeneralFaqs />)
    const text = container.textContent ?? ""
    expect(text).toContain("Wasatch Front")
    expect(text).not.toMatch(/Holladay, Midvale, Magna/)
  })

  it("one closing range appears on the loans, buying, and escrow FAQs and matches the lending facts", () => {
    expect(PURCHASE_TIMELINE.overall).toContain(PURCHASE_CLOSING_RANGE)
    for (const Page of [LoansFaqs, BuyingSellingFaqs, EscrowFaqs]) {
      const { container, unmount } = render(<Page />)
      expect(container.textContent).toContain(PURCHASE_CLOSING_RANGE)
      expect(container.textContent).not.toMatch(/30[–-]45 days/)
      unmount()
    }
  })

  it("notary FAQ is worded for RON only", () => {
    const { container } = render(<NotaryFaqs />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/notary appointment/i)
    expect(text).toMatch(/Remote Online Notary \(RON\)/)
  })
})
