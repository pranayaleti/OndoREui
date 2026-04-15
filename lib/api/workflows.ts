import { networkFirstGet, postJson, putJson, deleteJson } from "@/lib/api/http"

export interface WorkflowRule {
  id: string
  name: string
  description: string | null
  triggerEvent: string
  conditions: unknown[]
  actions: unknown[]
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface AutomationTemplate {
  id: string
  name: string
  description: string
  category: string
  triggerEvent: string
  defaultConditions: unknown[]
  defaultActions: unknown[]
}

export interface ExecutionLogEntry {
  id: string
  ruleId: string
  triggerEvent: string
  payload: unknown
  actionsExecuted: number
  status: string
  executedAt: string
}

export async function listRules(): Promise<{ rules: WorkflowRule[] }> {
  return networkFirstGet<{ rules: WorkflowRule[] }>(
    "/api/workflows/rules",
    "workflow-rules"
  )
}

export async function createRule(rule: {
  name: string
  description?: string
  triggerEvent: string
  conditions?: unknown[]
  actions: unknown[]
}): Promise<{ rule: WorkflowRule }> {
  return postJson<{ rule: WorkflowRule }>("/api/workflows/rules", rule)
}

export async function updateRule(
  id: string,
  updates: Partial<WorkflowRule>
): Promise<{ rule: WorkflowRule }> {
  return putJson<{ rule: WorkflowRule }>(`/api/workflows/rules/${id}`, updates)
}

export async function deleteRule(id: string): Promise<void> {
  await deleteJson(`/api/workflows/rules/${id}`)
}

export async function getTemplates(
  category?: string
): Promise<{ data: AutomationTemplate[] }> {
  const query = category ? `?category=${category}` : ""
  return networkFirstGet<{ data: AutomationTemplate[] }>(
    `/api/workflows/templates${query}`,
    `workflow-templates-${category ?? "all"}`
  )
}

export async function activateTemplate(
  templateId: string,
  overrides?: Record<string, unknown>
): Promise<{ data: WorkflowRule }> {
  return postJson<{ data: WorkflowRule }>(
    `/api/workflows/templates/${templateId}/activate`,
    overrides ?? {}
  )
}

export async function getExecutionLog(
  ruleId?: string
): Promise<{ data: ExecutionLogEntry[] }> {
  const query = ruleId ? `?ruleId=${ruleId}` : ""
  return networkFirstGet<{ data: ExecutionLogEntry[] }>(
    `/api/workflows/execution-log${query}`,
    `workflow-log-${ruleId ?? "all"}`
  )
}

export async function getAutomationStats(): Promise<{ data: Record<string, unknown> }> {
  return networkFirstGet<{ data: Record<string, unknown> }>(
    "/api/workflows/stats",
    "workflow-stats"
  )
}
