"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { findCityByZip, toCitySlug } from "@/lib/utah-cities"
import { sanitizeInput, isValidZipCode, RateLimiter } from "@/lib/security"
import { saveUserInfo } from "@/lib/session-utils"
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
  const [cityName, setCityName] = useState("")
  const [citySlug, setCitySlug] = useState("")
  const [step, setStep] = useState<"zip" | "service">("zip")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleZipChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeInput(e.target.value).replace(/\D/g, "").slice(0, 5)
    setZip(value)
    if (error) setError("")
  }, [error])

  const handleZipSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()

    if (!searchRateLimiter.isAllowed("hero-search")) {
      setError("Too many attempts. Please wait a moment.")
      return
    }

    if (!zip || !isValidZipCode(zip)) {
      setError("Please enter a valid 5-digit ZIP code")
      return
    }

    const city = findCityByZip(zip)
    if (city) {
      setCityName(city.name)
      setCitySlug(toCitySlug(city.name))
      setStep("service")
      saveUserInfo(zip)
      sessionStorage.setItem("property-match-zipcode", zip)
    } else {
      setError("This ZIP isn't in our service area (North Ogden to Nephi)")
    }
  }, [zip])

  const handleServiceClick = useCallback((service: Service) => {
    if (service.key === "invest") {
      router.push(`/${service.path}/opportunities/`)
    } else {
      router.push(`/${service.path}/${citySlug}/`)
    }
  }, [citySlug, router])

  if (step === "service") {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setStep("zip")}
            className="text-foreground/50 hover:text-foreground transition-colors"
            aria-label="Change ZIP code"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <p className="text-lg font-medium text-foreground/80">
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
    <form onSubmit={handleZipSubmit} className="flex w-full max-w-sm items-center gap-2">
      <Input
        type="text"
        placeholder="Enter your ZIP code"
        value={zip}
        onChange={handleZipChange}
        className="flex-1 h-11"
        maxLength={5}
        aria-describedby={error ? "hero-zip-error" : undefined}
        autoComplete="postal-code"
      />
      <Button type="submit" size="lg">
        Get Started
      </Button>
      {error && (
        <p id="hero-zip-error" className="absolute -bottom-6 left-0 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
