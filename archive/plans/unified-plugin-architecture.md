# Unified OpenCode Plugin Architecture

## Summary

We will build a single OpenCode plugin that consolidates the most valuable capabilities from two sources:

- **ruach** (OpenCode-native orchestration, agents, tools, hooks, MCPs)
- **Integrated compound-engineering** (All agents, commands, skills now native with `compound:` namespace)

The result is one OpenCode plugin with a clear internal architecture, explicit integration points, and a predictable migration path for Claude Code features.

This document defines the architecture, boundaries, and a phased plan. It focuses on the OpenCode plugin only.

## Goals

- Deliver a single OpenCode plugin that is the canonical entry point for advanced orchestration.
- Preserve `ruach` feature depth while adding a clean ingestion layer for Claude Code plugins.
- Keep the plugin modular: separate core orchestration from imported feature bundles.
- Maintain testability: explicit mapping contracts, fixtures, and golden output for conversions.

## Non-Goals

- A general-purpose converter CLI for multiple platforms.
- A VS Code extension or Claude Code host integration.
- Replacing OpenCode itself or its config system.

## System Overview

The plugin is organized into three layers:

1. **Core Orchestration**: ruach agents, hooks, tools, MCPs, shared utilities.
2. **Import/Mapping Layer**: adapters that map Claude Code plugin artifacts into OpenCode-compatible structures.
3. **Feature Bundles**: domain-specific capabilities (compound engineering tools, workflows, prompts) registered as standard OpenCode components.

```
+---------------------------------------------------------------+
|                    Unified OpenCode Plugin                    |
|                                                               |
|  +-----------------+    +------------------+   +------------+ |
|  | Core Orchestration|  | Import/Mapping   |  | Feature     | |
|  | (agents, hooks,  |  | (Claude -> OC)   |  | Bundles     | |
|  | tools, MCPs)     |  |                  |  | (compound)  | |
|  +-----------------+    +------------------+   +------------+ |
+---------------------------------------------------------------+
```

## Component Architecture

### 1) Core Orchestration (Existing ruach)

**Location**: `src/agents`, `src/hooks`, `src/tools`, `src/mcp`, `src/features`, `src/shared`

Responsibilities:

- Route tasks through orchestration hooks (Atlas, Sisyphus, etc.).
- Expose standardized OpenCode tooling and MCP integrations.
- Provide base skills, commands, and lifecycle hooks.

This layer remains the operational backbone. It should not be tightly coupled to any single imported plugin.

### 2) Import/Mapping Layer (New)

**Purpose**: Take Claude Code plugin components and map them to the OpenCode plugin runtime.

Responsibilities:

- Parse Claude Code plugin manifest structure and assets.
- Map Claude commands to OpenCode commands or skills with explicit conversion rules.
- Translate tool permissions and hooks into OpenCode equivalents where possible.
- Produce a normalized internal structure used by feature bundles.

Suggested structure:

```
src/
  features/
    imports/
      claude/
        index.ts
        types.ts
        mapper.ts
        fixtures/
```

Key conversion rules (initial):

- Claude commands -> OpenCode commands + skill wrappers
- Claude tools -> OpenCode tools or MCP equivalents
- Claude hooks -> OpenCode hook lifecycle mapping
- Unmappable features are recorded with warnings, not silently dropped

### 3) Feature Bundles (Compound Engineering)

**Purpose**: Wrap imported tools and workflows as first-class OpenCode components.

Structure:

```
src/
  features/
    compound-engineering/
      index.ts
      tools.ts
      commands.ts
      agents.ts
      skills/
```

Rules:

- All feature bundles must register through existing OpenCode registries.
- They must not hardcode imports; use the mapping layer for any Claude origin.
- Bundles are optional and can be toggled via config.

## Import Priority List and Mapping Table

The table below is the initial, detailed import priority list for the compound-engineering plugin. This list is the contract for Phase 2 and drives testing, fixtures, and migration order.

Priority legend:

- `P0`: Must ship in initial import
- `P1`: Planned for Phase 2 after core stabilization
- `P2`: Nice-to-have or specialty use

### Agents (27)

| Priority | Claude Agent | OpenCode Target | Notes |
|----------|--------------|-----------------|-------|
| P0 | `agent-native-reviewer` | `agent:agent-native-reviewer` | Core parity validation for agent-native workflows |
| P0 | `architecture-strategist` | `agent:architecture-strategist` | High-impact architecture review |
| P0 | `security-sentinel` | `agent:security-sentinel` | Security review baseline |
| P0 | `performance-oracle` | `agent:performance-oracle` | Perf review baseline |
| P0 | `code-simplicity-reviewer` | `agent:code-simplicity-reviewer` | Final pass simplification |
| P0 | `data-integrity-guardian` | `agent:data-integrity-guardian` | Migration safety |
| P0 | `deployment-verification-agent` | `agent:deployment-verification-agent` | Go/No-Go checks |
| P1 | `data-migration-expert` | `agent:data-migration-expert` | Migration mapping validation |
| P1 | `pattern-recognition-specialist` | `agent:pattern-recognition-specialist` | Architectural pattern analysis |
| P1 | `julik-frontend-races-reviewer` | `agent:julik-frontend-races-reviewer` | Frontend concurrency issues |
| P1 | `dhh-rails-reviewer` | `agent:dhh-rails-reviewer` | Rails review |
| P1 | `kieran-rails-reviewer` | `agent:kieran-rails-reviewer` | Rails review |
| P1 | `kieran-typescript-reviewer` | `agent:kieran-typescript-reviewer` | TS review |
| P1 | `kieran-python-reviewer` | `agent:kieran-python-reviewer` | Python review |
| P1 | `best-practices-researcher` | `agent:best-practices-researcher` | External best practices |
| P1 | `framework-docs-researcher` | `agent:framework-docs-researcher` | Framework docs research |
| P2 | `git-history-analyzer` | `agent:git-history-analyzer` | Git history analysis |
| P1 | `repo-research-analyst` | `agent:repo-research-analyst` | Repo norms and conventions |
| P1 | `design-implementation-reviewer` | `agent:design-implementation-reviewer` | Figma parity checks |
| P1 | `design-iterator` | `agent:design-iterator` | Iterative design refinement |
| P1 | `figma-design-sync` | `agent:figma-design-sync` | Figma synchronization |
| P1 | `bug-reproduction-validator` | `agent:bug-reproduction-validator` | Repro validation |
| P1 | `every-style-editor` | `agent:every-style-editor` | Editorial style workflow |
| P1 | `lint` | `agent:lint` | Linting workflow agent |
| P1 | `pr-comment-resolver` | `agent:pr-comment-resolver` | PR feedback resolution |
| P1 | `spec-flow-analyzer` | `agent:spec-flow-analyzer` | Spec gap analysis |
| P1 | `ankane-readme-writer` | `agent:ankane-readme-writer` | README generation |

### Commands (20)

| Priority | Claude Command | OpenCode Target | Notes |
|----------|----------------|-----------------|-------|
| P0 | `/workflows:plan` | `command:workflows:plan` + `skill wrapper` | Primary planning flow |
| P0 | `/workflows:review` | `command:workflows:review` + `skill wrapper` | Core review flow |
| P0 | `/workflows:work` | `command:workflows:work` + `skill wrapper` | Execution flow |
| P0 | `/workflows:compound` | `command:workflows:compound` + `skill wrapper` | Knowledge compounding |
| P1 | `/workflows:brainstorm` | `command:workflows:brainstorm` + `skill wrapper` | Early ideation |
| P1 | `/deepen-plan` | `command:deepen-plan` + `skill wrapper` | Plan enrichment |
| P1 | `/plan_review` | `command:plan_review` + `skill wrapper` | Multi-agent plan critique |
| P1 | `/resolve_pr_parallel` | `command:resolve_pr_parallel` + `skill wrapper` | Parallel PR comment resolution |
| P1 | `/resolve_todo_parallel` | `command:resolve_todo_parallel` + `skill wrapper` | Parallel TODO resolution |
| P1 | `/resolve_parallel` | `command:resolve_parallel` + `skill wrapper` | Parallel issue resolution |
| P1 | `/reproduce-bug` | `command:reproduce-bug` + `skill wrapper` | Bug repro flow |
| P1 | `/report-bug` | `command:report-bug` + `skill wrapper` | Bug reporting |
| P1 | `/triage` | `command:triage` + `skill wrapper` | Triage pipeline |
| P1 | `/test-browser` | `command:test-browser` + `skill wrapper` | Browser test orchestration |
| P2 | `/xcode-test` | `command:xcode-test` + `skill wrapper` | iOS simulator tests |
| P2 | `/feature-video` | `command:feature-video` + `skill wrapper` | Video walkthrough |
| P2 | `/changelog` | `command:changelog` + `skill wrapper` | Changelog generation |
| P2 | `/create-agent-skill` | `command:create-agent-skill` + `skill wrapper` | Claude skill creation |
| P2 | `/generate_command` | `command:generate_command` + `skill wrapper` | Command generation |
| P2 | `/heal-skill` | `command:heal-skill` + `skill wrapper` | Skill repair |

### Skills (14)

| Priority | Claude Skill | OpenCode Target | Notes |
|----------|--------------|-----------------|-------|
| P0 | `frontend-design` | `skill:frontend-design` | High-use workflow |
| P0 | `skill-creator` | `skill:skill-creator` | Skill creation backbone |
| P0 | `create-agent-skills` | `skill:create-agent-skills` | Agent skill authoring |
| P1 | `agent-native-architecture` | `skill:agent-native-architecture` | Agent architecture patterns |
| P1 | `compound-docs` | `skill:compound-docs` | Knowledge compounding |
| P1 | `andrew-kane-gem-writer` | `skill:andrew-kane-gem-writer` | Ruby gem workflow |
| P1 | `dhh-rails-style` | `skill:dhh-rails-style` | Rails style patterns |
| P1 | `dspy-ruby` | `skill:dspy-ruby` | DSPy.rb patterns |
| P1 | `every-style-editor` | `skill:every-style-editor` | Editorial style |
| P1 | `file-todos` | `skill:file-todos` | File-based TODOs |
| P1 | `git-worktree` | `skill:git-worktree` | Worktree management |
| P2 | `rclone` | `skill:rclone` | External CLI dependency |
| P2 | `agent-browser` | `skill:agent-browser` | External CLI dependency |
| P2 | `gemini-imagegen` | `skill:gemini-imagegen` | External API dependency |

### MCP Servers (1)

| Priority | Claude MCP | OpenCode Target | Notes |
|----------|------------|-----------------|-------|
| P1 | `context7` | `mcp:context7` | Map to OpenCode MCP registry |

## Data Flow

1. **Startup**: Plugin loads core orchestration and configuration.
2. **Import Phase**: Claude plugin artifacts (if configured) are parsed and normalized.
3. **Registration**: Feature bundles register tools, commands, hooks, skills.
4. **Runtime**: OpenCode executes with unified routing and policies.

## Configuration

Add a top-level config namespace for imported features.

Example:

```json
{
  "features": {
    "compoundEngineering": {
      "enabled": true,
      "source": "local",
      "path": "./plugins/compound-engineering"
    }
  },
  "imports": {
    "claude": {
      "enabled": true,
      "strict": false,
      "warnings": true
    }
  }
}
```

Notes:

- `strict=false` allows partial imports with warnings.
- `warnings=true` emits a visible import report.

## Error Handling and Reporting

- Import layer produces a structured report:
  - converted components
  - skipped components
  - mapping failures
- Warnings surface in logs and optional CLI diagnostics.
- No runtime crash due to unmapped features unless `strict=true`.

## Testing Strategy

Test coverage should follow the ruach TDD requirements.

- Unit tests for mapping rules: `src/features/imports/claude/*.test.ts`
- Golden fixtures: sample Claude plugin manifest and expected OpenCode registry output
- Integration tests: ensure registered commands, tools, and hooks are visible

## Migration Plan (Phased)

### Phase 1: Architecture + Skeleton

- Add mapping layer scaffolding
- Define conversion interfaces
- Add empty feature bundle stub

### Phase 2: Compound Engineering Import

- Map core Claude commands to OpenCode commands/skills
- Port critical tools to OpenCode tool registry
- Ship with feature toggle

### Phase 3: Harden and Extend

- Add richer Claude hook mappings
- Expand tool compatibility
- Add import diagnostics

## Risks and Mitigations

- **Incompatible tool semantics**: Mitigate by mapping to nearest OpenCode tool or wrap with adapter tools.
- **Hook mismatches**: Document gaps and optionally simulate with OpenCode hooks.
- **Config drift**: Keep imports behind explicit toggles.
- **Scope creep**: Maintain strict boundaries for which Claude components are supported.

## Open Questions

- Which Claude plugin features are must-have for the first phase?
- Should we ship the import layer enabled by default or opt-in?
- Which components should be treated as native OpenCode features vs imported?

## Status (Completed in v3.2.0)

All compound-engineering components have been successfully integrated into ruach.
All 125 components are now natively available and tested.
Archive location for historical reference: `archive/compound-engineering-plugin/`
