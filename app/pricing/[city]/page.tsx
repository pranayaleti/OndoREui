import type { Metadata } from "next"
import { QrRedirect } from "@/app/go/[placement]/qr-redirect"
import { findCityBySlug, allCitySlugs } from "@/lib/utah-cities"
import { SITE_URL, pageTitle } from "@/lib/site"

/**
 * /pricing/<city>/ used to be a "Cost of Real Estate Services" page that mixed management
 * fees, buying costs, mortgage estimates and rent data, each of which already has a page of
 * its own. It split "<city> property management fees" with /property-management/<city>/,
 * so the fee schedule moved there (#fees) and this route redirects. Meta refresh plus a
 * client-side replace, like /neighborhoods/<city>/; noindex and out of the sitemap.
 */
export const dynamicParams = false

type Params = Promise<{ city: string }>

export function generateStaticParams(): { city: string }[] {
  return allCitySlugs.map((city) => ({ city }))
}

function pricingRedirectTarget(citySlug: string): string {
  return `/property-management/${citySlug}/#fees`
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug } = await params
  const cityName = findCityBySlug(citySlug)?.name ?? citySlug
  return {
    title: pageTitle(`${cityName} Property Management Fees`),
    robots: { index: false, follow: true },
    alternates: { canonical: `${SITE_URL}/property-management/${citySlug}/` },
  }
}

export default async function PricingCityRedirect({ params }: { params: Params }) {
  const { city: citySlug } = await params
  const target = pricingRedirectTarget(citySlug)
  return (
    <main className="grid min-h-[50vh] place-items-center px-6 text-center">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <QrRedirect to={target} />
      <p className="text-muted-foreground">
        Opening{" "}
        <a href={target} className="font-medium text-primary underline underline-offset-4">
          property management fees
        </a>
        …
      </p>
    </main>
  )
}
