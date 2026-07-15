import Link from "next/link"

import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { NotaryBooking } from "@/components/notary-booking"
import type { NotaryCityRecord } from "@/lib/notary-cities"
import { notaryCityPath, notaryStatePath } from "@/lib/notary-cities"
import type { RonStateRecord } from "@/lib/notary-ron-states"
import {
  buildCityRonFaqs,
  buildCityRonIntro,
  receivingPartyCaveat,
} from "@/lib/notary-location-copy"
import { SITE_EMAILS } from "@/lib/site"

type Props = {
  city: NotaryCityRecord
  state: RonStateRecord
  nearby: NotaryCityRecord[]
}

export function NotaryCityPage({ city, state, nearby }: Props) {
  const intro = buildCityRonIntro(city, state)
  const faqs = buildCityRonFaqs(city, state)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BreadcrumbNav
          items={[
            { label: "Notary", href: "/notary/" },
            { label: state.name, href: notaryStatePath(state.slug) },
            { label: city.name },
          ]}
        />

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Remote online notary in {city.name}, {state.code}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{intro}</p>
        </header>

        <section className="mb-12" aria-labelledby="how-session">
          <h2 id="how-session" className="text-2xl font-semibold mb-4">
            How a RON session works
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Schedule online or contact {SITE_EMAILS.notary}.</li>
            <li>Join from {city.name} (or anywhere) on a supported device.</li>
            <li>Complete ID check, review documents, and finish e-notarization.</li>
          </ol>
        </section>

        <section className="mb-12" aria-labelledby="who-for">
          <h2 id="who-for" className="text-2xl font-semibold mb-4">
            Who it is for
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Real estate buyers, sellers, and agents closing remotely</li>
            <li>Loan signings and refinance packages</li>
            <li>Estate planning, powers of attorney, and affidavits</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            {state.statusNote ?? receivingPartyCaveat()}
          </p>
        </section>

        {nearby.length > 0 ? (
          <section className="mb-12" aria-labelledby="nearby">
            <h2 id="nearby" className="text-2xl font-semibold mb-4">
              Nearby cities
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={notaryCityPath(state.slug, n.slug)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-12" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold mb-4">
            {city.name} FAQ
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-medium">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-16">
          <NotaryBooking />
        </section>
      </div>
    </main>
  )
}
