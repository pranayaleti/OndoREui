// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { HomebuyerQuiz } from "@/components/homebuyer-quiz"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"

const title = "How Much Home Can You Afford in Utah? 60-Second Quiz"
const description =
  "Eight quick questions about income, debts, savings and credit, and you see a price range right away. No email required."
const canonical = `${SITE_URL}/buy/quiz/`

export const metadata: Metadata = {
  title: pageTitle(title),
  description,
  alternates: { canonical },
  openGraph: { title: pageTitleText(title), description, url: canonical, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: pageTitleText(title), description, images: [DEFAULT_OG_IMAGE_URL] },
}

export default function HomebuyerQuizPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <SEO
        title={pageTitleText(title)}
        description={description}
        pathname="/buy/quiz"
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Buy", url: `${SITE_URL}/buy` },
          { name: "Homebuyer quiz", url: `${SITE_URL}/buy/quiz` },
        ])}
      />
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-10 max-w-xl">
          <h1 className="font-outfit text-3xl font-bold tracking-tight md:text-4xl">See what you can afford</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Eight quick questions. You&apos;ll see a price range right away, no email required.
          </p>
        </header>
        <HomebuyerQuiz />
      </div>
    </main>
  )
}
