// Environment configuration
export const config = {
  // Site configuration
  site: {
    name: process.env['NEXT_PUBLIC_SITE_NAME'] || "ONDO Real Estate",
    url: process.env['NEXT_PUBLIC_SITE_URL'] || "https://ondorealestate.com",
    phone: process.env['NEXT_PUBLIC_SITE_PHONE'] || "+1-408-538-0420",
    email: process.env['NEXT_PUBLIC_SITE_EMAIL'] || "info@ondorealestate.com",
  },

  // Analytics
  analytics: {
    vercel: {
      enabled: process.env['NODE_ENV'] === "production",
    },
    google: {
      id: process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
      enabled: !!process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
    },
  },

  // API configuration
  api: {
    realEstate: {
      key: process.env['REAL_ESTATE_API_KEY'],
      url: process.env['REAL_ESTATE_API_URL'] || "https://api.realestate.com",
    },
    googleMaps: {
      key: process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'],
      enabled: !!process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'],
    },
  },

  // Database
  database: {
    url: process.env['DATABASE_URL'],
    enabled: !!process.env['DATABASE_URL'],
  },

  // Supabase (publishable key: use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)
  supabase: {
    url: process.env['NEXT_PUBLIC_SUPABASE_URL'],
    anonKey:
      process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'] ||
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    enabled: !!(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] &&
      (process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'] ||
        process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'])
    ),
  },

  // Email
  email: {
    smtp: {
      host: process.env['SMTP_HOST'],
      port: parseInt(process.env['SMTP_PORT'] || "587"),
      user: process.env['SMTP_USER'],
      pass: process.env['SMTP_PASS'],
    },
    enabled: !!(process.env['SMTP_HOST'] && process.env['SMTP_USER'] && process.env['SMTP_PASS']),
  },

  // File upload
  upload: {
    uploadthing: {
      secret: process.env['UPLOADTHING_SECRET'],
      appId: process.env['UPLOADTHING_APP_ID'],
    },
    enabled: !!(process.env['UPLOADTHING_SECRET'] && process.env['UPLOADTHING_APP_ID']),
  },

  // Redis
  redis: {
    url: process.env['REDIS_URL'],
    enabled: !!process.env['REDIS_URL'],
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env['SENTRY_DSN'],
      enabled: !!process.env['SENTRY_DSN'],
    },
  },

  // Environment
  env: {
    isDevelopment: process.env['NODE_ENV'] === "development",
    isProduction: process.env['NODE_ENV'] === "production",
    isTest: process.env['NODE_ENV'] === "test",
  },
}

// Validation function to check required environment variables
export const validateConfig = () => {
  const required = [
    "NEXT_PUBLIC_SITE_URL",
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0 && process.env['NODE_ENV'] === "development") {
    // Only throw in development to help catch configuration issues early
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return missing.length === 0
}

export default config
