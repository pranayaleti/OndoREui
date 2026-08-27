import { HeroSection } from "@/components/landing/hero-section"
import { JourneyCardsSection } from "@/components/landing/journey-cards-section"
import { SocialProofBar } from "@/components/landing/social-proof-bar"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { OperatorsSection } from "@/components/landing/operators-section"
import { FeaturedPropertiesSection } from "@/components/landing/featured-properties-section"
import { AudienceSolutionsSection } from "@/components/landing/audience-solutions-section"
import { PropertyOwnerSection } from "@/components/landing/property-owner-section"
import { HousingWeManageSection } from "@/components/landing/housing-we-manage-section"
import { OwnerCommitmentsSection } from "@/components/landing/owner-commitments-section"
import { FeeAlignmentWidget } from "@/components/landing/fee-alignment-widget"
import { SelfManagingSection } from "@/components/landing/self-managing-section"
import { RentSnapshotSection } from "@/components/landing/rent-snapshot-section"
import { FoundersNoteSection } from "@/components/landing/founders-note-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { EmailCaptureSection } from "@/components/landing/email-capture-section"
import { OwnerFaqSection } from "@/components/landing/owner-faq-section"
import { CalendlyBookSection } from "@/components/contact/calendly-inline-embed"
import { ServiceAreaSection } from "@/components/landing/service-area-section"
import { HomepageBlogSection } from "@/components/landing/homepage-blog-section"
import { UtahArrivalStrip } from "@/components/landing/utah-arrival-strip"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <JourneyCardsSection />
      <UtahArrivalStrip />
      <SocialProofBar />
      <HowItWorksSection />
      <OperatorsSection />
      <AudienceSolutionsSection />
      <PropertyOwnerSection />
      <HousingWeManageSection />
      <OwnerCommitmentsSection />
      <FeeAlignmentWidget />
      <RentSnapshotSection />
      <SelfManagingSection />
      <FeaturedPropertiesSection />
      <TestimonialsSection />
      <ServiceAreaSection />
      <HomepageBlogSection />
      <FoundersNoteSection />
      <OwnerFaqSection />
      <EmailCaptureSection />
      <CalendlyBookSection variant="compact" />
      <CTASection />
      {/* Footer rendered globally in RootLayout */}
    </div>
  )
}
