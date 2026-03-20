import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/home-staging-tips-that-work"
const title = "Home Staging Tips That Actually Work"
const description = "Professional staging tips to help your home sell faster and for more money."
const published = "2024-11-15"
const modified = "2024-11-15"
const author = "Lisa Park"
const category = "Selling"
const image = "/modern-apartment-balcony.png"
const keywords = ["home staging tips", "sell home faster Utah", "staging ROI", "curb appeal Utah", "listing preparation"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description: description, type: "article", publishedTime: published, modifiedTime: modified || published, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description: description },
}

export default function HomeStagingTipsThatWork() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="The moves that actually move buyers — from curb to close." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Staged homes sell faster and typically for more money. These are the moves that actually matter — from decluttering and lighting to the small details buyers notice on first walk-through.
            </p>

            <h2>Start Outside: Curb Appeal Sets First Impressions</h2>
            <p>Buyers form an opinion within 8 seconds of pulling up. In Utah, the exterior work that pays most reliably is:</p>
            <ul>
              <li><strong>Fresh paint on the front door and shutters</strong> — $100–300, consistently cited as top ROI improvement</li>
              <li><strong>Clean, edged lawn and trimmed shrubs</strong> — dried-out or overgrown landscaping is the #1 visual negative</li>
              <li><strong>Power-wash the driveway and walkway</strong> — Utah's red rock dust and inversion grime builds up fast</li>
              <li><strong>Replace or clean outdoor light fixtures</strong> — buyers tour in evenings; light fixtures signal maintenance habits</li>
            </ul>

            <h2>Declutter Ruthlessly Before Photos</h2>
            <p>Listing photos are your first showing — most buyers filter before ever scheduling a visit. The goal is to make every room look larger and allow buyers to mentally place their own furniture. Remove 30–40% of belongings: pack personal photos, excess furniture, countertop appliances, and anything that signals the home is lived-in rather than move-in ready. Rent a storage unit for 4–6 weeks if needed.</p>
            <p>Room-specific priorities:</p>
            <ul>
              <li><strong>Kitchen:</strong> Clear all countertops except one decorative item. Deep clean appliances inside and out.</li>
              <li><strong>Primary bedroom:</strong> Hotel-style bedding, minimal nightstand items, no laundry visible.</li>
              <li><strong>Bathrooms:</strong> Remove all personal care products. Add matching white towels and a new shower curtain.</li>
              <li><strong>Garage:</strong> Buyers tour it; organise and sweep. A messy garage reads as "no storage."</li>
            </ul>

            <h2>Light Is the Single Biggest Lever Inside</h2>
            <p>Dark rooms feel smaller and less inviting. Before every showing: open all blinds, turn on every light in the house including closets and range hoods. Replace any burned-out bulbs with matching colour temperature (2700–3000K for warm, inviting light). Add a floor lamp or table lamp to any room that feels dark even with overhead lighting. Professional photos should be taken with all lights on and on an overcast or early morning shoot for even natural light.</p>

            <h2>Neutral, Clean, and Smell-Neutral</h2>
            <p>Buyers who are sensitive to odours (pets, cooking, must) will walk out and not come back. A professional carpet cleaning, fresh air for 24–48 hours, and a light neutral scent (clean linen, not heavy fragrance) resets the olfactory experience. Repaint any rooms with bold colours in a soft neutral — Benjamin Moore Accessible Beige, Sherwin-Williams Agreeable Gray, or similar. Buyers pay a premium to not repaint.</p>

            <h2>The Walk-Through Test</h2>
            <p>Walk every room as a buyer would: stand in the doorway and evaluate the first 3 seconds. Check: does it feel open? Is the focal point (fireplace, view, built-in) highlighted? Is the furniture arrangement making the room feel smaller? A common staging move is to pull furniture 6–12 inches away from walls — counterintuitively, this makes rooms feel larger. Remove extra chairs and side tables that create traffic flow obstacles.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/sell">List With Ondo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Request a Listing Consult</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
