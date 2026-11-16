import {
  LICENSING,
  SITE_LOAN_OFFICER,
  SITE_NOTARY_COMMISSION_NUMBER,
  SITE_RE_LICENSE_NUMBER,
  type LicensingState,
} from "./site"

/**
 * License-claim patterns for the post-build scan (scripts/check-license-claims.ts).
 *
 * Each rule belongs to one license line (re, mlo, notary) and runs only while that line's switch
 * in lib/site.ts is off, so the real estate license can go live without unlocking loan officer
 * claims, and the other way round. Before the matching switch is on, no exported page may present
 * Pranay as a licensed real estate agent, a loan officer or a commissioned notary, or print an
 * NMLS, license or commission number. General prose ("ask a loan officer", "a commissioned notary
 * completes the act") is fine: each rule needs an ID, a schema title, the title tied to the name,
 * or a first-person claim. In October 2026 a /links sentence and a loan-page line shipped such
 * claims unchecked.
 */
export type LicenseLine = keyof LicensingState
export type LicenseClaim = { rule: string; line: LicenseLine; excerpt: string }

const RE_TITLE = String.raw`(?:real estate agent|realtor)`
const MLO_TITLE = String.raw`(?:loan officer|loan originator)`
const NOTARY_TITLE = String.raw`(?:notary public|notary|signing agent)`

type Rule = { rule: string; line: LicenseLine; pattern: RegExp; scan: "raw" | "text" }

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

/** His own license numbers: never in any export, in any form, while that license is off. */
function literalIdRule(rule: string, line: LicenseLine, id: string): Rule[] {
  if (id.trim() === "") return []
  return [{ rule, line, pattern: new RegExp(String.raw`(?<![\d])${escapeRegExp(id)}(?![\d])`), scan: "raw" }]
}

/** Title claims whose shape the real estate and loan officer lines share. */
function titleRules(line: LicenseLine, title: string): Rule[] {
  return [
    {
      rule: "schema-job-title",
      line,
      pattern: new RegExp(String.raw`"(?:jobTitle|hasOccupation)"\s*:\s*(?:"[^"]*|\[[^\]]*|\{[^}]*)${title}`, "i"),
      scan: "raw",
    },
    {
      rule: "title-next-to-name",
      line,
      pattern: new RegExp(String.raw`Pranay(?: Reddy)?(?: Aleti)?[^.!?]{0,60}\b${title}\b`, "i"),
      scan: "text",
    },
    { rule: "name-after-title", line, pattern: new RegExp(String.raw`\b${title}\b[^.!?]{0,20}\bPranay`, "i"), scan: "text" },
    {
      rule: "first-person-title",
      line,
      pattern: new RegExp(
        String.raw`\b(?:As|I'm|I am|I work as)\s+(?:a|an|your)\s+(?:licensed\s+)?(?:Utah[- ]licensed\s+|Utah\s+)?(?:licensed\s+)?${title}\b`,
        "i",
      ),
      scan: "text",
    },
  ]
}

const NOTARY_QUALIFIERS = String.raw`(?:commissioned\s+|Utah\s+|licensed\s+|remote\s+|online\s+){0,3}`

/**
 * Notary rules are tighter than the agent and loan officer ones because "notary" is the subject
 * of 368 notary pages: "the same as a notary near me" and a "Reviewed by Pranay" byline followed
 * by a notary headline are not claims. A claim must sit right beside the name or open a
 * first-person sentence.
 */
const NOTARY_RULES: Rule[] = [
  {
    rule: "notary-schema-title",
    line: "notary",
    pattern: new RegExp(String.raw`"(?:jobTitle|hasOccupation)"\s*:\s*(?:"[^"]*|\[[^\]]*|\{[^}]*)${NOTARY_TITLE}`, "i"),
    scan: "raw",
  },
  {
    rule: "notary-title-next-to-name",
    line: "notary",
    pattern: new RegExp(
      String.raw`Pranay(?: Reddy)?(?: Aleti)?,?\s+(?:is\s+)?(?:a|an|the|our|your)?\s*${NOTARY_QUALIFIERS}${NOTARY_TITLE}\b`,
      "i",
    ),
    scan: "text",
  },
  {
    rule: "notary-name-after-title",
    line: "notary",
    pattern: new RegExp(String.raw`\b${NOTARY_TITLE}\b[\s,:-]{0,8}Pranay`, "i"),
    scan: "text",
  },
  {
    rule: "notary-first-person",
    line: "notary",
    pattern: new RegExp(
      String.raw`(?:\b(?:I'm|I am|I work as)\s+(?:a|an|your)\s+|(?:^|[.!?]\s+)As\s+(?:a|an|your)\s+)${NOTARY_QUALIFIERS}${NOTARY_TITLE}\b`,
      "i",
    ),
    scan: "text",
  },
]

const RULES: Rule[] = [
  ...literalIdRule("nmls-id-literal", "mlo", SITE_LOAN_OFFICER.nmlsId),
  ...literalIdRule("re-license-literal", "re", SITE_RE_LICENSE_NUMBER),
  ...literalIdRule("notary-commission-literal", "notary", SITE_NOTARY_COMMISSION_NUMBER),
  { rule: "nmls-number", line: "mlo", pattern: /NMLS\s*(?:ID|No\.?|Number)?\s*[#:]?\s*\d{3,}/i, scan: "text" },
  ...titleRules("re", RE_TITLE),
  ...titleRules("mlo", MLO_TITLE),
  ...NOTARY_RULES,
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

/** Claims for every license line whose switch is off in `state`; a live line's rules are skipped. */
export function findLicenseClaims(
  content: string,
  kind: "html" | "text",
  state: LicensingState = LICENSING,
): LicenseClaim[] {
  const text = VISITOR_PHRASES.reduce(
    (current, phrase) => current.replace(phrase, " "),
    kind === "html" ? htmlToScanText(content) : normalize(content),
  )
  const claims: LicenseClaim[] = []
  for (const { rule, line, pattern, scan } of RULES) {
    if (state[line]) continue
    const match = pattern.exec(scan === "raw" ? content : text)
    if (match) claims.push({ rule, line, excerpt: match[0].slice(0, 140) })
  }
  return claims
}
