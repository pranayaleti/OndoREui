"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type VideoCard = { title: string; duration: string; comingSoon: boolean }

const tabs: Record<string, VideoCard[]> = {
  Owners: [
    { title: "Setting up your owner dashboard", duration: "3:20", comingSoon: true },
    { title: "How to add a property", duration: "2:10", comingSoon: true },
    { title: "Reading your financial report", duration: "4:05", comingSoon: true },
    { title: "Managing maintenance requests", duration: "3:45", comingSoon: true },
  ],
  Tenants: [
    { title: "How to pay rent online", duration: "2:30", comingSoon: true },
    { title: "Submitting a maintenance request", duration: "1:55", comingSoon: true },
    { title: "Accessing your documents", duration: "1:40", comingSoon: true },
    { title: "Messaging your landlord", duration: "1:20", comingSoon: true },
  ],
  Investors: [
    { title: "Understanding portfolio analytics", duration: "5:10", comingSoon: true },
    { title: "Reading your risk score", duration: "3:30", comingSoon: true },
    { title: "Browsing investment opportunities", duration: "4:00", comingSoon: true },
    { title: "Using the AI assistant", duration: "6:15", comingSoon: true },
  ],
  Platform: [
    { title: "Platform overview", duration: "8:00", comingSoon: true },
    { title: "AI assistant deep dive", duration: "7:30", comingSoon: true },
    { title: "Vendor management", duration: "4:45", comingSoon: true },
    { title: "Setting up notifications", duration: "2:50", comingSoon: true },
  ],
}

const tabKeys = Object.keys(tabs)

export function VideoTabs() {
  const [active, setActive] = useState(tabKeys[0])

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-8">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              active === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tabs[active].map(({ title, duration, comingSoon }) => (
          <Card key={title} className="border border-border">
            <div className="w-full aspect-video bg-muted rounded-t border-b border-border flex items-center justify-center">
              <Play className="h-8 w-8 text-foreground/30" />
            </div>
            <CardContent className="p-4 flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/50">{duration}</span>
                {comingSoon && (
                  <span className="text-xs bg-muted text-foreground/50 px-2 py-0.5 rounded-full border border-border">Coming soon</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
