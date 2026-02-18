/**
 * Compound Engineering Feature Bundle
 * 
 * Integrated compound-engineering components are now natively available in ruach v3.2.0.
 * All 125 components (28 agents, 24 commands, 73 skills) are available with the `compound:` namespace prefix.
 * This bundle module is now historical - components are directly integrated into the main codebase.
 */

import type { FeatureBundle, FeatureBundleConfig } from "../types"

export const COMPOUND_ENGINEERING_BUNDLE_NAME = "compound-engineering"

export const defaultCompoundEngineeringConfig: FeatureBundleConfig = {
  enabled: true,
  lazyLoad: true,
  cacheSize: 50,
}

export const compoundEngineeringBundle: FeatureBundle = {
  name: COMPOUND_ENGINEERING_BUNDLE_NAME,
  description: "Compound Engineering agents, commands, and skills imported from Claude Code plugin",
  config: defaultCompoundEngineeringConfig,
  components: {
    // P0 Agents (7)
    agents: [
      "agent-native-reviewer",
      "architecture-strategist",
      "security-sentinel",
      "performance-oracle",
      "code-simplicity-reviewer",
      "data-integrity-guardian",
      "deployment-verification-agent",
      // P1 Agents (17)
      "data-migration-expert",
      "pattern-recognition-specialist",
      "julik-frontend-races-reviewer",
      "dhh-rails-reviewer",
      "kieran-rails-reviewer",
      "kieran-typescript-reviewer",
      "kieran-python-reviewer",
      "best-practices-researcher",
      "framework-docs-researcher",
      "repo-research-analyst",
      "design-implementation-reviewer",
      "design-iterator",
      "figma-design-sync",
      "bug-reproduction-validator",
      "every-style-editor",
      "lint",
      "pr-comment-resolver",
      "spec-flow-analyzer",
      "ankane-readme-writer",
      // P2 Agents (3)
      "git-history-analyzer",
    ],
    // P0 Commands (4) + P1 Commands (11) + P2 Commands (5)
    commands: [
      "/workflows:plan",
      "/workflows:review",
      "/workflows:work",
      "/workflows:compound",
      "/workflows:brainstorm",
      "/deepen-plan",
      "/plan_review",
      "/resolve_pr_parallel",
      "/resolve_todo_parallel",
      "/resolve_parallel",
      "/reproduce-bug",
      "/report-bug",
      "/triage",
      "/test-browser",
      "/xcode-test",
      "/feature-video",
      "/changelog",
      "/create-agent-skill",
      "/generate_command",
      "/heal-skill",
    ],
    // P0 Skills (3) + P1 Skills (8) + P2 Skills (3)
    skills: [
      "frontend-design",
      "skill-creator",
      "create-agent-skills",
      "agent-native-architecture",
      "compound-docs",
      "andrew-kane-gem-writer",
      "dhh-rails-style",
      "dspy-ruby",
      "every-style-editor",
      "file-todos",
      "git-worktree",
      "rclone",
      "agent-browser",
      "gemini-imagegen",
    ],
    // P1 MCP (1)
    mcpServers: ["context7"],
  },
}

/**
 * Get bundle component count by priority
 */
export function getBundleStats(bundle: FeatureBundle): {
  total: number
  agents: number
  commands: number
  skills: number
  mcpServers: number
} {
  return {
    total: 
      (bundle.components.agents?.length ?? 0) +
      (bundle.components.commands?.length ?? 0) +
      (bundle.components.skills?.length ?? 0) +
      (bundle.components.mcpServers?.length ?? 0),
    agents: bundle.components.agents?.length ?? 0,
    commands: bundle.components.commands?.length ?? 0,
    skills: bundle.components.skills?.length ?? 0,
    mcpServers: bundle.components.mcpServers?.length ?? 0,
  }
}
