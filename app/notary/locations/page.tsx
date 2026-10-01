import Link from "next/link"
import type { Metadata } from "next"

import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import SEO from "@/components/seo"
import { getServedRonStates } from "@/lib/notary-ron-states"
import { getNotaryCitiesByStateSlug, notaryStatePath } from "@/lib/notary-cities"
import { buildPageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"

const TITLE = "Notary Locations by State"
// The branded text for the Open Graph card; the document title below is absolute so the layout adds no second brand.
const CARD_TITLE = pageTitleText(TITLE)

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: CARD_TITLE,
    description:
      "Browse remote online notary state hubs across all 50 U.S. states and Washington, D.C. Find curated city RON pages and book a secure session.",
    pathname: "/notary/locations/",
  }),
  title: pageTitle(TITLE),
}

export default function NotaryLocationsPage() {
  const states = getServedRonStates()
  const base = SITE_URL.replace(/\/$/, "")

  return (
    <>
      <SEO
        title={TITLE}
        description="Browse remote online notary state hubs across all 50 U.S. states and Washington, D.C."
        pathname="/notary/locations/"
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: base },
          { name: "Notary", url: `${base}/notary/` },
          { name: "Locations", url: `${base}/notary/locations/` },
        ])}
      />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <BreadcrumbNav
            items={[
              { label: "Notary", href: "/notary/" },
              { label: "Locations" },
            ]}
          />
          <h1 className="mt-6 text-4xl font-bold tracking-tight">Notary locations</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Remote online notarization for clients nationwide. Choose a state hub to see curated
            city pages and book a session.
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {states.map((state) => {
              const count = getNotaryCitiesByStateSlug(state.slug).length
              return (
                <li key={state.slug}>
                  <Link
                    href={notaryStatePath(state.slug)}
                    className="text-primary underline underline-offset-4 hover:no-underline"
                  >
                    {state.name}
                  </Link>
                  <span className="text-muted-foreground text-sm"> · {count} {count === 1 ? "city" : "cities"}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  )
}
