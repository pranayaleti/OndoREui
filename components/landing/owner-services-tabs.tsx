"use client"

/**
 * Tabbed owner-services explainer for the property-owner landing section.
 *
 * Replaces a bullet list with a small, focused tour of what full-service
 * management actually covers. Every tab links to an existing page so the
 * homepage never oversells what the site can back up.
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OwnerService {
  id: string
  label: string
  headline: string
  body: string
  href: string
  linkLabel: string
}

/**
 * Evictions intentionally links to the FAQ (not a "sue your tenant" pitch).
 * Ondo supports the process; legal advice is a licensed attorney's job.
 */
const services: OwnerService[] = [
  {
    id: "screening",
    label: "Screening",
    headline: "Fair-Housing-compliant tenant screening",
    body: "Credit, criminal, eviction, and income checks against consistent, documented criteria — applied to every applicant the same way. We follow HUD guidance on the use of criminal records in housing decisions.",
    href: "/property-management/tenant-screening",
    linkLabel: "See our screening process",
  },
  {
    id: "advertising",
    label: "Advertising",
    headline: "Marketing that moves vacant units",
    body: "Listing photography, syndicated placement, showings, and application flow that reduces days on market without cutting corners on applicant quality.",
    href: "/properties",
    linkLabel: "See how we list rentals",
  },
  {
    id: "rent",
    label: "Rent",
    headline: "Rent collection and owner statements",
    body: "Online tenant payments, clear late-fee policy in the lease, automated reminders, and monthly owner statements you can hand to your CPA at tax time.",
    href: "/property-management",
    linkLabel: "See how rent collection works",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    headline: "Coordinated repairs, 24/7 emergency line",
    body: "Tenant requests routed to trusted local vendors with photo/video documentation, cost approvals per your thresholds, and an emergency line for after-hours issues.",
    href: "/property-management/maintenance-coordination",
    linkLabel: "See maintenance coordination",
  },
  {
    id: "evictions",
    label: "Evictions",
    headline: "Utah eviction process support",
    body: "When it becomes necessary, we handle notices, documentation, and coordination with your attorney under Utah landlord-tenant law. This is procedural support, not legal advice.",
    href: "/faq",
    linkLabel: "Read landlord FAQs",
  },
  {
    id: "reporting",
    label: "Reporting",
    headline: "Real-time owner reporting",
    body: "Income and expense reports, balance sheets, general ledgers, and maintenance invoices — always current in the owner portal, not a monthly PDF drop.",
    href: "/property-management/owner-reporting",
    linkLabel: "See owner reporting",
  },
]

export function OwnerServicesTabs() {
  return (
    <Tabs defaultValue={services[0]?.id ?? "screening"} className="w-full">
      <TabsList
        className="mb-4 flex h-auto w-full flex-wrap gap-1 bg-muted p-1"
        aria-label="Owner services"
      >
        {services.map((service) => (
          <TabsTrigger
            key={service.id}
            value={service.id}
            className="flex-1 min-w-[92px] px-3 py-2 text-sm"
          >
            {service.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {services.map((service) => (
        <TabsContent
          key={service.id}
          value={service.id}
          className="rounded-lg border border-border bg-card p-5"
        >
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {service.headline}
          </h3>
          <p className="mb-4 text-foreground/70">{service.body}</p>
          <Link
            href={service.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
          >
            {service.linkLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </TabsContent>
      ))}
    </Tabs>
  )
}
