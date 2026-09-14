import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import EventsClient from "./events-client"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UTAH_LANDLORD_EDUCATION_LINKS } from "@/lib/resources/utah-landlord-education"
import { BookOpen, Calculator, GraduationCap, Mail, Share2, Users } from "lucide-react"

export const metadata: Metadata = {
  title: pageTitle("ONDO Events | Ondo Real Estate"),
  description:
    "Upcoming ONDO events, homebuyer workshops, investor mixers, and community gatherings. RSVP and join us.",
  alternates: { canonical: `${SITE_URL}/events/` },
  openGraph: {
    title: pageTitleText("ONDO Events | Ondo Real Estate"),
    description:
      "Upcoming ONDO events, homebuyer workshops, investor mixers, and community gatherings.",
    url: `${SITE_URL}/events/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

const EVENT_TYPES = [
  {
    title: "Homebuyer workshops",
    body:
      "Plain-language sessions on pre-approval, loan types, closing costs, and what a Utah purchase timeline actually looks like. Bring questions about your own situation.",
  },
  {
    title: "Owner and landlord education",
    body:
      "Screening, leases, maintenance budgeting, and Utah landlord-tenant rules for people who own or manage rentals along the Wasatch Front.",
  },
  {
    title: "Investor meetups",
    body:
      "Informal conversations about rental analysis, financing structures, and how we evaluate deals. No pitch decks required.",
  },
  {
    title: "Community gatherings",
    body:
      "Open houses, client appreciation nights, and neighborhood events where you can meet the team in person.",
  },
]

const RHA_EVENT_RESOURCES = UTAH_LANDLORD_EDUCATION_LINKS.filter((r) =>
  ["https://www.rhautah.org/general-membership-meetings", "https://www.rhautah.org/events/education"].includes(r.href),
)

export default function EventsPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <PageBanner
        title="ONDO Events"
        subtitle="Workshops, mixers, and community events: come say hi."
      />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-lg text-foreground/80">
              Ondo hosts a small number of in-person and online events each year for buyers,
              owners, investors, and residents. Everything we run is free to attend unless the
              listing says otherwise, and none of it is a sales seminar.
            </p>
            <p className="text-foreground/70">
              Upcoming events with dates, locations, and RSVP links are published below as soon as
              they are confirmed. If nothing is listed yet, the fastest way to hear about the next
              one is the email list or our social channels.
            </p>
          </div>
        </div>
      </section>

      <EventsClient />

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-foreground">What we host</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {EVENT_TYPES.map((type) => (
                <Card key={type.title}>
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-foreground">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{type.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 dark:text-foreground">Hear about the next one</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg dark:text-foreground">
                    <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                    Email updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70">
                    Event announcements go out with our Utah market updates and owner tips.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/subscribe">Subscribe</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg dark:text-foreground">
                    <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
                    Social channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70">
                    We post event dates, recaps, and photos on our profiles.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/socials">Follow Ondo</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg dark:text-foreground">
                    <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                    Request a session
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70">
                    HOA, employer, or investor group? Ask us about a private workshop.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/contact">Contact us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 dark:text-foreground">Learn in the meantime</h2>
            <p className="text-foreground/70 mb-6">
              Most of what we cover at workshops is already written down.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg dark:text-foreground">
                    <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                    Ondo Academy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70">Free written training for buyers, owners, and investors.</p>
                  <Button asChild variant="ghost" className="px-0">
                    <Link href="/academy">Open the academy</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg dark:text-foreground">
                    <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                    Guides and blog
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70">Mortgage, landlord, and Utah market guides.</p>
                  <Button asChild variant="ghost" className="px-0">
                    <Link href="/blog">Read the blog</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg dark:text-foreground">
                    <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
                    Calculators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/70">Payment, affordability, cap rate, and rent-vs-own math.</p>
                  <Button asChild variant="ghost" className="px-0">
                    <Link href="/calculators">Run the numbers</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {RHA_EVENT_RESOURCES.length > 0 ? (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 dark:text-foreground">Other Utah landlord education</h2>
              <p className="text-foreground/70 mb-6">
                Industry groups run recurring education we point owners to. Confirm dates and
                membership requirements on their own calendars.
              </p>
              <ul className="space-y-4">
                {RHA_EVENT_RESOURCES.map((r) => (
                  <li key={r.href}>
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {r.title}
                    </a>
                    <p className="text-sm text-foreground/70">{r.description}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/resources">More owner resources</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
