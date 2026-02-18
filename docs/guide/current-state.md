# Current State (Feb 2026)

This document summarizes what is implemented today so we can start work without guessing.

## What This Repo Is

Ruach is an OpenCode plugin with a CLI wrapper. It provides orchestration (Prometheus/Atlas), built-in agents, tools, skills, MCP integration, and a partial Claude plugin import layer.

## Primary Entry Points

- **Plugin entry**: `src/index.ts`
- **Config load/merge**: `src/plugin-config.ts`
- **Config schema**: `src/config/schema.ts`
- **CLI**: `src/cli/`

## Config Files (Runtime)

- **Project**: `.opencode/ruach.json` or `.opencode/ruach.jsonc`
- **User**: `~/.config/opencode/ruach.json` or `~/.config/opencode/ruach.jsonc`
- **OpenCode core**: `~/.config/opencode/opencode.json`

LSP config now follows the same ruach config discovery path as runtime config (`ruach.jsonc` then `ruach.json` in project/user scope).

## Core Runtime Systems

- **Orchestration**: `src/hooks/atlas/index.ts`
- **Background agents**: `src/features/background-agent/manager.ts`
- **Agents**: `src/agents/` + registry wiring in `src/index.ts`
- **Tools**: `src/tools/`
- **Hooks**: `src/hooks/`
- **Skills**: `src/features/builtin-skills/`
- **Commands**: `src/features/builtin-commands/`
- **MCP**: `src/mcp/`

## Unified Plugin Import (Claude)

Implemented as a library, not wired into runtime:

- **Import/mapping**: `src/features/imports/claude/` exposes `importClaudePluginFromPath`.
- **Security checks**: basic path validation (blocks `..` and null bytes).
- **Status**: available for tests/utilities, but **not invoked** by `src/index.ts`.

## Feature Bundles

- **Registry/loader/cache**: `src/features/bundles/`
- **Compound bundle listing**: `src/features/bundles/compound-engineering/`
- **Status**: not wired into runtime; loader returns placeholders.

## Compound Engineering Components

- **Integrated into core** with `compound:` namespace.
- **Migration**: `src/shared/compound-migration.ts` maps legacy names to namespaced ones.
- **Schema**: `src/config/schema.ts` enumerates built-in agents/skills/commands.

## Known Mismatches / Legacy Names

- Legacy naming artifacts are being removed; prefer `ruach` naming in all user-facing text and config guidance.

## How to Start Work

1. Skim `src/index.ts` to understand runtime wiring.
2. Read `src/config/schema.ts` and `docs/reference/configurations.md` to understand config surface.
3. Verify baselines:
   - `bun run build`
   - `bun test`
   - `bun run typecheck`
