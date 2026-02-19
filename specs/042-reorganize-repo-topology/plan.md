# Implementation Plan: Reorganize Core Repo Topology

**Branch**: `042-reorganize-repo-topology` | **Date**: 2026-02-19 | **Spec**: [Domain Reorganization Plan](../../docs/plans/2026-02-19-refactor-reorganize-core-repo-topology-plan.md)  
**Input**: Directory reorganization from type-based grouping to domain-based grouping

## Summary

Reorganize the OpenCode plugin repository's directory structure from type-based grouping to domain-based grouping. This improves code navigation and clarity by grouping directories by **what they DO** (domain) rather than **what they ARE** (type).

**Current state**: Type-based layers: agents/, hooks/, tools/, features/, shared/, mcp/, config/  
**Target state**: Domain-based layers: orchestration/ (control), execution/ (work), integration/ (connectors), platform/ (setup), cli/

**Technical Approach**: Phased implementation (6 phases) where each phase moves one domain, updates imports, validates with typecheck/build, then commits. This avoids the "500 imports at once" problem that broke previous attempts.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js via Bun  
**Primary Dependencies**: Bun (build tool), TypeScript (compiler), ESM modules  
**Storage**: File-based (git repo), no database  
**Testing**: Bun test runner, 100+ test files (TDD mandatory per AGENTS.md)  
**Target Platform**: Node.js/Bun CLI runtime  
**Project Type**: Monorepo plugin (OpenCode extension)  
**Performance Goals**: Build < 5s, typecheck < 3s, no runtime impact  
**Constraints**: Must not break build, must preserve git history via `git mv`, imports must be updated systematically  
**Scale/Scope**: 250+ files to move, ~500 import paths to update, 7 domains affected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**OpenCode Constitution (from AGENTS.md)**:

✅ **TDD (Test-Driven Development)**: MANDATORY  
   - RED-GREEN-REFACTOR cycle strictly enforced
   - Test file: `*.test.ts` alongside source (100 test files)
   - BDD comments: `//#given`, `//#when`, `//#then`
   - **Status**: PASS - This is a refactor. We run full test suite (`bun test`) after each phase to ensure no regressions.

✅ **Package Manager: Bun Only**
   - `bun run`, `bun build`, `bunx` exclusively
   - **Status**: PASS - We use Bun throughout (bun run typecheck, bun run build, bun test)

✅ **Build/Exports**: ESM + TypeScript declarations
   - Barrel pattern via index.ts
   - Output to dist/ with .d.ts
   - **Status**: PASS - Each domain will have index.ts barrel file exporting from subdirectories

✅ **Naming Conventions**: kebab-case dirs, `createXXXHook`/`createXXXTool` factories
   - **Status**: PASS - Domain names (orchestration/, execution/, integration/) are kebab-case

✅ **SINGLE SOURCE OF TRUTH**:
   - Agent metadata lives in `agents.yml`
   - Directory maps in `hooks.yml`, `tools.yml`, `features.yml`
   - **Status**: PASS - We update YAML references in Phase 5

✅ **Git History Preservation**: Use `git mv` for directory moves
   - **Status**: PASS - Explicit in Phase 0 preparation step

✅ **Pull Request Target**: `dev` branch (NOT master)
   - **Status**: PASS - Final PR will target `dev` per AGENTS.md rules

**Gate Result**: ✅ PASS - No violations. Refactor aligns with all constitutional principles.

## Project Structure

### Documentation (this feature)

```text
specs/042-reorganize-repo-topology/
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (unknown resolutions)
├── data-model.md        # Phase 1 output (domain model)
├── quickstart.md        # Phase 1 output (test scenarios)
├── contracts/           # Phase 1 output (directory mappings)
└── tasks.md             # Phase 2 output (checklist tasks)
```

### Source Code - Before (Current)

```text
src/
├── agents/              # 43 files - AI agent implementations
├── hooks/               # 41 directories - Lifecycle hooks
├── features/            # 21 directories - Built-in features/skills/commands
├── tools/               # 17 directories - Task delegation tools
├── shared/              # 43 utility files - Cross-cutting utilities
├── mcp/                 # 6 files - Model Context Protocol servers
├── cli/                 # CLI installer, doctor
├── config/              # 4 files - Configuration schema & types
├── index.ts             # Main plugin entry
└── plugin-*.ts          # Plugin setup files
```

### Source Code - After (Target)

```text
src/
├── orchestration/       # Control flow layer (agents + hooks)
│   ├── agents/          # 43 files - AI agent implementations
│   ├── hooks/           # 41 directories - Lifecycle hooks
│   └── index.ts         # Barrel export
├── execution/           # Work execution layer (features + tools)
│   ├── features/        # 21 directories - Built-in features/skills/commands
│   ├── tools/           # 17 directories - Task delegation tools
│   └── index.ts         # Barrel export
├── integration/         # Integration/connector layer (shared + mcp)
│   ├── shared/          # 43 utility files - Cross-cutting utilities
│   ├── mcp/             # 6 files - Model Context Protocol servers
│   └── index.ts         # Barrel export
├── platform/            # Platform/setup layer (config + existing)
│   ├── config/          # 4 files - Configuration schema & types
│   └── index.ts         # Barrel export
├── cli/                 # CLI stays separate (no change)
├── index.ts             # Main plugin entry (updated imports)
└── plugin-*.ts          # Plugin setup files (updated imports)
```

**Structure Decision**: Domain-based grouping by responsibility layer aligns with OpenCode's conceptual model:

- **Orchestration** = What orchestrates execution (agents orchestrate, hooks coordinate lifecycle)
- **Execution** = What does the work (features execute functionality, tools execute actions)
- **Integration** = What connects systems (shared integrates across domains, MCP integrates externally)
- **Platform** = What provides foundation (configuration provides platform setup)
- **CLI** = User interface (unchanged, separate concern)

This moves from a type-based view ("here are all agents") to a domain/responsibility view ("here's the orchestration layer"), which better communicates intent to developers.

## Complexity Tracking

No violations to justify - this refactor preserves all constitutional constraints and TDD requirements.

## Implementation Phases Overview

### Phase 0 – Preparation
Create import-mapping helper tool and validate git state

### Phase 1 – Reorganize Orchestration Domain (agents + hooks)
**Validation**: typecheck, build, tests

### Phase 2 – Reorganize Execution Domain (features + tools)
**Validation**: typecheck, build, tests

### Phase 3 – Reorganize Integration Domain (shared + mcp)
**Validation**: typecheck, build, tests

### Phase 4 – Reorganize Platform Domain (config)
**Validation**: typecheck, build, tests

### Phase 5 – Root-Level Cleanup & Documentation
Update AGENTS.md, YAML references, run full test suite

### Phase 6 – Create Pull Request
Submit PR targeting `dev` branch, ensure CI passes, merge

**Next Step**: Generate research.md, data-model.md, contracts/, and tasks.md in Phase 0-1 execution
