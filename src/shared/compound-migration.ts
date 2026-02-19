import * as fs from "fs"
import { log } from "./logger"

/**
 * Compound Engineering Component Migration
 *
 * Handles migration from old compound-engineering plugin imports to unified
 * ghostwire configuration. Automatically upgrades:
 * - Old import-based configuration to unified configuration
 * - Legacy component references to namespaced components
 * - Configuration structure updates with validation
 */

export interface CompoundMigrationResult {
  success: boolean
  changed: boolean
  migratedCount: number
  warnings: string[]
  errors: string[]
}

/**
 * Compound component name mapping for backward compatibility
 * Maps old component names to new namespaced names
 */
const COMPOUND_AGENT_MIGRATION_MAP: Record<string, string> = {
  // Review agents
  "kieran-rails-reviewer": "grid:kieran-rails-reviewer",
  "kieran-python-reviewer": "grid:kieran-python-reviewer",
  "kieran-typescript-reviewer": "grid:kieran-typescript-reviewer",
  "dhh-rails-reviewer": "grid:dhh-rails-reviewer",
  "code-simplicity-reviewer": "grid:code-simplicity-reviewer",

  // Research agents
  "framework-docs-researcher": "grid:framework-docs-researcher",
  "learnings-researcher": "grid:learnings-researcher",
  "best-practices-researcher": "grid:best-practices-researcher",
  "git-history-analyzer": "grid:git-history-analyzer",

  // Design agents
  "figma-design-sync": "grid:figma-design-sync",
  "design-implementation-reviewer": "grid:design-implementation-reviewer",
  "design-iterator": "grid:design-iterator",
  "frontend-design": "grid:frontend-design",

  // Workflow agents
  "spec-flow-analyzer": "grid:spec-flow-analyzer",
  "agent-native-architecture": "grid:agent-native-architecture",
  "deployment-verification-agent": "grid:deployment-verification-agent",

  // Documentation agents
  "ankane-readme-writer": "grid:ankane-readme-writer",
  "skill-creator": "grid:skill-creator",
  "create-agent-skills": "grid:create-agent-skills",

  // Existing compound agents (already namespaced)
  "grid:kieran-rails-reviewer": "grid:kieran-rails-reviewer",
  "grid:kieran-python-reviewer": "grid:kieran-python-reviewer",
  "grid:kieran-typescript-reviewer": "grid:kieran-typescript-reviewer",
  "grid:dhh-rails-reviewer": "grid:dhh-rails-reviewer",
}

const COMPOUND_COMMAND_MIGRATION_MAP: Record<string, string> = {
  // Old format → new format with grid: prefix
  "workflows:plan": "grid:workflows:plan",
  "workflows:create": "grid:workflows:create",
  "workflows:status": "grid:workflows:status",
  "workflows:complete": "grid:workflows:complete",
  "code:refactor": "grid:code:refactor",
  "code:review": "grid:code:review",
  "code:optimize": "grid:code:optimize",
  "code:format": "grid:code:format",
  "git:smart-commit": "grid:git:smart-commit",
  "git:branch": "grid:git:branch",
  "git:merge": "grid:git:merge",
  "git:cleanup": "grid:git:cleanup",
  "project:init": "grid:project:init",
  "project:build": "grid:project:build",
  "project:deploy": "grid:project:deploy",
  "project:test": "grid:project:test",
  "util:clean": "grid:util:clean",
  "util:backup": "grid:util:backup",
  "util:restore": "grid:util:restore",
  "util:doctor": "grid:util:doctor",
  "docs:deploy-docs": "grid:docs:deploy-docs",
  "docs:release-docs": "grid:docs:release-docs",
  "docs:feature-video": "grid:docs:feature-video",
  "docs:test-browser": "grid:docs:test-browser",
}

const COMPOUND_SKILL_MIGRATION_MAP: Record<string, string> = {
  // Add compound skill migrations as needed
  // Legacy names → new namespaced names
}

/**
 * Check if configuration has old compound-engineering import structure
 */
export function hasLegacyCompoundConfig(config: Record<string, unknown>): boolean {
  // Check for old import structure
  const imports = (config.imports as Record<string, unknown>) ?? {}
  if (imports.compound || imports["compound-engineering"]) {
    return true
  }

  // Check for old features structure with compound_engineering
  const features = (config.features as Record<string, unknown>) ?? {}
  const oldCompoundConfig = features.compound_engineering as Record<string, unknown>
  if (oldCompoundConfig && !oldCompoundConfig.components) {
    // Old structure without components field
    return true
  }

  return false
}

/**
 * Migrate agents configuration for compound engineering
 */
function migrateCompoundAgents(agents: Record<string, unknown>): {
  migrated: Record<string, unknown>
  changed: boolean
  migratedCount: number
} {
  const migrated: Record<string, unknown> = {}
  let changed = false
  let migratedCount = 0

  for (const [key, value] of Object.entries(agents)) {
    const newKey = COMPOUND_AGENT_MIGRATION_MAP[key] ?? key
    if (newKey !== key) {
      changed = true
      migratedCount++
    }
    migrated[newKey] = value
  }

  return { migrated, changed, migratedCount }
}

/**
 * Migrate commands configuration for compound engineering
 */
function migrateCompoundCommands(
  disabledCommands: string[]
): {
  migrated: string[]
  changed: boolean
  migratedCount: number
} {
  const migrated: string[] = []
  let changed = false
  let migratedCount = 0

  for (const cmd of disabledCommands) {
    const newCmd = COMPOUND_COMMAND_MIGRATION_MAP[cmd] ?? cmd
    if (newCmd !== cmd) {
      changed = true
      migratedCount++
    }
    migrated.push(newCmd)
  }

  return { migrated, changed, migratedCount }
}

/**
 * Migrate skills configuration for compound engineering
 */
function migrateCompoundSkills(
  disabledSkills: string[]
): {
  migrated: string[]
  changed: boolean
  migratedCount: number
} {
  const migrated: string[] = []
  let changed = false
  let migratedCount = 0

  for (const skill of disabledSkills) {
    const newSkill = COMPOUND_SKILL_MIGRATION_MAP[skill] ?? skill
    if (newSkill !== skill) {
      changed = true
      migratedCount++
    }
    migrated.push(newSkill)
  }

  return { migrated, changed, migratedCount }
}

/**
 * Migrate legacy compound-engineering configuration to unified format
 */
export function migrateCompoundEngineering(
  configPath: string,
  rawConfig: Record<string, unknown>
): CompoundMigrationResult {
  const result: CompoundMigrationResult = {
    success: false,
    changed: false,
    migratedCount: 0,
    warnings: [],
    errors: [],
  }

  try {
    let hasLegacyStructure = hasLegacyCompoundConfig(rawConfig)

    // Migrate agents (regardless of legacy config - support manual name updates)
    if (rawConfig.agents && typeof rawConfig.agents === "object") {
      const { migrated, changed, migratedCount } = migrateCompoundAgents(
        rawConfig.agents as Record<string, unknown>
      )
      if (changed) {
        rawConfig.agents = migrated
        result.changed = true
        result.migratedCount += migratedCount
        hasLegacyStructure = true // Found compound components to migrate
      }
    }

    // Migrate disabled_agents
    if (rawConfig.disabled_agents && Array.isArray(rawConfig.disabled_agents)) {
      const { migrated, changed, migratedCount } = migrateCompoundCommands(
        rawConfig.disabled_agents as string[]
      )
      if (changed) {
        rawConfig.disabled_agents = migrated
        result.changed = true
        result.migratedCount += migratedCount
      }
    }

    // Migrate disabled_commands
    if (rawConfig.disabled_commands && Array.isArray(rawConfig.disabled_commands)) {
      const { migrated, changed, migratedCount } = migrateCompoundCommands(
        rawConfig.disabled_commands as string[]
      )
      if (changed) {
        rawConfig.disabled_commands = migrated
        result.changed = true
        result.migratedCount += migratedCount
        hasLegacyStructure = true
      }
    }

    // Migrate disabled_skills
    if (rawConfig.disabled_skills && Array.isArray(rawConfig.disabled_skills)) {
      const { migrated, changed, migratedCount } = migrateCompoundSkills(
        rawConfig.disabled_skills as string[]
      )
      if (changed) {
        rawConfig.disabled_skills = migrated
        result.changed = true
        result.migratedCount += migratedCount
      }
    }

    // Remove old import structure
    if ((rawConfig.imports as Record<string, unknown>)?.compound) {
      delete (rawConfig.imports as Record<string, unknown>).compound
      result.changed = true
      result.warnings.push(
        "Removed legacy compound-engineering import configuration. All components are now built-in."
      )
    }

    if ((rawConfig.imports as Record<string, unknown>)?.["compound-engineering"]) {
      delete (rawConfig.imports as Record<string, unknown>)["compound-engineering"]
      result.changed = true
    }

    // Migrate features structure (only if we found legacy config or components to migrate)
    if (hasLegacyStructure) {
      const features = (rawConfig.features as Record<string, unknown>) ?? {}
      const oldCompoundConfig = features.compound_engineering as Record<string, unknown>

      if (oldCompoundConfig && !oldCompoundConfig.components) {
        // Create new unified structure for old feature config
        features.compound_engineering = {
          enabled: oldCompoundConfig.enabled ?? true,
          components: {
            agents: true,
            commands: true,
            skills: true,
          },
          namespace: "compound",
          disabled_components: [],
          migration_version: "2.0.0",
          migrated_at: new Date().toISOString(),
        }
        result.warnings.push(
          "Upgraded compound engineering configuration to unified format. Migration version: 2.0.0"
        )
      }
    }

    // Write back if changed
    if (result.changed) {
      try {
        const configContent = JSON.stringify(rawConfig, null, 2)
        fs.writeFileSync(configPath, configContent, "utf-8")
        log(`[CompoundMigration] Migrated ${result.migratedCount} components in ${configPath}`)
      } catch (writeErr) {
        result.errors.push(
          `Failed to write migrated config: ${writeErr instanceof Error ? writeErr.message : String(writeErr)}`
        )
        return result
      }
    }

    result.success = true
    return result
  } catch (err) {
    result.errors.push(
      `Migration failed: ${err instanceof Error ? err.message : String(err)}`
    )
    return result
  }
}

/**
 * Create backup before migration (safety mechanism)
 */
export function createConfigBackup(configPath: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const backupPath = `${configPath}.backup.${timestamp}`
  try {
    fs.copyFileSync(configPath, backupPath)
    log(`[CompoundMigration] Created backup at ${backupPath}`)
    return backupPath
  } catch (err) {
    log(`[CompoundMigration] Warning: Failed to create backup - ${err}`)
    return ""
  }
}
