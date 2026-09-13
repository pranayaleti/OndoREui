import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Calculator } from "lucide-react"
import SEO from "@/components/seo"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { generateBreadcrumbJsonLd, generateDefinedTermJsonLd } from "@/lib/seo"
import { SITE_NAME, SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import {
  GLOSSARY_CATEGORY_LABELS,
  GLOSSARY_SLUGS,
  getGlossaryTerm,
  glossaryHref,
  glossaryTermsByCategory,
  relatedGlossaryTerms,
} from "@/lib/content/glossary"

type Params = Promise<{ slug: string }>

export function generateStaticParams(): { slug: string }[] {
  return GLOSSARY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const entry = getGlossaryTerm(slug)
  if (!entry) return {}

  // "What is X?" mirrors how the term is actually searched, without keyword stuffing.
  const title = pageTitleText(`${entry.term} — What It Means | ${SITE_NAME}`)
  return pageCanonicalMetadata(glossaryHref(entry.slug), {
    title: pageTitle(title),
    description: entry.short,
    keywords: [entry.term, ...(entry.aliases ?? [])],
    openGraph: {
      title,
      description: entry.short,
      type: "article",
    },
  })
}

export default async function GlossaryTermPage({ params }: { params: Params }) {
  const { slug } = await params
  const entry = getGlossaryTerm(slug)
  if (!entry) notFound()

  const base = SITE_URL.replace(/\/$/, "")
  const url = `${base}${glossaryHref(entry.slug)}`
  const categoryLabel = GLOSSARY_CATEGORY_LABELS[entry.category]
  const seeAlso = relatedGlossaryTerms(entry)
  const calculators = (entry.calculators ?? [])
    .map((calcSlug) => ({ slug: calcSlug, meta: CALCULATOR_CATALOG[calcSlug] }))
    .filter((item): item is { slug: string; meta: { name: string; description: string } } =>
      Boolean(item.meta),
    )

  // Same-category siblings give the page somewhere to go when nothing else fits.
  const siblings = glossaryTermsByCategory(entry.category)
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 6)

  const structuredData = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Glossary", url: `${base}/glossary/` },
      { name: entry.term, url },
    ]),
    generateDefinedTermJsonLd({
      name: entry.term,
      description: entry.short,
      url,
      termSetName: `${SITE_NAME} Real Estate Glossary`,
      termSetUrl: `${base}/glossary/`,
      inCategory: categoryLabel,
    }),
  ].filter(Boolean)

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={`${entry.term} — What It Means`}
        description={entry.short}
        pathname={glossaryHref(entry.slug)}
        image={`${SITE_URL}/modern-office-building.webp`}
        keywords={[entry.term, ...(entry.aliases ?? [])]}
        jsonLd={structuredData}
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        {/* ---- Breadcrumb ---- */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-foreground/60">
            <li>
              <Link href="/" className="underline underline-offset-4 hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/glossary/" className="underline underline-offset-4 hover:text-primary">
                Glossary
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground/80">
              {entry.term}
            </li>
          </ol>
        </nav>

        {/* ---- Heading ---- */}
        <header>
          <Link
            href={`/glossary/#letter-${entry.term.trim().charAt(0).toUpperCase()}`}
            className="inline-flex rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary"
          >
            {categoryLabel}
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {entry.term}
          </h1>
          {entry.aliases && entry.aliases.length > 0 ? (
            <p className="mt-3 text-sm text-foreground/55">
              Also called: {entry.aliases.join(", ")}
            </p>
          ) : null}
          <p className="mt-6 border-l-2 border-primary pl-5 text-xl leading-relaxed text-foreground/85">
            {entry.short}
          </p>
        </header>

        {/* ---- Definition ---- */}
        <div className="mt-10 space-y-5">
          {entry.definition.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-foreground/80">
              {paragraph}
            </p>
          ))}
        </div>

        {/* ---- Why it matters ---- */}
        {entry.whyItMatters ? (
          <aside
            aria-labelledby="why-it-matters"
            className="mt-10 rounded-xl border border-primary/25 bg-primary/5 p-6"
          >
            <h2 id="why-it-matters" className="text-sm font-semibold uppercase tracking-wide text-primary">
              Why it matters
            </h2>
            <p className="mt-2 text-base leading-relaxed text-foreground/85">{entry.whyItMatters}</p>
          </aside>
        ) : null}

        {/* ---- Calculators that use this term ---- */}
        {calculators.length > 0 ? (
          <section aria-labelledby="use-it" className="mt-12">
            <h2 id="use-it" className="text-xl font-bold text-foreground">
              Put a number on it
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              {calculators.length === 1
                ? "This term is an input in the calculator below."
                : "This term feeds the calculators below."}
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {calculators.map((calc) => (
                <li key={calc.slug}>
                  <Link
                    href={`/calculators/${calc.slug}/`}
                    className="group flex h-full items-start gap-3 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-foreground group-hover:text-primary">
                        {calc.meta.name}
                      </span>
                      <span className="mt-1 block text-sm text-foreground/70">
                        {calc.meta.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---- See also ---- */}
        {seeAlso.length > 0 ? (
          <section aria-labelledby="see-also" className="mt-12">
            <h2 id="see-also" className="text-xl font-bold text-foreground">
              Related terms
            </h2>
            <ul className="mt-4 space-y-3">
              {seeAlso.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={glossaryHref(item.slug)}
                    className="group block rounded-lg border border-border bg-card/40 p-4 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary">
                      {item.term}
                    </span>
                    <span className="mt-1 block text-sm text-foreground/70">{item.short}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---- Go deeper ---- */}
        {entry.related && entry.related.length > 0 ? (
          <section aria-labelledby="go-deeper" className="mt-12">
            <h2 id="go-deeper" className="text-xl font-bold text-foreground">
              Go deeper
            </h2>
            <ul className="mt-4 space-y-2">
              {entry.related.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-primary underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---- Siblings ---- */}
        {siblings.length > 0 ? (
          <section aria-labelledby="more-in-category" className="mt-12 border-t border-border pt-8">
            <h2 id="more-in-category" className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
              More in {categoryLabel}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {siblings.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={glossaryHref(item.slug)}
                    className="inline-flex rounded-full border border-border bg-card/50 px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.term}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ---- CTA ---- */}
        <section className="mt-12 rounded-2xl border border-border bg-card/40 p-7 text-center">
          <h2 className="text-xl font-bold text-foreground">Have a question about your own situation?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-foreground/70">
            Ondo handles brokerage, lending, property management and notary under one roof, so the
            answer does not change depending on who you ask.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Talk to Ondo
            </Link>
            <Link
              href="/glossary/"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse all terms
            </Link>
          </div>
        </section>

        {/*
          Disclosure is a template property, not something an author remembers:
          any entry flagged `lending` gets it, automatically.
        */}
        {entry.lending ? <LendingDisclaimer className="mt-8" /> : null}
      </article>
    </main>
  )
}
