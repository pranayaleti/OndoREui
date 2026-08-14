import Link from "next/link"
import { SITE_EMAILS, SITE_PHONE, SITE_URL } from "@/lib/site"

/**
 * Server-rendered summary for `/properties/`. The interactive search + map + filter
 * on the page load client-side via `dynamic(..., { ssr: false })`. Without this
 * block, agents fetching the HTML shell (including Cloudflare's `Accept: text/markdown`
 * conversion) would see spinners rather than content.
 *
 * The visual treatment stays soft so it renders as a preamble for humans too.
 */
export function PropertiesAgentIntro() {
  return (
    <section
      className="border-b border-border/40 bg-background/60 py-8"
      aria-labelledby="properties-agent-intro"
      data-agent-intro="properties"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <h1 id="properties-agent-intro" className="text-2xl font-semibold text-foreground">
          Utah rental property search
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse Ondo Real Estate&apos;s current Utah rentals along the Wasatch Front. The results below load a
          client-side search, filter, and map — this summary keeps the essentials available for AI agents and no-JS
          visitors.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Filter by</h2>
            <ul className="mt-2 space-y-1 text-sm text-foreground/90">
              <li>City (partial, case-insensitive — e.g. Lehi, Salt Lake)</li>
              <li>Minimum bedrooms</li>
              <li>Maximum monthly rent (USD)</li>
              <li>Free text against title, description, and address</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Each listing returns</h2>
            <ul className="mt-2 space-y-1 text-sm text-foreground/90">
              <li>id, title, city, address</li>
              <li>Monthly price, bedrooms, bathrooms, sqft</li>
              <li>Short description (up to 200 characters)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-border/40 bg-muted/30 p-4 text-sm text-foreground/90">
          <p className="font-medium">For AI agents</p>
          <p className="mt-1 text-muted-foreground">
            This page registers the WebMCP tool <code className="rounded bg-background px-1 py-0.5 font-mono">search_available_properties</code>
            {" "}(read-only, capped at 100 results). A Markdown twin lives at{" "}
            <Link
              href={`${SITE_URL}/properties.md`}
              className="underline hover:text-foreground"
              rel="alternate"
              type="text/markdown"
            >
              /properties.md
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Ready to apply or tour? Applications are invitation-based — email{" "}
          <a href={`mailto:${SITE_EMAILS.info}`} className="underline hover:text-foreground">
            {SITE_EMAILS.info}
          </a>{" "}
          or call{" "}
          <a href={`tel:${SITE_PHONE.replace(/\D/g, "")}`} className="underline hover:text-foreground">
            {SITE_PHONE}
          </a>
          . Real estate services provided by Ondo Real Estate. Equal Housing Opportunity.
        </p>
      </div>
    </section>
  )
}
