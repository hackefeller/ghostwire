import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import * as fs from "fs"
import * as path from "path"
import { migrateCompoundEngineering, hasLegacyCompoundConfig } from "../../src/shared/compound-migration"

describe("Compound Engineering Migration", () => {
  const testDir = "/tmp/compound-migration-test"
  const testConfigPath = path.join(testDir, "test-config.json")

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe("Legacy Config Detection", () => {
    test("detects old import structure", () => {
      //#given
      const config = {
        imports: {
          compound: {
            enabled: true,
            path: "/path/to/plugin",
          },
        },
      }

      //#when
      const hasLegacy = hasLegacyCompoundConfig(config)

      //#then
      expect(hasLegacy).toBe(true)
    })

    test("detects old compound_engineering feature structure", () => {
      //#given
      const config = {
        features: {
          compound_engineering: {
            enabled: true,
            path: "/path/to/plugin",
            // Note: no 'components' field - old structure
          },
        },
      }

      //#when
      const hasLegacy = hasLegacyCompoundConfig(config)

      //#then
      expect(hasLegacy).toBe(true)
    })

    test("does not detect new unified structure", () => {
      //#given
      const config = {
        features: {
          compound_engineering: {
            enabled: true,
            components: {
              agents: true,
              commands: true,
              skills: true,
            },
          },
        },
      }

      //#when
      const hasLegacy = hasLegacyCompoundConfig(config)

      //#then
      expect(hasLegacy).toBe(false)
    })
  })

  describe("Agent Migration", () => {
    test("migrates old agent names to compound namespace", () => {
      //#given
      const config = {
        agents: {
          "kieran-rails-reviewer": {
            model: "anthropic/claude-opus-4-5",
          },
        },
      }

      fs.writeFileSync(testConfigPath, JSON.stringify(config))

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.changed).toBe(true)
      expect(result.migratedCount).toBe(1)
      expect(config.agents).toHaveProperty("compound:kieran-rails-reviewer")
    })

    test("preserves already namespaced agents", () => {
      //#given
      const config = {
        agents: {
          "compound:kieran-rails-reviewer": {
            model: "anthropic/claude-opus-4-5",
          },
        },
      }

      fs.writeFileSync(testConfigPath, JSON.stringify(config))

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.changed).toBe(false)
      expect(config.agents).toHaveProperty("compound:kieran-rails-reviewer")
    })
  })

  describe("Command Migration", () => {
    test("migrates disabled_commands to compound namespace", () => {
      //#given
      const config = {
        disabled_commands: ["workflows:plan", "code:refactor"],
      }

      fs.writeFileSync(testConfigPath, JSON.stringify(config))

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.changed).toBe(true)
      expect(result.migratedCount).toBe(2)
      expect((config.disabled_commands as string[]).includes("compound:workflows:plan")).toBe(true)
      expect((config.disabled_commands as string[]).includes("compound:code:refactor")).toBe(true)
    })
  })

  describe("Feature Structure Migration", () => {
    test("upgrades old feature structure to unified format", () => {
      //#given
      const config = {
        // Include an old agent reference to trigger migration
        agents: {
          "kieran-rails-reviewer": { model: "anthropic/claude-opus-4-5" },
        },
        features: {
          compound_engineering: {
            enabled: true,
            path: "/old/path",
            source: "plugin",
          },
        },
      }

      fs.writeFileSync(testConfigPath, JSON.stringify(config))

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.changed).toBe(true)

      const migratedFeature = (config.features as Record<string, unknown>)
        .compound_engineering as Record<string, unknown>
      expect(migratedFeature.components).toBeDefined()
      expect((migratedFeature.components as Record<string, unknown>).agents).toBe(true)
      expect((migratedFeature.components as Record<string, unknown>).commands).toBe(true)
      expect((migratedFeature.components as Record<string, unknown>).skills).toBe(true)
    })
  })

  describe("Migration Safety", () => {
    test("handles no migration needed gracefully", () => {
      //#given
      const config = {
        agents: {
          sisyphus: { model: "anthropic/claude-opus-4-5" },
        },
      }

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.changed).toBe(false)
      expect(result.errors.length).toBe(0)
    })

    test("reports warnings for removed configurations", () => {
      //#given
      const config = {
        imports: {
          compound: { enabled: true },
        },
      }

      fs.writeFileSync(testConfigPath, JSON.stringify(config))

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings[0]).toContain("legacy compound-engineering import")
    })
  })

  describe("End-to-End Migration", () => {
    test("migrates complete legacy configuration", () => {
      //#given
      const config = {
        agents: {
          "kieran-rails-reviewer": { model: "anthropic/claude-opus-4-5" },
          sisyphus: { model: "anthropic/claude-opus-4-5" },
        },
        disabled_commands: ["workflows:plan", "code:refactor"],
        disabled_skills: [],
        features: {
          compound_engineering: {
            enabled: true,
            path: "/old/path",
          },
        },
        imports: {
          compound: { enabled: true },
        },
      }

      fs.writeFileSync(testConfigPath, JSON.stringify(config))

      //#when
      const result = migrateCompoundEngineering(testConfigPath, config)

      //#then
      expect(result.success).toBe(true)
      expect(result.changed).toBe(true)
      expect(result.migratedCount).toBeGreaterThan(0)

      // Verify agents migrated
      expect(config.agents).toHaveProperty("compound:kieran-rails-reviewer")
      expect(config.agents).toHaveProperty("sisyphus")

      // Verify commands migrated
      const disabledCmds = config.disabled_commands as string[]
      expect(disabledCmds.includes("compound:workflows:plan")).toBe(true)
      expect(disabledCmds.includes("compound:code:refactor")).toBe(true)

      // Verify feature structure upgraded
      const feature = (config.features as Record<string, unknown>).compound_engineering as Record<
        string,
        unknown
      >
      expect(feature.components).toBeDefined()

      // Verify import removed
      expect((config.imports as Record<string, unknown>).compound).toBeUndefined()
    })
  })
})
