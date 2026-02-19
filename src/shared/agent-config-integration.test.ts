import { describe, test, expect } from "bun:test"
import { migrateAgentNames } from "./migration"
import { getAgentDisplayName } from "./agent-display-names"
import { AGENT_MODEL_REQUIREMENTS } from "./model-requirements"

describe("Agent Config Integration", () => {
  describe("Old format config migration", () => {
    test("migrates old format agent keys to lowercase", () => {
      // #given - config with old format keys
      const oldConfig = {
        "Cipher Operator": { model: "anthropic/claude-opus-4-5" },
        "Nexus Orchestrator": { model: "anthropic/claude-opus-4-5" },
        "Augur Planner (Planner)": { model: "anthropic/claude-opus-4-5" },
        "Tactician Strategist (Plan Consultant)": { model: "anthropic/claude-sonnet-4-5" },
        "Glitch Auditor (Plan Reviewer)": { model: "anthropic/claude-sonnet-4-5" },
      }

      // #when - migration is applied
      const result = migrateAgentNames(oldConfig)

      // #then - keys are lowercase
      expect(result.migrated).toHaveProperty("cipher-operator")
      expect(result.migrated).toHaveProperty("nexus-orchestrator")
      expect(result.migrated).toHaveProperty("augur-planner")
      expect(result.migrated).toHaveProperty("tactician-strategist")
      expect(result.migrated).toHaveProperty("glitch-auditor")

      // #then - old keys are removed
      expect(result.migrated).not.toHaveProperty("Cipher Operator")
      expect(result.migrated).not.toHaveProperty("Nexus Orchestrator")
      expect(result.migrated).not.toHaveProperty("Augur Planner (Planner)")
      expect(result.migrated).not.toHaveProperty("Tactician Strategist (Plan Consultant)")
      expect(result.migrated).not.toHaveProperty("Glitch Auditor (Plan Reviewer)")

      // #then - values are preserved
      expect(result.migrated["cipher-operator"]).toEqual({ model: "anthropic/claude-opus-4-5" })
      expect(result.migrated["nexus-orchestrator"]).toEqual({ model: "anthropic/claude-opus-4-5" })
      expect(result.migrated["augur-planner"]).toEqual({ model: "anthropic/claude-opus-4-5" })
      
      // #then - changed flag is true
      expect(result.changed).toBe(true)
    })

    test("preserves already lowercase keys", () => {
      // #given - config with lowercase keys
      const config = {
        "cipher-operator": { model: "anthropic/claude-opus-4-5" },
        "seer-advisor": { model: "openai/gpt-5.2" },
        "archive-researcher": { model: "opencode/glm-4.7-free" },
      }

      // #when - migration is applied
      const result = migrateAgentNames(config)

      // #then - keys remain unchanged
      expect(result.migrated).toEqual(config)
      
      // #then - changed flag is false
      expect(result.changed).toBe(false)
    })

    test("handles mixed case config", () => {
      // #given - config with mixed old and new format
      const mixedConfig = {
        "Cipher Operator": { model: "anthropic/claude-opus-4-5" },
        "seer-advisor": { model: "openai/gpt-5.2" },
        "Augur Planner (Planner)": { model: "anthropic/claude-opus-4-5" },
        "archive-researcher": { model: "opencode/glm-4.7-free" },
      }

      // #when - migration is applied
      const result = migrateAgentNames(mixedConfig)

      // #then - all keys are lowercase
      expect(result.migrated).toHaveProperty("cipher-operator")
      expect(result.migrated).toHaveProperty("seer-advisor")
      expect(result.migrated).toHaveProperty("augur-planner")
      expect(result.migrated).toHaveProperty("archive-researcher")
      expect(Object.keys(result.migrated).every((key) => key === key.toLowerCase())).toBe(true)
      
      // #then - changed flag is true
      expect(result.changed).toBe(true)
    })
  })

  describe("Display name resolution", () => {
    test("returns correct display names for all builtin agents", () => {
      // #given - lowercase config keys
      const agents = ["cipher-operator", "nexus-orchestrator", "augur-planner", "tactician-strategist", "glitch-auditor", "seer-advisor", "archive-researcher", "scout-recon", "optic-analyst"]

      // #when - display names are requested
      const displayNames = agents.map((agent) => getAgentDisplayName(agent))

      // #then - display names are correct
      expect(displayNames).toContain("Cipher Operator (Ultraworker)")
      expect(displayNames).toContain("Nexus Orchestrator (Plan Execution Orchestrator)")
      expect(displayNames).toContain("Augur Planner (Plan Builder)")
      expect(displayNames).toContain("Tactician Strategist (Plan Consultant)")
      expect(displayNames).toContain("Glitch Auditor (Plan Reviewer)")
      expect(displayNames).toContain("seer-advisor")
      expect(displayNames).toContain("archive-researcher")
      expect(displayNames).toContain("scout-recon")
      expect(displayNames).toContain("optic-analyst")
    })

    test("handles lowercase keys case-insensitively", () => {
      // #given - various case formats of lowercase keys
      const keys = ["Cipher Operator", "Nexus Orchestrator", "CIPHER-OPERATOR", "nexus-orchestrator", "augur-planner", "AUGUR-PLANNER"]

      // #when - display names are requested
      const displayNames = keys.map((key) => getAgentDisplayName(key))

      // #then - correct display names are returned
      expect(displayNames[0]).toBe("Cipher Operator (Ultraworker)")
      expect(displayNames[1]).toBe("Nexus Orchestrator (Plan Execution Orchestrator)")
      expect(displayNames[2]).toBe("Cipher Operator (Ultraworker)")
      expect(displayNames[3]).toBe("Nexus Orchestrator (Plan Execution Orchestrator)")
      expect(displayNames[4]).toBe("Augur Planner (Plan Builder)")
      expect(displayNames[5]).toBe("Augur Planner (Plan Builder)")
    })

    test("returns original key for unknown agents", () => {
      // #given - unknown agent key
      const unknownKey = "custom-agent"

      // #when - display name is requested
      const displayName = getAgentDisplayName(unknownKey)

      // #then - original key is returned
      expect(displayName).toBe(unknownKey)
    })
  })

  describe("Model requirements integration", () => {
    test("all model requirements use lowercase keys", () => {
      // #given - AGENT_MODEL_REQUIREMENTS object
      const agentKeys = Object.keys(AGENT_MODEL_REQUIREMENTS)

      // #when - checking key format
      const allLowercase = agentKeys.every((key) => key === key.toLowerCase())

      // #then - all keys are lowercase
      expect(allLowercase).toBe(true)
    })

    test("model requirements include all builtin agents", () => {
      // #given - expected builtin agents
      const expectedAgents = ["cipher-operator", "nexus-orchestrator", "augur-planner", "tactician-strategist", "glitch-auditor", "seer-advisor", "archive-researcher", "scout-recon", "optic-analyst"]

      // #when - checking AGENT_MODEL_REQUIREMENTS
      const agentKeys = Object.keys(AGENT_MODEL_REQUIREMENTS)

      // #then - all expected agents are present
      for (const agent of expectedAgents) {
        expect(agentKeys).toContain(agent)
      }
    })

    test("no uppercase keys in model requirements", () => {
      // #given - AGENT_MODEL_REQUIREMENTS object
      const agentKeys = Object.keys(AGENT_MODEL_REQUIREMENTS)

      // #when - checking for uppercase keys
      const uppercaseKeys = agentKeys.filter((key) => key !== key.toLowerCase())

      // #then - no uppercase keys exist
      expect(uppercaseKeys).toEqual([])
    })
  })

  describe("End-to-end config flow", () => {
    test("old config migrates and displays correctly", () => {
      // #given - old format config
      const oldConfig = {
        "Cipher Operator": { model: "anthropic/claude-opus-4-5", temperature: 0.1 },
        "Augur Planner (Planner)": { model: "anthropic/claude-opus-4-5" },
      }

      // #when - config is migrated
      const result = migrateAgentNames(oldConfig)

      // #then - keys are lowercase
      expect(result.migrated).toHaveProperty("cipher-operator")
      expect(result.migrated).toHaveProperty("augur-planner")

      // #when - display names are retrieved
      const cipherDisplay = getAgentDisplayName("cipher-operator")
      const augurDisplay = getAgentDisplayName("augur-planner")

      // #then - display names are correct
      expect(cipherDisplay).toBe("Cipher Operator (Ultraworker)")
      expect(augurDisplay).toBe("Augur Planner (Plan Builder)")

      // #then - config values are preserved
      expect(result.migrated["cipher-operator"]).toEqual({ model: "anthropic/claude-opus-4-5", temperature: 0.1 })
      expect(result.migrated["augur-planner"]).toEqual({ model: "anthropic/claude-opus-4-5" })
    })

    test("new config works without migration", () => {
      // #given - new format config (already lowercase)
      const newConfig = {
        "cipher-operator": { model: "anthropic/claude-opus-4-5" },
        "nexus-orchestrator": { model: "anthropic/claude-opus-4-5" },
      }

      // #when - migration is applied (should be no-op)
      const result = migrateAgentNames(newConfig)

      // #then - config is unchanged
      expect(result.migrated).toEqual(newConfig)
      
      // #then - changed flag is false
      expect(result.changed).toBe(false)

      // #when - display names are retrieved
      const cipherDisplay = getAgentDisplayName("cipher-operator")
      const nexusDisplay = getAgentDisplayName("nexus-orchestrator")

      // #then - display names are correct
      expect(cipherDisplay).toBe("Cipher Operator (Ultraworker)")
      expect(nexusDisplay).toBe("Nexus Orchestrator (Plan Execution Orchestrator)")
    })
  })
})
