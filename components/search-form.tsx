"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { saveUserInfo } from "@/lib/session-utils"
import { sanitizeInput, isValidZipCode, RateLimiter } from "@/lib/security"
import { SearchFormData } from "@/lib/types"
import { findCityByZip, toCitySlug } from "@/lib/utah-cities"
import { webmcpFormAttrs, webmcpParamAttrs } from "@/lib/webmcp-attrs"

const searchRateLimiter = new RateLimiter(3, 30000) // 3 attempts per 30 seconds

export function SearchForm() {
  const [formData, setFormData] = useState<SearchFormData>({ zipCode: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize input: only allow digits and limit to 5 characters
    const value = sanitizeInput(e.target.value).replace(/\D/g, "").slice(0, 5)
    setFormData(prev => ({ ...prev, zipCode: value }))

    // Clear error when user starts typing again
    if (error) {
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Rate limiting check
    if (!searchRateLimiter.isAllowed('search-form')) {
      setError("Too many search attempts. Please wait before trying again.")
      toast({
        title: "Rate Limited",
        description: "Please wait 30 seconds before searching again.",
        variant: "destructive",
      })
      return
    }

    const data = new FormData(e.currentTarget)
    const submittedZip = sanitizeInput(String(data.get("zip") ?? formData.zipCode))
    if (!submittedZip || !isValidZipCode(submittedZip)) {
      setError("Please enter a valid ZIP code")
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit ZIP code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Look up city from full utah-cities database
    const city = findCityByZip(submittedZip)

    // Save the ZIP code to session storage
    saveUserInfo(submittedZip)
    sessionStorage.setItem("property-match-zipcode", submittedZip)

    if (city) {
      const slug = toCitySlug(city.name)
      router.push(`/property-management/${slug}/`)
    } else {
      // ZIP not in our service area, route to general properties page
      router.push("/properties/")
      toast({
        title: "ZIP code not in service area",
        description: "We serve Utah's Wasatch Front from North Ogden to Nephi. Showing all properties.",
      })
    }

    setIsLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center gap-2"
      {...webmcpFormAttrs(
        "search_city_by_zip",
        "Look up Ondo property-management coverage for a Utah ZIP code and open that city page.",
        { autoSubmit: true },
      )}
    >
      <Input
        type="text"
        name="zip"
        placeholder="Enter ZIP code (e.g., 84043)"
        value={formData.zipCode}
        onChange={handleZipCodeChange}
        className="flex-1"
        maxLength={5}
        inputMode="numeric"
        autoComplete="postal-code"
        required
        disabled={isLoading}
        aria-describedby={error ? "zip-error" : undefined}
        {...webmcpParamAttrs("5-digit Utah ZIP code (e.g. 84043)", "zip_code")}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
      {error && <p id="zip-error" className="text-sm text-red-500 mt-1" role="alert">{error}</p>}
    </form>
  )
}
