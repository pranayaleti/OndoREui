import snapshot from "./instagram-feed.json"
import { SITE_SOCIAL_LINKS } from "./site"

/**
 * The /instagram page renders lib/instagram-feed.json, a snapshot written by
 * `npm run fetch:instagram` (scripts/fetch-instagram.ts). The site is a static export, so posts are
 * pulled at build time and their images saved under public/images/instagram/: Instagram's CDN URLs
 * expire within days, and hotlinking them would also hand every visitor to Meta, which the privacy
 * policy does not cover. Setup and token renewal: docs/instagram-feed.md.
 */

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"

export type InstagramPost = {
  id: string
  permalink: string
  /** Site path of the self-hosted square WebP. */
  image: string
  caption: string
  mediaType: InstagramMediaType
  /** ISO 8601, as the Graph API returns it. */
  timestamp: string
}

export type InstagramFeed = {
  /** When the snapshot was last written; null until the first successful fetch. */
  fetchedAt: string | null
  posts: InstagramPost[]
}

/** One item from the Graph API `/media` edge, limited to the fields the fetch script requests. */
export type GraphMedia = {
  id: string
  caption?: string
  media_type?: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  timestamp?: string
  children?: { data?: GraphMedia[] }
}

export const INSTAGRAM_FEED_LIMIT = 12
export const INSTAGRAM_IMAGE_DIR = "/images/instagram"

export const INSTAGRAM_PROFILE_URL =
  SITE_SOCIAL_LINKS.find((link) => new URL(link.url).hostname.endsWith("instagram.com"))?.url ??
  "https://www.instagram.com/OndoRealEstate"

export const INSTAGRAM_HANDLE = `@${new URL(INSTAGRAM_PROFILE_URL).pathname.replace(/^\/|\/$/g, "")}`

const MEDIA_TYPES: readonly InstagramMediaType[] = ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]

export const instagramFeed: InstagramFeed = snapshot as InstagramFeed

/**
 * The still image to show for a post: a video's cover frame, a carousel's first slide.
 * Undefined when Instagram withholds the media (for example a reel with licensed music).
 */
export function sourceImageUrl(media: GraphMedia): string | undefined {
  if (media.media_type === "VIDEO") return media.thumbnail_url
  if (media.media_type === "CAROUSEL_ALBUM") {
    const first = media.children?.data?.[0]
    return (first && sourceImageUrl(first)) ?? media.media_url
  }
  return media.media_url
}

/**
 * Maps a Graph item to a feed post, or null when it cannot be shown safely. The id becomes a file name
 * and the permalink an href, so both are checked rather than trusted.
 */
export function toFeedPost(media: GraphMedia): InstagramPost | null {
  if (!/^\d+$/.test(media.id)) return null
  if (!media.permalink?.startsWith("https://www.instagram.com/")) return null
  if (!media.timestamp || Number.isNaN(Date.parse(media.timestamp))) return null
  const mediaType = MEDIA_TYPES.find((type) => type === media.media_type) ?? "IMAGE"
  return {
    id: media.id,
    permalink: media.permalink,
    image: `${INSTAGRAM_IMAGE_DIR}/${media.id}.webp`,
    caption: (media.caption ?? "").trim(),
    mediaType,
    timestamp: media.timestamp,
  }
}

/** Caption text without hashtags or @mentions, collapsed to one line. */
function plainCaption(caption: string): string {
  return caption
    .replace(/(^|\s)[#@][\p{L}\p{N}_.]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(" ")
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:!-]+$/, "")}…`
}

/** Alt text for a post's image. The caption is the only description Instagram gives us. */
export function instagramAltText(post: InstagramPost): string {
  const text = plainCaption(post.caption)
  return text ? truncate(text, 125) : "Instagram post from Ondo Real Estate"
}

/** Short caption shown under the image. */
export function instagramCaptionPreview(post: InstagramPost, max = 140): string {
  return truncate(plainCaption(post.caption), max)
}

/** "Oct 20, 2026", in Utah time so the build machine's zone cannot shift the day. */
export function formatInstagramDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Denver",
  })
}
