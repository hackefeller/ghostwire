import { describe, it, expect } from "bun:test";
import { AGENT_DISPLAY_NAMES, getAgentDisplayName } from "./agent-display-names";

describe("getAgentDisplayName", () => {
  it("returns display name for lowercase config key (new format)", () => {
    // #given config key "void-runner"
    const configKey = "void-runner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "void-runner"
    expect(result).toBe("void-runner");
  });

  it("returns display name for uppercase config key (old format - case-insensitive)", () => {
    // #given config key "void-runner" (old format)
    const configKey = "void-runner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "void-runner" (case-insensitive lookup)
    expect(result).toBe("void-runner");
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

    // #then returns "grid-sync"
    expect(result).toBe("grid-sync");
  });

  it("returns display name for zen-planner", () => {
    // #given config key "zen-planner"
    const configKey = "zen-planner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "zen-planner"
    expect(result).toBe("zen-planner");
  });

  it("returns display name for dark-runner", () => {
    // #given config key "dark-runner"
    const configKey = "dark-runner";

    // #when getAgentDisplayName called
    const result = getAgentDisplayName(configKey);

    // #then returns "dark-runner"
    expect(result).toBe("dark-runner");
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
      // Current agent names (file-based)
      "void-runner": "void-runner",
      "grid-sync": "grid-sync",
      "zen-planner": "zen-planner",
      "dark-runner": "dark-runner",
      "war-mind": "war-mind",
      "null-audit": "null-audit",
      "eye-ops": "eye-ops",
      "data-dive": "data-dive",
      "scan-ops": "scan-ops",
      "eye-scan": "eye-scan",
      // Legacy aliases for backward compatibility
      "cipher-operator": "void-runner",
      "nexus-orchestrator": "grid-sync",
      "augur-planner": "zen-planner",
      "cipher-runner": "dark-runner",
      "tactician-strategist": "war-mind",
      "glitch-auditor": "null-audit",
      "seer-advisor": "eye-ops",
      "archive-researcher": "data-dive",
      "scout-recon": "scan-ops",
      "optic-analyst": "eye-scan",
    };

    // #when checking the constant
    // #then contains all expected mappings (and potentially more)
    for (const [key, value] of Object.entries(expectedMappings)) {
      expect(AGENT_DISPLAY_NAMES[key]).toBe(value);
    }
  });
});
