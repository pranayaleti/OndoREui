/**
 * Declarative WebMCP HTML attributes.
 *
 * Browsers that support the Declarative API read `toolname` / `tooldescription`
 * on `<form>` and `toolparamdescription` / `toolparamtitle` on controls.
 * Other browsers ignore the attributes. See docs/WEBMCP.md.
 */

export type WebmcpFormOptions = {
  /** When true, the agent may submit without a human click. Use only for read-only search/calc. */
  autoSubmit?: boolean
}

/** Attributes for a `<form>` that should register as a WebMCP tool. */
export function webmcpFormAttrs(
  name: string,
  description: string,
  options: WebmcpFormOptions = {},
): Record<string, string> {
  return {
    toolname: name,
    tooldescription: description,
    ...(options.autoSubmit ? { toolautosubmit: "" } : {}),
  }
}

/** Attributes for a form control that should appear in the synthesized JSON Schema. */
export function webmcpParamAttrs(description: string, title?: string): Record<string, string> {
  return {
    toolparamdescription: description,
    ...(title ? { toolparamtitle: title } : {}),
  }
}

/** Chrome SubmitEvent extras for agent-invoked declarative tools. */
export type AgentSubmitEvent = Event & {
  agentInvoked?: boolean
  respondWith?: (result: Promise<unknown>) => void
}

export function isAgentInvokedSubmit(event: Event): boolean {
  return (event as AgentSubmitEvent).agentInvoked === true
}

/**
 * Hand the in-flight submit result back to the agent.
 * Call after `preventDefault()` so the form does not navigate.
 */
export function respondToAgent(event: Event, result: Promise<unknown>): void {
  const submitEvent = event as AgentSubmitEvent
  if (submitEvent.agentInvoked === true && typeof submitEvent.respondWith === "function") {
    submitEvent.respondWith(result)
  }
}

export type ToolActivatedEvent = Event & { toolName?: string }

export function toolEventMatches(event: Event, toolName: string): boolean {
  const name = (event as ToolActivatedEvent).toolName
  return !name || name === toolName
}
