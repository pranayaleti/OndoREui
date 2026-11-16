import { ArrowUpRight, Images, Instagram, Play } from "lucide-react"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { analyticsAttributes } from "@/lib/analytics"
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_PROFILE_URL,
  formatInstagramDate,
  instagramAltText,
  instagramCaptionPreview,
  type InstagramFeed,
  type InstagramPost,
} from "@/lib/instagram-feed"

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const MEDIA_BADGE = {
  VIDEO: { Icon: Play, label: "Video" },
  CAROUSEL_ALBUM: { Icon: Images, label: "Carousel" },
} as const

function FollowButton() {
  return (
    <Button asChild size="lg">
      <a
        href={INSTAGRAM_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        {...analyticsAttributes("social_click", "instagram_page", "instagram")}
      >
        <Instagram className="mr-2 h-5 w-5" aria-hidden="true" />
        Follow {INSTAGRAM_HANDLE}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Button>
  )
}

function PostTile({ post }: { post: InstagramPost }) {
  const badge = post.mediaType === "IMAGE" ? null : MEDIA_BADGE[post.mediaType]
  const preview = instagramCaptionPreview(post)
  return (
    <li>
      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        {...analyticsAttributes("instagram_post_click", "instagram_page", post.id)}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary ${focusRing}`}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Plain <img>: images are unoptimized in the static export, and these are already 640px WebP. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={instagramAltText(post)}
            width={640}
            height={640}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {badge ? (
            <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white">
              <badge.Icon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{badge.label}</span>
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
          {preview ? <p className="line-clamp-3 text-sm text-foreground/85">{preview}</p> : null}
          <p className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
            <time dateTime={post.timestamp}>{formatInstagramDate(post.timestamp)}</time>
            <span className="inline-flex items-center gap-1">
              <span className="hidden sm:inline">View on Instagram</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </p>
        </div>
      </a>
    </li>
  )
}

export function InstagramFeedView({ feed }: { feed: InstagramFeed }) {
  const { posts } = feed
  return (
    <main className="min-h-screen">
      <PageBanner
        plain
        title="Ondo Real Estate on Instagram"
        subtitle="Utah homes, market notes and behind-the-scenes from Lehi. Tap any post to open it on Instagram."
      />
      <section className="bg-background py-12 sm:py-16" aria-labelledby="instagram-feed-heading">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <h2 id="instagram-feed-heading" className="text-2xl font-bold">
                  Latest posts
                </h2>
                <p className="text-sm text-muted-foreground">{INSTAGRAM_HANDLE}</p>
              </div>
              {/* The empty-state card carries its own button; two side by side would repeat the one action. */}
              {posts.length > 0 ? <FollowButton /> : null}
            </div>

            {posts.length > 0 ? (
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {posts.map((post) => (
                  <PostTile key={post.id} post={post} />
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center">
                <Instagram className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
                <p className="mx-auto mb-6 max-w-md text-foreground/85">
                  Our latest posts will show up here soon. Until then, you can see everything on Instagram.
                </p>
                <FollowButton />
              </div>
            )}

            {posts.length > 0 ? (
              <div className="mt-10 flex justify-center">
                <FollowButton />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
