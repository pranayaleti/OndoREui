import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedPropertiesSection } from "@/components/landing/featured-properties-section"
import { WhyOndoSection } from "@/components/landing/social-proof-bar"
import { ToolsSection } from "@/components/landing/tools-section"
import { FoundersNoteSection } from "@/components/landing/founders-note-section"
import { HomeFaqSection } from "@/components/landing/owner-faq-section"
import { CTASection } from "@/components/landing/cta-section"

/** Seven sections. Anything that wants onto the homepage replaces one of these, it does not add an eighth. */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturedPropertiesSection />
      <WhyOndoSection />
      <ToolsSection />
      <FoundersNoteSection />
      <HomeFaqSection />
      <CTASection />
    </>
  )
}
