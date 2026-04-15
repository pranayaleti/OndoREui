"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Zap, Plus, RefreshCw, Play } from "lucide-react"
import {
  listRules,
  getTemplates,
  activateTemplate,
  type WorkflowRule,
  type AutomationTemplate,
} from "@/lib/api/workflows"

export function AutomationPanel() {
  const [rules, setRules] = useState<WorkflowRule[]>([])
  const [templates, setTemplates] = useState<AutomationTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const [activating, setActivating] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      listRules().then((r) => setRules(r.rules ?? [])).catch(() => setRules([])),
      getTemplates().then((r) => setTemplates(r.data ?? [])).catch(() => setTemplates([])),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleActivate = async (templateId: string) => {
    try {
      setActivating(templateId)
      await activateTemplate(templateId)
      setShowTemplates(false)
      load()
    } catch {
      // Error handling could be enhanced
    } finally {
      setActivating(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Workflow Automations
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={load} className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => setShowTemplates(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add from Templates
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : rules.length === 0 ? (
            <p className="text-sm text-foreground/70 text-center py-4">
              No automation rules configured. Add from templates to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-foreground/70 text-xs">Trigger: {rule.triggerEvent}</p>
                  </div>
                  <Badge className={rule.enabled ? "bg-green-100 text-green-700" : "bg-muted text-foreground/70"}>
                    {rule.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Automation Templates</DialogTitle>
            <DialogDescription>
              Select a template to create an automation rule.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {templates.length === 0 ? (
              <p className="text-sm text-foreground/70 text-center py-4">No templates available.</p>
            ) : (
              templates.map((t) => (
                <div key={t.id} className="border rounded-md p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-foreground/70">{t.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{t.category}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleActivate(t.id)}
                    disabled={activating === t.id}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {activating === t.id ? "Activating..." : "Activate"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
