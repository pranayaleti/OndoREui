import Link from "next/link"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { ContentFaq, type ContentFaqItem } from "@/components/content/content-faq"
import { ArticleToc } from "@/components/content/article-toc"
import { ArticleByline } from "@/components/content/article-byline"
import { extractOutline } from "@/lib/content/article-outline"

const DEFAULT_AUTHOR = "Ondo Real Estate Editorial Team"

export type ArticleShellMeta = {
  path: string
  title: string
  description: string
  published: string
  modified?: string
  author?: string
  category?: string
  image?: string
  keywords?: string[]
  bannerSubtitle?: string
  faqs?: readonly ContentFaqItem[]
}

export function articleMetadata(meta: ArticleShellMeta): Metadata {
  return pageCanonicalMetadata(meta.path, {
    // Absolute so the root layout template cannot append a second brand.
    title: pageTitle(`${meta.title} | Ondo Real Estate`),
    description: meta.description,
    openGraph: {
      title: pageTitleText(`${meta.title} | Ondo Real Estate`),
      description: meta.description,
      type: "article",
      publishedTime: meta.published,
      modifiedTime: meta.modified || meta.published,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitleText(`${meta.title} | Ondo Real Estate`),
      description: meta.description,
    },
  })
}

type ArticleShellProps = {
  meta: ArticleShellMeta
  children: ReactNode
}

export function ArticleShell({ meta, children }: ArticleShellProps) {
  const image = meta.image ?? "/modern-office-building.png"
  // Walk the body once: stamps heading ids, collects the outline, counts words.
  const { nodes, outline, wordCount } = extractOutline(children)
  const jsonLd: object[] = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Learn", url: `${SITE_URL}/learn` },
      { name: meta.title, url: `${SITE_URL}${meta.path}` },
    ]),
  ]
  if (meta.faqs?.length) {
    const faqLd = generateFAQJsonLd([...meta.faqs])
    if (faqLd) jsonLd.push(faqLd)
  }

  return (
    <main className="min-h-screen">
      <SEO
        title={meta.title}
        description={meta.description}
        pathname={meta.path}
        image={`${SITE_URL}${image}`}
        publishedTime={meta.published}
        modifiedTime={meta.modified || meta.published}
        author={meta.author}
        section={meta.category}
        tags={meta.keywords}
        jsonLd={jsonLd}
      />
      <PageBanner title={meta.title} subtitle={meta.bannerSubtitle ?? meta.description} backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <BreadcrumbNav
            items={[
              { label: "Learn", href: "/learn" },
              { label: meta.category ?? "Guide" },
            ]}
          />
          <div className="mb-4 mt-4 flex flex-wrap gap-3">
            {meta.category ? <Badge variant="secondary">{meta.category}</Badge> : null}
            <Badge variant="outline">Educational</Badge>
          </div>
          <ArticleByline
            author={meta.author ?? DEFAULT_AUTHOR}
            published={meta.published}
            modified={meta.modified}
            wordCount={wordCount}
            className="mb-6"
          />
          <div className="not-prose mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href="/learn">← Mortgage learning hub</Link>
            </Button>
          </div>
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-12">
            <div className="min-w-0">
              <ArticleToc
                items={outline}
                className="mb-8 rounded-lg border border-border bg-muted/30 p-4 lg:hidden"
              />
              <div className="prose prose-lg prose-invert max-w-none">{nodes}</div>
              {meta.faqs?.length ? <ContentFaq items={meta.faqs} /> : null}
            </div>
            {/* Sticky rail on desktop only; the mobile copy above sits inline. */}
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <ArticleToc items={outline} />
            </aside>
          </div>
          <RelatedContent path={meta.path} title="Keep going" />
          <NextStepCta path={meta.path} />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
