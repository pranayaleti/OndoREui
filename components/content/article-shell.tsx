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
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { ContentFaq, type ContentFaqItem } from "@/components/content/content-faq"

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
    title: `${meta.title} | Ondo Real Estate`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | Ondo Real Estate`,
      description: meta.description,
      type: "article",
      publishedTime: meta.published,
      modifiedTime: meta.modified || meta.published,
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | Ondo Real Estate`,
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
          <div className="mb-6 mt-4 flex flex-wrap gap-3">
            {meta.category ? <Badge variant="secondary">{meta.category}</Badge> : null}
            <Badge variant="outline">Educational</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/learn">← Mortgage learning hub</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">{children}</div>
          {meta.faqs?.length ? <ContentFaq items={meta.faqs} /> : null}
          <RelatedContent path={meta.path} title="Keep going" />
          <NextStepCta path={meta.path} />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
