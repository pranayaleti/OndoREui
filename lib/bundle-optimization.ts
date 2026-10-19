// Bundle optimization utilities
import * as React from "react"
import { lazy } from "react"

// Dynamic imports for code splitting
export const dynamicImports = {
  // Calculator components
  calculators: {
    mortgagePayment: () => import("@/pages/calculators/mortgage-payment-calculator"),
    affordability: () => import("@/pages/calculators/affordability-calculator"),
    income: () => import("@/pages/calculators/income-calculator"),
    closingCost: () => import("@/pages/calculators/closing-cost-calculator"),
    refinance: () => import("@/pages/calculators/refinance-calculator"),
    homeSale: () => import("@/pages/calculators/home-sale-calculator"),
    temporaryBuydown: () => import("@/pages/calculators/temporary-buydown-calculator"),
    rentVsOwn: () => import("@/pages/calculators/rent-vs-own-calculator"),
  },

  // Dashboard components
  dashboard: {
    overview: () => import("@/components/dashboard/dashboard-overview"),
    recentLeads: () => import("@/components/dashboard/recent-leads"),
    propertyTypeDistribution: () => import("@/components/dashboard/property-type-distribution"),
    propertyValueDistribution: () => import("@/components/dashboard/property-value-distribution"),
    maintenanceRequests: () => import("@/components/dashboard/maintenance-requests"),
  },

  // Owner components
  owner: {
    propertyMaintenance: () => import("@/components/owner/property-maintenance"),
    addUnitDialog: () => import("@/components/owner/add-unit-dialog"),
    settingsView: () => import("@/components/owner/settings-view"),
  },

  // Tenant components
  tenant: {
    maintenanceRequestForm: () => import("@/components/tenant/maintenance-request-form"),
    maintenanceRequestDetail: () => import("@/components/tenant/maintenance-request-detail"),
    maintenanceRequestList: () => import("@/components/tenant/maintenance-request-list"),
  },

  // Charts and visualizations
  charts: {
    recharts: () => import("recharts"),
    // chartjs module not found, commenting out until available
    // chartjs: () => import("chart.js"),
  },

  // Heavy libraries
  libraries: {
    html2canvas: () => import("html2canvas"),
    jspdf: () => import("jspdf"),
    dateFns: () => import("date-fns"),
  },
}

// Lazy loading utilities
export const lazyLoading = {
  // Create lazy component with loading fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createLazyComponent: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    const LazyComponent = lazy(importFunc)

    return (props: React.ComponentProps<T>) =>
      React.createElement(
        React.Suspense,
        { fallback: fallback ? React.createElement(fallback) : React.createElement("div", null, "Loading...") },
        React.createElement(LazyComponent, props)
      )
  },

  // Create lazy component with error boundary
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createLazyComponentWithErrorBoundary: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType,
    errorFallback?: React.ComponentType<{ error: Error }>
  ) => {
    const LazyComponent = lazy(importFunc)

    const ComponentWithErrorBoundary = (props: React.ComponentProps<T>) => {
      const [hasError, setHasError] = React.useState(false)
      const [error, setError] = React.useState<Error | null>(null)

      React.useEffect(() => {
        const handleError = (event: ErrorEvent) => {
          setHasError(true)
          setError(event.error)
        }

        window.addEventListener('error', handleError)
        return () => window.removeEventListener('error', handleError)
      }, [])

      if (hasError && errorFallback && error) {
        return React.createElement(errorFallback, { error })
      }

      return React.createElement(
        React.Suspense,
        { fallback: fallback ? React.createElement(fallback) : React.createElement("div", null, "Loading...") },
        React.createElement(LazyComponent, props)
      )
    }

    return ComponentWithErrorBoundary
  },
}

// Bundle analysis utilities
export const bundleAnalysis = {
  // Get bundle size information
  getBundleInfo: () => {
    if (typeof window !== "undefined" && "performance" in window) {
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      const jsFiles = resources.filter((resource) => resource.name.includes(".js"))
      const cssFiles = resources.filter((resource) => resource.name.includes(".css"))
      
      return {
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        totalResources: resources.length,
        totalSize: resources.reduce((total, resource) => {
          return total + (resource.transferSize || 0)
        }, 0),
        jsSize: jsFiles.reduce((total, resource) => {
          return total + (resource.transferSize || 0)
        }, 0),
        cssSize: cssFiles.reduce((total, resource) => {
          return total + (resource.transferSize || 0)
        }, 0),
      }
    }
    return null
  },

  // Log bundle information in development
  logBundleInfo: () => {
    if (process.env['NODE_ENV'] === "development") {
      const info = bundleAnalysis.getBundleInfo()
      if (info) {
        // Expose bundle info for debugging without console noise in linted builds
        return {
          "JS Files": info.jsFiles,
          "CSS Files": info.cssFiles,
          "Total Resources": info.totalResources,
          "Total Size": `${(info.totalSize / 1024).toFixed(2)} KB`,
          "JS Size": `${(info.jsSize / 1024).toFixed(2)} KB`,
          "CSS Size": `${(info.cssSize / 1024).toFixed(2)} KB`,
        }
      }
    }
    return null
  },
}

// Tree shaking utilities - proper examples of tree-shaken imports
export const treeShaking = {
  // Example: Instead of importing entire lodash, import only what you need
  // Correct: import { debounce, throttle } from 'lodash'
  // Wrong: import _ from 'lodash'; _.debounce()

  // Example: Instead of importing all date-fns functions, import individually
  // Correct: import { format } from 'date-fns/format'
  // Wrong: import { format } from 'date-fns'

  // Note: React hooks are already tree-shaken by default
  // import { useState, useEffect } from 'react' - already optimal
}

// Preloading utilities
export const preloading = {
  // Preload critical resources
  preloadCritical: () => {
    if (typeof window !== "undefined") {
      // Preload critical images
      const criticalImages = [
        "/modern-office-building.png",
        "/logo-favicon.png",
      ]

      criticalImages.forEach(src => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
      })

      // Preload critical fonts
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      link.as = "style"
      document.head.appendChild(link)
    }
  },

  // Prefetch next page
  prefetchPage: (href: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = href
      document.head.appendChild(link)
    }
  },

  // Prefetch on hover
  prefetchOnHover: (href: string) => {
    if (typeof window !== "undefined") {
      let prefetched = false
      
      return {
        onMouseEnter: () => {
          if (!prefetched) {
            preloading.prefetchPage(href)
            prefetched = true
          }
        },
      }
    }
    return {}
  },
}

// Resource hints
export const resourceHints = {
  // Add DNS prefetch for external domains
  dnsPrefetch: (domain: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link")
      link.rel = "dns-prefetch"
      link.href = `//${domain}`
      document.head.appendChild(link)
    }
  },

  // Add preconnect for external resources
  preconnect: (url: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link")
      link.rel = "preconnect"
      link.href = url
      document.head.appendChild(link)
    }
  },

  // Add module preload for critical modules
  modulePreload: (url: string) => {
    if (typeof window !== "undefined") {
      const link = document.createElement("link")
      link.rel = "modulepreload"
      link.href = url
      document.head.appendChild(link)
    }
  },
}

// Performance monitoring (simplified for production use)
export const performanceMonitoring = {
  // Simple performance measurement for development
  measureAsync: async <T>(operation: () => Promise<T>, name: string): Promise<T> => {
    const startTime = performance.now()

    try {
      const result = await operation()
      const endTime = performance.now()
      const duration = endTime - startTime

      // Return timing metadata to callers instead of logging to console
      if (process.env['NODE_ENV'] === "development") {
        // Instead of returning a typed object, log the duration and return the result as-is to avoid type errors
        // You can customize this to fit your monitoring/logging solution as well
        // eslint-disable-next-line no-console
        if (typeof console !== "undefined" && console.debug) console.debug(`[Perf] ${name} took ${duration.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime

      const err = error instanceof Error ? error : new Error("Unknown error")
      err.message = `${err.message} (after ${duration.toFixed(2)}ms)`
      throw err
    }
  },
}

const bundleOptimization = {
  dynamicImports,
  lazyLoading,
  bundleAnalysis,
  treeShaking,
  preloading,
  resourceHints,
  performanceMonitoring,
}

export default bundleOptimization
