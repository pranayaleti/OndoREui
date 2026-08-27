import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TemplateRequestForm } from "@/components/resources/template-request-form"
import { FileText, ClipboardList, Home, BookOpen, ClipboardCheck } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Utah Landlord Templates & Seller Listing-Prep | Ondo Real Estate",
  description:
    "Request Utah landlord templates and a seller listing-prep checklist. We email the file after you request it — not an instant download.",
  alternates: { canonical: `${SITE_URL}/resources/templates/` },
  openGraph: {
    title: "Utah Landlord Templates & Forms | Ondo Real Estate",
    description: "Request Utah-oriented landlord templates plus a seller listing-prep checklist. Files are emailed after you request them.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utah Landlord Templates | Ondo Real Estate",
    description: "Utah-compliant lease agreement, move-in checklist, maintenance form, and landlord onboarding playbook.",
  },
}

const templates = [
  {
    id: "residential-lease",
    title: "Residential Lease Agreement",
    description:
      "A Utah-compliant lease covering rent terms, security deposit rules, maintenance responsibilities, entry notice requirements, and lease renewal conditions. Drafted to align with Utah Code Title 57 (Property) and current statutory limits.",
    icon: <FileText className="h-6 w-6" />,
    inquiryType: "owner" as const,
    details: [
      "Utah-specific statutory language",
      "Security deposit and pet deposit provisions",
      "Entry notice and habitability clauses",
      "Late fee and grace period schedules",
    ],
  },
  {
    id: "move-in-checklist",
    title: "Move-In / Move-Out Checklist",
    description:
      "A room-by-room condition checklist designed to protect both landlords and tenants at turnover. Includes a photo log section and a signature block for mutual agreement at move-in and move-out.",
    icon: <ClipboardList className="h-6 w-6" />,
    inquiryType: "owner" as const,
    details: [
      "Room-by-room condition fields",
      "Photo log documentation section",
      "Countersigned by owner and tenant",
      "Prevents security deposit disputes",
    ],
  },
  {
    id: "maintenance-request",
    title: "Maintenance Request Form",
    description:
      "A tenant-facing form that categorises issues by urgency tier (emergency, urgent, routine) so your maintenance team can triage and schedule appropriately. This form is integrated into the Ondo owner portal workflow.",
    icon: <Home className="h-6 w-6" />,
    inquiryType: "owner" as const,
    details: [
      "Three urgency tiers: emergency / urgent / routine",
      "Entry permission checkbox",
      "Photo attachment support",
      "Auto-routes to vendor assignment",
    ],
  },
  {
    id: "landlord-onboarding-playbook",
    title: "Landlord Onboarding Playbook",
    description:
      "A structured 90-day guide for new Utah landlords covering entity setup, insurance review, banking, screening criteria, lease execution, and systems configuration. Includes a checklist of tools and services to put in place before your first tenant moves in.",
    icon: <BookOpen className="h-6 w-6" />,
    inquiryType: "owner" as const,
    details: [
      "First 90-day milestone calendar",
      "Legal and insurance setup checklist",
      "Screening and lease execution guide",
      "Systems and automation recommendations",
    ],
  },
  {
    id: "listing-prep-showing-feedback",
    title: "Listing-Prep & Showing-Feedback Checklist",
    description:
      "A brokerage checklist for sellers getting a home ready to list and collecting showing notes afterward. We email the file after you request it — this is not a QR code, text-for-info shortcode, or YouTube tour product.",
    icon: <ClipboardCheck className="h-6 w-6" />,
    inquiryType: "seller" as const,
    details: [
      "Prep before photos: declutter, repairs, curb appeal",
      "Showing-day checklist for occupants",
      "How to record showing feedback we send you",
      "Request the file — we email it, not an instant download",
    ],
  },
]

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Landlord Templates & Forms"
        description="Request Utah landlord templates and a seller listing-prep checklist. We email the file after you request it."
        pathname="/resources/templates"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Resources", url: `${SITE_URL}/resources` },
          { name: "Templates", url: `${SITE_URL}/resources/templates` },
        ])}
      />
      <PageBanner
        title="Templates & Resources"
        subtitle="Utah-oriented landlord forms plus a seller listing-prep checklist. Request the file — we email it."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Intro */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why We Publish These Templates</h2>
              <p className="text-lg text-foreground/70">
                These templates reflect forms we use at Ondo. Landlord files are written for Utah law. Sellers can request a listing-prep and showing-feedback checklist — we email the file; it is not a QR, SMS, or YouTube product. Leave your name and email on each card.
              </p>
            </div>

            {/* Template cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {templates.map((t, i) => (
                <Card key={i} className="flex flex-col">
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">
                      {t.icon}
                    </div>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-6 flex flex-col gap-4 flex-1 justify-end">
                    <ul className="space-y-1 text-sm text-foreground/70">
                      {t.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <TemplateRequestForm
                      templateId={t.id}
                      templateTitle={t.title}
                      inquiryType={t.inquiryType}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Need Something Beyond the Templates?</h3>
              <p className="text-foreground/70 mb-6">
                If your situation calls for custom lease language, a full management handoff, or help getting your first Utah rental set up properly, we are happy to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Talk to Our Team</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/resources">Browse All Resources</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
