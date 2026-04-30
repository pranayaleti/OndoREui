import { useEffect, useState } from 'react'
import { performanceTracking } from '@/lib/analytics'

interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window === 'undefined' || !window.performance) {
        setIsLoading(false)
        return
      }

      try {
        // Get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

        // Get paint timing
        const paintEntries = performance.getEntriesByType('paint')
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0

        // Get LCP
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
        const largestContentfulPaint = lcpEntries[lcpEntries.length - 1]?.startTime || 0

        // Get FID (if available)
        const fidEntries = performance.getEntriesByType('first-input')
        const firstInputEntry = fidEntries[0]
        const firstInputDelay =
          firstInputEntry && 'processingStart' in firstInputEntry && typeof (firstInputEntry as PerformanceEventTiming).processingStart === 'number'
            ? (firstInputEntry as PerformanceEventTiming).processingStart - firstInputEntry.startTime
            : 0

        // Get CLS (if available)
        const clsEntries = performance.getEntriesByType('layout-shift')
        const cumulativeLayoutShift = clsEntries.reduce((cls, entry) => {
          // LayoutShift entries expose `value` but the DOM type isn't always available.
          return cls + (entry as PerformanceEntry & { value: number }).value
        }, 0)

        const performanceMetrics: PerformanceMetrics = {
          loadTime,
          domContentLoaded,
          firstContentfulPaint,
          largestContentfulPaint,
          firstInputDelay,
          cumulativeLayoutShift,
        }

        setMetrics(performanceMetrics)
        
        // Track performance metrics
        performanceTracking.trackPageLoad(loadTime)
        
        // Track Core Web Vitals
        if (firstContentfulPaint > 0) {
          performanceTracking.trackWebVitals({
            name: 'FCP',
            value: firstContentfulPaint,
            id: 'fcp'
          })
        }
        
        if (largestContentfulPaint > 0) {
          performanceTracking.trackWebVitals({
            name: 'LCP',
            value: largestContentfulPaint,
            id: 'lcp'
          })
        }
        
        if (firstInputDelay > 0) {
          performanceTracking.trackWebVitals({
            name: 'FID',
            value: firstInputDelay,
            id: 'fid'
          })
        }
        
        if (cumulativeLayoutShift > 0) {
          performanceTracking.trackWebVitals({
            name: 'CLS',
            value: cumulativeLayoutShift,
            id: 'cls'
          })
        }

      } catch (error) {
        console.error('Error measuring performance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance()
      return undefined
    }
    window.addEventListener('load', measurePerformance)
    return () => window.removeEventListener('load', measurePerformance)
  }, [])

  return { metrics, isLoading }
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (process.env['NODE_ENV'] === 'development') {
        // eslint-disable-next-line no-console -- intentional dev-only render-time logging
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
      }
      
      // Track render performance
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'component_render', {
          event_category: 'Performance',
          event_label: componentName,
          value: Math.round(renderTime),
        })
      }
    }
  }, [componentName])
}

// Hook for measuring API call performance
export function useApiPerformance() {
  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Track API performance
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'api_call', {
          event_category: 'Performance',
          event_label: endpoint,
          value: Math.round(duration),
        })
      }
      
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Track API error
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'api_error', {
          event_category: 'Performance',
          event_label: endpoint,
          value: Math.round(duration),
        })
      }
      
      throw error
    }
  }
  
  return { measureApiCall }
}
