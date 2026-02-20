/**
 * Agent config keys to display names mapping.
 * Config keys are lowercase (e.g., "void-runner", "grid-sync").
 * Display names include suffixes for UI/logs (e.g., "Cipher Operator (Ultraworker)").
 *
 * For backward compatibility, also includes legacy agent name aliases.
 */
export const AGENT_DISPLAY_NAMES: Record<string, string> = {
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

/**
 * Get display name for an agent config key.
 * Uses case-insensitive lookup for backward compatibility.
 * Returns original key if not found.
 */
export function getAgentDisplayName(configKey: string): string {
  // Try exact match first
  const exactMatch = AGENT_DISPLAY_NAMES[configKey];
  if (exactMatch !== undefined) return exactMatch;

  // Fall back to case-insensitive + normalized search
  const lowerKey = configKey.toLowerCase();
  const normalizedKey = lowerKey.replace(/\s+/g, "-");
  const aliasKey = normalizedKey === "void-runner-junior" ? "dark-runner" : normalizedKey;
  for (const [k, v] of Object.entries(AGENT_DISPLAY_NAMES)) {
    const lowerMapKey = k.toLowerCase();
    if (lowerMapKey === lowerKey || lowerMapKey === normalizedKey || lowerMapKey === aliasKey) {
      return v;
    }
  }

  // Unknown agent: return original key
  return configKey;
}
