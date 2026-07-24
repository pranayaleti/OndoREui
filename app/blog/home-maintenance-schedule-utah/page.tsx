import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/home-maintenance-schedule-utah"
const title = "Home Maintenance Schedule for Utah Homeowners"
const description = "A monthly and annual home-care checklist — filters, HVAC, gutters, winterizing — and how ONDO auto-reminds you."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "home maintenance schedule",
  "air filter replacement",
  "HVAC service",
  "winterize sprinklers Utah",
  "Utah home care",
  "maintenance reminders",
]

import type { Metadata } from "next"

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
  },
}

export default function HomeMaintenanceScheduleUtah() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Home Care"
        tags={["Maintenance", "Home Care", "Seasonal"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Small, scheduled tasks that protect a big investment."
        backgroundImage="/modern-townhouse-garage.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Home Care</Badge>
            <Badge variant="outline">Maintenance</Badge>
            <Badge variant="outline">Seasonal</Badge>
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
              Deferred maintenance is the most expensive kind. A simple, repeating checklist keeps
              systems efficient, prevents emergency repairs, and preserves your home’s value — and if
              you’re an ONDO owner, we track most of it for you automatically.
            </p>

            <h2>Monthly &amp; Quarterly</h2>
            <ul>
              <li><strong>Air filters (every ~90 days):</strong> replace HVAC filters — the single cheapest way to protect the system and cut energy bills.</li>
              <li><strong>Garage door (every ~6 months):</strong> lubricate rollers, hinges, and springs so the door runs quiet and lasts. (Yes — the “garage oil” job.)</li>
              <li><strong>Smoke &amp; CO detectors:</strong> test monthly; swap batteries on a schedule.</li>
              <li><strong>Quick walk:</strong> check for minor leaks under sinks, running toilets, and GFCI outlets.</li>
            </ul>

            <h2>Annual</h2>
            <ul>
              <li><strong>HVAC service:</strong> professional inspection and duct/unit cleanup before the heating and cooling seasons.</li>
              <li><strong>Water heater flush:</strong> drain sediment to extend life and hold efficiency.</li>
              <li><strong>Gutters &amp; downspouts:</strong> clear debris so meltwater drains away from the foundation.</li>
              <li><strong>Dryer vent:</strong> clean the exhaust run — efficiency plus a real fire-risk reduction.</li>
              <li><strong>Refrigerator coils:</strong> vacuum condenser coils so the compressor isn’t overworked.</li>
            </ul>

            <h2>Seasonal — the Utah lens</h2>
            <ul>
              <li><strong>Before first freeze:</strong> blow out sprinkler lines and winterize the lawn to avoid burst pipes.</li>
              <li><strong>Freeze-thaw:</strong> inspect roof, flashing, and concrete each spring — Utah’s cycles are hard on them.</li>
              <li><strong>Inversion season:</strong> fresh filters and a serviced HVAC help indoor air quality when the valley traps smog.</li>
            </ul>

            <h2>Let ONDO remind you</h2>
            <p>
              You don’t have to keep this calendar in your head. ONDO’s home-care reminders track the
              recurring tasks above — air filters (90 days), HVAC service (annual), garage-door lube,
              gutters, water-heater flush, dryer vent, smoke/CO batteries, and sprinkler winterizing —
              and surface each one when it’s due, tuned to your property type.
            </p>

            <div className="not-prose my-8">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/owner">See your home-care reminders →</Link>
              </Button>
            </div>

            <h2>Takeaway</h2>
            <p>
              Maintenance is asset preservation, not a chore list. Automate the cadence, act on the
              small stuff early, and you’ll avoid the big repairs. For the investor’s view on reserves
              and lifecycle planning, see our{" "}
              <Link href="/blog/maintenance-capex-strategy">Maintenance and CapEx Strategy</Link> guide.
            </p>
          </div>
        </div>
      </article>
    </main>
  )
}
