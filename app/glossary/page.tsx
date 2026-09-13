import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { generateBreadcrumbJsonLd, generateDefinedTermSetJsonLd } from "@/lib/seo"
import { SITE_NAME, SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { GLOSSARY_TERMS, glossaryHref, sortedGlossaryTerms } from "@/lib/content/glossary"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { GlossaryClient } from "./glossary-client"

const TITLE = "Real Estate Glossary"
const DESCRIPTION = `Plain-English definitions of ${GLOSSARY_TERMS.length} real estate, mortgage, investing, and property management terms — what each one means and why it matters.`

export const metadata: Metadata = pageCanonicalMetadata("/glossary", {
  title: pageTitle(`${TITLE} | ${SITE_NAME}`),
  description: DESCRIPTION,
  keywords: [
    "real estate glossary",
    "mortgage terms explained",
    "real estate definitions",
    "property management terms",
    "real estate investing terms",
    "what does escrow mean",
  ],
  openGraph: {
    title: pageTitleText(`${TITLE} | ${SITE_NAME}`),
    description: DESCRIPTION,
    type: "website",
  },
})

export default function GlossaryIndexPage() {
  const terms = sortedGlossaryTerms()
  const base = SITE_URL.replace(/\/$/, "")

  const structuredData = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: SITE_URL },
      { name: "Glossary", url: `${base}/glossary/` },
    ]),
    generateDefinedTermSetJsonLd({
      name: `${SITE_NAME} Real Estate Glossary`,
      description: DESCRIPTION,
      url: `${base}/glossary/`,
      terms: terms.map((entry) => ({
        name: entry.term,
        description: entry.short,
        url: `${base}${glossaryHref(entry.slug)}`,
      })),
    }),
  ].filter(Boolean)

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        pathname="/glossary/"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={structuredData}
      />

      {/* ---- Hero (server-rendered so the page reads well without JS) ---- */}
      <section className="border-b border-border bg-gradient-to-b from-background to-card/40">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm text-foreground/60">
              <li>
                <Link href="/" className="underline underline-offset-4 hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground/80">
                Glossary
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Real estate glossary
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-foreground/70">
            {GLOSSARY_TERMS.length} terms from buying, selling, lending, investing, leasing and
            closing — each one explained in plain English, with what it actually changes for you.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground/60">
            Looking for a number rather than a definition? Every term links through to the{" "}
            <Link href="/calculators/" className="font-medium text-primary underline underline-offset-4">
              calculator
            </Link>{" "}
            that uses it.
          </p>
        </div>
      </section>

      <GlossaryClient />

      {/* ---- Closing CTA ---- */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-foreground">Still not sure how it applies to you?</h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            A definition tells you what a term means. A conversation tells you what it means for
            your file, your property, or your timeline.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Talk to Ondo
            </Link>
            <Link
              href="/calculators/"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Run the numbers
            </Link>
          </div>
          <LendingDisclaimer className="mx-auto mt-8 max-w-2xl" />
        </div>
      </section>
    </main>
  )
}
