// Responsive design utilities

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

// Get current breakpoint based on window width
export const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints["2xl"]) return "2xl"
  if (width >= breakpoints.xl) return "xl"
  if (width >= breakpoints.lg) return "lg"
  if (width >= breakpoints.md) return "md"
  if (width >= breakpoints.sm) return "sm"
  return "xs"
}

// Check if current screen size matches breakpoint
export const isBreakpoint = (breakpoint: Breakpoint, width: number): boolean => {
  return width >= breakpoints[breakpoint]
}

// Responsive grid utilities
export const responsiveGrid = {
  // Generate responsive grid classes
  getGridCols: (cols: Partial<Record<Breakpoint, number>>) => {
    const classes: string[] = []
    Object.entries(cols).forEach(([bp, colCount]) => {
      if (bp === "xs") {
        classes.push(`grid-cols-${colCount}`)
      } else {
        classes.push(`${bp}:grid-cols-${colCount}`)
      }
    })
    return classes.join(" ")
  },

  // Generate responsive gap classes
  getGap: (gap: Partial<Record<Breakpoint, number>>) => {
    const classes: string[] = []
    Object.entries(gap).forEach(([bp, gapSize]) => {
      if (bp === "xs") {
        classes.push(`gap-${gapSize}`)
      } else {
        classes.push(`${bp}:gap-${gapSize}`)
      }
    })
    return classes.join(" ")
  },
}

// Responsive spacing utilities
export const responsiveSpacing = {
  // Generate responsive padding classes
  getPadding: (padding: Partial<Record<Breakpoint, number>>) => {
    const classes: string[] = []
    Object.entries(padding).forEach(([bp, paddingSize]) => {
      if (bp === "xs") {
        classes.push(`p-${paddingSize}`)
      } else {
        classes.push(`${bp}:p-${paddingSize}`)
      }
    })
    return classes.join(" ")
  },

  // Generate responsive margin classes
  getMargin: (margin: Partial<Record<Breakpoint, number>>) => {
    const classes: string[] = []
    Object.entries(margin).forEach(([bp, marginSize]) => {
      if (bp === "xs") {
        classes.push(`m-${marginSize}`)
      } else {
        classes.push(`${bp}:m-${marginSize}`)
      }
    })
    return classes.join(" ")
  },
}

// Responsive typography utilities
export const responsiveTypography = {
  // Generate responsive text size classes
  getTextSize: (sizes: Partial<Record<Breakpoint, string>>) => {
    const classes: string[] = []
    Object.entries(sizes).forEach(([bp, size]) => {
      if (bp === "xs") {
        classes.push(`text-${size}`)
      } else {
        classes.push(`${bp}:text-${size}`)
      }
    })
    return classes.join(" ")
  },

  // Generate responsive font weight classes
  getFontWeight: (weights: Partial<Record<Breakpoint, string>>) => {
    const classes: string[] = []
    Object.entries(weights).forEach(([bp, weight]) => {
      if (bp === "xs") {
        classes.push(`font-${weight}`)
      } else {
        classes.push(`${bp}:font-${weight}`)
      }
    })
    return classes.join(" ")
  },
}

// Responsive visibility utilities
export const responsiveVisibility = {
  // Show/hide elements at different breakpoints
  getVisibility: (visibility: Partial<Record<Breakpoint, "show" | "hide">>) => {
    const classes: string[] = []
    Object.entries(visibility).forEach(([bp, action]) => {
      if (action === "hide") {
        if (bp === "xs") {
          classes.push("hidden")
        } else {
          classes.push(`${bp}:hidden`)
        }
      } else {
        if (bp === "xs") {
          classes.push("block")
        } else {
          classes.push(`${bp}:block`)
        }
      }
    })
    return classes.join(" ")
  },
}

// Touch-friendly utilities
export const touchFriendly = {
  // Minimum touch target size (44px)
  minTouchTarget: "min-h-[44px] min-w-[44px]",
  
  // Touch-friendly spacing
  touchSpacing: "p-3",
  
  // Touch-friendly button styles
  button: "min-h-[44px] px-4 py-2 text-base",
  
  // Touch-friendly input styles
  input: "min-h-[44px] px-3 py-2 text-base",
}

// Mobile-first responsive classes
export const mobileFirst = {
  // Container with responsive padding
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  
  // Responsive grid for cards
  cardGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
  
  // Responsive text alignment
  textAlign: "text-center sm:text-left",
  
  // Responsive flex direction
  flexDirection: "flex flex-col sm:flex-row",
  
  // Responsive spacing
  spacing: "space-y-4 sm:space-y-0 sm:space-x-4",
}

// Common responsive patterns
export const patterns = {
  // Hero section responsive layout
  hero: "min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8",
  
  // Card responsive layout
  card: "bg-card rounded-lg shadow-md p-4 sm:p-6",
  
  // Form responsive layout
  form: "max-w-md mx-auto space-y-4 sm:space-y-6",
  
  // Navigation responsive layout
  nav: "flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6",
  
  // Footer responsive layout
  footer: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8",
}

// Responsive image utilities
export const responsiveImages = {
  // Responsive image container
  container: "relative w-full h-48 sm:h-64 lg:h-80",
  
  // Responsive image classes
  image: "object-cover w-full h-full",
  
  // Responsive aspect ratios
  aspectRatio: {
    square: "aspect-square",
    video: "aspect-video",
    photo: "aspect-[4/3]",
    wide: "aspect-[16/9]",
  },
}

// Responsive form utilities
export const responsiveForms = {
  // Form field responsive layout
  field: "space-y-2 sm:space-y-1",
  
  // Form row responsive layout
  row: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  
  // Form button responsive layout
  buttons: "flex flex-col sm:flex-row gap-2 sm:gap-4",
  
  // Form label responsive styles
  label: "text-sm font-medium text-gray-700 sm:text-base",
  
  // Form input responsive styles
  input: "w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent",
}

const responsiveUtils = {
  breakpoints,
  getCurrentBreakpoint,
  isBreakpoint,
  responsiveGrid,
  responsiveSpacing,
  responsiveTypography,
  responsiveVisibility,
  touchFriendly,
  mobileFirst,
  patterns,
  responsiveImages,
  responsiveForms,
}

export default responsiveUtils
