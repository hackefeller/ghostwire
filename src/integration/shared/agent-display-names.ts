/**
 * Agent config keys to display names mapping.
 * Config keys are lowercase (e.g., "void-runner", "grid-sync").
 * Display names match file names for consistency.
 *
 * For backward compatibility, also includes legacy agent name aliases.
 */
export const AGENT_DISPLAY_NAMES: Record<string, string> = {
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
    normalizedKey === "void-runner-junior" ? "dark-runner" : normalizedKey;
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
