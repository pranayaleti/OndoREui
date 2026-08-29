import type { Metadata } from "next"
import Link from "next/link"
import { Clapperboard, LineChart, MapPin, MessageCircleQuestion, HelpCircle, Video } from "lucide-react"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { APP_PORTAL_LOGIN_URL, APP_PORTAL_URL, SITE_URL } from "@/lib/site"
import { CONTENT_TYPES, contentStudioPortalPath, type ContentType } from "@/lib/api/content-generation"

export const metadata: Metadata = {
  title: "Content studio | Ondo Real Estate",
  description:
    "Draft listing video scripts, local content ideas, buyer Q&A, and market commentary from the Ondo portal. Scripts only — disclosures are appended after generation.",
  robots: { index: false },
}

const TYPE_COPY: Record<ContentType, { title: string; body: string; icon: typeof Video }> = {
  listing_video_script: {
    title: "Listing video script",
    body: "A 45-second spoken tour of the home. Words to read on camera — we do not render video.",
    icon: Video,
  },
  local_content_ideas: {
    title: "Local content ideas",
    body: "Evergreen topic lists by category. Pick a topic in the portal to turn it into a script. Amenities and places, never who should live there.",
    icon: MapPin,
  },
  topic_to_script: {
    title: "Topic to YouTube script",
    body: "A friendly local script that is not a sales pitch. End by asking viewers their favorite spot.",
    icon: Clapperboard,
  },
  buyer_questions: {
    title: "Buyer questions",
    body: "Practical questions a first-time buyer would ask before a showing. Questions only — no loan advice.",
    icon: HelpCircle,
  },
  buyer_question_video: {
    title: "Answer a buyer question",
    body: "A 45-second educational reply. Factors that affect prices, not financial advice or guarantees.",
    icon: MessageCircleQuestion,
  },
  market_commentary: {
    title: "Market commentary",
    body: "General buyer or seller update. Live MLS/rate stats are not attached yet — educational context only. Required disclosures are appended by the server.",
    icon: LineChart,
  },
}

export default function ContentStudioPage() {
  const managerHref = `${APP_PORTAL_URL}${contentStudioPortalPath("manager")}`
  const ownerHref = `${APP_PORTAL_URL}${contentStudioPortalPath("owner")}`

  return (
    <main className="min-h-screen">
      <SEO
        title="Content studio | Ondo Real Estate"
        description="Draft listing scripts and local content from the invitation-only Ondo portal."
        pathname="/tools/content-studio"
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Content studio", url: `${SITE_URL}/tools/content-studio` },
        ])}
      />
      <PageBanner
        title="Content studio"
        subtitle="Scripts for listings, local guides, and buyer education — generated in the portal"
      />
      <section className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        <p className="text-muted-foreground max-w-3xl">
          Managers and owners draft listing video scripts, local content ideas, YouTube scripts,
          buyer questions, and market commentary from the invitation-only portal. Select a listing,
          generate ideas or questions, then pick one to turn into a ~45-second script. City and
          listing details come from your properties — never invented sample cities or prices. This
          page does not generate copy for the public. Market commentary is general information, not
          financial advice; Ondo does not currently attach a live MLS or rate feed, so current
          figures must be verified. Disclosures are appended after generation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={managerHref}>Open manager studio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ownerHref}>Open owner studio</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={APP_PORTAL_LOGIN_URL}>Portal sign in</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONTENT_TYPES.map((id) => {
            const copy = TYPE_COPY[id]
            const Icon = copy.icon
            return (
              <Card key={id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5 text-primary" aria-hidden />
                    {copy.title}
                  </CardTitle>
                  <CardDescription>{copy.body}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground font-mono">{id}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
