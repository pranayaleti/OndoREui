/**
 * Critical CSS utilities
 * Helps identify and inline critical CSS for above-the-fold content
 */

export const criticalCSS = {
  /**
   * Get critical CSS classes that should be inlined
   * These are classes used in above-the-fold content
   */
  getCriticalClasses: () => [
    // Layout classes
    'container',
    'mx-auto',
    'px-4',
    'flex',
    'flex-col',
    'min-h-screen',
    'relative',
    'absolute',
    'inset-0',
    'z-10',
    'z-20',
    
    // Typography
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'font-extrabold',
    'font-bold',
    'text-center',
    'text-foreground',
    'text-foreground/70',
    
    // Backgrounds
    'bg-background',
    'bg-card',
    'bg-gradient-to-r',
    'bg-gradient-to-b',
    'dark:bg-gradient-to-b',
    'dark:from-background',
    'dark:to-card',
    
    // Spacing
    'mb-4',
    'mb-8',
    'py-20',
    'py-32',
    'max-w-2xl',
    'max-w-md',
    
    // Common utilities
    'opacity-20',
    'dark:bg-transparent',
  ],

  /**
   * Generate critical CSS string
   */
  generateCriticalCSS: () => {
    // This would be used to inline critical CSS
    // In a real implementation, you'd extract actual CSS rules
    return `
      .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
      .min-h-screen { min-height: 100vh; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .relative { position: relative; }
      .absolute { position: absolute; }
      .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    `
  },
}

