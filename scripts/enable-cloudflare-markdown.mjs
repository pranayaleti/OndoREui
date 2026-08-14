#!/usr/bin/env node
/**
 * Toggle Cloudflare Markdown for Agents (`content_converter`) for the
 * ondorealestate.com zone via the Cloudflare API.
 *
 * See docs/AGENT_READABILITY.md for the full runbook. This helper is the
 * scripted equivalent of the `curl` snippet in the "Enable Cloudflare
 * Markdown for Agents (one-time)" section.
 *
 * Requires an API token with the **Zone.Settings:Edit** permission for the
 * zone. The current deploy token (Cache Purge + Zone Read) is NOT sufficient
 * — create a new one at
 * https://dash.cloudflare.com/profile/api-tokens if needed.
 *
 * Usage:
 *   CF_API_TOKEN=... CF_ZONE_ID=... node scripts/enable-cloudflare-markdown.mjs         # turn on
 *   CF_API_TOKEN=... CF_ZONE_ID=... node scripts/enable-cloudflare-markdown.mjs off     # turn off
 *   CF_API_TOKEN=... CF_ZONE_ID=... node scripts/enable-cloudflare-markdown.mjs --dry-run
 */

const args = process.argv.slice(2)
let dryRun = false
const positional = []

for (const arg of args) {
  if (arg === "--dry-run") {
    dryRun = true
  } else if (arg === "--help" || arg === "-h") {
    console.log(
      [
        "Usage: node scripts/enable-cloudflare-markdown.mjs [on|off] [--dry-run]",
        "",
        "Requires CF_API_TOKEN (Zone.Settings:Edit) and CF_ZONE_ID env vars.",
        "See docs/AGENT_READABILITY.md.",
      ].join("\n")
    )
    process.exit(0)
  } else if (arg.startsWith("--")) {
    console.error(`unknown flag: ${arg}`)
    process.exit(2)
  } else {
    positional.push(arg)
  }
}

const action = positional[0] ?? "on"
if (action !== "on" && action !== "off") {
  console.error(`invalid action: ${action} (expected 'on' or 'off')`)
  process.exit(2)
}
if (positional.length > 1) {
  console.error(`too many positional arguments: ${positional.join(" ")}`)
  process.exit(2)
}

const { CF_API_TOKEN, CF_ZONE_ID } = process.env
if (!CF_API_TOKEN || !CF_ZONE_ID) {
  console.error("missing required env vars: CF_API_TOKEN and/or CF_ZONE_ID")
  console.error("")
  console.error("How to fix:")
  console.error("  1. Create a token at https://dash.cloudflare.com/profile/api-tokens")
  console.error("     with the 'Zone.Zone Settings:Edit' permission scoped to the")
  console.error("     ondorealestate.com zone. (The existing Cache Purge + Zone Read")
  console.error("     deploy token is NOT sufficient — do not reuse it.)")
  console.error("  2. Find the zone ID in the Cloudflare dashboard: select the")
  console.error("     ondorealestate.com zone → Overview → API section (right sidebar).")
  console.error("  3. Re-run:")
  console.error("       CF_API_TOKEN=... CF_ZONE_ID=... npm run cloudflare:markdown")
  process.exit(1)
}

const url = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/settings/content_converter`
const body = JSON.stringify({ value: action })
const headers = {
  Authorization: `Bearer ${CF_API_TOKEN}`,
  "Content-Type": "application/json",
}

if (dryRun) {
  console.log("[dry-run] would send:")
  console.log(`  PATCH ${url}`)
  console.log(`  Authorization: Bearer <redacted, ${CF_API_TOKEN.length} chars>`)
  console.log(`  Content-Type: application/json`)
  console.log(`  body: ${body}`)
  process.exit(0)
}

async function main() {
  const res = await fetch(url, { method: "PATCH", headers, body })
  const text = await res.text()

  if (res.status !== 200) {
    console.error(`Cloudflare API returned HTTP ${res.status}`)
    console.error(text)
    process.exit(1)
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = null
  }
  const newValue = parsed?.result?.value ?? action

  console.log(`Cloudflare Markdown for Agents (content_converter) set to "${newValue}" for zone ${CF_ZONE_ID}.`)
  console.log("")
  console.log("Verify with:")
  console.log(`  curl -sIH "Accept: text/markdown" https://www.ondorealestate.com/about/ | grep -i content-type`)
  console.log("  # Expected: content-type: text/markdown; charset=utf-8")
}

main().catch((err) => {
  console.error(`enable-cloudflare-markdown crashed: ${err instanceof Error ? err.stack : err}`)
  process.exit(1)
})
