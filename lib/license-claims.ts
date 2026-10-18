import { SITE_LOAN_OFFICER, SITE_RE_LICENSE_NUMBER } from "./site"

/**
 * License-claim patterns for the post-build scan (scripts/check-license-claims.ts).
 *
 * While LICENSING_LIVE (lib/site.ts) is off, no exported page may present Pranay as a licensed
 * real estate agent or loan officer, or print an NMLS number. General prose ("ask a loan officer")
 * is fine: each rule needs an ID, a schema title, the title tied to the name, or a first-person
 * claim. In October 2026 a /links sentence and a loan-page line shipped such claims unchecked.
 */
export type LicenseClaim = { rule: string; excerpt: string }

const TITLE = String.raw`(?:real estate agent|loan officer|realtor|loan originator)`

/** His own license numbers: never in any export, in any form, while licensing is off. */
const LITERAL_IDS = [SITE_LOAN_OFFICER.nmlsId, SITE_RE_LICENSE_NUMBER].filter((id) => id.trim() !== "")

const RULES: { rule: string; pattern: RegExp; scan: "raw" | "text" }[] = [
  ...LITERAL_IDS.map((id) => ({
    rule: "nmls-id-literal",
    pattern: new RegExp(String.raw`(?<![\d])${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\d])`),
    scan: "raw" as const,
  })),
  { rule: "nmls-number", pattern: /NMLS\s*(?:ID|No\.?|Number)?\s*[#:]?\s*\d{3,}/i, scan: "text" },
  {
    rule: "schema-job-title",
    pattern: new RegExp(String.raw`"(?:jobTitle|hasOccupation)"\s*:\s*(?:"[^"]*|\[[^\]]*|\{[^}]*)${TITLE}`, "i"),
    scan: "raw",
  },
  {
    rule: "title-next-to-name",
    pattern: new RegExp(String.raw`Pranay(?: Reddy)?(?: Aleti)?[^.!?]{0,60}\b${TITLE}\b`, "i"),
    scan: "text",
  },
  { rule: "name-after-title", pattern: new RegExp(String.raw`\b${TITLE}\b[^.!?]{0,20}\bPranay`, "i"), scan: "text" },
  {
    rule: "first-person-title",
    pattern: new RegExp(
      String.raw`\b(?:As|I'm|I am|I work as)\s+(?:a|an|your)\s+(?:licensed\s+)?(?:Utah[- ]licensed\s+|Utah\s+)?(?:licensed\s+)?${TITLE}\b`,
      "i",
    ),
    scan: "text",
  },
]

/**
 * First-person phrases a visitor picks about themselves, not claims about Pranay. Removed before the
 * rules run. Source: the contact form's "How can we help you?" radios (lib/contact-audiences.ts).
 */
const VISITOR_PHRASES = [/I am an? real estate agent\s*,\s*interested in referrals/gi]

const ENTITIES: Record<string, string> = { quot: '"', amp: "&", apos: "'", nbsp: " ", lt: "<", gt: ">" }

/** Decode HTML entities (named, decimal, hex) and fold curly quotes so "I’m" matches "I'm". */
function normalize(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&(quot|amp|apos|nbsp|lt|gt);/g, (_, name: string) => ENTITIES[name] ?? "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
}

/**
 * Visible text of an exported page: scripts and styles dropped, tags removed, entities decoded.
 * alt, content, title and aria-label values are appended, since a claim can sit in an attribute.
 */
export function htmlToScanText(html: string): string {
  const attributes = Array.from(html.matchAll(/\s(?:alt|content|title|aria-label)="([^"]*)"/gi), (m) => m[1])
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
  return normalize(`${body} . ${attributes.join(" . ")}`)
}

export function findLicenseClaims(content: string, kind: "html" | "text"): LicenseClaim[] {
  const text = VISITOR_PHRASES.reduce(
    (current, phrase) => current.replace(phrase, " "),
    kind === "html" ? htmlToScanText(content) : normalize(content),
  )
  const claims: LicenseClaim[] = []
  for (const { rule, pattern, scan } of RULES) {
    const match = pattern.exec(scan === "raw" ? content : text)
    if (match) claims.push({ rule, excerpt: match[0].slice(0, 140) })
  }
  return claims
}
