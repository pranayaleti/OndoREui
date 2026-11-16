/**
 * Pulls the latest Instagram posts into lib/instagram-feed.json and saves each image as a 640px square
 * WebP under public/images/instagram/, for the /instagram page (see lib/instagram-feed.ts).
 *
 *   IG_ACCESS_TOKEN=... npm run fetch:instagram
 *
 * IG_ACCESS_TOKEN alone uses the Instagram API with Instagram Login (graph.instagram.com/me). With
 * IG_USER_ID as well it uses the Facebook Login flow (graph.facebook.com/<ig-user-id>), the same pair
 * OndoRESocial reads. Setup: docs/instagram-feed.md.
 *
 * This runs in deploy.yml before the build and never fails it: no token, an expired token or an
 * Instagram outage leaves the committed snapshot in place, because a red deploy step would freeze the
 * whole site over one page.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import {
  INSTAGRAM_FEED_LIMIT,
  INSTAGRAM_IMAGE_DIR,
  sourceImageUrl,
  toFeedPost,
  type GraphMedia,
  type InstagramFeed,
  type InstagramPost,
} from "../lib/instagram-feed"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const feedFile = path.join(root, "lib", "instagram-feed.json")
const imageDir = path.join(root, "public", INSTAGRAM_IMAGE_DIR)

const GRAPH_VERSION = "v21.0"
const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}"
const TIMEOUT_MS = 15_000
const IMAGE_SIZE = 640

function mediaEndpoint(token: string, userId: string | undefined): URL {
  const url = userId
    ? new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${userId}/media`)
    : new URL(`https://graph.instagram.com/${GRAPH_VERSION}/me/media`)
  url.searchParams.set("fields", FIELDS)
  url.searchParams.set("limit", String(INSTAGRAM_FEED_LIMIT))
  url.searchParams.set("access_token", token)
  return url
}

async function fetchMedia(token: string, userId: string | undefined): Promise<GraphMedia[]> {
  const res = await fetch(mediaEndpoint(token, userId), { signal: AbortSignal.timeout(TIMEOUT_MS) })
  const body = (await res.json().catch(() => ({}))) as { data?: GraphMedia[]; error?: { message?: string; code?: number } }
  // The URL carries the token, so report Instagram's message, never the request.
  if (!res.ok) throw new Error(`Graph API ${res.status}: ${body.error?.message ?? "no error message"} (code ${body.error?.code ?? "?"})`)
  return body.data ?? []
}

async function saveImage(sourceUrl: string, post: InstagramPost): Promise<void> {
  const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!res.ok) throw new Error(`image ${post.id}: HTTP ${res.status}`)
  const input = Buffer.from(await res.arrayBuffer())
  await sharp(input)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: "cover" })
    .webp({ quality: 78 })
    .toFile(path.join(root, "public", post.image))
}

/** Drops images of posts that left the feed, so public/ only ships what the page shows. */
async function pruneImages(keep: InstagramPost[]): Promise<void> {
  const wanted = new Set(keep.map((post) => path.basename(post.image)))
  for (const name of await fs.readdir(imageDir)) {
    if (name.endsWith(".webp") && !wanted.has(name)) await fs.rm(path.join(imageDir, name))
  }
}

async function main(): Promise<void> {
  const token = process.env.IG_ACCESS_TOKEN?.trim()
  const userId = process.env.IG_USER_ID?.trim() || undefined
  if (!token) {
    console.log("fetch-instagram: IG_ACCESS_TOKEN not set; keeping the committed snapshot.")
    return
  }

  const media = await fetchMedia(token, userId)
  await fs.mkdir(imageDir, { recursive: true })

  const posts: InstagramPost[] = []
  for (const item of media) {
    const post = toFeedPost(item)
    const source = sourceImageUrl(item)
    if (!post || !source) {
      console.warn(`fetch-instagram: skipping ${item.id} (no usable image or permalink)`)
      continue
    }
    try {
      await saveImage(source, post)
      posts.push(post)
    } catch (error) {
      console.warn(`fetch-instagram: skipping ${item.id}: ${(error as Error).message}`)
    }
  }

  // An account that returned media but none we could save is an outage, not an empty feed.
  if (media.length > 0 && posts.length === 0) {
    throw new Error(`none of ${media.length} posts could be saved`)
  }

  const feed: InstagramFeed = { fetchedAt: new Date().toISOString(), posts }
  await fs.writeFile(feedFile, `${JSON.stringify(feed, null, 2)}\n`)
  await pruneImages(posts)
  console.log(`fetch-instagram: saved ${posts.length} posts.`)
}

main().catch((error: unknown) => {
  console.warn(`fetch-instagram: ${(error as Error).message}. Keeping the committed snapshot.`)
})
