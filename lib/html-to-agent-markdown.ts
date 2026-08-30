/**
 * Sibling Markdown paths and HTML → Markdown conversion for AI agents.
 *
 * GitHub Pages cannot honor `Accept: text/markdown`. Every exported HTML page
 * gets a `.md` twin (`/about/` → `/about.md`) so agents can fetch Markdown
 * without guessing URLs or executing JavaScript.
 */

const FILE_SUFFIX = /\.[a-z0-9]{2,8}$/i
const SKIP_EXPORT_PREFIXES = ["_next/", "_not-found/"]
const SKIP_EXPORT_NAMES = new Set(["404.html", "500.html", "404/index.html", "500/index.html"])

export function htmlPathToMarkdownPath(pathname: string): string | null {
  const trimmed = pathname.replace(/\/+$/, "") || "/"
  if (trimmed.startsWith("/_next/")) return null
  if (FILE_SUFFIX.test(trimmed)) {
    return trimmed.toLowerCase().endsWith(".md") ? trimmed : null
  }
  if (trimmed === "/") return "/index.md"
  return `${trimmed}.md`
}

export function exportedHtmlRelToMarkdownRel(relPosix: string): string | null {
  const rel = relPosix.replace(/\\/g, "/")
  if (SKIP_EXPORT_NAMES.has(rel)) return null
  if (SKIP_EXPORT_PREFIXES.some((prefix) => rel.startsWith(prefix))) return null
  if (!rel.endsWith(".html")) return null
  if (rel === "index.html") return "index.md"
  if (rel.endsWith("/index.html")) return `${rel.slice(0, -"/index.html".length)}.md`
  return `${rel.slice(0, -".html".length)}.md`
}

export function htmlToAgentMarkdown(
  html: string,
  opts: { canonical: string; title?: string },
): string {
  const title = opts.title?.trim() || extractTitle(html) || canonicalTitle(opts.canonical)
  const main = pickPageFragment(html)
  const body = fragmentToMarkdown(main).trim()
  const lines = [
    "---",
    `title: "${escapeYaml(title)}"`,
    `canonical: ${opts.canonical}`,
    "---",
    "",
  ]
  if (body) {
    if (!/^# /m.test(body)) {
      lines.push(`# ${title}`, "")
    }
    lines.push(body, "")
  } else {
    lines.push(`# ${title}`, "", "This page is interactive in the browser. Fetch the HTML URL or see /llms.txt.", "")
  }
  return lines.join("\n")
}

function pickPageFragment(html: string): string {
  const slots = extractHiddenSuspenseSlots(html)
    .map((fragment) => ({ fragment, score: fragmentScore(fragment) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
  if (slots[0]) return slots[0].fragment

  const scoped = [extractById(html, "main-content"), extractTag(html, "main")].filter(
    (value): value is string => typeof value === "string" && fragmentScore(value) > 0,
  )
  if (scoped[0]) return scoped[0]

  return extractTag(html, "body") ?? html
}

function extractHiddenSuspenseSlots(html: string): string[] {
  const slots: string[] = []
  const re = /<div\b[^>]*\shidden\b[^>]*\sid=["']S:\d+["'][^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(html))) {
    const inner = sliceBalanced(html, match.index + match[0].length, "div")
    if (inner) slots.push(inner)
  }
  return slots
}

function fragmentScore(fragment: string): number {
  const text = decodeEntities(stripTags(fragment)).replace(/\s+/g, " ").trim()
  if (!text || /^loading\.?\.?\.?$/i.test(text)) return 0
  let score = text.length
  if (/<h[1-3]\b/i.test(fragment)) score += 500
  if (/data-agent-intro/i.test(fragment)) score += 200
  return score
}

function canonicalTitle(canonical: string): string {
  try {
    const path = new URL(canonical).pathname.replace(/\/+$/, "") || "/"
    if (path === "/") return "Ondo Real Estate"
    return path
      .split("/")
      .filter(Boolean)
      .map((part) => part.replace(/-/g, " "))
      .join(" / ")
  } catch {
    return "Ondo Real Estate"
  }
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!match) return null
  return decodeEntities(stripTags(match[1])).replace(/\s+/g, " ").trim() || null
}

function extractById(html: string, id: string): string | null {
  const open = html.match(new RegExp(`<(?<tag>[a-zA-Z][a-zA-Z0-9]*)[^>]*\\sid=["']${id}["'][^>]*>`, "i"))
  if (!open?.groups?.tag || open.index == null) return null
  return sliceBalanced(html, open.index + open[0].length, open.groups.tag)
}

function extractTag(html: string, tag: string): string | null {
  const open = html.match(new RegExp(`<${tag}\\b[^>]*>`, "i"))
  if (!open || open.index == null) return null
  return sliceBalanced(html, open.index + open[0].length, tag)
}

function sliceBalanced(html: string, start: number, tag: string): string | null {
  const openRe = new RegExp(`<${tag}\\b`, "gi")
  const closeRe = new RegExp(`</${tag}>`, "gi")
  let depth = 1
  let cursor = start
  while (cursor < html.length && depth > 0) {
    openRe.lastIndex = cursor
    closeRe.lastIndex = cursor
    const nextOpen = openRe.exec(html)
    const nextClose = closeRe.exec(html)
    if (!nextClose) return html.slice(start)
    const openAt = nextOpen ? nextOpen.index : Number.POSITIVE_INFINITY
    if (openAt < nextClose.index) {
      depth += 1
      cursor = openAt + nextOpen![0].length
    } else {
      depth -= 1
      if (depth === 0) return html.slice(start, nextClose.index)
      cursor = nextClose.index + nextClose[0].length
    }
  }
  return html.slice(start)
}

function fragmentToMarkdown(fragment: string): string {
  let html = fragment
  html = html.replace(/<script\b[\s\S]*?<\/script>/gi, "")
  html = html.replace(/<style\b[\s\S]*?<\/style>/gi, "")
  html = html.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
  html = html.replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
  html = html.replace(/<!--[\s\S]*?-->/g, "")

  html = html.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const text = inlineToMarkdown(inner).trim()
    return text ? `\n\n${"#".repeat(Number(level))} ${text}\n\n` : "\n\n"
  })
  html = html.replace(/<br\s*\/?>/gi, "\n")
  html = html.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => `- ${inlineToMarkdown(inner).trim()}\n`)
  html = html.replace(/<\/(p|div|section|article|header|footer|tr)>/gi, "\n\n")
  html = html.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) => {
    const text = inlineToMarkdown(inner).trim() || href
    return `[${text}](${href})`
  })
  html = html.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => `**${inlineToMarkdown(inner).trim()}**`)
  html = html.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => `_${inlineToMarkdown(inner).trim()}_`)
  html = html.replace(/<[^>]+>/g, "")
  html = decodeEntities(html)
  html = html.replace(/[ \t]+\n/g, "\n")
  html = html.replace(/\n{3,}/g, "\n\n")
  return html.trim()
}

function inlineToMarkdown(inner: string): string {
  let html = inner.replace(/<script\b[\s\S]*?<\/script>/gi, "")
  html = html.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, nested) => {
    const text = stripTags(nested).trim() || href
    return `[${text}](${href})`
  })
  html = html.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, nested) => `**${stripTags(nested).trim()}**`)
  html = html.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, nested) => `_${stripTags(nested).trim()}_`)
  html = html.replace(/<br\s*\/?>/gi, " ")
  html = stripTags(html)
  return decodeEntities(html).replace(/\s+/g, " ").trim()
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, "")
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
}

function escapeYaml(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}
