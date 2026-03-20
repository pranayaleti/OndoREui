import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"

// Blog post data for slugs that don't have their own static page directory.
// Slugs with a dedicated app/blog/[slug]/page.tsx are resolved statically by
// Next.js before this dynamic route is reached, so we only list what's missing.
const POSTS: Record<string, {
  title: string
  description: string
  author: string
  published: string
  modified: string
  category: string
  image: string
  excerpt: string
}> = {
  // All blog posts now have dedicated static directories.
  // Add entries here only for slugs without their own app/blog/<slug>/page.tsx.
}

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return Object.keys(POSTS).map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return {}

  const canonical = `${SITE_URL}/blog/${slug}/`
  return {
    title: `${post.title} | Ondo Real Estate`,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: `${post.title} | Ondo Real Estate`,
      description: post.description,
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.modified,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Ondo Real Estate`,
      description: post.description,
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) notFound()

  const pathname = `/blog/${slug}`

  return (
    <main className="min-h-screen">
      <SEO
        title={post.title}
        description={post.description}
        pathname={pathname}
        image={`${SITE_URL}${post.image}`}
        publishedTime={post.published}
        modifiedTime={post.modified}
        author={post.author}
        section={post.category}
        tags={[post.category]}
      />

      <PageBanner
        title={post.title}
        subtitle={post.description}
        backgroundImage={post.image}
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{post.category}</Badge>
          </div>

          <div className="not-prose mb-6">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">{post.excerpt}</p>

            <p>
              This article is coming soon. In the meantime, our team is happy to answer any
              questions you have.{" "}
              <Link href="/contact" className="text-primary underline">
                Contact us
              </Link>{" "}
              or{" "}
              <Link href="/blog" className="text-primary underline">
                browse the blog
              </Link>{" "}
              for more insights.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
