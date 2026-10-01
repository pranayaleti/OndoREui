"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { findCitiesByZip, toCitySlug, type UtahCity } from "@/lib/utah-cities"
import { sanitizeInput, isValidZipCode, RateLimiter } from "@/lib/security"
import { saveUserInfo } from "@/lib/session-utils"
import { webmcpFormAttrs, webmcpParamAttrs } from "@/lib/webmcp-attrs"
import { Building2, Home, Landmark, TrendingUp, ArrowLeft } from "lucide-react"

const searchRateLimiter = new RateLimiter(5, 30000)

type Service = {
  key: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const services: Service[] = [
  { key: "pm", label: "Property Management", description: "Rent collection, maintenance, tenant screening", icon: Building2, path: "property-management" },
  { key: "buy-sell", label: "Buy or Sell", description: "Find your next home or list your property", icon: Home, path: "buy-sell" },
  { key: "loans", label: "Home Loans", description: "Mortgage rates, refinance, pre-approval", icon: Landmark, path: "loans" },
  { key: "invest", label: "Investments", description: "Fractional ownership, rental income, ROI analysis", icon: TrendingUp, path: "investments" },
]

export function ZipServiceSelector() {
  const [zip, setZip] = useState("")
  const [matches, setMatches] = useState<UtahCity[]>([])
  const [cityName, setCityName] = useState("")
  const [citySlug, setCitySlug] = useState("")
  const [step, setStep] = useState<"zip" | "city" | "service">("zip")
  const [error, setError] = useState("")
  const router = useRouter()
  const headingRef = useRef<HTMLParagraphElement>(null)
  const zipInputRef = useRef<HTMLInputElement>(null)
  const stepChanged = useRef(false)

  // The control that had focus is unmounted when the step swaps, so move focus
  // to the new heading (or back to the ZIP field) instead of dropping it on <body>.
  useEffect(() => {
    if (!stepChanged.current) return
    if (step === "zip") zipInputRef.current?.focus()
    else headingRef.current?.focus()
  }, [step])

  const goToStep = useCallback((next: "zip" | "city" | "service") => {
    stepChanged.current = true
    setStep(next)
  }, [])

  const handleZipChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeInput(e.target.value).replace(/\D/g, "").slice(0, 5)
    setZip(value)
    if (error) setError("")
  }, [error])

  const chooseCity = useCallback((city: UtahCity) => {
    setCityName(city.name)
    setCitySlug(toCitySlug(city.name))
    goToStep("service")
  }, [goToStep])

  const handleZipSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!searchRateLimiter.isAllowed("hero-search")) {
      setError("Too many attempts. Please wait a moment.")
      return
    }

    const data = new FormData(e.currentTarget)
    const submittedZip = sanitizeInput(String(data.get("zip") ?? zip)).replace(/\D/g, "").slice(0, 5)

    if (!submittedZip || !isValidZipCode(submittedZip)) {
      setError("Please enter a valid 5-digit ZIP code")
      return
    }

    const cities = findCitiesByZip(submittedZip)
    if (cities.length === 0) {
      setError("This ZIP isn't in our service area (North Ogden to Nephi)")
      return
    }

    setZip(submittedZip)
    saveUserInfo(submittedZip)
    try {
      sessionStorage.setItem("property-match-zipcode", submittedZip)
    } catch {
      // Blocked storage (private mode, cookies off): the lookup still works without it.
    }
    setMatches(cities)
    if (cities.length === 1) {
      chooseCity(cities[0])
    } else {
      goToStep("city")
    }
  }, [zip, chooseCity, goToStep])

  const handleServiceClick = useCallback((service: Service) => {
    if (service.key === "invest") {
      router.push(`/${service.path}/opportunities/`)
    } else {
      router.push(`/${service.path}/${citySlug}/`)
    }
  }, [citySlug, router])

  if (step === "city") {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => goToStep("zip")}
            className="text-foreground/50 hover:text-foreground transition-colors"
            aria-label="Change ZIP code"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-medium text-foreground/80 outline-none"
          >
            ZIP <span className="text-primary font-semibold">{zip}</span> covers more than one city. Which is yours?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {matches.map((city) => (
            <button
              key={city.name}
              type="button"
              onClick={() => chooseCity(city)}
              className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-left font-semibold text-foreground text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              {city.name}
              {city.county ? <span className="block text-xs font-normal text-foreground/60 mt-0.5">{city.county} County</span> : null}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === "service") {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => goToStep(matches.length > 1 ? "city" : "zip")}
            className="text-foreground/50 hover:text-foreground transition-colors"
            aria-label={matches.length > 1 ? "Change city" : "Change ZIP code"}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-medium text-foreground/80 outline-none"
          >
            What can we help with in <span className="text-primary font-semibold">{cityName}</span>?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {services.map((svc) => (
            <button
              key={svc.key}
              onClick={() => handleServiceClick(svc)}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors shrink-0">
                <svc.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{svc.label}</p>
                <p className="text-xs text-foreground/60 mt-0.5">{svc.description}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-foreground/40 mt-3 text-center">
          Serving {cityName} and 55+ cities along Utah&apos;s Wasatch Front
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleZipSubmit}
      className="flex w-full max-w-sm flex-wrap items-center gap-2"
      {...webmcpFormAttrs(
        "lookup_utah_zip_services",
        "Find Ondo Real Estate services available for a Utah ZIP code along the Wasatch Front.",
        { autoSubmit: true },
      )}
    >
      <Input
        ref={zipInputRef}
        type="text"
        name="zip"
        placeholder="Enter your ZIP code"
        value={zip}
        onChange={handleZipChange}
        className="flex-1 h-11"
        maxLength={5}
        inputMode="numeric"
        autoComplete="postal-code"
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "hero-zip-error" : undefined}
        {...webmcpParamAttrs("5-digit Utah ZIP code (e.g. 84043)", "zip_code")}
      />
      <Button type="submit" size="lg">
        Get Started
      </Button>
      {error && (
        <p id="hero-zip-error" className="w-full text-left text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
