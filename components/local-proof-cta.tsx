import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  MapPin,
  PhoneCall,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CityMarketData } from "@/lib/city-market-data"
import { getNearbyCities } from "@/lib/nearby-cities"
import {
  SITE_ADDRESS_CITY,
  SITE_ADDRESS_REGION,
  SITE_PHONE,
} from "@/lib/site"
import { type UtahCity, toCitySlug } from "@/lib/utah-cities"

type ServiceType = "property-management" | "buy-sell" | "loans"

type LocalProofCTAProps = {
  city: UtahCity
  service: ServiceType
  marketData?: CityMarketData
  focusName?: string
}

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n.toLocaleString("en-US")
}

function getServiceCopy(
  service: ServiceType,
  city: UtahCity,
  marketData?: CityMarketData,
  focusName?: string,
) {
  const localFocus = focusName ?? (
    service === "property-management"
      ? "property management"
      : service === "buy-sell"
      ? "buying and selling"
      : "mortgage guidance"
  )

  if (service === "property-management") {
    return {
      eyebrow: `Serving ${city.name} rental owners`,
      title: focusName
        ? `${focusName} with local context for ${city.name} owners`
        : `A local property management partner for ${city.name}`,
      description: marketData
        ? `From ${fmtUsd(marketData.medianRent)}/mo rentals to maintenance and owner reporting, Ondo helps ${city.name} owners make faster decisions with local market context and clear communication.`
        : `Ondo helps ${city.name} owners reduce vacancy, coordinate operations, and keep visibility across every property decision.`,
      primaryHref: "/contact",
      primaryLabel: "Get a Free Rental Analysis",
      proofPoints: [
        `Coverage across ZIPs ${city.zips.join(", ")}`,
        marketData
          ? `Demand shaped by employers like ${marketData.topEmployers.slice(0, 2).join(" and ")}`
          : `Support tailored to ${city.name} rental demand`,
        `Transparent owner reporting, screening, and maintenance workflows`,
      ],
      factsTitle: `Why ${city.name} owners reach out`,
      factsDescription: `Start with ${localFocus} and a team that already understands the local renter profile.`,
    }
  }

  if (service === "buy-sell") {
    return {
      eyebrow: `Serving ${city.name} buyers and sellers`,
      title: focusName
        ? `${focusName} backed by ${city.name} market context`
        : `A local guide for buying and selling in ${city.name}`,
      description: marketData
        ? `Ondo pairs neighborhood-level pricing, prep, and negotiation support with the realities of a ${fmtUsd(marketData.medianHomePrice)} median home market in ${city.name}.`
        : `Ondo combines local pricing strategy, property prep, and contract-to-close support for buyers and sellers in ${city.name}.`,
      primaryHref: "/contact",
      primaryLabel: "Talk to a Local Agent",
      proofPoints: [
        `Neighborhood-aware strategy across ZIPs ${city.zips.join(", ")}`,
        marketData
          ? `Buyer demand shaped by schools, commutes, and employers like ${marketData.topEmployers.slice(0, 2).join(" and ")}`
          : `Local pricing and positioning guidance`,
        `Clear support from valuation to negotiation to closing`,
      ],
      factsTitle: `Why ${city.name} clients reach out`,
      factsDescription: `Get a plan grounded in what buyers and sellers actually care about in this market.`,
    }
  }

  return {
    eyebrow: `Serving ${city.name} mortgage shoppers`,
    title: focusName
      ? `${focusName} for ${city.name} buyers`
      : `Mortgage guidance built around ${city.name}`,
    description: marketData
      ? `Compare loan options against ${city.name}'s ${fmtUsd(marketData.medianHomePrice)} median price point before you shop, refinance, or lock a rate.`
      : `Compare mortgage options with a Utah team that can help you weigh payment, cash-to-close, and long-term fit.`,
    primaryHref: "/qualify",
    primaryLabel: "Get Pre-Qualified",
    proofPoints: [
      `Compare conventional, FHA, VA, USDA, and jumbo options`,
      marketData
        ? `Plan around ${city.name} price points, income levels, and commute realities`
        : `Loan guidance built for Utah buyers`,
      `Clear next steps before you make an offer or lock a rate`,
    ],
    factsTitle: `Why ${city.name} borrowers reach out`,
    factsDescription: `Get payment clarity and loan comparisons before you commit to a property or lender path.`,
  }
}

export function LocalProofCTA({
  city,
  service,
  marketData,
  focusName,
}: LocalProofCTAProps) {
  const nearbyCities = getNearbyCities(city.name, 3)
  const copy = getServiceCopy(service, city, marketData, focusName)
  const telHref = SITE_PHONE.replace(/[^\d+]/g, "")

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-muted/70">
      <CardContent className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge>{copy.eyebrow}</Badge>
            <Badge variant="outline">{city.county || "Utah"} County</Badge>
            <Badge variant="outline">ZIPs {city.zips.join(", ")}</Badge>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {copy.title}
            </h2>
            <p className="max-w-3xl text-foreground/75">
              {copy.description}
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {copy.proofPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={copy.primaryHref}>
                {copy.primaryLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${telHref}`}>
                <PhoneCall className="h-4 w-4" />
                Call {SITE_PHONE}
              </a>
            </Button>
          </div>
        </div>

        <Card className="border-primary/15 bg-background/90 shadow-none">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg">{copy.factsTitle}</CardTitle>
            <CardDescription>{copy.factsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-foreground/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>Serving {city.name} and ZIPs {city.zips.join(", ")}.</span>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>Utah-based office in {SITE_ADDRESS_CITY}, {SITE_ADDRESS_REGION}.</span>
              </div>
              {marketData?.topEmployers.length ? (
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Local demand drivers include {marketData.topEmployers.slice(0, 3).join(", ")}.
                  </span>
                </div>
              ) : null}
            </div>

            {nearbyCities.length ? (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Nearby Coverage
                </p>
                <div className="flex flex-wrap gap-2">
                  {nearbyCities.map((nearbyCity) => (
                    <Link
                      key={nearbyCity.name}
                      href={`/${service}/${toCitySlug(nearbyCity.name)}/`}
                    >
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted/60">
                        {nearbyCity.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default LocalProofCTA
