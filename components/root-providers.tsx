"use client"

import type { ReactNode } from "react"
import dynamic from "next/dynamic"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { BfcacheProvider } from "@/components/bfcache-provider"
import { PwaProvider } from "@/components/pwa/pwa-provider"
import { RoutePrefetch } from "@/components/route-prefetch"
import { WebVitalsReporter } from "@/components/web-vitals-reporter"

const ClientConsultationWidget = dynamic(() => import("@/components/ClientConsultationWidget"), {
  loading: () => null,
})

export function RootProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <PwaProvider>
        <BfcacheProvider>
          {children}
          <RoutePrefetch />
          <WebVitalsReporter />
          <ClientConsultationWidget />
          <Toaster />
        </BfcacheProvider>
      </PwaProvider>
    </ThemeProvider>
  )
}
