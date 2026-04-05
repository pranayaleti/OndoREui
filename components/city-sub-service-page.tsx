import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PageBanner } from "@/components/page-banner"
import { CommuteBadges } from "@/components/commute-badges"
import { MarketDataCard } from "@/components/market-data-card"
import { CrossLinkSection } from "@/components/cross-link-section"
import { LocalProofCTA } from "@/components/local-proof-cta"
import ConsultationCTA from "@/components/ConsultationCTA"
import { type UtahCity, toCitySlug } from "@/lib/utah-cities"
import { cityContentByName } from "@/lib/city-content"
import { cityMarketData } from "@/lib/city-market-data"
import { getNearbyCities } from "@/lib/nearby-cities"
import { SITE_HOURS, SITE_NAME, SITE_PHONE, SITE_SOCIALS, SITE_URL } from "@/lib/site"
import {
  type SubServiceDefinition,
  getSubServicesForParent,
} from "@/lib/sub-service-content"
import {
  FileText,
  Shield,
  UserCheck,
  DollarSign,
  Phone,
  Wrench,
  CheckCircle,
  ClipboardList,
  BarChart3,
  LayoutDashboard,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Percent,
  CreditCard,
  Handshake,
  Home,
  ShieldCheck,
  ShieldOff,
  Settings,
  ArrowUpCircle,
  Building,
  Briefcase,
  Users,
  BadgeDollarSign,
  PiggyBank,
  GraduationCap,
  MapPin,
  Calculator,
  Building2,
  ArrowRightLeft,
  Search,
  SlidersHorizontal,
  Receipt,
  BookOpen,
  TreePine,
  School,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-6 w-6" />,
  Shield: <Shield className="h-6 w-6" />,
  UserCheck: <UserCheck className="h-6 w-6" />,
  DollarSign: <DollarSign className="h-6 w-6" />,
  Phone: <Phone className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  CheckCircle: <CheckCircle className="h-6 w-6" />,
  ClipboardList: <ClipboardList className="h-6 w-6" />,
  BarChart3: <BarChart3 className="h-6 w-6" />,
  LayoutDashboard: <LayoutDashboard className="h-6 w-6" />,
  FileSpreadsheet: <FileSpreadsheet className="h-6 w-6" />,
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  TrendingDown: <TrendingDown className="h-6 w-6" />,
  Percent: <Percent className="h-6 w-6" />,
  CreditCard: <CreditCard className="h-6 w-6" />,
  Handshake: <Handshake className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  ShieldOff: <ShieldOff className="h-6 w-6" />,
  Settings: <Settings className="h-6 w-6" />,
  ArrowUpCircle: <ArrowUpCircle className="h-6 w-6" />,
  Building: <Building className="h-6 w-6" />,
  Briefcase: <Briefcase className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  BadgeDollarSign: <BadgeDollarSign className="h-6 w-6" />,
  PiggyBank: <PiggyBank className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  MapPin: <MapPin className="h-6 w-6" />,
  Calculator: <Calculator className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
  ArrowRightLeft: <ArrowRightLeft className="h-6 w-6" />,
  Search: <Search className="h-6 w-6" />,
  SlidersHorizontal: <SlidersHorizontal className="h-6 w-6" />,
  Receipt: <Receipt className="h-6 w-6" />,
}

type CitySubServicePageProps = {
  city: UtahCity
  subService: SubServiceDefinition
}

export function CitySubServicePage({ city, subService }: CitySubServicePageProps) {
  const citySlug = toCitySlug(city.name)
  const marketData = cityMarketData[city.name]
  const cityContent = cityContentByName[city.name]
  const nearbyCities = getNearbyCities(city.name, 5)
  const siblingServices = getSubServicesForParent(subService.parentService).filter(
    (s) => s.slug !== subService.slug,
  )

  // Build localized FAQs
  const localizedBaseFaqs = subService.baseFaqs.map((f) => ({
    q: f.q.replace(/your area/g, city.name),
    a: f.a
      .replace(/your area/g, city.name)
      .replace(/your target area/g, city.name),
  }))
  const cityFaqs = cityContent?.faq || []
  const allFaqs = [...localizedBaseFaqs, ...cityFaqs]
  const canonicalPath = `/${subService.parentService}/${citySlug}/${subService.slug}/`

  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "RealEstateAgent"],
    name: SITE_NAME,
    areaServed: `${city.name}, UT`,
    url: `${SITE_URL}${canonicalPath}`,
    telephone: SITE_PHONE,
    openingHours: SITE_HOURS,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressRegion: "UT",
      addressCountry: "US",
    },
    sameAs: SITE_SOCIALS,
    ...(city.lat && city.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          },
        }
      : {}),
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${subService.name} in ${city.name}, UT`,
    description: subService.metaDescription(city.name),
    areaServed: `${city.name}, UT`,
    serviceType: subService.parentName,
    url: `${SITE_URL}${canonicalPath}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <main className="min-h-screen">
      <Script
        id={`subservice-business-jsonld-${citySlug}-${subService.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <Script
        id={`subservice-service-jsonld-${citySlug}-${subService.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {allFaqs.length > 0 ? (
        <Script
          id={`subservice-faq-jsonld-${citySlug}-${subService.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <PageBanner
        title={`${subService.name} in ${city.name}, Utah`}
        subtitle={subService.metaDescription(city.name)}
        backgroundImage="/modern-office-building.webp"
      />

      <div className="container mx-auto px-4 py-12 space-y-12 max-w-5xl">
        <LocalProofCTA
          city={city}
          service={subService.parentService}
          marketData={marketData}
          focusName={subService.name}
        />

        {/* Localized intro */}
        {marketData && (
          <section>
            <p className="text-lg leading-relaxed text-foreground/80">
              {subService.localizedIntro(city.name, marketData)}
            </p>
          </section>
        )}

        {cityContent?.lifestyleDescription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Local Context in {city.name}
              </CardTitle>
              <CardDescription>
                The neighborhood patterns, community habits, and daily rhythms that shape this market.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>{cityContent.lifestyleDescription}</p>
              {cityContent.highlights?.length ? (
                <ul className="list-disc pl-5 text-sm text-foreground/70 space-y-1">
                  {cityContent.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Commute badges */}
        {marketData?.commuteTimes && (
          <CommuteBadges commuteTimes={marketData.commuteTimes} />
        )}

        {/* Market snapshot */}
        {marketData && (
          <MarketDataCard cityName={city.name} data={marketData} variant="compact" />
        )}

        {/* Features grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subService.features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-3 text-primary">
                    {iconMap[f.iconName] || <FileText className="h-6 w-6" />}
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="space-y-6">
            {subService.howItWorks.map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-foreground/70">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Localized benefits */}
        {marketData && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Why {city.name} for {subService.name}
            </h2>
            <ul className="space-y-3">
              {subService.localizedBenefits(city.name, marketData).map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Schools & education */}
        {marketData?.notableSchools && marketData.notableSchools.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" /> Schools & Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <span className="font-medium">School District:</span>{" "}
                {marketData.schoolDistrict}
              </p>
              <p className="text-sm text-muted-foreground">
                Notable schools: {marketData.notableSchools.join(", ")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Outdoor recreation & landmarks */}
        {marketData && (marketData.outdoorRec.length > 0 || marketData.localLandmarks.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" /> Lifestyle & Recreation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.geographyNote && (
                <p className="text-foreground/80">{marketData.geographyNote}</p>
              )}
              {marketData.outdoorRec.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-1">Outdoor Activities</p>
                  <ul className="list-disc pl-5 text-sm text-foreground/70 space-y-1">
                    {marketData.outdoorRec.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              {marketData.localLandmarks.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-1">Local Landmarks</p>
                  <ul className="list-disc pl-5 text-sm text-foreground/70 space-y-1">
                    {marketData.localLandmarks.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Neighborhoods */}
        {cityContent?.neighborhoods && cityContent.neighborhoods.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">
              {city.name} Neighborhoods
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cityContent.neighborhoods.map((n) => (
                <div key={n} className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Related services in this city */}
        <CrossLinkSection
          title={`Related Services in ${city.name}`}
          variant="grid"
          links={[
            {
              label: `All ${subService.parentName} in ${city.name}`,
              href: `/${subService.parentService}/${citySlug}/`,
            },
            ...siblingServices.map((s) => ({
              label: `${s.name} in ${city.name}`,
              href: `/${s.parentService}/${citySlug}/${s.slug}/`,
            })),
          ]}
        />

        {/* Also available in nearby cities */}
        <CrossLinkSection
          title={`${subService.name} Also Available In`}
          variant="pills"
          links={nearbyCities.map((nc) => ({
            label: nc.name,
            href: `/${subService.parentService}/${toCitySlug(nc.name)}/${subService.slug}/`,
          }))}
        />

        <Separator />

        {/* FAQ accordion */}
        {allFaqs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {allFaqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Ready to Get Started in {city.name}?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Get a Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={subService.parentHref}>
                All {subService.parentName} Services
              </Link>
            </Button>
          </div>
        </section>

        <ConsultationCTA variant="default" />
      </div>
    </main>
  )
}
