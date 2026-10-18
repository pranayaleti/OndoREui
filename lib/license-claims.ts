/**
 * License-claim patterns for the post-build scan (scripts/check-license-claims.ts).
 *
 * While LICENSING_LIVE (lib/site.ts) is off, no exported page may present Pranay as a licensed
 * real estate agent or loan officer, or print an NMLS number. General prose ("ask a loan officer")
 * is fine: each rule needs an ID, a schema jobTitle, the title tied to the name, or a first-person
 * claim. In October 2026 a /links sentence and a loan-page line shipped such claims unchecked.
 */
export type LicenseClaim = { rule: string; excerpt: string }

const TITLE = String.raw`(?:real estate agent|loan officer|realtor|loan originator)`

const RULES: { rule: string; pattern: RegExp; scan: "raw" | "text" }[] = [
  { rule: "nmls-number", pattern: /NMLS\s*(?:ID\s*)?#?\s*:?\s*\d{5,}/i, scan: "text" },
  {
    rule: "schema-job-title",
    pattern: new RegExp(String.raw`"jobTitle"\s*:\s*(?:"[^"]*|\[[^\]]*)${TITLE}`, "i"),
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
      String.raw`\b(?:I'm an?|I am an?|As an? (?:licensed )?Utah)\s+(?:licensed\s+)?(?:Utah\s+)?${TITLE}\b`,
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

const ENTITIES: Record<string, string> = {
  "&#x27;": "'",
  "&#39;": "'",
  "&apos;": "'",
  "&quot;": '"',
  "&amp;": "&",
  "&nbsp;": " ",
}

/** Visible text of an exported page: scripts and styles dropped, tags removed, common entities decoded. */
export function htmlToScanText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;|&apos;|&quot;|&amp;|&nbsp;/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
}

export function findLicenseClaims(content: string, kind: "html" | "text"): LicenseClaim[] {
  const text = VISITOR_PHRASES.reduce(
    (current, phrase) => current.replace(phrase, " "),
    kind === "html" ? htmlToScanText(content) : content.replace(/\s+/g, " "),
  )
  const claims: LicenseClaim[] = []
  for (const { rule, pattern, scan } of RULES) {
    const match = pattern.exec(scan === "raw" ? content : text)
    if (match) claims.push({ rule, excerpt: match[0].slice(0, 140) })
  }
  return claims
}
