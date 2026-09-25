// Global type declarations for the application

declare module "*.css"

// Google Analytics gtag function
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    /** Meta Pixel, loaded by TrackingTags when NEXT_PUBLIC_META_PIXEL_ID is set. */
    fbq?: (...args: unknown[]) => void;
    /** TikTok Pixel, loaded by TrackingTags when NEXT_PUBLIC_TIKTOK_PIXEL_ID is set. */
    ttq?: { track?: (...args: unknown[]) => void };
    reb2b?: {
      loaded: boolean;
    };
  }
}

export {};
