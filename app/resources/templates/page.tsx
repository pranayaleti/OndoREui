import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, ClipboardList, Home, BookOpen } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Utah Landlord Templates & Forms | Ondo Real Estate",
  description: "Download Utah-compliant landlord templates: residential lease, move-in checklist, maintenance request form, and a 90-day onboarding playbook.",
  alternates: { canonical: `${SITE_URL}/resources/templates/` },
  openGraph: {
    title: "Utah Landlord Templates & Forms | Ondo Real Estate",
    description: "Download Utah-compliant landlord templates: residential lease, move-in checklist, maintenance request form, and a 90-day onboarding playbook.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utah Landlord Templates | Ondo Real Estate",
    description: "Utah-compliant lease agreement, move-in checklist, maintenance form, and landlord onboarding playbook.",
  },
}

const templates = [
  {
    title: "Residential Lease Agreement",
    description:
      "A Utah-compliant lease covering rent terms, security deposit rules, maintenance responsibilities, entry notice requirements, and lease renewal conditions. Drafted to align with Utah Code Title 57 (Property) and current statutory limits.",
    badge: "Request via contact",
    badgeHref: "/contact",
    icon: <FileText className="h-6 w-6" />,
    details: [
      "Utah-specific statutory language",
      "Security deposit and pet deposit provisions",
      "Entry notice and habitability clauses",
      "Late fee and grace period schedules",
    ],
  },
  {
    title: "Move-In / Move-Out Checklist",
    description:
      "A room-by-room condition checklist designed to protect both landlords and tenants at turnover. Includes a photo log section and a signature block for mutual agreement at move-in and move-out.",
    badge: "Download PDF",
    badgeHref: "/contact",
    icon: <ClipboardList className="h-6 w-6" />,
    details: [
      "Room-by-room condition fields",
      "Photo log documentation section",
      "Countersigned by owner and tenant",
      "Prevents security deposit disputes",
    ],
  },
  {
    title: "Maintenance Request Form",
    description:
      "A tenant-facing form that categorises issues by urgency tier (emergency, urgent, routine) so your maintenance team can triage and schedule appropriately. This form is integrated into the Ondo owner portal workflow.",
    badge: "Used in owner portal",
    badgeHref: "/contact",
    icon: <Home className="h-6 w-6" />,
    details: [
      "Three urgency tiers: emergency / urgent / routine",
      "Entry permission checkbox",
      "Photo attachment support",
      "Auto-routes to vendor assignment",
    ],
  },
  {
    title: "Landlord Onboarding Playbook",
    description:
      "A structured 90-day guide for new Utah landlords covering entity setup, insurance review, banking, screening criteria, lease execution, and systems configuration. Includes a checklist of tools and services to put in place before your first tenant moves in.",
    badge: "Request via contact",
    badgeHref: "/contact",
    icon: <BookOpen className="h-6 w-6" />,
    details: [
      "First 90-day milestone calendar",
      "Legal and insurance setup checklist",
      "Screening and lease execution guide",
      "Systems and automation recommendations",
    ],
  },
]

export default function TemplatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Landlord Templates & Forms"
        description="Download Utah-compliant landlord templates: residential lease, move-in checklist, maintenance request form, and a 90-day onboarding playbook."
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
        subtitle="Practical, Utah-compliant forms and playbooks that help landlords protect their investment and run tighter operations"
        backgroundImage="/modern-apartment-balcony.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Intro */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why We Publish These Templates</h2>
              <p className="text-lg text-foreground/70">
                Most landlord mistakes happen before a tenant ever moves in — an informal lease, a skipped move-in checklist, or no documented process for maintenance. These templates reflect the same forms and workflows we use inside Ondo&apos;s property management platform. They are written for Utah law, tested across hundreds of rentals, and free to use as a starting point. If you need a version customised to your specific portfolio or want us to manage the whole process, reach out and we will walk through it with you.
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
                    <Button asChild size="sm" className="self-start">
                      <Link href={t.badgeHref}>{t.badge}</Link>
                    </Button>
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
