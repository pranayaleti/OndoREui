import { JsonLd } from "@/components/json-ld"
import {
  canonicalCrumbUrl,
  generateBlogPostingJsonLd,
  generateBreadcrumbJsonLd,
  generateWebPageJsonLd,
} from "@/lib/seo"
import { SITE_NAME, SITE_URL } from "@/lib/site"

// NOTE: This component only generates JSON-LD structured data.
// For <title>, <meta name="description">, robots, and OG tags, use Next.js
// `export const metadata` or `generateMetadata` in the page/layout file.
// To noindex a page, add `robots: { index: false }` to its metadata export.
type SEOProps = {
  title: string
  description: string
  pathname?: string
  image?: string
  jsonLd?: object | object[] | null
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
}

export default function SEO({
  title,
  description,
  pathname = "/",
  image,
  jsonLd = null,
  keywords = [],
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOProps) {
  const domain = SITE_URL.replace(/\/$/, "")
  const toAbsolute = (value?: string) => {
    if (!value) return undefined
    return value.startsWith("http://") || value.startsWith("https://") ? value : `${domain}${value}`
  }

  // Structured-data URLs must match the canonical, which ends with "/" (trailingSlash: true).
  const url = canonicalCrumbUrl(`${domain}${pathname}`)
  const ogImage = toAbsolute(image) || `${domain}/modern-office-building.webp`

  const providedJsonLd = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : []

  const hasType = (entries: object[], typeName: string) =>
    entries.some((entry) => {
      const type = (entry as Record<string, unknown>)?.["@type"]
      if (Array.isArray(type)) return type.includes(typeName)
      return type === typeName
    })

  const hasBlogPostingJsonLd = hasType(providedJsonLd, "BlogPosting")
  const hasWebPageJsonLd = hasType(providedJsonLd, "WebPage")
  const hasBreadcrumbJsonLd = hasType(providedJsonLd, "BreadcrumbList")

  const blogPostingJsonLd =
    !hasBlogPostingJsonLd && publishedTime
      ? generateBlogPostingJsonLd({
          title,
          description,
          url,
          image: ogImage,
          datePublished: publishedTime,
          dateModified: modifiedTime,
          authorName: author || SITE_NAME,
          // Post-specific terms only. Merging the site-wide list put the same 30+
          // keywords on every post, which Google ignores and treats as stuffing.
          keywords: tags.length ? tags : keywords,
          articleSection: section,
        })
      : null

  const webPageJsonLd = !hasWebPageJsonLd
    ? generateWebPageJsonLd({
        name: title,
        url,
        description,
      })
    : null

  const breadcrumbJsonLd =
    !hasBreadcrumbJsonLd && pathname
      ? generateBreadcrumbJsonLd(buildBreadcrumbItems({ pathname, title, domain }))
      : null

  const payload = [
    ...providedJsonLd,
    ...(blogPostingJsonLd ? [blogPostingJsonLd] : []),
    ...(webPageJsonLd ? [webPageJsonLd] : []),
    ...(breadcrumbJsonLd ? [breadcrumbJsonLd] : []),
  ].filter(Boolean)

  if (!payload.length) return null

  return <JsonLd data={payload.length === 1 ? payload[0] : payload} id="seo-jsonld" />
}

/**
 * Path prefixes that have no page of their own, mapped to the hub that covers them.
 * Without this, /vs/buildium/ got a breadcrumb pointing at /vs, which is a 404.
 */
const BREADCRUMB_HUBS: Record<string, { name: string; path: string }> = {
  "/vs": { name: "Compare", path: "/compare/" },
}

export function buildBreadcrumbItems({
  pathname,
  title,
  domain,
}: {
  pathname: string
  title: string
  domain: string
}) {
  const segments = pathname.split("/").filter(Boolean)
  const items: Array<{ name: string; url: string }> = [{ name: "Home", url: `${domain}/` }]

  let current = ""
  segments.forEach((segment, index) => {
    current += `/${segment}`
    const isLast = index === segments.length - 1
    const hub = isLast ? undefined : BREADCRUMB_HUBS[current]
    // Canonical URLs end with "/" (trailingSlash: true); without it every crumb is a 301 hop.
    items.push({
      name: hub?.name ?? (isLast ? title : humanizeSegment(segment)),
      url: `${domain}${hub?.path ?? `${current}/`}`,
    })
  })

  return items
}

function humanizeSegment(segment: string) {
  return segment
    .replace(/[\[\]]/g, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}