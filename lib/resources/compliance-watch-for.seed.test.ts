import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { COMPLIANCE_WATCH_FOR_RULES } from "./compliance-watch-for"

/**
 * compliance-watch-for.ts is the source of truth for the "watch for" copy; the
 * backend seeds the same text into compliance_rules. Nothing else keeps them in
 * step, so this diffs the two. The backend is a sibling repo: when it is not
 * checked out next to this one (CI), the test is skipped rather than failing.
 */
const SEED_PATH = join(
  __dirname,
  "../../../OndoREBackend/supabase/migrations/20260827181652_seed_utah_disclosure_rules.sql",
)

/**
 * The seed files the federal lead-paint rule under jurisdiction 'UT'; the
 * frontend says 'US' (federal, applies in every state). The seed uses
 * WHERE NOT EXISTS, so editing it would not change rows already inserted. The fix
 * is a new backend migration (tracked as a follow-up); until then this drift is
 * pinned so any other drift fails.
 */
const KNOWN_SEED_JURISDICTION: Record<string, string> = { "us-lead-paint": "UT" }

type SeedRule = { jurisdiction: string; title: string; description: string; watchFor: string[] }

/** The seed uses straight quotes; the frontend copy uses curly ones. */
const plain = (text: string) => text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim()

function parseSeed(sql: string): SeedRule[] {
  return sql
    .split("INSERT INTO public.compliance_rules")
    .slice(1)
    .map((block) => {
      const head = /SELECT 'disclosure', '([A-Z]{2})', '((?:[^']|'')*)',\s*\$watch\$([\s\S]*?)\$watch\$/.exec(block)
      if (!head) throw new Error(`Unparseable seed block: ${block.slice(0, 120)}`)
      const [description, bullets = ""] = head[3]!.split(/\n\s*WATCH_FOR:\n/)
      return {
        jurisdiction: head[1]!,
        title: head[2]!.replace(/''/g, "'"),
        description: description!.trim(),
        watchFor: bullets
          .split("\n")
          .filter((line) => line.startsWith("- "))
          .map((line) => line.slice(2).trim()),
      }
    })
}

describe.skipIf(!existsSync(SEED_PATH))("backend compliance seed matches COMPLIANCE_WATCH_FOR_RULES", () => {
  const seed = existsSync(SEED_PATH) ? parseSeed(readFileSync(SEED_PATH, "utf8")) : []

  it("seeds exactly the frontend rules, no more and no fewer", () => {
    expect(seed.map((r) => plain(r.title)).sort()).toEqual(
      COMPLIANCE_WATCH_FOR_RULES.map((r) => plain(r.title)).sort(),
    )
  })

  it.each(COMPLIANCE_WATCH_FOR_RULES.map((r) => [r.id, r] as const))(
    "%s has the same title, description, bullets and jurisdiction in the seed",
    (id, rule) => {
      const row = seed.find((r) => plain(r.title) === plain(rule.title))
      expect(row, `no seed row for ${id}`).toBeDefined()
      expect(plain(row!.description)).toBe(plain(rule.description))
      expect(row!.watchFor.map(plain)).toEqual(rule.watchFor.map(plain))
      expect(row!.jurisdiction).toBe(KNOWN_SEED_JURISDICTION[id] ?? rule.jurisdiction)
    },
  )
})
