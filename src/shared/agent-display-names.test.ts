import { describe, it, expect } from "bun:test"
import { AGENT_DISPLAY_NAMES, getAgentDisplayName } from "./agent-display-names"

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // #given config key "cipher-operator"
    const configKey = "cipher-operator"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Cipher Operator (Ultraworker)"
    expect(result).toBe("Cipher Operator (Ultraworker)")
  })

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // #given config key "Cipher Operator" (old format)
    const configKey = "Cipher Operator"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Cipher Operator (Ultraworker)" (case-insensitive lookup)
    expect(result).toBe("Cipher Operator (Ultraworker)")
  })

  it("returns original key for unknown agents (fallback)", () => {
    // #given config key "custom-agent"
    const configKey = "custom-agent"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "custom-agent" (original key unchanged)
    expect(result).toBe("custom-agent")
  })

  it("returns display name for nexus-orchestrator", () => {
    // #given config key "nexus-orchestrator"
    const configKey = "nexus-orchestrator"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Nexus Orchestrator (Plan Execution Orchestrator)"
    expect(result).toBe("Nexus Orchestrator (Plan Execution Orchestrator)")
  })

  it("returns display name for augur-planner", () => {
    // #given config key "augur-planner"
    const configKey = "augur-planner"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Augur Planner (Plan Builder)"
    expect(result).toBe("Augur Planner (Plan Builder)")
  })

  it("returns display name for cipher-runner", () => {
    // #given config key "cipher-runner"
    const configKey = "cipher-runner"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Cipher Operator-Junior"
    expect(result).toBe("Cipher Operator-Junior")
  })

  it("returns display name for tactician-strategist", () => {
    // #given config key "tactician-strategist"
    const configKey = "tactician-strategist"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Tactician Strategist (Plan Consultant)"
    expect(result).toBe("Tactician Strategist (Plan Consultant)")
  })

  it("returns display name for glitch-auditor", () => {
    // #given config key "glitch-auditor"
    const configKey = "glitch-auditor"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "Glitch Auditor (Plan Reviewer)"
    expect(result).toBe("Glitch Auditor (Plan Reviewer)")
  })

  it("returns display name for seer-advisor", () => {
    // #given config key "seer-advisor"
    const configKey = "seer-advisor"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "seer-advisor"
    expect(result).toBe("seer-advisor")
  })

  it("returns display name for archive-researcher", () => {
    // #given config key "archive-researcher"
    const configKey = "archive-researcher"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "archive-researcher"
    expect(result).toBe("archive-researcher")
  })

  it("returns display name for scout-recon", () => {
    // #given config key "scout-recon"
    const configKey = "scout-recon"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "scout-recon"
    expect(result).toBe("scout-recon")
  })

  it("returns display name for optic-analyst", () => {
    // #given config key "optic-analyst"
    const configKey = "optic-analyst"

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey)

    // #then returns "optic-analyst"
    expect(result).toBe("optic-analyst")
  })
})

describe("AGENT_DISPLAY_NAMES", () => {
  it("contains all expected agent mappings", () => {
    // #given expected mappings
    const expectedMappings = {
      "cipher-operator": "Cipher Operator (Ultraworker)",
      "nexus-orchestrator": "Nexus Orchestrator (Plan Execution Orchestrator)",
      "augur-planner": "Augur Planner (Plan Builder)",
      "cipher-runner": "Cipher Operator-Junior",
      "tactician-strategist": "Tactician Strategist (Plan Consultant)",
      "glitch-auditor": "Glitch Auditor (Plan Reviewer)",
      "seer-advisor": "seer-advisor",
      "archive-researcher": "archive-researcher",
      "scout-recon": "scout-recon",
      "optic-analyst": "optic-analyst",
    }

    // #when checking the constant
    // #then contains all expected mappings
    expect(AGENT_DISPLAY_NAMES).toEqual(expectedMappings)
  })
})