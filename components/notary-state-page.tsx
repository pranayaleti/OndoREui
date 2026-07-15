import Link from "next/link"

import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { NotaryBooking } from "@/components/notary-booking"
import { Button } from "@/components/ui/button"
import type { NotaryCityRecord } from "@/lib/notary-cities"
import { notaryCityPath } from "@/lib/notary-cities"
import type { RonStateRecord } from "@/lib/notary-ron-states"
import { buildStateRonFaqs, receivingPartyCaveat } from "@/lib/notary-location-copy"
import { SITE_EMAILS } from "@/lib/site"

type Props = {
  state: RonStateRecord
  cities: NotaryCityRecord[]
}

export function NotaryStatePage({ state, cities }: Props) {
  const faqs = buildStateRonFaqs(state)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BreadcrumbNav
          items={[
            { label: "Notary", href: "/notary/" },
            { label: "Locations", href: "/notary/locations/" },
            { label: state.name },
          ]}
        />

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Remote online notary for {state.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Secure Remote Online Notarization (RON) for clients in {state.name}. Identity-verified
            video sessions for real estate, loan signings, and estate documents.
          </p>
          {state.statusNote ? (
            <p className="mt-3 text-sm text-muted-foreground max-w-3xl">{state.statusNote}</p>
          ) : null}
        </header>

        <section className="mb-12" aria-labelledby="how-ron-works">
          <h2 id="how-ron-works" className="text-2xl font-semibold mb-4">
            How RON works
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Book a session online or email {SITE_EMAILS.notary}.</li>
            <li>Join a secure video call and complete identity verification.</li>
            <li>Review and e-sign while our notary completes the notarization.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">{receivingPartyCaveat()}</p>
        </section>

        <section className="mb-12" aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="text-2xl font-semibold mb-4">
            Cities we highlight in {state.name}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={notaryCityPath(state.slug, city.slug)}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Remote online notary in {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {state.code === "UT" ? (
          <section className="mb-12" aria-labelledby="utah-mobile">
            <h2 id="utah-mobile" className="text-2xl font-semibold mb-4">
              Mobile and in-office in Utah
            </h2>
            <p className="text-muted-foreground">
              Along the Wasatch Front we also offer mobile and in-office notary. RON remains available
              for clients anywhere in Utah and nationwide.
            </p>
          </section>
        ) : null}

        <section className="mb-12" aria-labelledby="related">
          <h2 id="related" className="text-2xl font-semibold mb-4">
            Related
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <Link href="/notary/">Notary home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/notary/on-demand/">On-demand notary</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/notary/locations/">All states</Link>
            </Button>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-4">
            {state.name} notary FAQ
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-medium text-foreground">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-16" aria-labelledby="book-heading">
          <h2 id="book-heading" className="sr-only">
            Book
          </h2>
          <NotaryBooking />
        </section>
      </div>
    </main>
  )
}
