import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { TopicHubGrid } from "@/components/content/topic-hub"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/learn", {
  title: "Mortgage Learning Hub | Ondo Real Estate",
  description:
    "Utah mortgage education by topic: first-time buyers, loan programs, variable income, refinance, VA, FHA, credit, and calculators. Informational, not a credit decision.",
})

export default function LearnHubPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Mortgage Learning Hub"
        description="Utah mortgage education by topic: first-time buyers, loan programs, variable income, refinance, and calculators."
        pathname="/learn"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Learn", url: `${SITE_URL}/learn` },
        ])}
      />
      <PageBanner
        title="Mortgage learning hub"
        subtitle="Answer the borrower question first. Then pick a program, a calculator, or a conversation."
        backgroundImage="/modern-office-building.png"
      />
      <section className="bg-background py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <BreadcrumbNav items={[{ label: "Learn" }]} />
          <p className="mb-8 mt-4 max-w-3xl text-lg text-foreground/70">
            This hub is for people who need a clear map, not another rate headline. Ondo originates mortgages in
            licensed states. Pages here are education. They are not approval, a lock, or advice for your file.
          </p>
          <p className="mb-10 text-sm text-foreground/70">
            Start with{" "}
            <Link href="/learn/variable-income" className="text-primary underline-offset-4 hover:underline">
              variable income
            </Link>
            ,{" "}
            <Link href="/learn/first-time" className="text-primary underline-offset-4 hover:underline">
              first-time cash and closing
            </Link>
            ,{" "}
            <Link href="/learn/non-qm" className="text-primary underline-offset-4 hover:underline">
              Non-QM / bank-statement / DSCR
            </Link>
            ,{" "}
            <Link href="/learn/investment" className="text-primary underline-offset-4 hover:underline">
              investment occupancy and DSCR
            </Link>
            ,{" "}
            <Link href="/blog/how-long-first-purchase-takes" className="text-primary underline-offset-4 hover:underline">
              how long a first purchase takes
            </Link>
            ,{" "}
            <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis" className="text-primary underline-offset-4 hover:underline">
              Utah tax calendar vs first escrow analysis
            </Link>
            , the{" "}
            <Link href="/loans" className="text-primary underline-offset-4 hover:underline">
              loan program hub
            </Link>
            , or{" "}
            <Link href="/buy/rates" className="text-primary underline-offset-4 hover:underline">
              how quotes differ from headline rates
            </Link>
            .
          </p>
          <TopicHubGrid />
          <RelatedContent path="/learn" title="Highest-traffic next steps" />
          <NextStepCta
            path="/learn"
            heading="If you already know the question"
            body="Bring documents and a target payment. We will tell you what we can and cannot see from a conversation."
          />
          <LendingDisclaimer className="mt-8" />
        </div>
      </section>
    </main>
  )
}
