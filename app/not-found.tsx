"use client"

import Link from "next/link"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileQuestion, Home, Search, Calculator, Users, Building, ArrowLeft, MapPin, Phone } from "lucide-react"
import { SITE_URL, SITE_PHONE, SITE_EMAILS, APP_PORTAL_IS_EXTERNAL, APP_PORTAL_LOGIN_URL } from "@/lib/site"
import SEO from "@/components/seo"

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

  // Track when component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Automatically step back one breadcrumb level for unknown routes.
  // Only runs on client side after mount to avoid build/SSR issues
  useEffect(() => {
    // Only run after component is mounted and in browser
    if (!isMounted || typeof window === "undefined" || hasRedirected.current || !pathname) {
      return
    }

    // Use requestAnimationFrame to ensure this runs after initial render
    const timeoutId = setTimeout(() => {
      // Double-check we haven't redirected and still have a valid pathname
      if (hasRedirected.current || !pathname) return

      // Normalize path by removing trailing slashes (except for root)
      const normalizedPath = pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname

      if (!normalizedPath || normalizedPath === "/") return

      // Find parent path (e.g. /about/careers/kl -> /about/careers)
      const lastSlashIndex = normalizedPath.lastIndexOf("/")

      // If we're already at root or there's no parent, do nothing
      if (lastSlashIndex <= 0) return

      const parentPath = normalizedPath.slice(0, lastSlashIndex) || "/"

      // Avoid redirect loops: only redirect if the parent is different and valid
      if (parentPath !== normalizedPath && parentPath !== pathname) {
        hasRedirected.current = true
        // Use replace to avoid adding to history
        router.replace(parentPath)
      }
    }, 100) // Small delay to ensure hydration is complete

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isMounted, pathname, router])

  const popularPages: { name: string; href: string; icon: React.ReactNode; description: string; external?: boolean }[] = [
    { name: "Properties", href: "/properties", icon: <Building className="h-4 w-4" />, description: "Browse available rentals" },
    { name: "Property Management Portal", href: APP_PORTAL_LOGIN_URL, icon: <Users className="h-4 w-4" />, description: "Owner, tenant, and staff access", external: APP_PORTAL_IS_EXTERNAL },
    { name: "Buy a Home", href: "/buy", icon: <Home className="h-4 w-4" />, description: "Find your dream home" },
    { name: "Sell a Home", href: "/sell", icon: <Home className="h-4 w-4" />, description: "Sell your property" },
    { name: "Mortgage Loans", href: "/loans", icon: <Calculator className="h-4 w-4" />, description: "Get pre-approved" },
    { name: "Calculators", href: "/calculators", icon: <Calculator className="h-4 w-4" />, description: "Real estate calculators" },
    { name: "About Us", href: "/about", icon: <Users className="h-4 w-4" />, description: "Learn about our team" },
    { name: "Contact", href: "/contact", icon: <Phone className="h-4 w-4" />, description: "Get in touch" }
  ]

  const quickActions: { name: string; href: string; icon: React.ReactNode; external?: boolean }[] = [
    { name: "Search Properties", href: "/properties", icon: <Search className="h-5 w-5" /> },
    { name: "Calculate Mortgage", href: "/calculators/mortgage-payment", icon: <Calculator className="h-5 w-5" /> },
    { name: "Property Management Portal", href: APP_PORTAL_LOGIN_URL, icon: <Building className="h-5 w-5" />, external: APP_PORTAL_IS_EXTERNAL },
    { name: "Get Pre-Approved", href: "/loans", icon: <Home className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <SEO
        title="404 - Page Not Found | Ondo Real Estate"
        description="The page you're looking for doesn't exist. Explore our popular pages and find what you need."
        pathname="/404"
        image={`${SITE_URL}/modern-apartment-balcony.webp`}
      />
      
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <FileQuestion className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">Oops! Page Not Found</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off like a lost property key. 
            Don't worry - we'll help you find what you need!
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
            <CardDescription className="text-center">Get back on track with these popular options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) =>
                action.external ? (
                  <a
                    key={index}
                    href={action.href}
                  >
                    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                      {action.icon}
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  </a>
                ) : (
                  <Link key={index} href={action.href}>
                    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                      {action.icon}
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  </Link>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Popular Pages</CardTitle>
            <CardDescription className="text-center">Explore our most visited sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularPages.map((page, index) =>
                page.external ? (
                  <a
                    key={index}
                    href={page.href}
                  >
                    <div className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">{page.icon}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{page.name}</h3>
                          <p className="text-sm text-foreground/70">{page.description}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <Link key={index} href={page.href}>
                    <div className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">{page.icon}</div>
                        <div>
                          <h3 className="font-semibold text-foreground">{page.name}</h3>
                          <p className="text-sm text-foreground/70">{page.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Need Help Finding Something?</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-foreground/70 mb-4">Our team is here to help you navigate our services.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Search className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Try Our Search</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-foreground/70 mb-4">Use our search feature to find properties or information.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/search">Search Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Call Us Directly</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-foreground/70 mb-4">Speak with our team for immediate assistance.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`tel:${SITE_PHONE.replace(/[^+\\d]/g, "")}`}>{SITE_PHONE}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
          
          <div className="text-sm text-foreground/70">
            <p>Still can't find what you're looking for?</p>
            <p>Email us at <a href={`mailto:${SITE_EMAILS.support}`} className="text-primary hover:underline">{SITE_EMAILS.support}</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
