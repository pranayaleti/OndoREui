"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SEO from "@/components/seo";
import { SITE_URL, SITE_PHONE, SITE_EMAILS } from "@/lib/site";
import { generateBreadcrumbJsonLd, generateLocalBusinessJsonLd } from "@/lib/seo";
import NOTARY_SERVICE_AREAS from "@/lib/notary-service-areas";
import {
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Shield,
  Users,
  Calendar,
  TrendingUp,
  Quote,
  Star,
  Award,
  Building2,
} from "lucide-react";
import { NotaryBooking } from "@/components/notary-booking";
import ConsultationModal from "@/components/ConsultationModal";
import { CalendlyInlineEmbed } from "@/components/contact/calendly-inline-embed";

export default function NotaryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hiddenContent = useMemo(
    () => NOTARY_SERVICE_AREAS.getHiddenSEOContent(),
    []
  );
  const notaryKeywords = useMemo(
    () =>
      NOTARY_SERVICE_AREAS.getKeywordsString()
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    []
  );

  return (
  <main className="min-h-screen">
    {/* SEO */}
    <SEO
      title="Remote Online Notary – Available Nationwide | ONDO Notary"
      description="Secure Remote Online Notarization (RON) for clients across all 50 U.S. states. Mobile and in-office notarization in Utah County. Specializing in real estate, loan signings, affidavits, and estate documents."
      pathname="/notary"
      image={`${SITE_URL}/notary-cover.jpg`}
      keywords={[
        "remote online notary",
        "RON nationwide",
        "online notary US",
        "mobile notary Utah",
        "loan signing agent",
        "real estate notary",
        "notary near me",
        "Utah notary public",
        "apostille assistance",
        ...notaryKeywords,
      ]}
      jsonLd={[
        generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Notary", url: `${SITE_URL}/notary` },
        ]),
        generateLocalBusinessJsonLd({
          name: "ONDO Notary Services",
          url: `${SITE_URL}/notary`,
          telephone: SITE_PHONE,
          image: `${SITE_URL}/notary-cover.jpg`,
          areaServed: "United States",
          openingHours: "Mo-Fr 09:00-19:00",
          address: {
            addressLocality: "Lehi",
            addressRegion: "UT",
            addressCountry: "US",
          },
          makesOffer: [
            { itemOffered: { name: "Remote Online Notarization (RON)" } },
            { itemOffered: { name: "Mobile Notary" } },
            { itemOffered: { name: "Loan Signing Agent" } },
          ],
        }),
      ]}
    />

    {/* HERO */}
    <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Remote Online Notary – Available Nationwide
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          ONDO Notary provides secure Remote Online Notarization (RON) from anywhere in the U.S.,
          plus mobile and in-office notarization in Utah County. Ideal for real estate, loan
          packages, affidavits, POA, estate documents, and business agreements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground flex gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Calendar className="w-5 h-5" />
            Book with ONDO Notary
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-muted dark:border-white dark:text-white dark:hover:bg-white/10"
          >
            <Link href="#services" className="flex gap-2">
              <FileText className="w-5 h-5" /> View Services
            </Link>
          </Button>
        </div>

        <p className="text-gray-400 mt-6 text-sm">
          Same‑day availability • Remote notarization nationwide • Mobile service in Utah County
        </p>
      </div>
    </section>

    {/* ABOUT */}
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Professional Remote Notary Services by ONDO Notary
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">Remote‑First, Nationwide with ONDO Notary</h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-4">
              ONDO Notary provides secure, convenient Remote Online Notarization (RON) across all 50
              U.S. states. Sign your documents from anywhere via video, with no travel or delays.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              Backed by real estate and loan signing expertise, every ONDO Notary session is handled
              with precision and professionalism.
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-white">Commissioned & Bonded</h4>
                  <p className="text-gray-300 text-sm">
                    Fully commissioned Utah Notary Public with training, certification, and bonding.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Users className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold text-white">Real Estate & Loan Signing Expertise</h4>
                  <p className="text-gray-300 text-sm">
                    Specialized in mortgage packages, refinances, closings, and investment property documents.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-b from-black to-gray-900 border border-border rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Why Choose ONDO Notary?</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Nationwide remote notarization</li>
              <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Same‑day appointments</li>
              <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Real estate & loan document experts</li>
              <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Transparent pricing & clear process</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* SERVICES */}
    <section id="services" className="py-16 md:py-24 bg-card dark:bg-gradient-to-b dark:from-black dark:to-gray-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          ONDO Notary Services Offered
        </h2>
        <p className="text-center text-foreground/70 mb-8 max-w-2xl mx-auto">
          Remote‑first ONDO Notary services with Utah-specific mobile and in-office options.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* RON */}
          <div className="p-6 bg-black border border-primary rounded-lg">
            <h3 className="text-xl text-primary font-semibold mb-3">
              Remote Online Notarization (RON) by ONDO Notary
            </h3>
            <p className="text-gray-300 mb-4">
              Secure online notarization for clients in all 50 U.S. states.
            </p>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Identity verification via government ID</li>
              <li>• Digital signatures & electronic seal</li>
              <li>• Fastest notarization method available</li>
              <li>• Ideal for real estate, POA, affidavits, and business documents</li>
            </ul>
          </div>

          {/* In‑Office */}
          <div className="p-6 bg-muted border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">In‑Office Notarization (Utah)</h3>
            <p className="text-foreground/70 mb-4">
              Quick appointments at the Lehi office.
            </p>
            <ul className="text-foreground text-sm space-y-2">
              <li>• Loan documents</li>
              <li>• Affidavits & acknowledgements</li>
              <li>• Power of attorney</li>
              <li>• Estate documents</li>
              <li>• I‑9 verification</li>
            </ul>
          </div>

          {/* Mobile */}
          <div className="p-6 bg-muted border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Mobile Notary (Utah County)</h3>
            <p className="text-foreground/70 mb-4">
              We travel to your home, office, or preferred location in Utah County.
            </p>
            <ul className="text-foreground text-sm space-y-2">
              <li>• Flexible scheduling</li>
              <li>• Evening availability</li>
              <li>• Travel fee applies</li>
            </ul>
          </div>

          {/* Loan Signing */}
          <div className="p-6 bg-black border border-primary rounded-lg">
            <h3 className="text-xl text-primary font-semibold mb-3">Loan Signing Agent by ONDO Notary</h3>
            <p className="text-gray-300 text-sm mb-4">
              Full mortgage packages, refinances, and investment property closings.
            </p>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Purchases, refinances, HELOCs</li>
              <li>• Investor closings</li>
              <li>• Full borrower walkthrough</li>
            </ul>
          </div>

          {/* Additional */}
          <div className="p-6 bg-black border border-primary rounded-lg md:col-span-2">
            <h3 className="text-xl text-primary font-semibold mb-3">Additional Services</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• I‑9 Employment Verification</li>
              <li>• Apostille Assistance (Utah documents)</li>
              <li>• Certified Copy Oversight</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

      {/* PRICING */}
      <section className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            ONDO Notary Fees & Availability
          </h2>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
            Transparent, upfront pricing.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h3 className="text-2xl text-primary font-semibold mb-6">Pricing</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-white font-medium">Notarial Act</span>
                  <span className="text-primary font-semibold">$10 per stamp</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-white font-medium">Mobile Trip Fee</span>
                  <span className="text-primary font-semibold">Starting at $25</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-3">
                  <span className="text-white font-medium">Loan Signing Packages</span>
                  <span className="text-primary font-semibold">$75–$200</span>
                </div>
                <div className="flex justify-between pb-3">
                  <span className="text-white font-medium">Remote Online Notary (RON)</span>
                  <span className="text-primary font-semibold">$25 platform fee + state fee</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-primary font-semibold mb-6">Availability</h3>
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="text-white font-semibold">Hours</h4>
                    <p className="text-gray-300">Mon–Fri 9 AM – 7 PM<br />Weekends by appointment</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <h4 className="text-white font-semibold">Client Volume</h4>
                    <p className="text-gray-300">Serving 5–10 clients monthly</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  Text or call for urgent, same‑day notarization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO BRING */}
      <section className="py-16 md:py-24 bg-card dark:bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            What to Bring for ONDO Notary
          </h2>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
            Required items for your appointment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-muted border border-border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Required Items</h3>
              <ul className="space-y-3 text-foreground">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Valid government ID</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Unsigned documents</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Witnesses (if required)</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Payment method</li>
              </ul>
            </div>

            <div className="p-6 bg-black border border-primary rounded-lg">
              <h3 className="text-xl text-primary font-semibold mb-4">RON Appointments</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Laptop or smartphone</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Camera & microphone</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Stable internet</li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary" /> Quiet space</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LOAN SIGNING */}
      <section className="py-16 md:py-24 bg-card dark:bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            ONDO Notary Loan Signing Expertise
          </h2>
          <p className="text-center text-foreground/70 mb-8 max-w-2xl mx-auto">
            Professional, accurate mortgage signing services.
          </p>

          <div className="bg-black p-8 border border-primary rounded-lg mb-12">
              <h3 className="text-2xl font-semibold text-primary flex gap-2 mb-4">
                <TrendingUp className="w-6 h-6" /> Why ONDO Notary Loan Signing Agents Matter
            </h3>
            <p className="text-gray-300 leading-relaxed">
          A trained ONDO Notary signing agent ensures mortgage documents are executed correctly,
          properly notarized, and returned promptly — preventing delays and funding issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-muted border border-border rounded-lg">
              <h3 className="text-xl font-semibold flex gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                Key Responsibilities
              </h3>
              <ul className="text-sm text-foreground space-y-2">
                <li>• Guide borrowers through loan documents</li>
                <li>• Verify identity and signatures</li>
                <li>• Ensure accurate notarization</li>
                <li>• Coordinate with title & escrow</li>
              </ul>
            </div>

            <div className="p-6 bg-muted border border-border rounded-lg">
              <h3 className="text-xl font-semibold flex gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                Professional Standards
              </h3>
              <p className="text-sm text-foreground">
                Certified, trained, and compliant with Utah notarial law and industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

    {/* NATIONWIDE COVERAGE */}
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
          Nationwide Coverage – ONDO Notary in All 50 States
        </h2>
        <p className="text-center text-gray-300 max-w-3xl mx-auto mb-10">
          We support Remote Online Notarization everywhere in the United States,
          plus mobile and in-office appointments in Utah County. Choose your
          state to confirm your documents can be notarized online.
        </p>
        <div className="sr-only" aria-hidden="true">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm text-gray-200">
            {hiddenContent.states.map((state) => (
              <Link
                key={state.slug}
                href={state.url}
                className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 transition hover:border-primary hover:bg-primary/10"
              >
                <span className="font-semibold text-white">{state.name}</span>
                <p className="text-xs text-gray-400">{state.linkText}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 sr-only" aria-hidden="true">
          <h3 className="text-xl font-semibold text-primary mb-3 text-center">
            High-Demand Metro Areas (Online Notary)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm text-gray-200">
            {hiddenContent.cities.map((city) => (
              <Link
                key={city.slug}
                href={city.url}
                className="block rounded-md border border-white/10 bg-white/5 px-3 py-2 transition hover:border-primary hover:bg-primary/10"
              >
                <span className="font-semibold text-white">{city.name}</span>
                <p className="text-xs text-gray-400">{city.linkText}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-card dark:bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            What Clients Say About ONDO Notary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1 */}
            <div className="p-6 bg-black border border-primary rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-primary mb-3" />
              <p className="text-gray-300 italic mb-4">
                “We closed on our Colorado property from home. The remote online notarization was
                accepted by our title company without a hitch and took under 20 minutes.”
              </p>
              <p className="text-primary font-semibold">— Sarah M., Denver, CO</p>
            </div>

            {/* 2 */}
            <div className="p-6 bg-muted border border-border rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-primary mb-3" />
              <p className="text-foreground italic mb-4">
                “I’m in Texas and needed an out-of-state investment package notarized. The RON
                session met my lender’s requirements, and every document was verified on the call.”
              </p>
              <p className="text-primary font-semibold">— Jason T., Dallas, TX</p>
            </div>

            {/* 3 */}
            <div className="p-6 bg-muted border border-border rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-primary mb-3" />
              <p className="text-foreground italic mb-4">
                “Clear instructions, identity checks, and a smooth video session. I received the
                signed, sealed documents instantly after the call.”
              </p>
              <p className="text-primary font-semibold">— Michelle R., Salt Lake City, UT</p>
            </div>

            {/* 4 */}
            <div className="p-6 bg-black border border-primary rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <Quote className="w-6 h-6 text-primary mb-3" />
              <p className="text-gray-300 italic mb-4">
                “Needed a sworn statement notarized for a New York employer while I was in Utah.
                They provided the electronic seal, audit trail, and confirmation the receiving state
                needed.”
              </p>
              <p className="text-primary font-semibold">— Daniel K., New York, NY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Centralized FAQs live on /faq */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Questions about ONDO Notary services?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Visit our Help Center to browse detailed FAQs on notary services, RON, mobile notary, and document signing.
          </p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            <Link href="/faq/notary-faqs">View Notary FAQs</Link>
          </Button>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 md:py-24 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Contact ONDO Notary & Booking
          </h2>
          <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
            Book online, call, or text for urgent same-day notarization in Utah County.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="text-white font-semibold">Phone</h4>
                  <p className="text-gray-300">{SITE_PHONE} <br /> Text or call for urgent requests.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="text-white font-semibold">Email</h4>
                  <p className="text-gray-300">{SITE_EMAILS.primary}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="text-white font-semibold">Office Location</h4>
                  <p className="text-gray-300">2701 N Thanksgiving Way, Lehi, UT 84043</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Building2 className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="text-white font-semibold">Service Area</h4>
                  <p className="text-gray-300">
                    Remote online notarization across all 50 U.S. states, with mobile and in-office
                    appointments available in Utah County (Lehi, American Fork, Saratoga Springs,
                    Orem, Provo).
                  </p>
                </div>
              </div>
            </div>

            <NotaryBooking />
          </div>

          <div className="mt-14 max-w-3xl mx-auto border-t border-white/10 pt-10">
            <h3 className="text-xl font-semibold text-white text-center mb-2">
              Or schedule a call
            </h3>
            <p className="text-center text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Same calendar for notary questions, loan signings, and general scheduling.
            </p>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
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

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-primary text-primary-foreground py-3 px-4 flex justify-between items-center shadow-lg">
        <span className="font-medium text-lg">Need ONDO Notary?</span>
        <Button
          size="sm"
          className="bg-white text-primary font-semibold"
          onClick={() => setIsModalOpen(true)}
        >
          Book ONDO
        </Button>
      </div>

      {/* MODAL */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        variant="notary"
      />
    </main>
  );
}
