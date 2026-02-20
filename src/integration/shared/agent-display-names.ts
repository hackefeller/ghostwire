/**
 * Agent config keys to display names mapping.
 * Config keys are lowercase (e.g., "operator", "orchestrator").
 * Display names match file names for consistency.
 *
 * For backward compatibility, also includes legacy agent name aliases.
 */
export const AGENT_DISPLAY_NAMES: Record<string, string> = {
  // Phase 1 - Orchestration (new names)
  "operator": "operator",
  "orchestrator": "orchestrator",
  "planner": "planner",
  "executor": "executor",
  // Remaining agents (not yet renamed)
  "advisor-strategy": "advisor-strategy",
  "validator-audit": "validator-audit",
  "advisor-plan": "advisor-plan",
  "data-dive": "data-dive",
  "scan-ops": "scan-ops",
  "analyzer-media": "analyzer-media",
  // Legacy aliases for backward compatibility
  "cipher-operator": "operator",
  "void-runner": "operator",
  "nexus-orchestrator": "orchestrator",
  "grid-sync": "orchestrator",
  "augur-planner": "planner",
  "zen-planner": "planner",
  "cipher-runner": "executor",
  "dark-runner": "executor",
  "tactician-strategist": "advisor-strategy",
  "glitch-auditor": "validator-audit",
  "seer-advisor": "advisor-plan",
  "archive-researcher": "data-dive",
  "scout-recon": "scan-ops",
  "optic-analyst": "analyzer-media",
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
  const aliasKey =
    normalizedKey === "operator-junior" ? "executor" : normalizedKey;
  for (const [k, v] of Object.entries(AGENT_DISPLAY_NAMES)) {
    const lowerMapKey = k.toLowerCase();
    if (
      lowerMapKey === lowerKey ||
      lowerMapKey === normalizedKey ||
      lowerMapKey === aliasKey
    ) {
      return v;
    }
  }

  // Unknown agent: return original key
  return configKey;
}
