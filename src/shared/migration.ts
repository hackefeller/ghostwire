import * as fs from "fs"
import { log } from "./logger"

// Migration map: old keys → new keys (for backward compatibility)
export const AGENT_NAME_MAP: Record<string, string> = {
  // Cipher Operator variants → "cipher-operator"
  "grid": "cipher-operator",
  "OmO": "cipher-operator",
  "Cipher Operator": "cipher-operator",
  "cipher-operator": "cipher-operator",

  // Augur Planner variants → "augur-planner"
  "OmO-Plan": "augur-planner",
  "grid-plan": "augur-planner",
  "Planner-Cipher Operator": "augur-planner",
  "planner-cipher-operator": "augur-planner",
  "Augur Planner (Planner)": "augur-planner",
  "augur-planner": "augur-planner",

  // Nexus Orchestrator variants → "nexus-orchestrator"
  "orchestrator-cipher-operator": "nexus-orchestrator",
  "Nexus Orchestrator": "nexus-orchestrator",
  "nexus-orchestrator": "nexus-orchestrator",

  // Tactician Strategist variants → "tactician-strategist"
  "plan-consultant": "tactician-strategist",
  "Tactician Strategist (Plan Consultant)": "tactician-strategist",
  "tactician-strategist": "tactician-strategist",

  // Glitch Auditor variants → "glitch-auditor"
  "Glitch Auditor (Plan Reviewer)": "glitch-auditor",
  "glitch-auditor": "glitch-auditor",

  // Cipher Operator-Junior → "cipher-runner"
  "Cipher Operator-Junior": "cipher-runner",
  "cipher-runner": "cipher-runner",

  // Already lowercase - passthrough
  "build": "build",
  "seer-advisor": "seer-advisor",
  "archive-researcher": "archive-researcher",
  "scout-recon": "scout-recon",
  "optic-analyst": "optic-analyst",
}

export const BUILTIN_AGENT_NAMES = new Set([
  "cipher-operator",           // was "Cipher Operator"
  "seer-advisor",
  "archive-researcher",
  "scout-recon",
  "optic-analyst",
  "tactician-strategist",              // was "Tactician Strategist (Plan Consultant)"
  "glitch-auditor",              // was "Glitch Auditor (Plan Reviewer)"
  "augur-planner",         // was "Augur Planner (Planner)"
  "nexus-orchestrator",              // was "Nexus Orchestrator"
  "build",
])

// Migration map: old hook names → new hook names (for backward compatibility)
// null means the hook was removed and should be filtered out from disabled_hooks
export const HOOK_NAME_MAP: Record<string, string | null> = {
  // Legacy names (backward compatibility)
  "anthropic-auto-compact": "grid-anthropic-context-window-limit-recovery",
  "cipher-operator-orchestrator": "nexus-orchestrator",

  // Removed hooks (v3.0.0) - will be filtered out and user warned
  "preemptive-compaction": null,
  "empty-message-sanitizer": null,
}

/**
 * @deprecated LEGACY MIGRATION ONLY
 * 
 * This map exists solely for migrating old configs that used hardcoded model strings.
 * It maps legacy model strings to semantic category names, allowing users to migrate
 * from explicit model configs to category-based configs.
 * 
 * DO NOT add new entries here. New agents should use:
 * - Category-based config (preferred): { category: "unspecified-high" }
 * - Or inherit from OpenCode's config.model
 * 
 * This map will be removed in a future major version once migration period ends.
 */
export const MODEL_TO_CATEGORY_MAP: Record<string, string> = {
  "google/gemini-3-pro": "visual-engineering",
  "google/gemini-3-flash": "writing",
  "openai/gpt-5.2": "ultrabrain",
  "anthropic/claude-haiku-4-5": "quick",
  "anthropic/claude-opus-4-5": "unspecified-high",
  "anthropic/claude-sonnet-4-5": "unspecified-low",
}

export function migrateAgentNames(agents: Record<string, unknown>): { migrated: Record<string, unknown>; changed: boolean } {
  const migrated: Record<string, unknown> = {}
  let changed = false

  for (const [key, value] of Object.entries(agents)) {
    const newKey = AGENT_NAME_MAP[key.toLowerCase()] ?? AGENT_NAME_MAP[key] ?? key
    if (newKey !== key) {
      changed = true
    }
    migrated[newKey] = value
  }

  return { migrated, changed }
}

export function migrateHookNames(hooks: string[]): { migrated: string[]; changed: boolean; removed: string[] } {
  const migrated: string[] = []
  const removed: string[] = []
  let changed = false

  for (const hook of hooks) {
    const mapping = HOOK_NAME_MAP[hook]

    if (mapping === null) {
      removed.push(hook)
      changed = true
      continue
    }

    const newHook = mapping ?? hook
    if (newHook !== hook) {
      changed = true
    }
    migrated.push(newHook)
  }

  return { migrated, changed, removed }
}

export function migrateAgentConfigToCategory(config: Record<string, unknown>): {
  migrated: Record<string, unknown>
  changed: boolean
} {
  const { model, ...rest } = config
  if (typeof model !== "string") {
    return { migrated: config, changed: false }
  }

  const category = MODEL_TO_CATEGORY_MAP[model]
  if (!category) {
    return { migrated: config, changed: false }
  }

  return {
    migrated: { category, ...rest },
    changed: true,
  }
}

export function shouldDeleteAgentConfig(
  config: Record<string, unknown>,
  category: string
): boolean {
  const { DEFAULT_CATEGORIES } = require("../tools/delegate-task/constants")
  const defaults = DEFAULT_CATEGORIES[category]
  if (!defaults) return false

  const keys = Object.keys(config).filter((k) => k !== "category")
  if (keys.length === 0) return true

  for (const key of keys) {
    if (config[key] !== (defaults as Record<string, unknown>)[key]) {
      return false
    }
  }
  return true
}

export function migrateConfigFile(configPath: string, rawConfig: Record<string, unknown>): boolean {
  let needsWrite = false

  if (rawConfig.agents && typeof rawConfig.agents === "object") {
    const { migrated, changed } = migrateAgentNames(rawConfig.agents as Record<string, unknown>)
    if (changed) {
      rawConfig.agents = migrated
      needsWrite = true
    }
  }



  if (rawConfig.omo_agent) {
    rawConfig.cipher_agent = rawConfig.omo_agent
    delete rawConfig.omo_agent
    needsWrite = true
  }

  if (rawConfig.disabled_agents && Array.isArray(rawConfig.disabled_agents)) {
    const migrated: string[] = []
    let changed = false
    for (const agent of rawConfig.disabled_agents as string[]) {
      const newAgent = AGENT_NAME_MAP[agent.toLowerCase()] ?? AGENT_NAME_MAP[agent] ?? agent
      if (newAgent !== agent) {
        changed = true
      }
      migrated.push(newAgent)
    }
    if (changed) {
      rawConfig.disabled_agents = migrated
      needsWrite = true
    }
  }

  if (rawConfig.disabled_hooks && Array.isArray(rawConfig.disabled_hooks)) {
    const { migrated, changed, removed } = migrateHookNames(rawConfig.disabled_hooks as string[])
    if (changed) {
      rawConfig.disabled_hooks = migrated
      needsWrite = true
    }
    if (removed.length > 0) {
      log(`Removed obsolete hooks from disabled_hooks: ${removed.join(", ")} (these hooks no longer exist in v3.0.0)`)
    }
  }

  if (needsWrite) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
      const backupPath = `${configPath}.bak.${timestamp}`
      fs.copyFileSync(configPath, backupPath)

      fs.writeFileSync(configPath, JSON.stringify(rawConfig, null, 2) + "\n", "utf-8")
      log(`Migrated config file: ${configPath} (backup: ${backupPath})`)
    } catch (err) {
      log(`Failed to write migrated config to ${configPath}:`, err)
    }
  }

  return needsWrite
}
