"use client"

import { useMemo, useState, type ReactNode } from "react"
import { BookOpen, ClipboardCheck, ClipboardList, FileText, Home, ShieldAlert } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { TemplateRequestForm } from "@/components/resources/template-request-form"
import {
  ALL_STATES_FILTER,
  RESOURCE_TEMPLATES,
  TEMPLATE_KIND_LABELS,
  filterTemplatesByState,
  templateStateLabel,
  uniqueTemplateStates,
  type ResourceTemplate,
  type TemplateKind,
} from "@/lib/resources/templates"

const KIND_ICONS: Record<TemplateKind, ReactNode> = {
  base_lease: <FileText className="h-6 w-6" aria-hidden="true" />,
  addendum: <FileText className="h-6 w-6" aria-hidden="true" />,
  disclosure: <ShieldAlert className="h-6 w-6" aria-hidden="true" />,
  checklist: <ClipboardList className="h-6 w-6" aria-hidden="true" />,
  playbook: <BookOpen className="h-6 w-6" aria-hidden="true" />,
  other: <Home className="h-6 w-6" aria-hidden="true" />,
}

function iconFor(template: ResourceTemplate): ReactNode {
  if (template.id === "listing-prep-showing-feedback") {
    return <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
  }
  if (template.id === "move-in-checklist") {
    return <ClipboardList className="h-6 w-6" aria-hidden="true" />
  }
  if (template.id === "utility-hoa-addendum") {
    return <Home className="h-6 w-6" aria-hidden="true" />
  }
  return KIND_ICONS[template.kind]
}

export function TemplatesCatalog() {
  const [stateFilter, setStateFilter] = useState(ALL_STATES_FILTER)
  const states = useMemo(() => uniqueTemplateStates(RESOURCE_TEMPLATES), [])
  const visible = useMemo(
    () => filterTemplatesByState(RESOURCE_TEMPLATES, stateFilter),
    [stateFilter],
  )

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <Label htmlFor="template-state-filter" className="text-sm font-medium">
            Filter by state
          </Label>
          <p id="template-state-filter-help" className="mt-1 text-sm text-foreground/70">
            Utah packets are listed first. Nevada includes the federal lead-paint disclosure plus a
            request-for-review card — not a fill-in Nevada statute form.
          </p>
        </div>
        <select
          id="template-state-filter"
          aria-describedby="template-state-filter-help"
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-56"
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value)}
        >
          <option value={ALL_STATES_FILTER}>All states</option>
          {states.map((code) => (
            <option key={code} value={code}>
              {templateStateLabel(code)} ({code})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {visible.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
                {iconFor(t)}
              </div>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="outline">{t.state}</Badge>
                <Badge variant="secondary">{TEMPLATE_KIND_LABELS[t.kind]}</Badge>
              </div>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <div className="flex flex-1 flex-col justify-end gap-4 px-6 pb-6">
              <div>
                <p className="text-sm font-medium">Applies when</p>
                <p className="mt-1 text-sm text-foreground/70">{t.appliesWhen}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Watch for</p>
                <ul className="mt-1 space-y-1 text-sm text-foreground/70">
                  {t.watchFor.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="space-y-1 text-sm text-foreground/70">
                {t.details.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-foreground/60">{t.disclaimer}</p>
              <TemplateRequestForm
                templateId={t.id}
                templateTitle={t.title}
                inquiryType={t.inquiryType}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
