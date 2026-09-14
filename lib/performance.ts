"use client"

// Performance monitoring utilities
//
// bfcache: Use pagehide/pageshow (lib/bfcache-optimization.ts), not beforeunload/unload,
// for cleanup or analytics. Use sendBeaconOnPagehide() for flushing data on exit.
// Prefer replaceState for in-page state updates so history entries stay bfcache-eligible;
// avoid pushState right before the user navigates away.
//
// Prefetch: do NOT add Speculation Rules or <link rel="prefetch"> — the GitHub Pages origin
// returns 503 for any request carrying `Sec-Purpose: prefetch`. Rely on Next.js <Link> prefetch.
export const performanceMonitor = {
  // Measure page load time
  measurePageLoad: () => {
    if (typeof window !== "undefined" && "performance" in window) {
      const entries = performance.getEntriesByType("navigation")
      const navigation = entries[0] as PerformanceNavigationTiming | undefined
      if (!navigation) return null
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
      }
    }
    return null
  },

  // Measure Core Web Vitals
  measureWebVitals: () => {
    if (typeof window !== "undefined" && "web-vitals" in window) {
      // This would be implemented with the web-vitals library
      return {
        lcp: 0, // Largest Contentful Paint
        fid: 0, // First Input Delay
        cls: 0, // Cumulative Layout Shift
        fcp: 0, // First Contentful Paint
        ttfb: 0, // Time to First Byte
      }
    }
    return null
  },

  // Log performance metrics
  logMetrics: (metrics: unknown) => {
    if (process.env['NODE_ENV'] === "development") {
      return metrics
    }
    return null
  },
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image sizes
  getResponsiveSizes: (baseWidth: number) => {
    return [
      { width: 640, media: "(max-width: 640px)" },
      { width: 768, media: "(max-width: 768px)" },
      { width: 1024, media: "(max-width: 1024px)" },
      { width: 1280, media: "(max-width: 1280px)" },
      { width: baseWidth, media: "(min-width: 1281px)" },
    ]
  },

  // Generate srcSet for responsive images
  generateSrcSet: (src: string, sizes: number[]) => {
    return sizes
      .map((size) => `${src}?w=${size} ${size}w`)
      .join(", ")
  },
}

// Lazy loading utilities
export const lazyLoading = {
  // Intersection Observer for lazy loading
  createObserver: (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      return new IntersectionObserver(callback, {
        rootMargin: "50px",
        threshold: 0.1,
        ...options,
      })
    }
    return null
  },

  // Lazy load images
  lazyLoadImage: (img: HTMLImageElement) => {
    if (img.dataset.src) {
      img.src = img.dataset.src
      img.removeAttribute("data-src")
    }
  },
}

// Bundle analysis utilities
export const bundleAnalysis = {
  // Get bundle size information
  getBundleInfo: () => {
    if (typeof window !== "undefined" && "performance" in window) {
      const resources = performance.getEntriesByType("resource")
      const resourceEntries = resources.filter(
        (resource): resource is PerformanceResourceTiming => resource.entryType === "resource",
      )
      const jsFiles = resourceEntries.filter((resource) => resource.name.includes(".js"))
      const cssFiles = resourceEntries.filter((resource) => resource.name.includes(".css"))
      
      return {
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        totalResources: resourceEntries.length,
        totalSize: resourceEntries.reduce((total, resource) => {
          return total + (resource.transferSize || 0)
        }, 0),
      }
    }
    return null
  },
}
