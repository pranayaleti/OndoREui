// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import { QrRedirect } from "@/app/go/[placement]/qr-redirect"
import { neighborhoodsByCity } from "@/lib/neighborhood-content"
import { SITE_URL, pageTitle } from "@/lib/site"
import { toCitySlug } from "@/lib/utah-cities"

/**
 * /neighborhoods/<city>/ has no page of its own: neighborhoods live one level down, at
 * /neighborhoods/<city>/<neighborhood>/. Trimming a neighborhood URL used to 404, so each city
 * redirects to its section of the /neighborhoods/ hub (same data and slugs as the hub, so a
 * new city is covered automatically). Meta refresh plus a client-side replace, like /go/.
 */
export const dynamicParams = false

export function generateStaticParams(): { city: string }[] {
  return Object.entries(neighborhoodsByCity)
    .filter(([, neighborhoods]) => neighborhoods.length > 0)
    .map(([city]) => ({ city: toCitySlug(city) }))
}

export const metadata: Metadata = {
  title: pageTitle("Utah Neighborhood Guides"),
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/neighborhoods/` },
}

export default async function NeighborhoodCityRedirect({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const target = `/neighborhoods/#hoods-${city}`
  return (
    <main className="grid min-h-[50vh] place-items-center px-6 text-center">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <QrRedirect to={target} />
      <p className="text-muted-foreground">
        Opening the{" "}
        <a href={target} className="font-medium text-primary underline underline-offset-4">
          neighborhood guide
        </a>
        …
      </p>
    </main>
  )
}
