"use client"

import { memo } from "react"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { OperatorsSection } from "@/components/landing/operators-section"
import { FeaturedPropertiesSection } from "@/components/landing/featured-properties-section"
import { PropertyOwnerSection } from "@/components/landing/property-owner-section"
import { FoundersNoteSection } from "@/components/landing/founders-note-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { CalendlyBookSection } from "@/components/contact/calendly-inline-embed"

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <OperatorsSection />
      <FeaturedPropertiesSection />
      <PropertyOwnerSection />
      <FoundersNoteSection />
      <TestimonialsSection />
      <CalendlyBookSection />
      <CTASection />
      {/* Footer rendered globally in RootLayout */}
    </div>
  )
}

// Memoize component to prevent unnecessary re-renders
export default memo(LandingPage)
