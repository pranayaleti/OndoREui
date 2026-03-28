import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, SITE_EMAILS } from "@/lib/site"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import { CalendlyInlineEmbed } from "@/components/contact/calendly-inline-embed"
import { WebMCPContactInfoTool } from "@/components/contact/webmcp-contact-info-tool"
import { Mail, Phone } from "lucide-react"

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ondo Real Estate. We're your first point of contact — qualified leads and strategic outreach for property management, investments, and leasing across Utah.",
  alternates: { canonical: `${SITE_URL}/contact/` },
  openGraph: {
    title: "Contact Us | Ondo Real Estate",
    description: "Ondo Real Estate — your first point of contact for property management and real estate services in Utah. Qualified leads, strategic outreach.",
    url: `${SITE_URL}/contact`,
  },
}

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <WebMCPContactInfoTool />
      <SEO
        title="Contact Us"
        description="Get in touch with Ondo Real Estate. Send a message or call us for property management, investments, and leasing across Utah."
        pathname="/contact"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Contact", url: `${SITE_URL}/contact` },
        ])}
      />

      <PageBanner
        title="Contact us"
        subtitle="We're your first point of contact — qualified leads, strategic outreach, and a relationship-driven team ready to help with property management, investments, and leasing"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto grid gap-10 md:grid-cols-2 md:max-w-6xl md:gap-12 md:items-start">
            <div>
              <h2 className="text-xl font-semibold dark:text-foreground mb-4">
                Send a message
              </h2>
              <ContactLeadForm />
            </div>
            <div>
              <h2 className="text-xl font-semibold dark:text-foreground mb-4">
                Other ways to reach us
              </h2>
              <ul className="space-y-4 text-foreground/80 dark:text-foreground/80">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0" aria-hidden />
                  <a href={`tel:${SITE_PHONE.replace(/\D/g, "")}`} className="hover:underline">
                    {SITE_PHONE}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 flex-shrink-0" aria-hidden />
                  <a href={`mailto:${SITE_EMAILS.primary}`} className="hover:underline">
                    {SITE_EMAILS.primary}
                  </a>
                </li>
              </ul>
              <div id="book-a-call" className="scroll-mt-24">
                <CalendlyInlineEmbed />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
