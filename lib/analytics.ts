// Analytics and tracking utilities

const GA_ID = process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] ?? '';

export const analytics = {
  // Track page views
  trackPageView: (url: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag && GA_ID) {
      window.gtag('config', GA_ID, {
        page_title: title,
        page_location: url,
      })
    }
  },

  // Track custom events
  trackEvent: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  },

  // Track form submissions
  trackFormSubmission: (formName: string, success: boolean = true) => {
    analytics.trackEvent(
      success ? 'form_submit_success' : 'form_submit_error',
      'form_interaction',
      formName
    )
  },

  // Track property views
  trackPropertyView: (propertyId: string, propertyName: string) => {
    analytics.trackEvent('view_property', 'property_interaction', propertyName)
  },

  // Track search queries
  trackSearch: (query: string, resultsCount: number) => {
    analytics.trackEvent('search', 'search_interaction', query, resultsCount)
  },

  // Track lead generation
  trackLeadGeneration: (source: string, propertyId?: string) => {
    analytics.trackEvent('generate_lead', 'lead_generation', source)
    if (propertyId) {
      analytics.trackEvent('property_lead', 'lead_generation', propertyId)
    }
  },

  // Track calculator usage
  trackCalculatorUsage: (calculatorName: string, _inputs: Record<string, unknown>) => {
    analytics.trackEvent('use_calculator', 'calculator_interaction', calculatorName)
  },

  // Track user engagement
  trackEngagement: (action: string, element: string) => {
    analytics.trackEvent(action, 'user_engagement', element)
  },
}

// Define type for Web Vitals metric
interface WebVitalsMetric {
  name: string;
  id: string;
  value: number;
}

// Performance tracking
export const performanceTracking = {
  // Track Core Web Vitals
  trackWebVitals: (metric: WebVitalsMetric) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
  },

  // Track page load performance
  trackPageLoad: (loadTime: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_load_time', {
        event_category: 'Performance',
        value: Math.round(loadTime),
        non_interaction: true,
      })
    }
  },
}

// E-commerce tracking for real estate
export const ecommerceTracking = {
  // Track property interest
  trackPropertyInterest: (propertyId: string, propertyName: string, price: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'USD',
        value: price,
        items: [{
          item_id: propertyId,
          item_name: propertyName,
          category: 'Real Estate',
          price: price,
        }]
      })
    }
  },

  // Track lead conversion
  trackLeadConversion: (propertyId: string, propertyName: string, leadValue: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `lead_${Date.now()}`,
        value: leadValue,
        currency: 'USD',
        items: [{
          item_id: propertyId,
          item_name: propertyName,
          category: 'Real Estate Lead',
          price: leadValue,
        }]
      })
    }
  },
}
