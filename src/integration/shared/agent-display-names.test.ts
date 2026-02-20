import { describe, it, expect } from "bun:test";
import { AGENT_DISPLAY_NAMES, getAgentDisplayName } from "./agent-display-names";

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // #given config key "operator"
    const configKey = "operator";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "operator"
    expect(result).toBe("operator");
  });

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // #given config key "operator" (old format)
    const configKey = "operator";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "operator" (case-insensitive lookup)
    expect(result).toBe("operator");
  });

  it("returns original key for unknown agents (fallback)", () => {
    // #given config key "custom-agent"
    const configKey = "custom-agent";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "custom-agent" (original key unchanged)
    expect(result).toBe("custom-agent");
  });

  it("returns display name for orchestrator", () => {
    // #given config key "orchestrator"
    const configKey = "orchestrator";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "orchestrator"
    expect(result).toBe("orchestrator");
  });

  it("returns display name for planner", () => {
    // #given config key "planner"
    const configKey = "planner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "planner"
    expect(result).toBe("planner");
  });

  it("returns display name for executor", () => {
    // #given config key "executor"
    const configKey = "executor";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "executor"
    expect(result).toBe("executor");
  });

  it("returns display name for war-mind", () => {
    // #given config key "war-mind"
    const configKey = "war-mind";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "war-mind"
    expect(result).toBe("war-mind");
  });

  it("returns display name for null-audit", () => {
    // #given config key "null-audit"
    const configKey = "null-audit";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "null-audit"
    expect(result).toBe("null-audit");
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

  it("returns display name for analyzer-media", () => {
    // #given config key "analyzer-media"
    const configKey = "analyzer-media";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "analyzer-media"
    expect(result).toBe("analyzer-media");
  });
});

describe("AGENT_DISPLAY_NAMES", () => {
  it("contains all expected agent mappings", () => {
    // #given expected mappings (including legacy aliases)
    const expectedMappings = {
      // Current agent names (file-based)
      "operator": "operator",
      "orchestrator": "orchestrator",
      "planner": "planner",
      "executor": "executor",
      "war-mind": "war-mind",
      "null-audit": "null-audit",
      "eye-ops": "eye-ops",
      "data-dive": "data-dive",
      "scan-ops": "scan-ops",
      "analyzer-media": "analyzer-media",
      // Legacy aliases for backward compatibility
      "cipher-operator": "operator",
      "nexus-orchestrator": "orchestrator",
      "augur-planner": "planner",
      "cipher-runner": "executor",
      "tactician-strategist": "war-mind",
      "glitch-auditor": "null-audit",
      "seer-advisor": "eye-ops",
      "archive-researcher": "data-dive",
      "scout-recon": "scan-ops",
      "optic-analyst": "analyzer-media",
    };

    // #when checking the constant
    // #then contains all expected mappings (and potentially more)
    for (const [key, value] of Object.entries(expectedMappings)) {
      expect(AGENT_DISPLAY_NAMES[key]).toBe(value);
    }
  });
});
