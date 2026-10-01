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
import { countWords, extractOutline } from "@/lib/content/article-outline"
import { KeyTakeaways } from "@/components/content/key-takeaways"
import { ARTICLE_ADVICE_NOTICE, articleDisclosureKind, type ArticleDisclosureKind } from "@/lib/content/article-disclosure"
import { ARRIVAL_REAL_ESTATE_DISCLOSURE } from "@/lib/utah-arrival"
import { articleFallbackFor, articleHubFor, isMortgageArticle } from "@/lib/content/article-fallback"
import { getContentNodeByPath } from "@/lib/content"

const NON_MORTGAGE_NEXT_STEP_BODY = "Questions about your own property or plan? Ondo RE can walk through it with you."

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
  /** Optional "at a glance" bullets shown above the body. */
  takeaways?: readonly string[]
  /** Override the takeaways caption; legal-adjacent articles need their own. */
  takeawaysCaption?: string
  faqs?: readonly ContentFaqItem[]
  /** Footer disclosure. Defaults from `category` (see lib/content/article-disclosure.ts). */
  disclosure?: ArticleDisclosureKind
  /**
   * Set on a duplicate post that was folded into a stronger one. The page stays reachable but is
   * noindex,follow with its canonical pointing at the kept post, and it links readers there.
   */
  mergedInto?: { path: string; title: string }
}

export function articleMetadata(meta: ArticleShellMeta): Metadata {
  return pageCanonicalMetadata(meta.mergedInto?.path ?? meta.path, {
    ...(meta.mergedInto ? { robots: { index: false, follow: true } } : {}),
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

function ArticleDisclosure({ kind }: { kind: ArticleDisclosureKind }) {
  if (kind === "lending") return <LendingDisclaimer className="mt-8" />
  return (
    <p className="mt-8 text-xs leading-relaxed text-foreground/60">
      {ARRIVAL_REAL_ESTATE_DISCLOSURE}
      {kind === "advice" ? ` ${ARTICLE_ADVICE_NOTICE}` : ""}
    </p>
  )
}

type ArticleShellProps = {
  meta: ArticleShellMeta
  children: ReactNode
}

export function ArticleShell({ meta, children }: ArticleShellProps) {
  const image = meta.image ?? "/modern-office-building.png"
  // Walk the body once: stamps heading ids, collects the outline, counts words.
  const { nodes, outline, wordCount: bodyWordCount } = extractOutline(children)
  // Takeaways render outside the children, so count them separately.
  const wordCount = bodyWordCount + countWords((meta.takeaways ?? []).join(" "))
  // Mortgage posts live under the Learn hub; landlord, neighborhood, notary and
  // other posts under the blog index.
  const hub = articleHubFor(meta.path, meta.category)
  // Posts outside the content graph would otherwise end with no related links or next step.
  const fallback = getContentNodeByPath(meta.path) ? undefined : articleFallbackFor(meta.category)
  const jsonLd: object[] = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: hub.label, url: `${SITE_URL}${hub.href}` },
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
              { label: hub.label, href: hub.href },
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
              <Link href={hub.href}>{hub.backLabel}</Link>
            </Button>
          </div>
          {meta.takeaways?.length ? <KeyTakeaways items={meta.takeaways} caption={meta.takeawaysCaption} className="mb-8" /> : null}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-12">
            <div className="min-w-0">
              <ArticleToc
                items={outline}
                className="mb-8 rounded-lg border border-border bg-muted/30 p-4 lg:hidden"
              />
              {meta.mergedInto ? (
                <p className="not-prose mb-6 rounded-lg border border-border bg-muted p-4 text-sm text-foreground/80">
                  This guide now lives in{" "}
                  <Link href={meta.mergedInto.path} className="font-medium underline underline-offset-2">
                    {meta.mergedInto.title}
                  </Link>
                  . Read it there.
                </p>
              ) : null}
              <div className="prose prose-lg max-w-none">{nodes}</div>
              {meta.faqs?.length ? <ContentFaq items={meta.faqs} /> : null}
            </div>
            {/* Sticky rail on desktop only; the mobile copy above sits inline. */}
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <ArticleToc items={outline} />
            </aside>
          </div>
          <RelatedContent path={meta.path} title="Keep going" fallbackLinks={fallback?.links} />
          <NextStepCta
            path={meta.path}
            fallback={fallback}
            body={fallback && !isMortgageArticle(meta.path, meta.category) ? NON_MORTGAGE_NEXT_STEP_BODY : undefined}
          />
          <ArticleDisclosure kind={articleDisclosureKind(meta.category, meta.disclosure)} />
        </div>
      </article>
    </main>
  )
}
