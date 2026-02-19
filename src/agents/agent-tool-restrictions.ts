/**
 * Agent tool restrictions for session.prompt calls.
 * OpenCode SDK's session.prompt `tools` parameter expects boolean values.
 * true = tool allowed, false = tool denied.
 */

import { findCaseInsensitive } from "../shared/case-insensitive"

const EXPLORATION_AGENT_DENYLIST: Record<string, boolean> = {
  write: false,
  edit: false,
  task: false,
  delegate_task: false,
  call_grid_agent: false,
}

const AGENT_RESTRICTIONS: Record<string, Record<string, boolean>> = {
  "scout-recon": EXPLORATION_AGENT_DENYLIST,

  "archive-researcher": EXPLORATION_AGENT_DENYLIST,

  "seer-advisor": {
    write: false,
    edit: false,
    task: false,
    delegate_task: false,
  },

  "optic-analyst": {
    read: true,
  },

  "cipher-runner": {
    task: false,
    delegate_task: false,
  },
}

export function getAgentToolRestrictions(agentName: string): Record<string, boolean> {
  return findCaseInsensitive(AGENT_RESTRICTIONS, agentName) ?? {}
}

export function hasAgentToolRestrictions(agentName: string): boolean {
  const restrictions = findCaseInsensitive(AGENT_RESTRICTIONS, agentName)
  return restrictions !== undefined && Object.keys(restrictions).length > 0
}
