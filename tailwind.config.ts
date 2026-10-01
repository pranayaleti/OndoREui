import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // One overlay scale. Keep in sync with OVERLAY_Z_LAYERS in lib/utils.ts (tailwind-merge needs the names).
      // Page chrome (sticky header, chat launchers, sticky bars) stays at z-50 and below.
      zIndex: {
        overlay: "60", // dialog, sheet, drawer backdrops
        modal: "70", // dialog, alert dialog, sheet, drawer panels
        popover: "80", // select, dropdown, popover, tooltip: must open above a modal
        toast: "90", // always on top so form feedback is never hidden
      },
      fontFamily: {
        sans: ['var(--font-family-base)'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          // Use for destructive TEXT. `DEFAULT` is a fill and fails contrast as text on dark.
          emphasis: "hsl(var(--destructive-emphasis))",
        },
        // Readable-as-text status colours; see _design-tokens.css.
        "success-emphasis": "hsl(var(--success-emphasis))",
        "warning-emphasis": "hsl(var(--warning-emphasis))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Photo scrim for banners and heroes. Black in both themes so white text on it keeps 4.5:1; use bg-scrim/60.
        scrim: "hsl(0 0% 0% / <alpha-value>)",
        "accent-1": "rgb(var(--color-accent-1) / <alpha-value>)",
        "accent-2": "rgb(var(--color-accent-2) / <alpha-value>)",
      },
      // Text colour only. `text-primary` resolves to --primary-text (darker orange in the light theme, which
      // fails 4.5:1 as --primary); bg-, border-, ring- and fill utilities keep using --primary.
      textColor: {
        primary: {
          DEFAULT: "hsl(var(--primary-text))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out both",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config
