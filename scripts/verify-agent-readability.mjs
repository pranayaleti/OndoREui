#!/usr/bin/env node
/**
 * Smoke-test the agent-readability surface against a running site.
 *
 * Runs every curl-equivalent check listed in docs/AGENT_READABILITY.md against
 * `--base-url` (default http://localhost:3000) and prints a labeled PASS/FAIL
 * for each. All checks run even when one fails, so the final report always
 * covers the full stack. Exits non-zero when any REQUIRED check fails; the
 * Cloudflare Markdown-for-Agents check is optional and can be skipped during
 * dev with `--skip-cf`.
 *
 * Usage:
 *   node scripts/verify-agent-readability.mjs                          # localhost, all checks
 *   node scripts/verify-agent-readability.mjs --skip-cf                # skip Cloudflare-only check
 *   node scripts/verify-agent-readability.mjs --base-url=https://www.ondorealestate.com
 *
 * See docs/AGENT_READABILITY.md for the canonical layer-by-layer runbook.
 */

const args = process.argv.slice(2)
let baseUrl = "http://localhost:3000"
let skipCf = false

for (const arg of args) {
  if (arg.startsWith("--base-url=")) {
    baseUrl = arg.slice("--base-url=".length)
  } else if (arg === "--skip-cf") {
    skipCf = true
  } else if (arg === "--help" || arg === "-h") {
    console.log(
      [
        "Usage: node scripts/verify-agent-readability.mjs [--base-url=<url>] [--skip-cf]",
        "",
        "Runs the checks documented in docs/AGENT_READABILITY.md against a running site.",
      ].join("\n")
    )
    process.exit(0)
  } else {
    console.error(`unknown argument: ${arg}`)
    process.exit(2)
  }
}

baseUrl = baseUrl.replace(/\/+$/, "")

/** @type {Array<{ label: string, status: "PASS"|"FAIL"|"SKIP", detail: string, required: boolean }>} */
const results = []

function record(label, status, detail, required) {
  results.push({ label, status, detail, required })
  const line = `[${status}] ${label}${detail ? ` ${detail}` : ""}`
  if (status === "FAIL") {
    console.error(line)
  } else {
    console.log(line)
  }
}

async function safeFetch(path, init) {
  const url = `${baseUrl}${path}`
  try {
    const res = await fetch(url, init)
    return { ok: true, res, url }
  } catch (err) {
    return { ok: false, url, error: err instanceof Error ? err.message : String(err) }
  }
}

async function checkGet(label, path, validate) {
  const fetched = await safeFetch(path, { method: "GET", redirect: "manual" })
  if (!fetched.ok) {
    record(label, "FAIL", `— ${fetched.url}: ${fetched.error}`, true)
    return
  }
  const { res } = fetched
  const contentType = res.headers.get("content-type") || ""
  let body = ""
  try {
    body = await res.text()
  } catch (err) {
    record(label, "FAIL", `— ${fetched.url}: could not read body (${err instanceof Error ? err.message : err})`, true)
    return
  }
  const problems = validate({ status: res.status, contentType, body }) || []
  if (problems.length === 0) {
    record(label, "PASS", `(${contentType || "no content-type"}, ${body.length} bytes)`, true)
  } else {
    record(label, "FAIL", `— ${fetched.url}\n        ${problems.join("\n        ")}`, true)
  }
}

async function checkGetJson(label, path, validate) {
  const fetched = await safeFetch(path, { method: "GET", redirect: "manual" })
  if (!fetched.ok) {
    record(label, "FAIL", `— ${fetched.url}: ${fetched.error}`, true)
    return
  }
  const { res } = fetched
  const contentType = res.headers.get("content-type") || ""
  const raw = await res.text()
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    record(label, "FAIL", `— ${fetched.url}: invalid JSON (${err instanceof Error ? err.message : err})`, true)
    return
  }
  const problems = validate({ status: res.status, contentType, json: parsed }) || []
  if (problems.length === 0) {
    record(label, "PASS", `(${contentType || "no content-type"}, ${raw.length} bytes)`, true)
  } else {
    record(label, "FAIL", `— ${fetched.url}\n        ${problems.join("\n        ")}`, true)
  }
}

async function checkHead(label, path, init, validate, required) {
  const fetched = await safeFetch(path, { method: "HEAD", redirect: "manual", ...init })
  if (!fetched.ok) {
    record(label, "FAIL", `— ${fetched.url}: ${fetched.error}`, required)
    return
  }
  const { res } = fetched
  const contentType = res.headers.get("content-type") || ""
  const problems = validate({ status: res.status, contentType }) || []
  if (problems.length === 0) {
    record(label, "PASS", `(${contentType || "no content-type"})`, required)
  } else {
    record(label, "FAIL", `— ${fetched.url}\n        ${problems.join("\n        ")}`, required)
  }
}

async function main() {
  console.log(`Verifying agent-readability surface at ${baseUrl}${skipCf ? " (--skip-cf)" : ""}`)
  console.log("")

  await checkGet("/llms.txt", "/llms.txt", ({ status, contentType, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!contentType.startsWith("text/plain")) problems.push(`expected content-type text/plain, got ${contentType || "none"}`)
    if (!body.includes("## Required disclosures")) problems.push("body missing '## Required disclosures'")
    if (!body.includes("How to fetch Markdown")) problems.push("body missing 'How to fetch Markdown'")
    return problems
  })

  await checkGet("/llms-full.txt", "/llms-full.txt", ({ status, contentType, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!contentType.startsWith("text/plain")) problems.push(`expected content-type text/plain, got ${contentType || "none"}`)
    if (!body.includes("## Required disclosures")) problems.push("body missing '## Required disclosures'")
    return problems
  })

  await checkGetJson("/llms.json", "/llms.json", ({ status, json }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    const markdownSitemap = json?.resources?.markdownSitemap
    if (typeof markdownSitemap !== "string" || !markdownSitemap.endsWith("/sitemap.md")) {
      problems.push(`resources.markdownSitemap should end with '/sitemap.md', got ${JSON.stringify(markdownSitemap)}`)
    }
    const acceptHeader = json?.contentNegotiation?.acceptHeader
    if (acceptHeader !== "text/markdown") {
      problems.push(`contentNegotiation.acceptHeader should be 'text/markdown', got ${JSON.stringify(acceptHeader)}`)
    }
    return problems
  })

  await checkGet("/sitemap.md", "/sitemap.md", ({ status, contentType, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!contentType.startsWith("text/markdown")) problems.push(`expected content-type text/markdown, got ${contentType || "none"}`)
    if (!body.startsWith("# Ondo Real Estate — Markdown sitemap")) {
      problems.push("body does not start with '# Ondo Real Estate — Markdown sitemap'")
    }
    return problems
  })

  await checkGet("/index.md", "/index.md", ({ status, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!body.includes("---\n")) problems.push("body missing YAML frontmatter delimiter ('---\\n')")
    if (!body.includes("## Required disclosures")) problems.push("body missing '## Required disclosures'")
    return problems
  })

  await checkGet("/properties.md", "/properties.md", ({ status, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!body.includes("search_available_properties")) problems.push("body missing 'search_available_properties'")
    return problems
  })

  await checkGet("/contact.md", "/contact.md", ({ status, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!body.includes("submit_contact_lead")) problems.push("body missing 'submit_contact_lead'")
    if (!body.includes("get_company_contact_info")) problems.push("body missing 'get_company_contact_info'")
    return problems
  })

  await checkGet("/calculators/mortgage-payment.md", "/calculators/mortgage-payment.md", ({ status, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!body.includes("Monthly principal + interest")) problems.push("body missing 'Monthly principal + interest'")
    if (!body.includes("Equal Housing Lender")) problems.push("body missing 'Equal Housing Lender'")
    return problems
  })

  await checkGet("/robots.txt", "/robots.txt", ({ status, body }) => {
    const problems = []
    if (status !== 200) problems.push(`expected status 200, got ${status}`)
    if (!body.includes("Content-Signal: search=yes, ai-input=yes, ai-train=yes")) {
      problems.push("body missing 'Content-Signal: search=yes, ai-input=yes, ai-train=yes'")
    }
    if (!body.includes("User-agent: ClaudeBot")) problems.push("body missing 'User-agent: ClaudeBot'")
    return problems
  })

  if (skipCf) {
    record("/about/ (Accept: text/markdown)", "SKIP", "(Cloudflare Markdown for Agents check skipped via --skip-cf)", false)
  } else {
    await checkHead(
      "/about/ (Accept: text/markdown)",
      "/about/",
      { headers: { Accept: "text/markdown" } },
      ({ contentType }) => {
        const problems = []
        if (!contentType.startsWith("text/markdown")) {
          problems.push(
            `expected content-type text/markdown, got ${contentType || "none"} — expected after Cloudflare Markdown for Agents is enabled; skip with --skip-cf during dev`
          )
        }
        return problems
      },
      true
    )
  }

  const passed = results.filter((r) => r.status === "PASS").length
  const failed = results.filter((r) => r.status === "FAIL").length
  const skipped = results.filter((r) => r.status === "SKIP").length
  const requiredFailed = results.filter((r) => r.status === "FAIL" && r.required).length

  console.log("")
  console.log(`${passed} passed, ${failed} failed, ${skipped} skipped`)

  process.exit(requiredFailed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(`verify-agent-readability crashed: ${err instanceof Error ? err.stack : err}`)
  process.exit(1)
})
