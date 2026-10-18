# Entity and Licensing Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Pranay Reddy Aleti one entity (one profile page, one JSON-LD `Person` id) that every blog post, buy/sell/loan page, and AI brief points at, with all license titles behind the existing `LICENSING_LIVE` switch and a post-build scan that fails the build on any early license claim.

**Architecture:** One founder record in `lib/team-data.ts` plus licensing placeholders in `lib/site.ts`. `lib/seo.ts` builds the full `Person` node (profile page only) and a reference (everywhere else). The shared `<SEO>` component gains `reviewedBy`/`lastReviewed`, which land on the `WebPage` node it already emits. Visible output comes from three components: `FounderProfile`, `ReviewedBy`, and `YourContactCard`. `lib/license-claims.ts` holds the claim patterns; a `tsx` post-build script runs them over `out/`.

**Tech Stack:** Next.js 15 App Router (static export), React 19, TypeScript, Tailwind, Vitest + Testing Library (jsdom), Playwright + axe for the a11y suite.

**Spec:** `docs/superpowers/specs/2026-10-18-entity-and-licensing-switch-design.md`

## Global Constraints

- Work only in a worktree on branch `feat/founder-entity` created from `hotfix/loan-officer-line` (that is `origin/main` plus this plan and the revised spec; the push ships both docs). Never commit in `/Users/pranay/Documents/RE/OndoREui` itself: other sessions stage files there and a plain `git commit` sweeps them in. Ship with `git push origin feat/founder-entity:main`.
- `LICENSING_LIVE` stays `false`. Never invent a license number, brokerage name, lender name, or lender NMLS ID; the new constants ship as `""`.
- Blog credit is "Reviewed by Pranay Reddy Aleti", never "Written by" (owner decision 2026-10-18).
- New copy follows `/Users/pranay/Documents/RE/brand-voice.md`: short sentences, no em dash used as a pause, never "straightforward", "genuinely", "honestly", "delve", "dive into". Refer to Pranay by name or in first person; no third-person pronouns in new copy.
- Internal hrefs end with `/`. Page titles at most 60 characters, descriptions at most 160 (`lib/page-titles.test.ts` and `check:seo` enforce).
- Do not touch `components/city-service-page.tsx` or `components/city-sub-service-page.tsx` (another session's staged rewrite).
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Unit test command: `npx vitest run <paths>`. Lint: `npx eslint --max-warnings=0 <paths>`. Types: `npx tsc --noEmit`.

## Review Focus

1. A blog post whose `published` or `modified` is not a plain `YYYY-MM-DD` would render "Invalid Date" in the new byline. Expect a real date on every post. Pinned in Task 5's blog-wide test.
2. The contact card at 390px phone width must not create horizontal scroll or clip its buttons. Pinned in Task 10's Playwright check on `/loans/fha/` and `/sell/`.
3. The claim scan must stay silent on today's real build: general prose ("ask a loan officer"), glossary entries, `/licensing/`, and the `/links` "licenses finalize" sentence are not claims. Pinned in Task 8 by fixtures and by running the scan over a full build.
4. The profile page must be discoverable: listed in `sitemap.xml`, exported as `/about/team/pranay-reddy-aleti.md`, not `noindex`, linked from `/about/team/` and the HTML sitemap. Pinned in Task 3 (index entry, team link) and Task 10 (export checks).
5. When the switch is on, `/loans/second-look/` and `/refinance/watch/` must show the NMLS line once, not twice (card plus the old standalone line). Pinned in Task 6.

---

### Task 1: Licensing placeholders and the founder record

**Files:**
- Modify: `lib/site.ts` (after `export const SITE_COMPANY_NMLS_ID = "" as string`, about line 94)
- Modify: `lib/site.test.ts` (import list at top; `describe("NMLS identification gate")`, about lines 92-112)
- Modify: `lib/team-data.ts` (whole file, 32 lines)
- Create: `lib/team-data.test.ts`

**Interfaces:**
- Produces: `SITE_RE_LICENSE_NUMBER: string`, `SITE_BROKERAGE_NAME: string`, `SITE_LENDER_NAME: string`, `missingLicensingFields(fields?): string[]` (lib/site.ts). `FOUNDER_SLUG = "pranay-reddy-aleti"`, `FOUNDER_PROFILE_PATH = "/about/team/pranay-reddy-aleti/"`, `getFounder(): TeamMember`, `founderRoleLabel(live?: boolean): string`, extended `TeamMember` with optional `image`, `knowsAbout`, `areaServed`, `sameAs`, `licenses` (lib/team-data.ts).

- [ ] **Step 1: Create the worktree**

```bash
cd /Users/pranay/Documents/RE/OndoREui
git fetch -q origin
S=/private/tmp/claude-501/-Users-pranay-Documents-RE-brand/01286922-453c-4f04-9c72-9944aae22392/scratchpad
git worktree add -b feat/founder-entity $S/founder-entity hotfix/loan-officer-line
ln -s /Users/pranay/Documents/RE/OndoREui/node_modules $S/founder-entity/node_modules
cd $S/founder-entity && git log --oneline -1
```

Expected: the log shows the docs commit that adds this plan, directly on top of `6e900c721`. If `origin/main` has moved past `6e900c721`, run `git rebase origin/main` in the new worktree first. Run every later step from `$S/founder-entity`.

- [ ] **Step 2: Write the failing tests**

In `lib/site.test.ts`, add `SITE_RE_LICENSE_NUMBER, SITE_BROKERAGE_NAME, SITE_LENDER_NAME, missingLicensingFields,` to the `from "./site"` import list. Replace the existing `it("never ships live with a missing company ID or an 'on file' disclosure", ...)` block with:

```ts
  it("lists every licensing placeholder still empty, by constant name", () => {
    expect(missingLicensingFields()).toEqual([
      "SITE_COMPANY_NMLS_ID",
      "SITE_RE_LICENSE_NUMBER",
      "SITE_BROKERAGE_NAME",
      "SITE_LENDER_NAME",
    ])
    expect(
      missingLicensingFields({
        SITE_COMPANY_NMLS_ID: "123456",
        SITE_RE_LICENSE_NUMBER: "RE-1",
        SITE_BROKERAGE_NAME: "B",
        SITE_LENDER_NAME: " ",
      }),
    ).toEqual(["SITE_LENDER_NAME"])
  })

  it("never ships live with an empty placeholder or an 'on file' disclosure", () => {
    if (!LICENSING_LIVE) return
    expect(missingLicensingFields()).toEqual([])
    expect(SITE_COMPANY_NMLS_ID).toMatch(/^\d+$/)
    expect(ARRIVAL_LENDING_DISCLOSURE).not.toMatch(/on file/i)
    expect(LLMS_DISCLOSURES_BLOCK).not.toMatch(/on file/i)
  })
```

Create `lib/team-data.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { FOUNDER_PROFILE_PATH, FOUNDER_SLUG, founderRoleLabel, getFounder } from "./team-data"

describe("founder record", () => {
  it("is the listed team member with a profile path under /about/team/", () => {
    const founder = getFounder()
    expect(founder.slug).toBe(FOUNDER_SLUG)
    expect(founder.name).toBe("Pranay Reddy Aleti")
    expect(FOUNDER_PROFILE_PATH).toBe("/about/team/pranay-reddy-aleti/")
    expect(founder.image).toBe("/founder-image.webp")
    expect(founder.areaServed).toEqual(["Salt Lake County", "Utah County", "Davis County", "Weber County"])
    expect(founder.sameAs).toEqual([])
  })

  it("carries the NMLS ID and empty sponsor placeholders until licensing", () => {
    expect(getFounder().licenses).toEqual({
      realEstate: { number: "", brokerageName: "" },
      mortgage: { nmlsId: "2699085", lenderName: "", lenderNmlsId: "" },
    })
  })

  it("adds the license titles to the role line only when live", () => {
    expect(founderRoleLabel(false)).toBe("Founder, Ondo Real Estate")
    expect(founderRoleLabel(false)).not.toMatch(/agent|loan officer/i)
    expect(founderRoleLabel(true)).toBe("Founder · Utah real estate agent and loan officer")
  })
})
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run lib/site.test.ts lib/team-data.test.ts`
Expected: FAIL. `missingLicensingFields` is not exported, and `getFounder` / `FOUNDER_SLUG` do not exist.

- [ ] **Step 4: Add the placeholders to `lib/site.ts`**

Insert directly after `export const SITE_COMPANY_NMLS_ID = "" as string`:

```ts
/**
 * Licensing placeholders, supplied by the owner on licensing day and never invented.
 * Turning LICENSING_LIVE on with any of these empty fails lib/site.test.ts.
 */
/** Utah real estate sales agent license number (Division of Real Estate). */
export const SITE_RE_LICENSE_NUMBER = "" as string
/** Brokerage the real estate license is affiliated with. */
export const SITE_BROKERAGE_NAME = "" as string
/** Mortgage company sponsoring the NMLS license; its NMLS ID is SITE_COMPANY_NMLS_ID. */
export const SITE_LENDER_NAME = "" as string

/** Names of licensing placeholders that are still blank. Must be empty before LICENSING_LIVE goes on. */
export function missingLicensingFields(
  fields: Record<string, string> = {
    SITE_COMPANY_NMLS_ID,
    SITE_RE_LICENSE_NUMBER,
    SITE_BROKERAGE_NAME,
    SITE_LENDER_NAME,
  },
): string[] {
  return Object.entries(fields)
    .filter(([, value]) => value.trim() === "")
    .map(([name]) => name)
}
```

- [ ] **Step 5: Rewrite `lib/team-data.ts`**

```ts
import {
  LICENSING_LIVE,
  SITE_BROKERAGE_NAME,
  SITE_COMPANY_NMLS_ID,
  SITE_LENDER_NAME,
  SITE_LOAN_OFFICER,
  SITE_RE_LICENSE_NUMBER,
} from "./site"

/**
 * Public team roster. Only real people who have agreed to be listed belong here.
 * Do not add titles, license numbers, years of experience, photos or personal
 * mailboxes that are not verified (contact goes through /contact/). License fields are
 * placeholders until licensing and render only when LICENSING_LIVE (lib/site.ts) is on.
 */
export type TeamMemberLicenses = {
  realEstate: { number: string; brokerageName: string }
  mortgage: { nmlsId: string; lenderName: string; lenderNmlsId: string }
}

export type TeamMember = {
  name: string
  slug: string
  title: string
  bio: string
  /** The fields below feed the founder's profile page and Person JSON-LD (lib/seo.ts). */
  image?: string
  knowsAbout?: readonly string[]
  /** Counties served, as schema.org AdministrativeArea names. */
  areaServed?: readonly string[]
  /** The person's own claimed profiles (not the company's). Empty until supplied. */
  sameAs?: readonly string[]
  licenses?: TeamMemberLicenses
}

export const FOUNDER_SLUG = "pranay-reddy-aleti"
/** The founder's profile page: the one place the full Person node lives. */
export const FOUNDER_PROFILE_PATH = `/about/team/${FOUNDER_SLUG}/`

export const teamMembers: TeamMember[] = [
  {
    name: "Pranay Reddy Aleti",
    slug: FOUNDER_SLUG,
    title: "Founder",
    bio: "Pranay founded Ondo Real Estate and built the platform behind the owner and tenant portals. He started in software and moved into real estate, and he still works with clients directly.",
    image: "/founder-image.webp",
    knowsAbout: [
      "Property management",
      "Utah real estate",
      "Real estate investing",
      "Home financing",
      "Full stack software development",
    ],
    areaServed: ["Salt Lake County", "Utah County", "Davis County", "Weber County"],
    sameAs: [],
    licenses: {
      realEstate: { number: SITE_RE_LICENSE_NUMBER, brokerageName: SITE_BROKERAGE_NAME },
      mortgage: {
        nmlsId: SITE_LOAN_OFFICER.nmlsId,
        lenderName: SITE_LENDER_NAME,
        lenderNmlsId: SITE_COMPANY_NMLS_ID,
      },
    },
  },
]

export function getTeam(): TeamMember[] {
  return teamMembers
}

export function findTeamMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug)
}

export function getFounder(): TeamMember {
  const founder = findTeamMemberBySlug(FOUNDER_SLUG)
  if (!founder) throw new Error(`team-data: founder "${FOUNDER_SLUG}" is missing from teamMembers`)
  return founder
}

/** Role line under the founder's name. License titles appear only once licensing is live. */
export function founderRoleLabel(live: boolean = LICENSING_LIVE): string {
  return live ? "Founder · Utah real estate agent and loan officer" : "Founder, Ondo Real Estate"
}
```

The `bio` string is the existing text, unchanged.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run lib/site.test.ts lib/team-data.test.ts lib/seo.test.ts`
Expected: PASS. `lib/seo.test.ts` is included because `lib/seo.ts` imports `teamMembers`.

- [ ] **Step 7: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 lib/site.ts lib/site.test.ts lib/team-data.ts lib/team-data.test.ts
git add lib/site.ts lib/site.test.ts lib/team-data.ts lib/team-data.test.ts
git commit -m "Add licensing placeholders and a founder record with a profile path

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: One Person id in JSON-LD, and reviewedBy on the WebPage node

**Files:**
- Modify: `lib/seo.ts` (imports lines 2-20; after `NOTARY_SERVICE_ID` about line 47; `generateRealEstateBusinessJsonLd` `founder:` about line 353; `generateWebPageJsonLd` about line 610; `generateBlogPostingJsonLd` author about line 663)
- Modify: `components/seo.tsx` (props type lines 14-26, destructuring lines 28-40, `generateWebPageJsonLd` call about line 80)
- Modify: `lib/seo.test.ts` (blog author test about line 362; new tests)
- Modify: `components/seo.test.tsx` (new test in `describe("SEO structured data")`)
- Create: `lib/founder-person-live.test.ts`

**Interfaces:**
- Consumes: `FOUNDER_SLUG`, `FOUNDER_PROFILE_PATH`, `getFounder()` (Task 1); `LICENSING_LIVE`, `NMLS_CONSUMER_ACCESS_URL` (lib/site.ts).
- Produces: `FOUNDER_PERSON_ID: string` (`https://www.ondorealestate.com/about/team/pranay-reddy-aleti/#person`), `founderPersonRef(): { "@type": "Person"; "@id": string; name: string }`, `founderPersonJsonLd(live?: boolean): Record<string, unknown>` (lib/seo.ts). `generateWebPageJsonLd({ name, url, description?, reviewedBy?: string, lastReviewed?: string })`. `<SEO reviewedBy?: string lastReviewed?: string />`.

- [ ] **Step 1: Write the failing tests**

In `lib/seo.test.ts`, add `FOUNDER_PERSON_ID, founderPersonRef, founderPersonJsonLd,` to the `from "./seo"` import list. Replace the test `it("types a listed team member as a Person with a page, and the company as an Organization", ...)` with:

```ts
    it("credits the founder by the shared Person id, and the company as an Organization", () => {
      const person = generateBlogPostingJsonLd({ ...base, authorName: "Pranay Reddy Aleti" })
      expect(person?.author).toEqual({
        "@type": "Person",
        "@id": FOUNDER_PERSON_ID,
        name: "Pranay Reddy Aleti",
      })
      expect(generateBlogPostingJsonLd({ ...base, authorName: "Ondo RE Team" })?.author).toMatchObject({
        "@type": "Organization",
      })
    })
```

Add a new `describe` block at the end of the top-level `describe("seo", ...)`:

```ts
  describe("founder entity", () => {
    it("has one id on the profile page", () => {
      expect(FOUNDER_PERSON_ID).toBe(`${SITE_URL.replace(/\/$/, "")}/about/team/pranay-reddy-aleti/#person`)
      expect(founderPersonRef()).toEqual({ "@type": "Person", "@id": FOUNDER_PERSON_ID, name: "Pranay Reddy Aleti" })
    })

    it("makes the Organization founder a reference to that id", () => {
      expect(generateRealEstateBusinessJsonLd().founder).toEqual(founderPersonRef())
    })

    it("builds the full Person with no license title or credential while licensing is off", () => {
      const person = founderPersonJsonLd(false)
      expect(person).toMatchObject({
        "@type": "Person",
        "@id": FOUNDER_PERSON_ID,
        name: "Pranay Reddy Aleti",
        url: `${SITE_URL.replace(/\/$/, "")}/about/team/pranay-reddy-aleti/`,
        image: `${SITE_URL.replace(/\/$/, "")}/founder-image.webp`,
        jobTitle: "Founder",
        worksFor: { "@id": SITE_ORGANIZATION_ID },
      })
      expect(person.areaServed).toEqual([
        { "@type": "AdministrativeArea", name: "Salt Lake County" },
        { "@type": "AdministrativeArea", name: "Utah County" },
        { "@type": "AdministrativeArea", name: "Davis County" },
        { "@type": "AdministrativeArea", name: "Weber County" },
      ])
      expect(person).not.toHaveProperty("hasCredential")
      expect(person).not.toHaveProperty("affiliation")
      expect(person).not.toHaveProperty("sameAs")
    })
  })

  describe("generateWebPageJsonLd reviewer", () => {
    it("adds reviewedBy as an id reference and lastReviewed only when given", () => {
      const reviewed = generateWebPageJsonLd({
        name: "FHA",
        url: "/loans/fha/",
        reviewedBy: FOUNDER_PERSON_ID,
        lastReviewed: "2026-10-18",
      })
      expect(reviewed).toMatchObject({ reviewedBy: { "@id": FOUNDER_PERSON_ID }, lastReviewed: "2026-10-18" })
      const plain = generateWebPageJsonLd({ name: "FHA", url: "/loans/fha/" })
      expect(plain).not.toHaveProperty("reviewedBy")
      expect(plain).not.toHaveProperty("lastReviewed")
    })
  })
```

Create `lib/founder-person-live.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest"

vi.mock("./site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./site")>()),
  SITE_RE_LICENSE_NUMBER: "RE-1234567",
  SITE_BROKERAGE_NAME: "Test Realty",
  SITE_LENDER_NAME: "Test Lending",
  SITE_COMPANY_NMLS_ID: "123456",
}))

import { founderPersonJsonLd } from "./seo"

describe("founderPersonJsonLd once licensing is live", () => {
  it("adds the license titles, both credentials and both sponsors", () => {
    const person = founderPersonJsonLd(true)
    expect(person.jobTitle).toEqual(["Founder", "Real Estate Agent", "Loan Officer"])
    expect(person.hasCredential).toEqual([
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Utah real estate sales agent license",
        identifier: "RE-1234567",
        recognizedBy: { "@type": "GovernmentOrganization", name: "Utah Division of Real Estate" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "Mortgage loan originator license",
        identifier: "NMLS 2699085",
        recognizedBy: {
          "@type": "Organization",
          name: "Nationwide Multistate Licensing System (NMLS)",
          url: "https://www.nmlsconsumeraccess.org/",
        },
      },
    ])
    expect(person.affiliation).toEqual([
      { "@type": "Organization", name: "Test Realty" },
      { "@type": "Organization", name: "Test Lending", identifier: "NMLS 123456" },
    ])
  })
})
```

In `components/seo.test.tsx`, inside `describe("SEO structured data", ...)`, add:

```tsx
  it("puts reviewedBy and lastReviewed on the WebPage node", () => {
    const id = "https://www.ondorealestate.com/about/team/pranay-reddy-aleti/#person"
    const { container } = render(
      <SEO title="FHA" description="d" pathname="/loans/fha/" reviewedBy={id} lastReviewed="2026-10-18" />,
    )
    const payload = JSON.parse(container.querySelector('script[type="application/ld+json"]')?.innerHTML ?? "[]")
    const nodes = Array.isArray(payload) ? payload : [payload]
    const webPage = nodes.find((node: { "@type"?: string }) => node["@type"] === "WebPage")
    expect(webPage.reviewedBy).toEqual({ "@id": id })
    expect(webPage.lastReviewed).toBe("2026-10-18")
  })
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run lib/seo.test.ts lib/founder-person-live.test.ts components/seo.test.tsx`
Expected: FAIL. `FOUNDER_PERSON_ID`, `founderPersonRef`, and `founderPersonJsonLd` are not exported, and SEO ignores `reviewedBy`.

- [ ] **Step 3: Implement in `lib/seo.ts`**

Add `LICENSING_LIVE, NMLS_CONSUMER_ACCESS_URL,` to the `from "./site"` import list. Replace `import { teamMembers } from "./team-data"` with:

```ts
import { FOUNDER_PROFILE_PATH, FOUNDER_SLUG, getFounder, teamMembers } from "./team-data"
```

Directly after the `NOTARY_SERVICE_ID` export, add:

```ts
/** Every JSON-LD reference to the founder points at this id; the full node lives on the profile page. */
export const FOUNDER_PERSON_ID = `${baseSiteUrl}${FOUNDER_PROFILE_PATH}#person`

/** Founder reference for use inside other nodes (Organization.founder, Article.author, BlogPosting.author). */
export function founderPersonRef() {
  return { '@type': 'Person', '@id': FOUNDER_PERSON_ID, name: getFounder().name }
}

/**
 * The full founder Person node. Only the profile page embeds it; every other page uses
 * founderPersonRef(). License titles, credentials and sponsors appear only when `live`.
 */
export function founderPersonJsonLd(live: boolean = LICENSING_LIVE): Record<string, unknown> {
  const founder = getFounder()
  const licenses = founder.licenses
  const image = toAbsoluteUrl(founder.image)
  return {
    '@type': 'Person',
    '@id': FOUNDER_PERSON_ID,
    name: founder.name,
    url: pageUrl(FOUNDER_PROFILE_PATH),
    ...(image ? { image } : {}),
    description: founder.bio,
    jobTitle: live ? ['Founder', 'Real Estate Agent', 'Loan Officer'] : 'Founder',
    worksFor: { '@id': SITE_ORGANIZATION_ID },
    ...(founder.knowsAbout?.length ? { knowsAbout: [...founder.knowsAbout] } : {}),
    ...(founder.areaServed?.length
      ? { areaServed: founder.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })) }
      : {}),
    ...(founder.sameAs?.length ? { sameAs: [...founder.sameAs] } : {}),
    ...(live && licenses
      ? {
          hasCredential: [
            {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'license',
              name: 'Utah real estate sales agent license',
              identifier: licenses.realEstate.number,
              recognizedBy: { '@type': 'GovernmentOrganization', name: 'Utah Division of Real Estate' },
            },
            {
              '@type': 'EducationalOccupationalCredential',
              credentialCategory: 'license',
              name: 'Mortgage loan originator license',
              identifier: `NMLS ${licenses.mortgage.nmlsId}`,
              recognizedBy: {
                '@type': 'Organization',
                name: 'Nationwide Multistate Licensing System (NMLS)',
                url: NMLS_CONSUMER_ACCESS_URL,
              },
            },
          ],
          affiliation: [
            { '@type': 'Organization', name: licenses.realEstate.brokerageName },
            {
              '@type': 'Organization',
              name: licenses.mortgage.lenderName,
              identifier: `NMLS ${licenses.mortgage.lenderNmlsId}`,
            },
          ],
        }
      : {}),
  }
}
```

`baseSiteUrl`, `toAbsoluteUrl`, and `pageUrl` are declared above this point (lines 22-37), and `SITE_ORGANIZATION_ID` sits just above it.

In `generateRealEstateBusinessJsonLd`, replace:

```ts
    founder: {
      '@type': 'Person',
      name: 'Pranay Reddy Aleti',
    },
```

with:

```ts
    founder: founderPersonRef(),
```

Replace `generateWebPageJsonLd` with:

```ts
export function generateWebPageJsonLd(params: {
  name: string
  url: string
  description?: string
  /** `@id` of the person who reviewed the page (FOUNDER_PERSON_ID). */
  reviewedBy?: string
  /** YYYY-MM-DD of the last review. */
  lastReviewed?: string
}) {
  const { name, url, description, reviewedBy, lastReviewed } = params
  const absoluteUrl = pageUrl(url)
  if (!name || !absoluteUrl) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url: absoluteUrl,
    description,
    ...(reviewedBy ? { reviewedBy: { '@id': reviewedBy } } : {}),
    ...(lastReviewed ? { lastReviewed } : {}),
  }
}
```

In `generateBlogPostingJsonLd`, add `const authorMember = teamMembers.find((member) => member.name === authorName)` directly above `return {`, and replace the `author:` property and its comment with:

```ts
    // Blog authors are the company unless the byline names a listed team member (lib/team-data.ts).
    // The founder is referenced by the shared Person id so every page points at the same entity.
    author: authorMember
      ? authorMember.slug === FOUNDER_SLUG
        ? founderPersonRef()
        : { '@type': 'Person', name: authorMember.name, url: pageUrl('/about/team/') }
      : {
          '@type': 'Organization',
          name: authorName || SITE_NAME,
        },
```

- [ ] **Step 4: Implement in `components/seo.tsx`**

Add to `SEOProps` after `tags?: string[]`:

```ts
  /** `@id` of the person who reviewed this page (FOUNDER_PERSON_ID); lands on the WebPage node. */
  reviewedBy?: string
  /** YYYY-MM-DD of the reviewer's last check. */
  lastReviewed?: string
```

Add `reviewedBy,` and `lastReviewed,` to the destructured parameters after `tags = []`. Replace the `webPageJsonLd` assignment with:

```ts
  const webPageJsonLd = !hasWebPageJsonLd
    ? generateWebPageJsonLd({
        name: title,
        url,
        description,
        reviewedBy,
        lastReviewed,
      })
    : null
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run lib/seo.test.ts lib/founder-person-live.test.ts components/seo.test.tsx lib/site.test.ts lib/team-data.test.ts`
Expected: PASS.

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 lib/seo.ts lib/seo.test.ts lib/founder-person-live.test.ts components/seo.tsx components/seo.test.tsx
git add lib/seo.ts lib/seo.test.ts lib/founder-person-live.test.ts components/seo.tsx components/seo.test.tsx
git commit -m "Point every founder reference at one Person id and let pages name a reviewer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: The founder profile page

**Files:**
- Create: `components/people/founder-profile.tsx`
- Create: `app/about/team/pranay-reddy-aleti/page.tsx`
- Create: `app/about/team/pranay-reddy-aleti/page.test.tsx`
- Modify: `app/about/team/page.tsx` (the `<CardTitle className="text-xl">{member.name}</CardTitle>` line)
- Modify: `lib/site-index.ts` (the `{ name: "Team", href: "/about/team", ... }` entry about line 587, and the `"about"` section `hrefs` list about line 793)
- Modify: `tests/a11y.spec.ts` (the `routes` array)

**Interfaces:**
- Consumes: `founderPersonJsonLd`, `generateBreadcrumbJsonLd`, `FOUNDER_PERSON_ID` (Task 2); `getFounder`, `founderRoleLabel`, `FOUNDER_PROFILE_PATH`, `FOUNDER_SLUG` (Task 1); `SITE_RE_LICENSE_NUMBER`, `SITE_BROKERAGE_NAME`, `SITE_LENDER_NAME`, `SITE_COMPANY_NMLS_ID`, `SITE_LOAN_OFFICER`, `NMLS_CONSUMER_ACCESS_URL`, `SITE_CALENDLY_URL`, `SITE_ADDRESS_CITY`, `SITE_URL`, `LICENSING_LIVE`, `pageTitle` (lib/site.ts).
- Produces: route `/about/team/pranay-reddy-aleti/`. `FounderProfile({ live }: { live: boolean })`, `founderProfileTitle(live: boolean): string`, `FOUNDER_PROFILE_DESCRIPTION: string` (components/people/founder-profile.tsx).

- [ ] **Step 1: Write the failing test**

Create `app/about/team/pranay-reddy-aleti/page.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_RE_LICENSE_NUMBER: "RE-1234567",
  SITE_BROKERAGE_NAME: "Test Realty",
  SITE_LENDER_NAME: "Test Lending",
  SITE_COMPANY_NMLS_ID: "123456",
}))

import FounderProfilePage, { metadata } from "./page"
import { FounderProfile } from "@/components/people/founder-profile"
import { FOUNDER_PERSON_ID } from "@/lib/seo"

const jsonLdBlocks = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((node) => {
    const parsed = JSON.parse(node.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })

const hasType = (block: { "@type"?: string | string[] }, type: string) =>
  Array.isArray(block["@type"]) ? block["@type"].includes(type) : block["@type"] === type

describe("/about/team/pranay-reddy-aleti/", () => {
  it("has one main landmark labelled by the founder's name", () => {
    render(<FounderProfilePage />)
    const mains = screen.getAllByRole("main")
    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAccessibleName("Pranay Reddy Aleti")
  })

  it("publishes a self-canonical, a name-first title and a snippet-length description", () => {
    const title = typeof metadata.title === "object" && metadata.title && "absolute" in metadata.title ? metadata.title.absolute : ""
    expect(title).toBe("Pranay Reddy Aleti: Founder of Ondo Real Estate")
    expect(title.length).toBeLessThanOrEqual(60)
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(metadata.alternates?.canonical).toBe("https://www.ondorealestate.com/about/team/pranay-reddy-aleti/")
    expect(metadata.robots).toBeUndefined()
  })

  it("embeds the one full Person node as the ProfilePage's main entity, with no license title", () => {
    const { container } = render(<FounderProfilePage />)
    const blocks = jsonLdBlocks(container)
    const webPages = blocks.filter((block) => hasType(block, "WebPage"))
    expect(webPages).toHaveLength(1)
    expect(hasType(webPages[0], "ProfilePage")).toBe(true)
    expect(webPages[0].mainEntity["@id"]).toBe(FOUNDER_PERSON_ID)
    expect(webPages[0].mainEntity.jobTitle).toBe("Founder")
    expect(webPages[0].mainEntity).not.toHaveProperty("hasCredential")
  })

  it("says licensing is in progress and shows no license number while the switch is off", () => {
    render(<FounderProfilePage />)
    expect(screen.getByText(/licensing is in progress/i)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NMLS #\d|license #/i)
    expect(screen.getByRole("link", { name: /licensing & disclosures/i })).toHaveAttribute("href", "/licensing/")
  })

  it("lists license numbers, sponsors and NMLS Consumer Access once live", () => {
    render(<FounderProfile live />)
    expect(screen.getByText(/license #RE-1234567, with Test Realty/)).toBeInTheDocument()
    expect(screen.getByText(/NMLS #2699085, with Test Lending \(NMLS #123456\)/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /verify at nmls consumer access/i })).toHaveAttribute(
      "href",
      "https://www.nmlsconsumeraccess.org/",
    )
  })

  it("links to the founder's letter, the services and booking", () => {
    render(<FounderProfilePage />)
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"))
    for (const expected of ["/founders-letter/", "/property-management/", "/buy/", "/sell/", "/loans/", "/contact/"]) {
      expect(hrefs).toContain(expected)
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run app/about/team/pranay-reddy-aleti/page.test.tsx`
Expected: FAIL with `Failed to resolve import "./page"`.

- [ ] **Step 3: Create `components/people/founder-profile.tsx`**

```tsx
import Image from "next/image"
import Link from "next/link"
import SEO from "@/components/seo"
import { Button } from "@/components/ui/button"
import { founderPersonJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"
import {
  NMLS_CONSUMER_ACCESS_URL,
  SITE_ADDRESS_CITY,
  SITE_BROKERAGE_NAME,
  SITE_CALENDLY_URL,
  SITE_COMPANY_NMLS_ID,
  SITE_LENDER_NAME,
  SITE_LOAN_OFFICER,
  SITE_RE_LICENSE_NUMBER,
  SITE_URL,
} from "@/lib/site"
import { FOUNDED_MONTH_LABEL, FOUNDED_YEAR } from "@/lib/social-proof-stats"
import { FOUNDER_PROFILE_PATH, founderRoleLabel, getFounder } from "@/lib/team-data"
import { toAbsoluteSiteUrl } from "@/lib/url"

/** Bump when the profile's wording changes; surfaces as dateModified on the ProfilePage. */
const modified = "2026-10-18"

export const FOUNDER_PROFILE_DESCRIPTION =
  "Pranay Reddy Aleti founded Ondo Real Estate in Lehi, Utah, in July 2022: a software engineer turned Utah landlord building simpler property management."

/** Name first so the page ranks for searches on the name; license titles join once licensing is live. */
export function founderProfileTitle(live: boolean): string {
  return live
    ? "Pranay Reddy Aleti: Utah Real Estate Agent & Loan Officer"
    : "Pranay Reddy Aleti: Founder of Ondo Real Estate"
}

const SERVICES = [
  { href: "/property-management/", label: "Property management", detail: "Full-service management with owner and tenant portals." },
  { href: "/buy/", label: "Buying a home", detail: "Search, offers and closing on the Wasatch Front." },
  { href: "/sell/", label: "Selling a home", detail: "Pricing, prep and listing." },
  { href: "/loans/", label: "Home loans", detail: "Conventional, FHA, VA and USDA, explained." },
]

const heading = "text-2xl font-bold text-foreground"
const body = "mt-4 text-lg leading-relaxed text-foreground/80"
const inlineLink = "font-semibold text-primary underline underline-offset-4 hover:text-primary/80"

export function FounderProfile({ live }: { live: boolean }) {
  const founder = getFounder()
  const canonical = toAbsoluteSiteUrl(FOUNDER_PROFILE_PATH)
  const title = founderProfileTitle(live)
  const image = founder.image ?? "/founder-image.webp"

  // ProfilePage is a WebPage subtype; the array type keeps <SEO> from adding a second WebPage block.
  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "ProfilePage"],
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description: FOUNDER_PROFILE_DESCRIPTION,
    dateModified: modified,
    inLanguage: "en-US",
    mainEntity: founderPersonJsonLd(live),
  }

  return (
    <main className="min-h-screen bg-background dark:bg-transparent" aria-labelledby="founder-profile-heading">
      <SEO
        title={title}
        description={FOUNDER_PROFILE_DESCRIPTION}
        pathname={FOUNDER_PROFILE_PATH}
        image={toAbsoluteSiteUrl(image)}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "About", url: `${SITE_URL}/about/` },
            { name: "Team", url: `${SITE_URL}/about/team/` },
            { name: founder.name, url: canonical },
          ]),
          profilePageJsonLd,
        ]}
      />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-primary">
            <Image
              src={image}
              alt={`${founder.name}, founder of Ondo Real Estate, professional headshot`}
              fill
              priority
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 id="founder-profile-heading" className="text-4xl font-bold text-foreground md:text-5xl">
              {founder.name}
            </h1>
            <p className="mt-2 text-lg text-primary">{founderRoleLabel(live)}</p>
            <p className="mt-1 text-foreground/70">{SITE_ADDRESS_CITY}, Utah</p>
          </div>
        </div>

        <section aria-labelledby="profile-about-heading" className="mt-12">
          <h2 id="profile-about-heading" className={heading}>
            About
          </h2>
          <p className={body}>
            I spent over a decade as a full stack software engineer before I bought my first home in Utah in 2019.
            That house led to rental property of my own, and the rentals led to Ondo. I started OndoSoft, my software
            consultancy, in May 2022 and founded Ondo Real Estate in {FOUNDED_MONTH_LABEL} {FOUNDED_YEAR}.
          </p>
          <p className={body}>
            I still own and manage rental property myself, so I deal with the same repair calls, lease questions and
            year-end paperwork our owners do. The goal is simple. Owning rental property should not be a second job,
            and renting a home should feel fair and easy.
          </p>
          <p className="mt-4">
            <Link href="/founders-letter/" className={inlineLink}>
              Read the founder&apos;s letter
            </Link>
          </p>
        </section>

        <section aria-labelledby="profile-services-heading" className="mt-12">
          <h2 id="profile-services-heading" className={heading}>
            How I can help
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <li key={service.href} className="rounded-lg border border-border bg-card p-4">
                <Link href={service.href} className="font-semibold text-foreground hover:text-primary">
                  {service.label}
                </Link>
                <p className="mt-1 text-sm text-foreground/70">{service.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="profile-area-heading" className="mt-12">
          <h2 id="profile-area-heading" className={heading}>
            Where I work
          </h2>
          <p className={body}>{(founder.areaServed ?? []).join(", ")}, across Utah&apos;s Wasatch Front.</p>
        </section>

        <section
          aria-labelledby="profile-licensing-heading"
          className="mt-12 rounded-xl border border-border bg-card p-6"
        >
          <h2 id="profile-licensing-heading" className={heading}>
            Licensing
          </h2>
          {live ? (
            <ul className="mt-4 space-y-2 text-foreground/80">
              <li>
                Utah real estate sales agent, license #{SITE_RE_LICENSE_NUMBER}, with {SITE_BROKERAGE_NAME}.
              </li>
              <li>
                Loan officer, NMLS #{SITE_LOAN_OFFICER.nmlsId}, with {SITE_LENDER_NAME} (NMLS #{SITE_COMPANY_NMLS_ID}).{" "}
                <a href={NMLS_CONSUMER_ACCESS_URL} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                  Verify at NMLS Consumer Access
                </a>
              </li>
            </ul>
          ) : (
            <p className="mt-4 text-foreground/80">
              Real estate and mortgage licensing is in progress. License titles and numbers will be listed here once
              active.
            </p>
          )}
          <p className="mt-4 text-sm">
            <Link href="/licensing/" className={inlineLink}>
              Licensing &amp; disclosures
            </Link>
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href={SITE_CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a 30-minute call
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact/">Contact Ondo</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Create `app/about/team/pranay-reddy-aleti/page.tsx`**

```tsx
import type { Metadata } from "next"
import { FounderProfile, FOUNDER_PROFILE_DESCRIPTION, founderProfileTitle } from "@/components/people/founder-profile"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { LICENSING_LIVE, pageTitle } from "@/lib/site"
import { FOUNDER_PROFILE_PATH } from "@/lib/team-data"
import { toAbsoluteSiteUrl } from "@/lib/url"

const founderImage = {
  url: toAbsoluteSiteUrl("/founder-image.webp"),
  width: 1770,
  height: 1354,
  alt: "Pranay Reddy Aleti, founder of Ondo Real Estate",
}

export const metadata: Metadata = pageCanonicalMetadata(FOUNDER_PROFILE_PATH, {
  title: pageTitle(founderProfileTitle(LICENSING_LIVE)),
  description: FOUNDER_PROFILE_DESCRIPTION,
  openGraph: { type: "profile", images: [founderImage] },
  twitter: { images: [founderImage.url] },
})

export default function FounderProfilePage() {
  return <FounderProfile live={LICENSING_LIVE} />
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run app/about/team/pranay-reddy-aleti/page.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 6: Link the profile from the team page, the site index and the a11y suite**

In `app/about/team/page.tsx`, add `import { FOUNDER_SLUG } from "@/lib/team-data"` (or add `FOUNDER_SLUG` to the existing `@/lib/team-data` import) and replace `<CardTitle className="text-xl">{member.name}</CardTitle>` with:

```tsx
                  <CardTitle className="text-xl">
                    {member.slug === FOUNDER_SLUG ? (
                      <Link href={`/about/team/${member.slug}/`} className="hover:text-primary hover:underline underline-offset-4">
                        {member.name}
                      </Link>
                    ) : (
                      member.name
                    )}
                  </CardTitle>
```

In `lib/site-index.ts`, directly after the entry `{ name: "Team", href: "/about/team", description: "The founder of Ondo Real Estate." },`, add:

```ts
        { name: "Pranay Reddy Aleti", href: "/about/team/pranay-reddy-aleti", description: "Founder profile: background, service area and licensing status." },
```

In the same file, in the `"about"` section's `hrefs` array, add `"/about/team/pranay-reddy-aleti"` right after `"/about/team"`.

In `tests/a11y.spec.ts`, add `"/about/team/pranay-reddy-aleti/",` to `routes` directly after `"/founders-letter",`.

- [ ] **Step 7: Run the related suites**

Run: `npx vitest run app/about lib/site-index.test.ts lib/page-titles.test.ts`
Expected: PASS. If `lib/site-index.test.ts` asserts a fixed link count, update that number by +1 and note it in the commit message.

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 components/people app/about lib/site-index.ts
git add components/people/founder-profile.tsx app/about/team/pranay-reddy-aleti app/about/team/page.tsx lib/site-index.ts tests/a11y.spec.ts
git commit -m "Add the founder profile page that holds the one full Person node

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: The founder's letter becomes an Article by that Person

**Files:**
- Modify: `app/founders-letter/founders-letter-client.tsx` (imports lines 1-8; `RELATED_LINKS` about line 35; the `founderId` / `profilePageJsonLd` block about lines 88-115; the `jsonLd` array about line 130)
- Modify: `app/founders-letter/page.tsx` (`openGraph.type`)
- Modify: `app/founders-letter/page.test.tsx` (the ProfilePage test and the links test)

**Interfaces:**
- Consumes: `founderPersonRef`, `FOUNDER_PERSON_ID`, `SITE_ORGANIZATION_ID` (Task 2); `FOUNDER_PROFILE_PATH` (Task 1).

- [ ] **Step 1: Write the failing test**

In `app/founders-letter/page.test.tsx`, add `import { FOUNDER_PERSON_ID } from "@/lib/seo"`. Replace the test `it("marks the page up as a ProfilePage about the founder, without a duplicate WebPage block", ...)` with:

```tsx
  it("marks the letter up as an Article by the founder's one Person id", () => {
    const { container } = render(<FoundersLetterPage />)
    const blocks = jsonLdBlocks(container)
    expect(blocks.filter((block) => hasType(block, "ProfilePage"))).toHaveLength(0)
    expect(blocks.filter((block) => hasType(block, "WebPage"))).toHaveLength(1)
    const article = blocks.find((block) => hasType(block, "Article"))
    expect(article.author).toEqual({ "@type": "Person", "@id": FOUNDER_PERSON_ID, name: "Pranay Reddy Aleti" })
    expect(article.url).toBe("https://www.ondorealestate.com/founders-letter/")
    expect(JSON.stringify(blocks)).not.toContain('"jobTitle"')
    const breadcrumb = blocks.find((block) => hasType(block, "BreadcrumbList"))
    expect(breadcrumb.itemListElement.at(-1).item).toBe("https://www.ondorealestate.com/founders-letter/")
  })
```

In the test `it("links the letter to the pages it talks about with canonical trailing-slash hrefs", ...)`, add `"/about/team/pranay-reddy-aleti/"` to the `expected` array.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run app/founders-letter`
Expected: FAIL. A ProfilePage block is still present, and the profile link is missing.

- [ ] **Step 3: Implement**

In `founders-letter-client.tsx`, change the `@/lib/seo` import to:

```ts
import { SITE_ORGANIZATION_ID, founderPersonRef, generateBreadcrumbJsonLd } from "@/lib/seo"
```

and add `import { FOUNDER_PROFILE_PATH } from "@/lib/team-data"`.

In `RELATED_LINKS`, replace `{ href: "/about/team/", label: "Meet the team" },` with:

```ts
  { href: FOUNDER_PROFILE_PATH, label: "Pranay's full profile" },
```

Replace everything from `  const founderId = \`${canonical}#founder\`` through the closing `  }` of `profilePageJsonLd` (the line before `  const stats = [`) with:

```ts
  // The full Person lives on the profile page (FOUNDER_PROFILE_PATH); the letter is an Article by it.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: FOUNDERS_LETTER_TITLE,
    description: FOUNDERS_LETTER_DESCRIPTION,
    url: canonical,
    mainEntityOfPage: canonical,
    image: founderImage,
    datePublished: modified,
    dateModified: modified,
    inLanguage: "en-US",
    author: founderPersonRef(),
    publisher: { "@id": SITE_ORGANIZATION_ID },
  }
```

In the `<SEO jsonLd={[...]}>` array, replace `profilePageJsonLd,` with `articleJsonLd,`. Remove any now-unused imports that eslint reports.

In `app/founders-letter/page.tsx`, change `openGraph: { type: "profile", images: [founderOgImage] },` to `openGraph: { type: "article", images: [founderOgImage] },`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run app/founders-letter`
Expected: PASS (7 tests).

- [ ] **Step 5: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 app/founders-letter
git add app/founders-letter
git commit -m "Mark the founder's letter up as an Article by the founder's Person id

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: "Reviewed by" on every blog post

**Files:**
- Create: `components/content/reviewed-by.tsx`
- Create: `components/content/reviewed-by.test.tsx`
- Create: `app/blog/reviewed-by.test.tsx`
- Modify: `components/content/article-shell.tsx` (imports; `<SEO>` props; after `<ArticleByline ... />`)
- Modify (7 posts not on `ArticleShell`): `app/blog/{building-high-performance-real-estate-nextjs-supabase,engineering-real-estate-investment-calculators,mobile-notary-utah-county-guide,prepare-for-remote-online-notary-session,remote-online-notary-all-50-states,remote-online-notary-real-estate-closings,technical-seo-for-real-estate}/page.tsx`
- Modify: `app/blog/ultimate-guide-becoming-utah-landlord-2026/page.tsx` (line 10 `const author`, the two `author,` lines at about 29 and 44, the footer at about line 191)

**Interfaces:**
- Consumes: `FOUNDER_PERSON_ID` (Task 2); `<SEO reviewedBy lastReviewed>` (Task 2); `getFounder`, `FOUNDER_PROFILE_PATH` (Task 1); `formatArticleDate(iso: string): string` (components/content/article-byline.tsx).
- Produces: `ReviewedBy({ date, className }: { date: string; className?: string })`.

- [ ] **Step 1: Write the failing tests**

Create `components/content/reviewed-by.test.tsx`:

```tsx
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ReviewedBy } from "./reviewed-by"

describe("ReviewedBy", () => {
  it("credits the founder as reviewer with a profile link and the review date", () => {
    render(<ReviewedBy date="2026-03-04" />)
    expect(screen.getByRole("link", { name: "Pranay Reddy Aleti" })).toHaveAttribute("href", "/about/team/pranay-reddy-aleti/")
    expect(screen.getByText(/reviewed by/i)).toBeInTheDocument()
    expect(screen.getByText("March 4, 2026")).toHaveAttribute("dateTime", "2026-03-04")
    expect(document.body.textContent).not.toMatch(/written by/i)
  })
})
```

Create `app/blog/reviewed-by.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/content/reviewed-by.test.tsx app/blog/reviewed-by.test.tsx`
Expected: FAIL. `./reviewed-by` cannot be resolved, and every post is reported as missing the reviewer link.

- [ ] **Step 3: Create `components/content/reviewed-by.tsx`**

```tsx
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatArticleDate } from "@/components/content/article-byline"
import { FOUNDER_PROFILE_PATH, getFounder } from "@/lib/team-data"

type ReviewedByProps = {
  /** YYYY-MM-DD of the last review: the post's modified date, else its published date. */
  date: string
  className?: string
}

/** "Reviewed by Pranay Reddy Aleti, Founder · Last reviewed <date>". Owner's call: reviewed, never "written". */
export function ReviewedBy({ date, className }: ReviewedByProps) {
  const founder = getFounder()
  return (
    <p className={cn("not-prose text-sm text-foreground/70", className)}>
      Reviewed by{" "}
      <Link href={FOUNDER_PROFILE_PATH} className="font-medium text-foreground underline-offset-4 hover:underline">
        {founder.name}
      </Link>
      , Founder{" "}
      <span aria-hidden="true" className="text-foreground/30">
        ·
      </span>{" "}
      Last reviewed <time dateTime={date}>{formatArticleDate(date)}</time>
    </p>
  )
}
```

- [ ] **Step 4: Wire it into `ArticleShell`**

In `components/content/article-shell.tsx`:
- Add `import { ReviewedBy } from "@/components/content/reviewed-by"`.
- Change `import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"` to `import { FOUNDER_PERSON_ID, generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"`.
- Inside `ArticleShell`, after the `const fallback = ...` line, add `const lastReviewed = meta.modified || meta.published`.
- Add to the `<SEO ... />` props, after `tags={meta.keywords}`: `reviewedBy={FOUNDER_PERSON_ID}` and `lastReviewed={lastReviewed}`.
- Change `className="mb-6"` on `<ArticleByline ... />` to `className="mb-2"`, and insert directly after that element: `<ReviewedBy date={lastReviewed} className="mb-6" />`.

- [ ] **Step 5: Wire it into the 7 posts that skip `ArticleShell`**

Each of these files has `const published = ...`, `const modified = ...`, one `<SEO` element, and the anchor lines `<article className="bg-background py-12">` followed by `<div className="container mx-auto px-4 md:px-6 max-w-5xl">`. Run from the worktree root:

```bash
python3 -I - <<'EOF'
import re, pathlib
SLUGS = [
    "building-high-performance-real-estate-nextjs-supabase",
    "engineering-real-estate-investment-calculators",
    "mobile-notary-utah-county-guide",
    "prepare-for-remote-online-notary-session",
    "remote-online-notary-all-50-states",
    "remote-online-notary-real-estate-closings",
    "technical-seo-for-real-estate",
]
ANCHOR = re.compile(r'(\n([ \t]*)<article className="bg-background py-12">\n[ \t]*<div className="container mx-auto px-4 md:px-6 max-w-5xl">\n)')
for slug in SLUGS:
    p = pathlib.Path(f"app/blog/{slug}/page.tsx")
    s = p.read_text()
    assert s.count("<SEO") == 1, slug
    m = ANCHOR.search(s)
    assert m, f"{slug}: article anchor not found"
    indent = m.group(2) + "    "
    s = s[: m.end()] + f"{indent}<ReviewedBy date={{modified || published}} className=\"mb-6\" />\n" + s[m.end():]
    seo = re.search(r"\n([ \t]*)<SEO\b", s)
    pad = seo.group(1) + "  "
    s = s[: seo.end()] + f"\n{pad}reviewedBy={{FOUNDER_PERSON_ID}}\n{pad}lastReviewed={{modified || published}}" + s[seo.end():]
    s = 'import { ReviewedBy } from "@/components/content/reviewed-by"\nimport { FOUNDER_PERSON_ID } from "@/lib/seo"\n' + s
    p.write_text(s)
    print("ok", slug)
EOF
```

Expected: seven `ok` lines. If the script stops with `article anchor not found` for a post, open that file and add `<ReviewedBy date={modified || published} className="mb-6" />` as the first child of the element that wraps the post body (the element right after `<PageBanner ... />`), then rerun the script with that slug removed from `SLUGS`. If a file already imports from `"@/lib/seo"`, eslint's duplicate-import rule fails in Step 8. In that case, move `FOUNDER_PERSON_ID` into the existing `@/lib/seo` import of that file and delete the added line.

- [ ] **Step 6: Change the landlord guide from "Written by" to "Reviewed by"**

In `app/blog/ultimate-guide-becoming-utah-landlord-2026/page.tsx`:
- Delete line 10, `const author = "Pranay Reddy Aleti"`.
- Delete both shorthand `author,` lines (about lines 29 and 44). The post then falls back to the default editorial byline, and the shell's `ReviewedBy` credits Pranay.
- In the "About this guide" footer, replace `Written by Pranay Reddy Aleti, founder of Ondo Real Estate,` with `Reviewed by Pranay Reddy Aleti, founder of Ondo Real Estate,`. Leave the rest of that sentence unchanged.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run components/content app/blog`
Expected: PASS, including the existing `merged-and-thin-posts.test.tsx`.

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 components/content app/blog
git add components/content/reviewed-by.tsx components/content/reviewed-by.test.tsx components/content/article-shell.tsx app/blog
git commit -m "Credit the founder as reviewer on every blog post, visibly and in JSON-LD

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: "Your contact" card on 26 buy, sell, loan and refinance pages

**Files:**
- Create: `components/people/your-contact-card.tsx`
- Create: `components/people/your-contact-card.test.tsx`
- Create: `app/contact-card-pages.test.ts`
- Modify (agent role, 5): `app/buy/page.tsx`, `app/buy/first-time/page.tsx`, `app/buy/quiz/page.tsx`, `app/buy/second-home/page.tsx`, `app/sell/page.tsx`
- Modify (loan role, 21): `app/buy/{15-year,30-year,adjustable-rate,fixed-rate,rates}/page.tsx`, `app/buy/first-time/grants/page.tsx`, `app/loans/page.tsx`, `app/loans/{conventional,fha,heloc,jumbo,reverse,second-look,usda,va}/page.tsx`, `app/refinance/page.tsx`, `app/refinance/{blog,cash-out,process,rate-term,watch}/page.tsx`

**Interfaces:**
- Consumes: `getFounder`, `founderRoleLabel`, `FOUNDER_PROFILE_PATH` (Task 1); `FOUNDER_PERSON_ID`, `<SEO reviewedBy>` (Task 2); `LoanOfficerLine` (components/lending/loan-officer-line.tsx, renders nothing unless `live`); `analyticsAttributes(event, category, label)` (lib/analytics.ts).
- Produces: `YourContactCard({ role, live }: { role: "agent" | "loan"; live?: boolean })`.

- [ ] **Step 1: Write the failing tests**

Create `components/people/your-contact-card.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_BROKERAGE_NAME: "Test Realty",
  SITE_LENDER_NAME: "Test Lending",
  SITE_COMPANY_NMLS_ID: "123456",
}))

import { YourContactCard } from "./your-contact-card"

describe("YourContactCard", () => {
  it("names the founder with a profile link and no license title while licensing is off", () => {
    render(<YourContactCard role="loan" live={false} />)
    expect(screen.getByRole("heading", { name: "Your contact" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Pranay Reddy Aleti" })).toHaveAttribute("href", "/about/team/pranay-reddy-aleti/")
    expect(screen.getByText("Founder, Ondo Real Estate")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NMLS|loan officer|real estate agent|brokered by/i)
  })

  it("offers a call and a booking link", () => {
    render(<YourContactCard role="agent" live={false} />)
    expect(screen.getByRole("link", { name: /^call$/i }).getAttribute("href")).toMatch(/^tel:\+?\d{10,}$/)
    expect(screen.getByRole("link", { name: /book a call/i })).toHaveAttribute("target", "_blank")
  })

  it("shows the brokerage on agent pages once live", () => {
    render(<YourContactCard role="agent" live />)
    expect(screen.getByText("Brokered by Test Realty")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NMLS/)
  })

  it("shows the loan officer line once, with the lender, on loan pages once live", () => {
    render(<YourContactCard role="loan" live />)
    expect(screen.getAllByText(/NMLS #2699085/)).toHaveLength(1)
    expect(screen.getByText("with Test Lending")).toBeInTheDocument()
  })
})
```

Create `app/contact-card-pages.test.ts`:

```ts
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"

const AGENT = ["app/buy/page.tsx", "app/buy/first-time/page.tsx", "app/buy/quiz/page.tsx", "app/buy/second-home/page.tsx", "app/sell/page.tsx"]
const LOAN = [
  "app/buy/15-year/page.tsx", "app/buy/30-year/page.tsx", "app/buy/adjustable-rate/page.tsx", "app/buy/fixed-rate/page.tsx",
  "app/buy/rates/page.tsx", "app/buy/first-time/grants/page.tsx", "app/loans/page.tsx", "app/loans/conventional/page.tsx",
  "app/loans/fha/page.tsx", "app/loans/heloc/page.tsx", "app/loans/jumbo/page.tsx", "app/loans/reverse/page.tsx",
  "app/loans/second-look/page.tsx", "app/loans/usda/page.tsx", "app/loans/va/page.tsx", "app/refinance/page.tsx",
  "app/refinance/blog/page.tsx", "app/refinance/cash-out/page.tsx", "app/refinance/process/page.tsx",
  "app/refinance/rate-term/page.tsx", "app/refinance/watch/page.tsx",
]

describe("buy, sell, loan and refinance pages name one contact", () => {
  it.each([...AGENT.map((f) => [f, "agent"]), ...LOAN.map((f) => [f, "loan"])])(
    "%s renders the %s contact card inside <main> and marks the founder as reviewer",
    (file, role) => {
      const source = readFileSync(file, "utf8")
      expect(source).toContain(`<YourContactCard role="${role}" />`)
      expect(source.indexOf("<YourContactCard")).toBeLessThan(source.indexOf("</main>"))
      expect(source).toContain("reviewedBy={FOUNDER_PERSON_ID}")
      expect(source).not.toContain("<LoanOfficerLine")
    },
  )
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run components/people/your-contact-card.test.tsx app/contact-card-pages.test.ts`
Expected: FAIL. `./your-contact-card` cannot be resolved, and all 26 file checks fail.

- [ ] **Step 3: Create `components/people/your-contact-card.tsx`**

```tsx
import Image from "next/image"
import Link from "next/link"
import { Calendar, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoanOfficerLine } from "@/components/lending/loan-officer-line"
import { analyticsAttributes } from "@/lib/analytics"
import { LICENSING_LIVE, SITE_BROKERAGE_NAME, SITE_CALENDLY_URL, SITE_LENDER_NAME, SITE_PHONE_TEL } from "@/lib/site"
import { FOUNDER_PROFILE_PATH, founderRoleLabel, getFounder } from "@/lib/team-data"

export type ContactRole = "agent" | "loan"

type YourContactCardProps = {
  role: ContactRole
  live?: boolean
}

/**
 * "Your contact" on buy, sell, loan and refinance pages: the founder's photo, name and profile link,
 * so every page that matches agent or lender searches points at one person. License titles render
 * only once licensing is live (LICENSING_LIVE in lib/site.ts).
 */
export function YourContactCard({ role, live = LICENSING_LIVE }: YourContactCardProps) {
  const founder = getFounder()
  return (
    <section aria-labelledby="your-contact-heading" className="container mx-auto px-4 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary">
          <Image
            src={founder.image ?? "/founder-image.webp"}
            alt={`${founder.name}, founder of Ondo Real Estate`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="your-contact-heading" className="text-sm font-medium uppercase tracking-wide text-foreground/60">
            Your contact
          </h2>
          <p className="mt-1 text-xl font-semibold text-foreground">
            <Link href={FOUNDER_PROFILE_PATH} className="underline-offset-4 hover:text-primary hover:underline">
              {founder.name}
            </Link>
          </p>
          <p className="text-sm text-foreground/70">{founderRoleLabel(live)}</p>
          {live && role === "agent" ? (
            <p className="mt-1 text-sm text-foreground/70">Brokered by {SITE_BROKERAGE_NAME}</p>
          ) : null}
          {role === "loan" ? (
            <>
              <LoanOfficerLine live={live} className="mt-1 text-sm text-foreground/70" />
              {live ? <p className="text-sm text-foreground/70">with {SITE_LENDER_NAME}</p> : null}
            </>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:w-44">
          <Button asChild>
            <a href={`tel:${SITE_PHONE_TEL}`} {...analyticsAttributes("contact_click", "your_contact_card", "call")}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Call
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={SITE_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              {...analyticsAttributes("contact_click", "your_contact_card", "book")}
            >
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Book a call
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the card test to verify it passes**

Run: `npx vitest run components/people/your-contact-card.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Place the card on the 26 pages**

Run from the worktree root:

```bash
python3 -I - <<'EOF'
import re, pathlib
AGENT = ["app/buy/page.tsx", "app/buy/first-time/page.tsx", "app/buy/quiz/page.tsx", "app/buy/second-home/page.tsx", "app/sell/page.tsx"]
LOAN = [
    "app/buy/15-year/page.tsx", "app/buy/30-year/page.tsx", "app/buy/adjustable-rate/page.tsx", "app/buy/fixed-rate/page.tsx",
    "app/buy/rates/page.tsx", "app/buy/first-time/grants/page.tsx", "app/loans/page.tsx", "app/loans/conventional/page.tsx",
    "app/loans/fha/page.tsx", "app/loans/heloc/page.tsx", "app/loans/jumbo/page.tsx", "app/loans/reverse/page.tsx",
    "app/loans/second-look/page.tsx", "app/loans/usda/page.tsx", "app/loans/va/page.tsx", "app/refinance/page.tsx",
    "app/refinance/blog/page.tsx", "app/refinance/cash-out/page.tsx", "app/refinance/process/page.tsx",
    "app/refinance/rate-term/page.tsx", "app/refinance/watch/page.tsx",
]
for role, files in (("agent", AGENT), ("loan", LOAN)):
    for f in files:
        p = pathlib.Path(f)
        s = p.read_text()
        assert s.count("</main>") == 1 and s.count("<SEO") == 1, f
        # The card carries the loan officer line now; drop the standalone one so it never shows twice.
        s = re.sub(r"\n[ \t]*<LoanOfficerLine />", "", s)
        s = re.sub(r'import \{ LoanOfficerLine \} from "@/components/lending/loan-officer-line"\n', "", s)
        main = re.search(r"\n([ \t]*)</main>", s)
        s = s[: main.start()] + f'\n{main.group(1)}  <YourContactCard role="{role}" />' + s[main.start():]
        seo = re.search(r"\n([ \t]*)<SEO\b", s)
        s = s[: seo.end()] + f"\n{seo.group(1)}  reviewedBy={{FOUNDER_PERSON_ID}}" + s[seo.end():]
        imp = re.search(r'import \{([^}]*)\} from "@/lib/seo"', s)
        if imp:
            names = imp.group(1).rstrip().rstrip(",")
            s = s[: imp.start()] + "import {" + names + ', FOUNDER_PERSON_ID } from "@/lib/seo"' + s[imp.end():]
        else:
            s = 'import { FOUNDER_PERSON_ID } from "@/lib/seo"\n' + s
        s = 'import { YourContactCard } from "@/components/people/your-contact-card"\n' + s
        p.write_text(s)
        print("ok", role, f)
EOF
```

Expected: 26 `ok` lines.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run app/contact-card-pages.test.ts components/people app/buy app/sell app/loans app/refinance components/lending`
Expected: PASS. The hotfix tests in `app/loans/second-look/page.test.tsx` and `app/refinance/watch/page.test.tsx` still pass, because the card's loan line renders nothing while the switch is off.

- [ ] **Step 7: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 components/people app/buy app/sell app/loans app/refinance app/contact-card-pages.test.ts
git add components/people/your-contact-card.tsx components/people/your-contact-card.test.tsx app/contact-card-pages.test.ts app/buy app/sell app/loans app/refinance
git commit -m "Name one contact on every buy, sell, loan and refinance page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: "Who runs Ondo" in llms.txt, and a licensing-day-safe llms check

**Files:**
- Modify: `lib/site-index.ts` (imports lines 1-20; new exported function before `buildLlmsTxtBody` about line 849; one insertion in each builder)
- Modify: `lib/site-index.test.ts` (new `describe`)
- Modify: `scripts/check-llms-txt-export.mjs` (the disclosure condition, about line 37)

**Interfaces:**
- Consumes: `getFounder`, `FOUNDER_PROFILE_PATH` (Task 1); `LICENSING_LIVE`, `SITE_RE_LICENSE_NUMBER`, `SITE_BROKERAGE_NAME`, `SITE_LENDER_NAME`, `SITE_COMPANY_NMLS_ID`, `SITE_LOAN_OFFICER` (lib/site.ts); `FOUNDED_MONTH_LABEL`, `FOUNDED_YEAR` (lib/social-proof-stats.ts); `toAbsoluteSiteUrl` (already imported in site-index).
- Produces: `buildWhoRunsOndoLines(live?: boolean): string[]`.

- [ ] **Step 1: Write the failing test**

Add to `lib/site-index.test.ts` (add `buildWhoRunsOndoLines` to its `./site-index` import, and `import { toAbsoluteSiteUrl } from "./url"` if it is not already imported):

```ts
describe("Who runs Ondo", () => {
  it("names the founder, the founding dates and the profile in both briefs, with no license title while off", () => {
    for (const brief of [buildLlmsTxtBody(), buildLlmsFullTxtBody()]) {
      expect(brief).toContain("## Who runs Ondo")
      expect(brief).toContain("Pranay Reddy Aleti, founder")
      expect(brief).toContain("May 2022")
      expect(brief).toContain("July 2022")
      expect(brief).toContain(toAbsoluteSiteUrl("/about/team/pranay-reddy-aleti/"))
      expect(brief).not.toMatch(/NMLS 2699085|real estate agent \(license/i)
    }
  })

  it("adds the license titles and IDs once live", () => {
    const lines = buildWhoRunsOndoLines(true).join("\n")
    expect(lines).toMatch(/Utah real estate agent \(license /)
    expect(lines).toMatch(/loan officer \(NMLS 2699085/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/site-index.test.ts`
Expected: FAIL. `buildWhoRunsOndoLines` is not exported, and the briefs lack the section.

- [ ] **Step 3: Implement**

In `lib/site-index.ts`, add any of these names that are missing to the existing `from "@/lib/site"` import: `LICENSING_LIVE, SITE_BROKERAGE_NAME, SITE_COMPANY_NMLS_ID, SITE_LENDER_NAME, SITE_LOAN_OFFICER, SITE_RE_LICENSE_NUMBER`. Then add:

```ts
import { FOUNDED_MONTH_LABEL, FOUNDED_YEAR } from "@/lib/social-proof-stats"
import { FOUNDER_PROFILE_PATH, getFounder } from "@/lib/team-data"
```

Add above `buildLlmsTxtBody`:

```ts
/** "Who runs Ondo" for llms.txt and llms-full.txt. License titles and IDs only once licensing is live. */
export function buildWhoRunsOndoLines(live: boolean = LICENSING_LIVE): string[] {
  const founder = getFounder()
  const licensing = live
    ? `Utah real estate agent (license ${SITE_RE_LICENSE_NUMBER}, ${SITE_BROKERAGE_NAME}) and loan officer (NMLS ${SITE_LOAN_OFFICER.nmlsId}, ${SITE_LENDER_NAME}, company NMLS ${SITE_COMPANY_NMLS_ID}).`
    : "Real estate and mortgage licensing in progress; check the licensing page before relying on a licensed service."
  return [
    "## Who runs Ondo",
    `- ${founder.name}, founder. After a decade in full stack software engineering and owning Utah rental property since 2019, Pranay started OndoSoft (a software consultancy) in May 2022 and founded Ondo Real Estate in ${FOUNDED_MONTH_LABEL} ${FOUNDED_YEAR}.`,
    `- Point of contact for property management, buying, selling and home loans. ${licensing}`,
    `- Serves ${(founder.areaServed ?? []).join(", ")} on Utah's Wasatch Front.`,
    `- Profile: ${toAbsoluteSiteUrl(FOUNDER_PROFILE_PATH)}`,
    `- Licensing and disclosures: ${toAbsoluteSiteUrl("/licensing/")}`,
  ]
}
```

In `buildLlmsTxtBody`, replace the exact lines:

```ts
    `- Media: ${SITE_EMAILS.media}`,
    "",
    LLMS_DISCLOSURES_BLOCK,
```

with:

```ts
    `- Media: ${SITE_EMAILS.media}`,
    "",
    ...buildWhoRunsOndoLines(),
    "",
    LLMS_DISCLOSURES_BLOCK,
```

If that three-line block occurs more than once in the file, apply this only inside `buildLlmsTxtBody`.

In `buildLlmsFullTxtBody`, directly before the line `    "## Supported locales",` that is followed by `` `Default locale: en (`` (the second `## Supported locales` in the file), insert:

```ts
    ...buildWhoRunsOndoLines(),
    "",
```

In `scripts/check-llms-txt-export.mjs`, replace:

```js
  if (!text.includes("## Required disclosures") || !text.includes("NMLS ID on file")) {
```

with:

```js
  // "NMLS ID on file" until licensing; the real company ID once LICENSING_LIVE is on.
  if (!text.includes("## Required disclosures") || !/NMLS ID on file|Company NMLS ID \d+/.test(text)) {
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/site-index.test.ts lib/site.test.ts`
Expected: PASS.

- [ ] **Step 5: Typecheck, lint, commit**

```bash
npx tsc --noEmit && npx eslint --max-warnings=0 lib/site-index.ts lib/site-index.test.ts scripts/check-llms-txt-export.mjs
git add lib/site-index.ts lib/site-index.test.ts scripts/check-llms-txt-export.mjs
git commit -m "Tell AI assistants who runs Ondo, and keep the llms check passing on licensing day

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Post-build scan that fails on early license claims

**Files:**
- Create: `lib/license-claims.ts`
- Create: `lib/license-claims.test.ts`
- Create: `scripts/check-license-claims.ts`
- Modify: `package.json` (`scripts.postbuild`, plus a new `check:license-claims` script)

**Interfaces:**
- Consumes: `LICENSING_LIVE` (lib/site.ts).
- Produces: `findLicenseClaims(content: string, kind: "html" | "text"): LicenseClaim[]`, `htmlToScanText(html: string): string`, `type LicenseClaim = { rule: string; excerpt: string }`.

- [ ] **Step 1: Write the failing test**

Create `lib/license-claims.test.ts`:

```ts
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
    ]) {
      expect(rules(html), html).toEqual([])
    }
  })

  it("scans Markdown and plain text as-is", () => {
    expect(rules("- Loan officer: Pranay Reddy Aleti, NMLS #2699085", "text")).toContain("nmls-number")
    expect(rules("- Pranay Reddy Aleti, founder.", "text")).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/license-claims.test.ts`
Expected: FAIL with `Failed to resolve import "./license-claims"`.

- [ ] **Step 3: Create `lib/license-claims.ts`**

```ts
/**
 * License-claim patterns for the post-build scan (scripts/check-license-claims.ts).
 *
 * While LICENSING_LIVE (lib/site.ts) is off, no exported page may present Pranay as a licensed
 * real estate agent or loan officer, or print an NMLS number. General prose ("ask a loan officer")
 * is fine: each rule needs an ID, a schema jobTitle, the title tied to his name, or a first-person
 * claim. On Oct 12, 2026 a /links sentence and a loan-page line shipped such claims unchecked.
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
  { rule: "title-next-to-name", pattern: new RegExp(String.raw`Pranay(?: Reddy)?(?: Aleti)?[^.!?]{0,60}\b${TITLE}\b`, "i"), scan: "text" },
  { rule: "name-after-title", pattern: new RegExp(String.raw`\b${TITLE}\b[^.!?]{0,20}\bPranay`, "i"), scan: "text" },
  {
    rule: "first-person-title",
    pattern: new RegExp(String.raw`\b(?:I'm an?|I am an?|As an? (?:licensed )?Utah)\s+(?:licensed\s+)?(?:Utah\s+)?${TITLE}\b`, "i"),
    scan: "text",
  },
]

const ENTITIES: Record<string, string> = { "&#x27;": "'", "&#39;": "'", "&apos;": "'", "&quot;": '"', "&amp;": "&", "&nbsp;": " " }

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
  const text = kind === "html" ? htmlToScanText(content) : content.replace(/\s+/g, " ")
  const claims: LicenseClaim[] = []
  for (const { rule, pattern, scan } of RULES) {
    const match = pattern.exec(scan === "raw" ? content : text)
    if (match) claims.push({ rule, excerpt: match[0].slice(0, 140) })
  }
  return claims
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/license-claims.test.ts`
Expected: PASS (6 tests). If an "ignores" fixture fails, tighten the rule that fired. Do not delete the fixture.

- [ ] **Step 5: Create `scripts/check-license-claims.ts` and wire it into postbuild**

```ts
#!/usr/bin/env tsx
/**
 * Post-build guard: while LICENSING_LIVE is off, fail the build if any exported page presents
 * Pranay as a licensed real estate agent or loan officer, or prints an NMLS number.
 * Patterns and their tests: lib/license-claims.ts. Usage: npx tsx scripts/check-license-claims.ts [outDir]
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { findLicenseClaims } from "../lib/license-claims"
import { LICENSING_LIVE } from "../lib/site"

function* exportedFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== "_next") yield* exportedFiles(full)
    } else if (/\.(html|md|txt)$/.test(entry.name)) {
      yield full
    }
  }
}

/* eslint-disable no-console -- CLI output */
const outDir = resolve(process.argv[2] ?? "out")
if (LICENSING_LIVE) {
  console.log("check-license-claims: LICENSING_LIVE is on, licensed titles are allowed")
  process.exit(0)
}
if (!existsSync(outDir)) {
  console.error(`check-license-claims: ${outDir} not found, run the build first`)
  process.exit(1)
}
const problems: string[] = []
let scanned = 0
for (const file of exportedFiles(outDir)) {
  scanned += 1
  const kind = file.endsWith(".html") ? "html" : "text"
  for (const claim of findLicenseClaims(readFileSync(file, "utf8"), kind)) {
    problems.push(`${relative(outDir, file)} [${claim.rule}] ${claim.excerpt}`)
  }
}
if (problems.length > 0) {
  for (const problem of problems.slice(0, 50)) console.error(problem)
  if (problems.length > 50) console.error(`...and ${problems.length - 50} more`)
  console.error(`check-license-claims: ${problems.length} license claim(s) while LICENSING_LIVE is off`)
  process.exit(1)
}
console.log(`check-license-claims: ${scanned} files, no license claims`)
```

In `package.json`, add the script `"check:license-claims": "npx tsx scripts/check-license-claims.ts",` next to `"check:main-landmark"`, and append ` && npm run check:license-claims` to the end of `"postbuild"`.

- [ ] **Step 6: Run the scan against a real build**

```bash
NEXT_PUBLIC_DASHBOARD_URL=https://app.ondorealestate.com NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:3030 npm run build 2>&1 | tail -4
```

Expected: the last lines include `check-license-claims: <N> files, no license claims` with N above 2000, and the build exits 0. If it reports claims, read each excerpt:
- If it is a real claim, fix the page.
- If it is a false positive, add the excerpt as an "ignores" fixture in `lib/license-claims.test.ts`, tighten the rule, and rerun Step 4 and this step.

- [ ] **Step 7: Lint, commit**

```bash
npx eslint --max-warnings=0 lib/license-claims.ts lib/license-claims.test.ts scripts/check-license-claims.ts
git checkout -- public/index.md public/contact.md public/properties.md 2>/dev/null || true
git add lib/license-claims.ts lib/license-claims.test.ts scripts/check-license-claims.ts package.json
git commit -m "Fail the build on agent or loan officer claims while licensing is off

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

The `git checkout` line undoes the build's known rewrite of three tracked Markdown files.

---

### Task 9: One-person consistency test across pages

**Files:**
- Create: `lib/founder-entity.test.tsx`

**Interfaces:**
- Consumes: `FOUNDER_PERSON_ID`, `generateRealEstateBusinessJsonLd` (Task 2); the profile page (Task 3); the founder's letter (Task 4); `ArticleShell` and non-shell posts (Task 5); `/loans/fha/` (Task 6).

- [ ] **Step 1: Write the test**

```tsx
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { FOUNDER_PERSON_ID, generateRealEstateBusinessJsonLd } from "./seo"
import FounderProfilePage from "@/app/about/team/pranay-reddy-aleti/page"
import FoundersLetterPage from "@/app/founders-letter/page"
import LandlordGuide from "@/app/blog/ultimate-guide-becoming-utah-landlord-2026/page"
import NotaryGuide from "@/app/blog/mobile-notary-utah-county-guide/page"
import FhaPage from "@/app/loans/fha/page"

type Json = Record<string, unknown>

function jsonLd(element: ReactElement): Json[] {
  const { container, unmount } = render(element)
  const nodes = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((script) => {
    const parsed = JSON.parse(script.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })
  unmount()
  return nodes
}

function walk(node: unknown, visit: (node: Json) => void) {
  if (Array.isArray(node)) node.forEach((child) => walk(child, visit))
  else if (node && typeof node === "object") {
    visit(node as Json)
    Object.values(node as Json).forEach((child) => walk(child, visit))
  }
}

const PAGES: [string, () => Json[]][] = [
  ["Organization (layout)", () => [generateRealEstateBusinessJsonLd()]],
  ["/about/team/pranay-reddy-aleti/", () => jsonLd(<FounderProfilePage />)],
  ["/founders-letter/", () => jsonLd(<FoundersLetterPage />)],
  ["ArticleShell post", () => jsonLd(<LandlordGuide />)],
  ["non-ArticleShell post", () => jsonLd(<NotaryGuide />)],
  ["/loans/fha/", () => jsonLd(<FhaPage />)],
]

describe("the founder is one entity across the site", () => {
  it("gives every Person node named Pranay Reddy Aleti the one @id, with the full node only on the profile page", () => {
    const problems: string[] = []
    for (const [label, nodes] of PAGES) {
      walk(nodes(), (node) => {
        if (node["@type"] !== "Person" || node.name !== "Pranay Reddy Aleti") return
        if (node["@id"] !== FOUNDER_PERSON_ID) problems.push(`${label}: Person without the shared @id`)
        const full = "knowsAbout" in node || "jobTitle" in node
        if (full && label !== "/about/team/pranay-reddy-aleti/") problems.push(`${label}: full Person outside the profile page`)
      })
    }
    expect(problems).toEqual([])
  })

  it("points every reviewedBy on these pages at the founder's @id", () => {
    for (const [label, nodes] of PAGES.slice(3)) {
      const reviewers: unknown[] = []
      walk(nodes(), (node) => {
        if (node.reviewedBy) reviewers.push((node.reviewedBy as Json)["@id"])
      })
      expect(reviewers, label).toEqual([FOUNDER_PERSON_ID])
    }
  })
})
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run lib/founder-entity.test.tsx`
Expected: PASS. Tasks 2-6 already produce this behavior; this test locks it in across pages. If `FhaPage` cannot render in jsdom, swap in `app/loans/conventional/page` and say so in the commit message. If a page is an async component, render `await Page()` instead.

- [ ] **Step 3: Lint, commit**

```bash
npx eslint --max-warnings=0 lib/founder-entity.test.tsx
git add lib/founder-entity.test.tsx
git commit -m "Lock in one founder Person id across the profile, letter, blog and loan pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Run the CI chain, ship, and verify production

**Files:** none changed (except a fix commit if a gate fails).

- [ ] **Step 1: Full local gate, same order as `.github/workflows/ci.yml`**

```bash
npx tsc --noEmit && npm run lint -- --max-warnings=0 && npm run test:run
S=/private/tmp/claude-501/-Users-pranay-Documents-RE-brand/01286922-453c-4f04-9c72-9944aae22392/scratchpad
export NEXT_PUBLIC_DASHBOARD_URL=https://app.ondorealestate.com NEXT_PUBLIC_BACKEND_BASE_URL=http://127.0.0.1:3030
for step in "npm run build" "npm run check:links" "npm run check:seo" "node scripts/analyze-bundle.mjs --check" "npm run test:a11y" "npm run test:links" "npm run test:popups"; do
  echo "##### $step"; bash -c "$step" > "$S/ci-$(echo $step | tr ' :/' '___').log" 2>&1 || { echo "FAILED: $step"; tail -30 "$S/ci-$(echo $step | tr ' :/' '___').log"; break; }
done
git checkout -- public/index.md public/contact.md public/properties.md 2>/dev/null || true
```

Expected: no `FAILED` line. The build log contains `check-license-claims: ... no license claims`, and the a11y suite passes, including `/about/team/pranay-reddy-aleti/`.

- [ ] **Step 2: Check the export for the Review Focus items**

```bash
grep -c "about/team/pranay-reddy-aleti/" out/sitemap-0.xml
test -f out/about/team/pranay-reddy-aleti.md && echo md-ok
grep -c 'noindex' out/about/team/pranay-reddy-aleti/index.html
grep -c "## Who runs Ondo" out/llms.txt out/llms-full.txt
```

Expected: `1`, `md-ok`, `0`, and `1` for each llms file.

Then check phone width with this script, saved to the scratchpad as `card-width.mjs`:

```js
import { createRequire } from "node:module"
const { chromium } = createRequire(`${process.cwd()}/`)("playwright")
import { createServer } from "node:http"
import { readFileSync, existsSync, statSync } from "node:fs"
import { join } from "node:path"
const root = process.argv[2]
const server = createServer((req, res) => {
  let p = join(root, decodeURIComponent(req.url.split("?")[0]))
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html")
  if (!existsSync(p)) { res.statusCode = 404; return res.end() }
  res.end(readFileSync(p))
}).listen(4317)
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block" })
const page = await context.newPage()
for (const path of ["/loans/fha/", "/sell/", "/about/team/pranay-reddy-aleti/"]) {
  await page.goto(`http://localhost:4317${path}`)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  const card = await page.locator("#your-contact-heading").count()
  console.log(path, "hscroll", overflow, "card", card)
}
await browser.close(); server.close()
```

Run: `node <scratchpad>/card-width.mjs "$PWD/out"`. Run it from the worktree root: the script resolves `playwright` from the current directory's `node_modules`.
Expected: `hscroll false` on all three; `card 1` on `/loans/fha/` and `/sell/`, `card 0` on the profile page.

- [ ] **Step 3: Push and watch the deploy**

```bash
git log --oneline origin/main..HEAD
git push origin feat/founder-entity:main
```

Expected: the log lists only this plan's commits. Then poll `https://api.github.com/repos/pranayaleti/OndoREui/actions/runs?per_page=5` until the "OndoREui CI" and "Deploy static site to GitHub Pages" runs for the pushed SHA both finish. On a CI failure, read the annotations at `.../check-runs/<job id>/annotations`, fix, and push again.

- [ ] **Step 4: Verify production**

```bash
B=https://www.ondorealestate.com; cb="?cb=$(date +%s)"
curl -s "$B/about/team/pranay-reddy-aleti/$cb" | grep -o '<title>[^<]*</title>'
curl -s "$B/$cb" | grep -o '"founder":{[^}]*}'
curl -s "$B/loans/fha/$cb" | grep -c 'your-contact-heading'
curl -s "$B/blog/ultimate-guide-becoming-utah-landlord-2026/$cb" | grep -o '"reviewedBy":{[^}]*}'
curl -s "$B/llms.txt" | grep -A2 "## Who runs Ondo"
for p in links loans/second-look refinance/watch about/team/pranay-reddy-aleti; do printf "$p: "; curl -s "$B/$p/$cb" | sed 's/<[^>]*>//g' | grep -c "NMLS #[0-9]"; done
```

Expected:
- the profile title `Pranay Reddy Aleti: Founder of Ondo Real Estate`
- an Organization founder that includes `"@id":"https://www.ondorealestate.com/about/team/pranay-reddy-aleti/#person"`
- `1` card on the FHA page
- a `reviewedBy` with that same `@id`
- the llms section
- `0` NMLS numbers on all four pages

- [ ] **Step 5: Clean up and hand off**

```bash
cd /Users/pranay/Documents/RE/OndoREui
git worktree remove --force <scratchpad>/founder-entity
git worktree remove --force <scratchpad>/hotfix 2>/dev/null || true
git worktree prune
```

Tell the owner:
1. In Search Console, open URL Inspection for `https://www.ondorealestate.com/about/team/pranay-reddy-aleti/` and request indexing.
2. Optionally, run the profile URL through Google's Rich Results Test.
3. On licensing day, send the four values: license number, brokerage, lender, and lender NMLS ID.
