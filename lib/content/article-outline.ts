import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react"

/**
 * Heading levels that appear in the article table of contents. h4 and below are
 * treated as body structure, not navigation.
 */
export type OutlineLevel = 2 | 3

export type OutlineEntry = {
  id: string
  text: string
  level: OutlineLevel
}

export type ArticleOutline = {
  /** The children tree with an `id` stamped onto every h2/h3 that lacked one. */
  nodes: ReactNode
  outline: OutlineEntry[]
  wordCount: number
}

const WORDS_PER_MINUTE = 225

export function readingTimeMinutes(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    // Drop quotes and apostrophes rather than turning them into separators, so
    // “bank statement” does not become -bank-statement-.
    .replace(/['‘’"“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

type ElementProps = { children?: ReactNode; id?: string }

function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

/** Flattens an already-rendered subtree to its text. Interpolated values have
 *  resolved to strings by the time the shell receives them, so this is exact. */
function textOf(node: ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement(node)) return textOf((node.props as ElementProps).children)
  return ""
}

function levelOf(type: ReactElement["type"]): OutlineLevel | null {
  if (type === "h2") return 2
  if (type === "h3") return 3
  return null
}

/**
 * Walks an article's children, collecting its h2/h3 outline and stamping ids on
 * those headings so the table of contents can link to them. Runs at render time
 * in a server component, so no per-post markup has to be edited.
 */
export function extractOutline(children: ReactNode): ArticleOutline {
  const outline: OutlineEntry[] = []
  const usedIds = new Map<string, number>()
  let wordCount = 0

  const uniqueId = (base: string): string => {
    const seen = usedIds.get(base) ?? 0
    usedIds.set(base, seen + 1)
    return seen === 0 ? base : `${base}-${seen + 1}`
  }

  const walk = (node: ReactNode): ReactNode => {
    if (typeof node === "string" || typeof node === "number") {
      wordCount += countWords(String(node))
      return node
    }
    if (Array.isArray(node)) return Children.map(node, walk)
    if (!isValidElement(node)) return node

    const element = node as ReactElement<ElementProps>
    const level = levelOf(element.type)

    if (level) {
      const text = textOf(element.props.children)
      wordCount += countWords(text)
      if (element.props.id) {
        outline.push({ id: element.props.id, text, level })
        return element
      }
      const id = uniqueId(slugifyHeading(text))
      outline.push({ id, text, level })
      return cloneElement(element, { id })
    }

    if (element.props.children === undefined) return element
    return cloneElement(element, undefined, walk(element.props.children))
  }

  return { nodes: walk(children), outline, wordCount }
}
