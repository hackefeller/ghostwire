# Unified OpenCode Plugin Architecture - Implementation Guide

## Overview

This guide documents the current unified OpenCode plugin architecture used by Ghostwire.

As of v3.2.x:
- Compound-engineering components are integrated directly into core runtime under the `grid:` namespace.
- Claude import/translation utilities exist as library code for migration/testing workflows.
- Feature bundle infrastructure has been removed to keep runtime deterministic and reduce maintenance surface.

## Architecture Layers

1. **Core Orchestration Runtime**
   - Native OpenCode agents, hooks, tools, MCP composition
   - Entry point: `src/index.ts`

2. **Integrated Components**
   - Compound agents/commands/skills wired into schema + runtime registries
   - Migration support via `src/config/migration.ts`

3. **Import/Mapping Utilities (Library-only)**
   - Claude plugin parsing/mapping/diagnostics in `src/features/imports/claude/`
   - Not invoked by plugin bootstrap path

## Runtime Composition

- Plugin bootstrap constructs managers/hooks/tools and returns lifecycle handlers.
- Config handler materializes effective agent/tool/command/mcp views from:
  - Built-ins
  - User/project overrides
  - OpenCode/Claude compatibility loaders where enabled

Key files:
- `src/index.ts`
- `src/plugin-config.ts`
- `src/config/schema.ts`
- `src/platform/opencode/config-composer.ts`

## Config Scope and Precedence

Runtime config scope:
- Project: `.opencode/ghostwire.jsonc` then `.opencode/ghostwire.json`
- User: `<opencode-config-dir>/ghostwire.jsonc` then `<opencode-config-dir>/ghostwire.json`

LSP scope (same naming model + tolerant parsing):
- Project ghostwire files
- User ghostwire files
- OpenCode base config (`opencode.json`)

Effective merge priority remains: `project > user > opencode`.

## Claude Import/Mapping Status

The Claude import subsystem (`src/features/imports/claude/`) provides:
- manifest parsing
- namespace mapping
- include/exclude filtering
- diagnostics/telemetry

Current status:
- implemented and tested
- library-facing
- not runtime-wired through `src/index.ts`

## Why Bundles Were Removed

Feature bundles were removed because they did not provide product leverage for a single-plugin runtime:
- no runtime registration path in bootstrap
- placeholder component loading in registry path
- duplicated conceptual model versus direct integration
- additional complexity for cache/lifecycle/error-state management

Direct integration is now the single source of runtime truth.

## Contributor Guidance

When adding/changing behavior:
- Runtime flow: `src/index.ts`
- Config contract: `src/config/schema.ts`
- Effective config composition: `src/platform/opencode/config-composer.ts`
- Hook behavior/policies: `src/hooks/*`
- Tool behavior: `src/tools/*`

Do not re-introduce dynamic bundle loading unless there is a concrete runtime requirement with measured product impact.
