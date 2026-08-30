import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ContentFaq } from "@/components/content/content-faq"
import { ComparisonTable } from "@/components/content/comparison-table"
import { Button } from "@/components/ui/button"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { LENDING_FACTS_AS_OF, QUALIFY_CONVERSATION } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import QualifyTokenChat from "./page-client"

const faqs = [
  {
    question: "Does filling this out or talking with a loan officer mean I am approved?",
    answer: QUALIFY_CONVERSATION.notPromised,
  },
  {
    question: "What will I be asked?",
    answer: QUALIFY_CONVERSATION.asked,
  },
  {
    question: "Do I need a complete document stack before the first conversation?",
    answer: QUALIFY_CONVERSATION.notNeededFirstCall,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "asked", heading: "What you will be asked" },
  { id: "not", heading: "What you will not be promised" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "scope",
    criterion: "First conversation",
    cells: {
      asked: QUALIFY_CONVERSATION.asked,
      not: QUALIFY_CONVERSATION.notPromised,
    },
  },
  {
    id: "later",
    criterion: "If a file is opened",
    cells: {
      asked: "Credit authorization when you are ready, then the document stack for your income type. A letter, if issued, is still a snapshot.",
      not: "A lock, APR, or clear-to-close from this page. Pre-approval is not a commitment to lend.",
    },
  },
]

export const metadata: Metadata = pageCanonicalMetadata("/qualify", {
  title: "Start a Mortgage Conversation | What You Will Be Asked | Ondo Real Estate",
  description:
    "What a first mortgage conversation asks, and what it will not promise. Not an approval, a lock, or a credit decision.",
})

export default function QualifyPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Start a mortgage conversation: what you will be asked"
        description="Occupancy, income type, debts, and assets. A conversation is not approval, a lock, or a quote."
        pathname="/qualify"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Qualify", url: `${SITE_URL}/qualify` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Start a mortgage conversation"
        subtitle="Here is what we will ask — and what a conversation will not promise."
        backgroundImage="/modern-office-building.png"
      />
      <Suspense fallback={null}>
        <QualifyTokenChat />
      </Suspense>
      <section className="bg-background py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <BreadcrumbNav items={[{ label: "Qualify" }]} />
          <div className="prose prose-lg prose-invert mt-6 max-w-none">
            <p className="lead text-xl text-foreground/70">
              A first conversation is how we learn occupancy, how you are paid, what you owe, and what cash you can
              document. It is not an instant approval, a rate lock, or a commitment to lend. Snapshot as of{" "}
              {LENDING_FACTS_AS_OF}.
            </p>
            <ComparisonTable
              caption={`What a mortgage conversation is for as of ${LENDING_FACTS_AS_OF}.`}
              columns={columns}
              rows={rows}
              footnote="Fair Housing: questions are about the file (income, debts, occupancy, property), not about protected class."
            />
            <h2>Bring this, not a peak month</h2>
            <ul>
              <li>Occupancy: primary, second home, or investment.</li>
              <li>Income type: W-2, 1099, K-1, mixed, or a bank-statement conversation.</li>
              <li>Debts you know about — including a car you might finance next week.</li>
              <li>Whether gift funds or assistance are part of cash to close.</li>
            </ul>
            <p>{QUALIFY_CONVERSATION.notNeededFirstCall}</p>
            <p>
              Crawlable detail:{" "}
              <Link href="/blog/what-a-mortgage-conversation-asks">
                what a mortgage conversation asks
              </Link>
              . After a letter, the stages are{" "}
              <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs clear to close</Link>.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">Talk with a loan officer</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/faq/loans-faqs">Loan FAQs</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/calculators/affordability">Affordability illustration</Link>
            </Button>
          </div>
          <ContentFaq items={faqs} />
          <RelatedContent path="/qualify" title="Before you apply" />
          <NextStepCta
            path="/qualify"
            heading="A message is not an application"
            body="Send a note or book a call. We will tell you what we can see from a conversation and what still has to be documented."
          />
          <LendingDisclaimer className="mt-8" />
        </div>
      </section>
    </main>
  )
}
