import type { Metadata } from "next"
import Link from "next/link"
import { Clock, CheckCircle, Video, MapPin, Mail, Phone } from "lucide-react"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { NotaryBooking } from "@/components/notary-booking"
import { CalendlyInlineEmbed } from "@/components/contact/calendly-inline-embed"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, SITE_EMAILS } from "@/lib/site"

export const metadata: Metadata = {
  title: "On-Demand Notary — Same-Day When We Can | ONDO Notary",
  description:
    "On-demand notarization from ONDO Notary. We try to accommodate same-day appointments when capacity allows — RON nationwide and mobile notary in Utah.",
  alternates: { canonical: `${SITE_URL}/notary/on-demand/` },
  openGraph: {
    title: "On-Demand Notary — Same-Day When We Can | ONDO Notary",
    description:
      "Need a notarization today? We try to accommodate same-day when capacity allows. Remote online (RON) nationwide; mobile in Utah.",
    url: `${SITE_URL}/notary/on-demand/`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: "ONDO Notary — on-demand and same-day when we can",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "On-Demand Notary — Same-Day When We Can",
    description: "Best-effort same-day notarization. RON nationwide; mobile in Utah.",
    images: [`${SITE_URL}/modern-office-building.webp`],
  },
}

export default function OnDemandNotaryPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="On-Demand Notary — Same-Day When We Can | ONDO Notary"
        description="On-demand notarization from ONDO Notary. We try to accommodate same-day appointments when capacity allows — RON nationwide and mobile notary in Utah."
        pathname="/notary/on-demand"
        image={`${SITE_URL}/modern-office-building.webp`}
        keywords={[
          "on demand notary",
          "same day notary",
          "same day notary Utah",
          "urgent notary",
          "remote online notary",
          "mobile notary Utah",
        ]}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Notary", url: `${SITE_URL}/notary` },
            { name: "On-demand", url: `${SITE_URL}/notary/on-demand` },
          ]),
          generateServiceJsonLd({
            name: "On-Demand Notary",
            description:
              "On-demand notarization with best-effort same-day scheduling when capacity allows. Remote Online Notarization nationwide; mobile notary in Utah.",
            serviceType: "NotaryPublic",
            areaServed: "United States",
            offers: {
              description: "Same-day when capacity allows — not a guaranteed SLA.",
            },
          }),
        ]}
      />

      <PageBanner
        title="On-Demand Notary"
        subtitle="We'll try to accommodate same-day when capacity allows"
        backgroundImage="/modern-office-building.webp"
      />

      {/* Hero support */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-lg text-foreground/80 leading-relaxed">
            When you need a notarization quickly — loan packages, POA, affidavits, or closing docs —
            ONDO Notary offers on-demand scheduling. We work to fit same-day requests whenever our
            calendar allows.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link href="#book">Request a slot</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/notary">All notary services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">How it works</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Request",
                body: "Tell us what you need notarized and when you need it — online booking, email, or phone.",
              },
              {
                step: "2",
                title: "Confirm availability",
                body: "We check capacity and confirm a slot. Same-day depends on volume and document type.",
              },
              {
                step: "3",
                title: "RON or mobile",
                body: "Complete via remote online notarization nationwide, or mobile/in-office in our Utah area.",
              },
            ].map((item) => (
              <li key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Same-day expectations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-2 text-primary mb-4 justify-center">
            <Clock className="h-5 w-5" />
            <h2 className="text-3xl font-bold text-foreground">Same-day expectations</h2>
          </div>
          <p className="text-center text-foreground/80 mb-8">
            We&apos;ll try to accommodate same-day when capacity allows. This is best-effort —
            not a guaranteed same-day SLA.
          </p>
          <ul className="space-y-3 text-foreground/80 max-w-xl mx-auto">
            <li className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              Request by noon Mountain Time for the best same-day odds
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              Earlier requests (morning for afternoon slots) improve your odds
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              Simple RON sessions are often easier to fit same-day than complex loan packages
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              Mobile travel depends on location within our Utah service area
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              Evenings and weekends are limited and not guaranteed
            </li>
            <li className="flex gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              If we can&apos;t fit today, we&apos;ll offer the soonest available time
            </li>
          </ul>
        </div>
      </section>

      {/* RON vs mobile */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">RON vs mobile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-primary bg-background">
              <Video className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Remote Online (RON)</h3>
              <p className="text-sm text-foreground/70 mb-4">
                Best for most urgent needs — available nationwide via secure video. No travel required.
              </p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• All 50 U.S. states</li>
                <li>• Government ID verification</li>
                <li>• Ideal for many real estate & general docs</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border border-border bg-muted/40">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Mobile / in-office (Utah)</h3>
              <p className="text-sm text-foreground/70 mb-4">
                We come to you or meet at our Lehi-area office when in-person is required or preferred.
              </p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Utah County & nearby Wasatch Front</li>
                <li>• Loan packages & wet-ink needs</li>
                <li>• Travel fee may apply for mobile</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / book */}
      <section id="book" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-4">Request on-demand</h2>
          <p className="text-center text-foreground/70 mb-10">
            Book online or reach us directly — mention that you need same-day if timing is urgent.
          </p>

          <NotaryBooking />

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href={`mailto:${SITE_EMAILS.notary}`}
              className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {SITE_EMAILS.notary}
            </a>
            <a
              href={`tel:${SITE_PHONE.replace(/\D/g, "")}`}
              className="inline-flex items-center justify-center gap-2 text-primary hover:underline"
            >
              <Phone className="h-4 w-4" />
              {SITE_PHONE}
            </a>
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <h3 className="text-xl font-semibold text-center mb-2">Or schedule a call</h3>
            <p className="text-center text-foreground/60 text-sm mb-6">
              Same calendar for notary questions and general scheduling.
            </p>
            <div className="rounded-lg border border-border bg-card/50 p-2">
              <CalendlyInlineEmbed
                variant="compact"
                heading={null}
                showFallbackLink
                className="mt-0 [&_iframe]:bg-card"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
