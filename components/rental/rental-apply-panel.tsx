"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchRentalProfile, type RentalPublicProfile } from "@/lib/api/rental"
import { formatCents, readStoredApplications } from "@/lib/rental-application"
import { PropertyRequirements } from "@/components/rental/property-requirements"
import { ReadinessForm } from "@/components/rental/readiness-form"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"
import { PetInformation } from "@/components/rental/pet-information"
import { TourRequestForm } from "@/components/rental/tour-request-form"
import { RentalContactForm } from "@/components/rental/rental-contact-form"
import { RentalApplyNowLink } from "@/components/rental/rental-listing-funnel"
import { STICKY_HEADER_SCROLL_MARGIN_CLASS } from "@/lib/scroll-margins"

const PANEL_CLASS = `mb-8 ${STICKY_HEADER_SCROLL_MARGIN_CLASS} space-y-5 rounded-xl border border-border bg-card p-5`

export function RentalApplyPanel({
  propertyId,
  publicId,
}: {
  propertyId: string
  publicId: string
}) {
  const [profile, setProfile] = useState<RentalPublicProfile | null>(null)
  const [showReadiness, setShowReadiness] = useState(false)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    let cancelled = false
    void fetchRentalProfile(propertyId)
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch(() => {
        if (!cancelled) setLoadError("Application details are not available yet.")
      })
    return () => {
      cancelled = true
    }
  }, [propertyId])

  const stored = readStoredApplications().find((row) => row.propertyId === propertyId || row.propertyId === publicId)
  const applyHref = profile?.applyPath ?? `/apply/start/${publicId}`

  if (loadError && !profile) {
    return (
      <section id="listing-apply" className={PANEL_CLASS} aria-live="polite">
        <div>
          <h2 className="text-xl font-semibold">Apply for this home</h2>
          <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            You can still start an application. Written requirements will appear here when they are available.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <RentalApplyNowLink
            href={applyHref}
            propertyRef={publicId}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"
          >
            Apply now
          </RentalApplyNowLink>
          {stored ? (
            <Link
              href={`/applications/${stored.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 font-medium hover:bg-muted"
            >
              Continue application
            </Link>
          ) : null}
        </div>
        <TourRequestForm propertyId={propertyId} />
        <RentalContactForm propertyId={propertyId} />
        <FairHousingNotice compact />
      </section>
    )
  }

  if (!profile) {
    return (
      <section id="listing-apply" className={PANEL_CLASS} aria-busy="true">
        <p className="text-sm text-muted-foreground">Loading application requirements…</p>
      </section>
    )
  }

  return (
    <section id="listing-apply" className={PANEL_CLASS}>
      <div>
        <h2 className="text-xl font-semibold">Apply for this home</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Rent {formatCents(profile.property.monthlyRentCents)}
          {profile.property.availability ? ` · Available ${profile.property.availability}` : ""}
        </p>
      </div>
      {profile.applicationsOpen ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <RentalApplyNowLink
            href={applyHref}
            propertyRef={publicId}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:opacity-90"
          >
            Apply now
          </RentalApplyNowLink>
          <Button type="button" variant="outline" className="min-h-11" onClick={() => setShowReadiness((v) => !v)}>
            Check your application requirements
          </Button>
          {stored ? (
            <Link
              href={`/applications/${stored.id}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 font-medium hover:bg-muted"
            >
              Continue application
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Online applications are not open for this listing yet. Request a tour or ask a question below.
        </p>
      )}
      {profile.requirements.whoCanApply.tourRequiredBeforeApply ? (
        <p className="text-sm">This property asks applicants to complete a tour before applying.</p>
      ) : null}
      <PropertyRequirements categories={profile.requirements.categories} />
      <PetInformation pets={profile.requirements.pets} assistanceAnimals={profile.requirements.assistanceAnimals} />
      {showReadiness ? <ReadinessForm propertyId={propertyId} onReady={() => { window.location.href = applyHref }} /> : null}
      <TourRequestForm propertyId={propertyId} />
      <RentalContactForm propertyId={propertyId} />
      <FairHousingNotice compact />
    </section>
  )
}
