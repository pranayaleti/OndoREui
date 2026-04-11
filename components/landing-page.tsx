import { HeroSection } from "@/components/landing/hero-section"
import { SocialProofBar } from "@/components/landing/social-proof-bar"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { OperatorsSection } from "@/components/landing/operators-section"
import { FeaturedPropertiesSection } from "@/components/landing/featured-properties-section"
import { AudienceSolutionsSection } from "@/components/landing/audience-solutions-section"
import { PropertyOwnerSection } from "@/components/landing/property-owner-section"
import { FoundersNoteSection } from "@/components/landing/founders-note-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { EmailCaptureSection } from "@/components/landing/email-capture-section"
import { CalendlyBookSection } from "@/components/contact/calendly-inline-embed"
import { ServiceAreaSection } from "@/components/landing/service-area-section"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <SocialProofBar />
      <HowItWorksSection />
      <OperatorsSection />
      <AudienceSolutionsSection />
      <PropertyOwnerSection />
      <FeaturedPropertiesSection />
      <TestimonialsSection />
      <ServiceAreaSection />
      <FoundersNoteSection />
      <EmailCaptureSection />
      <CalendlyBookSection variant="compact" />
      <CTASection />
      {/* Footer rendered globally in RootLayout */}
    </div>
  )
}
