---
title: refactor: reorganize core repo topology
type: refactor
date: 2026-02-19
---

# Refactor: Reorganize Core Repo Topology

## Overview
Reorganize the repo's directory topology and filenaming from first principles to make the codebase easier to navigate and develop against. The goal is a structure that feels intuitive and scales as the project grows.

## Problem Statement
The current folder layout has evolved organically without a coherent organizing principle. This makes it difficult to:
- Find where to add new code
- Understand the relationship between different parts of the codebase
- Onboard new contributors efficiently

## Proposed Solution
Approach reorganization from first principles:
1. What are the natural groupings of functionality?
2. What naming conventions make paths self-documenting?
3. How can we minimize cognitive load when navigating?

## Technical Approach

### Phase 1 – Current State Audit
- List all top-level directories and understand their purpose
- Identify what each directory contains and why it exists
- Map dependencies between directories (what imports what)
- Understand what the build/test system expects

### Phase 2 – First-Principles Redesign
- Group by concern rather than by type
- Consider flat vs deep hierarchies tradeoffs
- Define naming conventions that make paths predictable
- Design for discoverability (ls should reveal intent)

### Phase 3 – Implementation
- Move files with `git mv` to preserve history
- Update all imports and references
- Run `bun run typecheck` and `bun run build` after each change
- Update any metadata files (agents.yml, hooks.yml, tools.yml, features.yml)

### Phase 4 – Validation
- Verify all tests pass
- Confirm build succeeds
- Check that documentation still links correctly

## Acceptance Criteria
- [ ] Directory structure feels intuitive and self-documenting
- [ ] New contributors can find what they need without extensive hunting
- [ ] All builds and tests pass after reorganization
- [ ] Import paths and references are consistent

## Success Metrics
1. Time to find a specific file or module is reduced
2. Directory structure reveals intent without reading code
3. No regressions in build/test pipeline

## Dependencies & Risks
- **Dependencies:** Any files that hardcode paths (imports, config, docs)
- **Risks:** Breaking imports; forgetting to update references; build failures

## Documentation Plan
- Update AGENTS.md to reflect new structure
- Add navigation guidance to docs

## References
- `workflows:plan` conventions (filename schema, planning depth)
- Current directory structure: `ls -la src/`
