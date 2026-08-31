import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/backyard-upgrades-and-fertilizer-guide"
const title = "Backyard Upgrades & Lawn Care: A Seasonal Fertilizer Guide"
const description = "Value-adding backyard projects plus a simple seasonal fertilizer schedule and the common DIY fixes that keep a yard healthy."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "backyard upgrades",
  "lawn fertilizer schedule",
  "when to fertilize lawn",
  "NPK fertilizer",
  "curb appeal projects",
  "sprinkler repair",
]

import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo Real Estate`,
    description: description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified || published,
    authors: [author],
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default function BackyardUpgradesAndFertilizerGuide() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Home Improvement"
        tags={["Home Improvement", "Landscaping", "Curb Appeal"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Curb appeal and a healthy lawn: on a schedule you can keep."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Home Improvement</Badge>
            <Badge variant="outline">Landscaping</Badge>
            <Badge variant="outline">Curb Appeal</Badge>
          </div>

          <div className="not-prose mb-6">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              The backyard is where lifestyle value and curb appeal meet. A few well-chosen upgrades
              and a consistent lawn routine do more for enjoyment, and first impressions, than almost
              any interior project of the same cost.
            </p>

            <h2>Upgrades that pay off</h2>
            <ul>
              <li><strong>Patio or deck:</strong> defined outdoor living space is the highest-impact addition for both use and resale.</li>
              <li><strong>Low-water landscaping:</strong> native and drought-tolerant beds with drip irrigation cut water bills, especially in dry climates.</li>
              <li><strong>Lighting &amp; fencing:</strong> path lighting and clean fence lines make a yard feel finished and private.</li>
              <li><strong>Shade trees:</strong> the long game, they lower cooling costs and add mature-landscape value.</li>
            </ul>

            <h2>The fertilizer schedule</h2>
            <p>
              Fertilizer bags list three numbers, <strong>N-P-K</strong> (nitrogen for green growth,
              phosphorus for roots, potassium for stress tolerance). Timing depends on your grass type,
              so first find out whether you have cool-season or warm-season grass:
            </p>
            <ul>
              <li><strong>Cool-season grasses (fescue, ryegrass, bluegrass, northern U.S.):</strong> light spring feed, then the most important feeding in fall to build roots. Skip feeding during mid-summer heat.</li>
              <li><strong>Warm-season grasses (Bermuda, zoysia, St. Augustine, southern U.S.):</strong> feed through late spring and summer when they actively grow; taper off before dormancy.</li>
              <li><strong>Don’t over-apply nitrogen:</strong> too much causes weak, disease-prone growth, follow the bag rate for your lawn size.</li>
              <li><strong>Water it in:</strong> irrigate after granular feeds and never fertilize a heat-stressed lawn, water deeply instead.</li>
            </ul>

            <h2>Common DIY fixes</h2>
            <ul>
              <li><strong>Sprinkler heads:</strong> replace broken heads and adjust arcs so you water lawn, not sidewalk.</li>
              <li><strong>Bare spots:</strong> rake, seed, topdress, and keep moist until established.</li>
              <li><strong>Drainage:</strong> re-grade low spots away from the foundation to avoid pooling.</li>
              <li><strong>Weeds:</strong> a pre-emergent in early spring prevents far more work later.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>
              Pick one or two upgrades that fit how you use the yard, then keep the lawn on a simple
              seasonal cadence, feed in fall, water deeply, fix small issues early. Planning an indoor
              project too? See our{" "}
              <Link href="/blog/finishing-basement-roi">basement finishing guide</Link> and the{" "}
              <Link href="/blog/home-maintenance-schedule">home maintenance schedule</Link>.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
