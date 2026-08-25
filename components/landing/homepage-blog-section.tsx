import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { homepageBlogPosts } from "@/lib/homepage-blog-posts"

export function HomepageBlogSection() {
  return (
    <section
      className="border-y border-border/40 bg-muted/30 py-16 dark:bg-[var(--gradient-overlay)]"
      aria-labelledby="homepage-blog-heading"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="homepage-blog-heading"
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              Utah landlord guides
            </h2>
            <p className="mt-2 text-foreground/70">
              Practical writing from the Ondo team &mdash; how to price, screen, maintain, and
              scale rentals along the Wasatch Front.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
          >
            All articles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {homepageBlogPosts.map((post) => (
            <li key={post.href}>
              <Link
                href={post.href}
                className="group flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="mb-3 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <span className="text-foreground/50">{post.readTime}</span>
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-foreground/70">{post.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read guide
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    &rarr;
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
