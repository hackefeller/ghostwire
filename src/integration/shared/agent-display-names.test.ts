import { describe, it, expect } from "bun:test";
import { AGENT_DISPLAY_NAMES, getAgentDisplayName } from "./agent-display-names";

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // #given config key "void-runner"
    const configKey = "void-runner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Cipher Operator (Ultraworker)"
    expect(result).toBe("Cipher Operator (Ultraworker)");
  });

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // #given config key "Cipher Operator" (old format)
    const configKey = "Cipher Operator";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Cipher Operator (Ultraworker)" (case-insensitive lookup)
    expect(result).toBe("Cipher Operator (Ultraworker)");
  });

  it("returns original key for unknown agents (fallback)", () => {
    // #given config key "custom-agent"
    const configKey = "custom-agent";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "custom-agent" (original key unchanged)
    expect(result).toBe("custom-agent");
  });

  it("returns display name for grid-sync", () => {
    // #given config key "grid-sync"
    const configKey = "grid-sync";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Nexus Orchestrator (Plan Execution Orchestrator)"
    expect(result).toBe("Nexus Orchestrator (Plan Execution Orchestrator)");
  });

  it("returns display name for zen-planner", () => {
    // #given config key "zen-planner"
    const configKey = "zen-planner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Augur Planner (Plan Builder)"
    expect(result).toBe("Augur Planner (Plan Builder)");
  });

  it("returns display name for dark-runner", () => {
    // #given config key "dark-runner"
    const configKey = "dark-runner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Cipher Operator-Junior"
    expect(result).toBe("Cipher Operator-Junior");
  });

  it("returns display name for war-mind", () => {
    // #given config key "war-mind"
    const configKey = "war-mind";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Tactician Strategist (Plan Consultant)"
    expect(result).toBe("Tactician Strategist (Plan Consultant)");
  });

  it("returns display name for null-audit", () => {
    // #given config key "null-audit"
    const configKey = "null-audit";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "Glitch Auditor (Plan Reviewer)"
    expect(result).toBe("Glitch Auditor (Plan Reviewer)");
  });

  it("returns display name for eye-ops", () => {
    // #given config key "eye-ops"
    const configKey = "eye-ops";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "eye-ops"
    expect(result).toBe("eye-ops");
  });

  it("returns display name for data-dive", () => {
    // #given config key "data-dive"
    const configKey = "data-dive";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "data-dive"
    expect(result).toBe("data-dive");
  });

  it("returns display name for scan-ops", () => {
    // #given config key "scan-ops"
    const configKey = "scan-ops";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "scan-ops"
    expect(result).toBe("scan-ops");
  });

  it("returns display name for eye-scan", () => {
    // #given config key "eye-scan"
    const configKey = "eye-scan";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "eye-scan"
    expect(result).toBe("eye-scan");
  });
});

describe("AGENT_DISPLAY_NAMES", () => {
  it("contains all expected agent mappings", () => {
    // #given expected mappings (including legacy aliases)
    const expectedMappings = {
      // Current agent names
      "void-runner": "Cipher Operator (Ultraworker)",
      "grid-sync": "Nexus Orchestrator (Plan Execution Orchestrator)",
      "zen-planner": "Augur Planner (Plan Builder)",
      "dark-runner": "Cipher Operator-Junior",
      "war-mind": "Tactician Strategist (Plan Consultant)",
      "null-audit": "Glitch Auditor (Plan Reviewer)",
      "eye-ops": "eye-ops",
      "data-dive": "data-dive",
      "scan-ops": "scan-ops",
      "eye-scan": "eye-scan",
      // Legacy aliases for backward compatibility
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
    };

    // #when checking the constant
    // #then contains all expected mappings (and potentially more)
    for (const [key, value] of Object.entries(expectedMappings)) {
      expect(AGENT_DISPLAY_NAMES[key]).toBe(value);
    }
  });
});
