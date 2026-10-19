"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SEO from "@/components/seo";
import { SITE_URL, SITE_PHONE, SITE_PHONE_TEL, SITE_EMAILS, SITE_ADDRESS } from "@/lib/site";
import { analyticsAttributes } from "@/lib/analytics";
import { NOTARY_SERVICE_ID, generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo";
import { NOTARY_HOURS_SPEC } from "@/lib/notary-fees";
import { NOTARY_PAGE_FAQS } from "@/lib/service-faq";
import { CheckCircle, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { NotaryBooking } from "@/components/notary-booking";
import { NotaryFees } from "@/components/notary-fees";
import { ServiceFaqSection } from "@/components/service-faq-section";
import ConsultationModal from "@/components/ConsultationModal";

const KEYWORDS = [
  "remote online notary",
  "RON nationwide",
  "online notary USA",
  "loan signing agent",
  "real estate notary",
  "digital notarization",
  "Utah notary public",
  "apostille assistance",
];

const whatYouGet = [
  { title: "Remote online notarization", body: "A video session from wherever you are, accepted in every state. Real estate, powers of attorney, affidavits and estate documents." },
  { title: "Loan signings", body: "Purchases, refinances and HELOCs, walked through page by page and returned to title on time." },
  { title: "Same day when there is room", body: "Ask early and we fit you in when we can." },
  { title: "The extras", body: "I-9 verification, apostille help and witnesses when a document needs them." },
];

/** `imageUrl` comes from the server page so this client bundle stays free of lib/page-canonical. */
export default function NotaryPage({ imageUrl }: { imageUrl: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <SEO
        title="Remote Online Notary – Available Nationwide"
        description="Remote online notarization (RON) in every state: real estate, loan signings, affidavits and estate documents by secure video. No office visit, no mobile travel."
        pathname="/notary/"
        image={imageUrl}
        keywords={KEYWORDS}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Notary", url: `${SITE_URL}/notary/` },
          ]),
          // The one notary entity. Hours come from the posted notary schedule (not the office
          // hours on the site Organization); state and city pages point back here by @id.
          generateServiceJsonLd({
            id: NOTARY_SERVICE_ID,
            name: "Remote Online Notarization (RON)",
            description:
              "Remote online notarization nationwide for real estate, loan signings, affidavits, POA and estate documents. Identity-verified video sessions, no office visits or mobile travel.",
            serviceType: "Remote Online Notarization",
            areaServed: "United States",
            areaServedType: "Country",
            hoursAvailable: NOTARY_HOURS_SPEC,
            providerIsSiteOrganization: true,
          }),
        ]}
      />

      {/* HERO */}
      <section className="bg-gradient-to-b from-background to-card py-16 text-center md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
            Online notary, any state
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/80">
            Sign on a video call with a commissioned Utah notary. No office visit, no travel.
          </p>
          <Button
            size="lg"
            className="flex gap-2 bg-primary text-primary-foreground"
            onClick={() => setIsModalOpen(true)}
          >
            <Calendar className="h-5 w-5" />
            Book a session
          </Button>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="bg-background py-16" aria-labelledby="notary-what-heading">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 id="notary-what-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
            What you get
          </h2>
          <ul className="space-y-4">
            {whatYouGet.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-foreground/80">
                  <span className="font-semibold text-foreground">{item.title}.</span> {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-foreground/70">
            Need it today?{" "}
            <Link href="/notary/on-demand/" className="font-medium text-primary underline underline-offset-4">
              Same-day sessions
            </Link>
            . Outside Utah?{" "}
            <Link href="/notary/locations/" className="font-medium text-primary underline underline-offset-4">
              Notary by state
            </Link>
            .
          </p>
        </div>
      </section>

      <NotaryFees />

      <ServiceFaqSection id="notary-faq" faqs={NOTARY_PAGE_FAQS} moreHref="/faq/notary-faqs/" moreLabel="All notary questions" />

      {/* CONTACT + BOOKING */}
      <section id="contact" className="bg-background py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-foreground md:text-4xl">
            Book or ask a question
          </h2>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Call or text</h3>
                  <p className="text-foreground/80">
                    <a
                      href={`tel:${SITE_PHONE_TEL}`}
                      className="text-primary hover:underline"
                      {...analyticsAttributes("notary_contact_click", "notary_contact", "call")}
                    >
                      {SITE_PHONE}
                    </a>
                    <br />
                    <a
                      href={`sms:${SITE_PHONE_TEL}`}
                      className="text-primary hover:underline"
                      {...analyticsAttributes("notary_contact_click", "notary_contact", "text")}
                    >
                      Text us
                    </a>{" "}
                    for urgent requests.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-foreground/80">
                    <a
                      href={`mailto:${SITE_EMAILS.notary}`}
                      className="text-primary hover:underline"
                      {...analyticsAttributes("notary_contact_click", "notary_contact", "email")}
                    >
                      {SITE_EMAILS.notary}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Based in Lehi</h3>
                  <p className="text-foreground/80">
                    {SITE_ADDRESS}
                    <br />
                    Sessions are remote only.
                  </p>
                </div>
              </div>
            </div>
            <NotaryBooking />
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div data-fixed-bottom-bar className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shadow-lg md:hidden">
        <span className="text-lg font-medium">Need a notary?</span>
        <Button
          size="sm"
          className="bg-card font-semibold text-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Book
        </Button>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variant="notary"
      />
    </main>
  );
}
