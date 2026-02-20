---
title: Phase agent renaming into individual phases
type: refactor
date: 2026-02-19
---

# Phase Agent Renaming Into Individual Phases

## Overview

Break down the agent renaming refactor into 10 individual phases, one per agent name change, plus 5 compound-agent phases. Each phase is independent and can be tested/reviewed before moving to the next. This plan expands each phase into **fine-grained, executable tasks** with explicit checkpoints and **repo-scan-informed checklists**.

## Background

The agent renaming change (cipher-operator → void-runner, etc.) affects 658+ references across the codebase. This is too large to do in one pass. Breaking into phases allows:

- Incremental testing
- Easier review
- Rollback capability if issues arise
- Clear progress tracking
- Reduced regression risk

## Global Rules

- **TDD is mandatory**: tests first for each phase.  
- **No sweeping “search/replace” without verification**.  
- **Each phase results in a clean, reviewable PR**.  
- **Do not mix phases in a single change**.  
- **Document any surprises or exceptions** in the phase notes.  
- **Keep compiled artifacts in sync** after source updates (schema + dist).  

---

# Phase Summary

| Phase | Agent Rename | Files to Update | Status |
|-------|-------------|-----------------|--------|
| 1 | `cipher-operator` → `void-runner` | ~120 refs | ✅ DONE |
| 2 | `nexus-orchestrator` → `grid-sync` | ~80 refs | ✅ DONE |
| 3 | `augur-planner` → `zen-planner` | ~40 refs | ✅ DONE |
| 4 | `tactician-strategist` → `war-mind` | ~20 refs | ✅ DONE |
| 5 | `glitch-auditor` → `null-audit` | ~20 refs | ✅ DONE |
| 6 | `seer-advisor` → `eye-ops` | ~40 refs | ✅ DONE |
| 7 | `scout-recon` → `scan-ops` | ~30 refs | ✅ DONE |
| 8 | `archive-researcher` → `data-dive` | ~30 refs | ✅ DONE |
| 9 | `optic-analyst` → `eye-scan` | ~20 refs | ✅ DONE |
| 10 | `cipher-runner` → `dark-runner` | ~15 refs | ✅ DONE |
| 11 | Review compound agents | ~20 refs | ✅ DONE |
| 12 | Research compound agents | ~15 refs | ✅ DONE |
| 13 | Design compound agents | ~15 refs | ✅ DONE |
| 14 | Workflow compound agents | ~10 refs | ✅ DONE |
| 15 | Documentation compound agents | ~10 refs | ✅ DONE |

---

# Repo Scan Findings (Core Targets)

## Source / Runtime
- `src/shared/agent-display-names.ts`
- `src/shared/agent-display-names.test.ts`
- `src/agents/compound/index.ts`
- `src/config/schema.ts`
- `src/index.ts`
- `src/platform/opencode/config-composer.ts`

## Tests
- `tests/compound/regression.test.ts`
- `tests/compound/foundation.test.ts`

## Documentation
- `README.md`
- `AGENTS.md`
- `docs/reference/agents.md`
- `docs/reference/configurations.md`
- `docs/reference/tools.md`
- `docs/reference/modes.md`
- `docs/reference/lifecycle-hooks.md`
- `docs/reference/features.md`
- `docs/getting-started/overview.md`
- `docs/getting-started/installation.md`
- `docs/concepts/orchestration.md`
- `docs/concepts/system-deep-dive.md`
- `docs/concepts/plugin-architecture.md`
- `docs/troubleshooting/ollama-streaming-issue.md`
- `docs/plans/*` (legacy mentions should be updated only when in scope)

## Generated / Build Artifacts (Regenerate post-phase)
- `assets/ghostwire.schema.json`
- `assets/ruach.schema.json`
- `dist/config/schema.d.ts`
- `dist/tools/*`
- `dist/*` (when schema or constants change)

---

# Phase Execution Template (Use for every phase)

### 0) Pre-flight
- [ ] Confirm phase scope and old → new mapping
- [ ] Create a task branch named `refactor/phase-<n>-<agent>`
- [ ] Identify *all* known file clusters (agents, hooks, config, tests, docs, dist)
- [ ] Record baseline state: typecheck + tests status
- [ ] Create a per-phase checklist from **Repo Scan Findings**

### 1) RED — Add/adjust tests
- [ ] Locate existing tests referencing old agent name
- [ ] Add a minimal test (or test case) that expects new name
- [ ] Ensure the test fails for the old name (verify failure)
- [ ] Document the failing test in phase notes

### 2) GREEN — Implement rename (minimum changes)
- [ ] Rename agent file (if applicable)
- [ ] Update agent registry mappings
- [ ] Update config schema (if applicable)
- [ ] Update hooks / runtime strings
- [ ] Update docs and comments (only within phase scope)
- [ ] Update tests to pass

### 3) REFACTOR — Clean and verify
- [ ] Remove any temporary or duplicated references
- [ ] Run targeted test(s) for this phase
- [ ] Run typecheck
- [ ] Grep for any remaining old name (project-wide)
- [ ] Regenerate schemas / dist outputs if schema changed
- [ ] Add phase notes (unexpected changes, files touched)

### 4) Exit Criteria
- [ ] No references to old name remain
- [ ] TypeScript compiles
- [ ] Phase tests pass
- [ ] Documentation updated if required
- [ ] Generated artifacts updated if impacted

---

# Current Status (2026-02-19)

- **TypeScript**: ✅ 0 errors  
- **Tests**: 1961 pass, 0 fail  
- **Core agents**: ✅ All 10 renamed  
- **Compound agents**: ✅ All 15 renamed (Phases 11-15 complete)

---

# Phase 1: cipher-operator → void-runner

### Files Already Updated
- `src/agents/void-runner.ts` (renamed from cipher-operator.ts)
- `src/agents/types.ts` - BuiltinAgentName type
- `src/agents/utils.ts` - agentSources mapping
- `src/config/schema.ts` - BuiltinAgentNameSchema, OverridableAgentNameSchema, AgentOverridesSchema

### Remaining Files (Fine-Grained Tasks)

#### Discovery
- [ ] List all occurrences of `cipher-operator` across `src/`, `tests/`, `docs/`
- [ ] Categorize each hit: registry, config, hooks, CLI, tests, docs, dist
- [ ] Identify dynamic string generation involving `cipher-operator`

#### Test (RED)
- [ ] Add a targeted test in the most relevant agent test file
- [ ] Ensure test fails with `cipher-operator` still present

#### Update (GREEN)
- [ ] Replace string references in `src/index.ts`
- [ ] Update `src/platform/opencode/config-composer.ts`
- [ ] Update `src/shared/agent-display-names.ts`
- [ ] Update tests: `tests/compound/regression.test.ts`, `tests/compound/foundation.test.ts`
- [ ] Update docs: `README.md`, `docs/reference/agents.md`, `docs/reference/configurations.md`
- [ ] Update `system-prompt.md` and `AGENTS.md`
- [ ] Regenerate schema artifacts if schema touched

#### Refactor/Verify
- [ ] Run phase-specific tests
- [ ] `typecheck` clean
- [ ] No remaining `cipher-operator` references

### Acceptance Criteria
- [ ] TypeScript compiles without `cipher-operator` errors
- [ ] Tests pass for `void-runner`
- [ ] No `cipher-operator` string references remain

---

# Phase 2: nexus-orchestrator → grid-sync

### Files Already Updated
- `src/agents/grid-sync.ts` (renamed)
- `src/agents/utils.ts` - agentSources mapping

### Remaining Files (Fine-Grained Tasks)

#### Discovery
- [ ] Search for all `nexus-orchestrator` occurrences in source/tests/docs
- [ ] Enumerate hook names, orchestrator references, and config overrides
- [ ] Identify hook-related docs: `docs/reference/lifecycle-hooks.md`

#### Test (RED)
- [ ] Add a test case for `grid-sync` name resolution or selection
- [ ] Ensure failure pre-update

#### Update (GREEN)
- [ ] Update `src/index.ts` hook names
- [ ] Update `docs/reference/features.md`, `docs/getting-started/overview.md`
- [ ] Update any orchestrator hook implementation IDs
- [ ] Replace string references in tests
- [ ] Regenerate schema artifacts if required

#### Refactor/Verify
- [ ] Run phase test subset
- [ ] `typecheck` clean
- [ ] Confirm no `nexus-orchestrator` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `nexus-orchestrator` errors
- [ ] Tests pass for `grid-sync`
- [ ] No `nexus-orchestrator` string references remain

---

# Phase 3: augur-planner → zen-planner

### Fine-Grained Tasks

- #### Discovery
- [ ] Document where legacy `augur-planner` strings still exist (hooks, agents, config, docs, tests)
- [ ] Confirm hook directory: `src/hooks/augur-planner-md-only/`
- [ ] Verify any dynamic prompt builder usage
- [ ] Check docs: `docs/reference/modes.md`, `docs/reference/lifecycle-hooks.md`

#### Test (RED)
- [ ] Add test in planner-related suite verifying `zen-planner` selection
- [ ] Confirm failure before updates

#### Update (GREEN)
- [ ] Rename agent file (if not already renamed)
- [ ] Rename hook directory and internal factory (`createZenPlannerHook`)
- [ ] Update config and schema references
- [ ] Update hardcoded strings in prompts or templates
- [ ] Update tests and fixtures
- [ ] Update docs references

#### Refactor/Verify
- [ ] Run planner tests
- [ ] `typecheck` clean
- [ ] Verify no residual `augur-planner` references remain (documentation only)

### Acceptance Criteria
- [ ] TypeScript compiles without `Augur Planner`-related wording (for historical records)
- [ ] Tests pass for `zen-planner`
- [ ] No `augur-planner` string references remain (goal achieved)

---

# Phase 4: tactician-strategist → war-mind

### Fine-Grained Tasks

#### Discovery
- [ ] Locate all occurrences of `tactician-strategist`
- [ ] Identify any non-TS references (docs, config templates)
- [ ] Validate test coverage for agent selection

#### Test (RED)
- [ ] Add test to verify `war-mind` appears in agent registry
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mapping in `agentSources`
- [ ] Update schema types
- [ ] Replace strings in tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No `tactician-strategist` references

### Acceptance Criteria
- [ ] TypeScript compiles without `tactician-strategist` errors
- [ ] No `tactician-strategist` string references remain

---

# Phase 5: glitch-auditor → null-audit

### Fine-Grained Tasks

#### Discovery
- [ ] Find all `glitch-auditor` references
- [ ] Confirm test file `src/agents/momus.test.ts` references

#### Test (RED)
- [ ] Add/adjust test to assert `null-audit` registration
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mapping and schema
- [ ] Update `momus.test.ts`
- [ ] Update docs strings (if any)

#### Refactor/Verify
- [ ] Run `momus` tests
- [ ] `typecheck` clean
- [ ] No `glitch-auditor` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `glitch-auditor` errors
- [ ] No `glitch-auditor` string references remain

---

# Phase 6: seer-advisor → eye-ops

### Fine-Grained Tasks

#### Discovery
- [ ] Locate all `seer-advisor` references
- [ ] Identify dynamic prompt builder usage
- [ ] Find model-fallback definitions referencing `seer-advisor`
- [ ] Scan docs in `docs/reference/*`, `docs/getting-started/*`

#### Test (RED)
- [ ] Add a test for dynamic prompt builder selecting `eye-ops`
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mappings and schema
- [ ] Update dynamic prompt builder strings
- [ ] Update tests and fixtures
- [ ] Update docs and system-prompt references

#### Refactor/Verify
- [ ] Run relevant prompt builder tests
- [ ] `typecheck` clean
- [ ] No `seer-advisor` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `seer-advisor` errors
- [ ] No `seer-advisor` string references remain

---

# Phase 7: scout-recon → scan-ops

### Fine-Grained Tasks

#### Discovery
- [ ] Search for all `scout-recon` occurrences
- [ ] Identify model-fallback and test references
- [ ] Check config schema for old name
- [ ] Scan docs in tools, configurations, and workflows

#### Test (RED)
- [ ] Add test for `scan-ops` fallback mapping
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mapping, schema, and fallback config
- [ ] Update tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No `scout-recon` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `scout-recon` errors
- [ ] No `scout-recon` string references remain

---

# Phase 8: archive-researcher → data-dive

### Fine-Grained Tasks

#### Discovery
- [ ] Find `archive-researcher` references
- [ ] Identify model fallback and test usage
- [ ] Verify any documentation references

#### Test (RED)
- [ ] Add test for `data-dive` registry/fallback
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mapping, schema, fallback config
- [ ] Update tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No `archive-researcher` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `archive-researcher` errors
- [ ] No `archive-researcher` string references remain

---

# Phase 9: optic-analyst → eye-scan

### Fine-Grained Tasks

#### Discovery
- [ ] Locate `optic-analyst` references
- [ ] Identify config and test references
- [ ] Verify agent mapping
- [ ] Scan docs in agents + configurations

#### Test (RED)
- [ ] Add test for `eye-scan` registration
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mapping and schema
- [ ] Update tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No `optic-analyst` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `optic-analyst` errors
- [ ] No `optic-analyst` string references remain

---

# Phase 10: cipher-runner → dark-runner

### Fine-Grained Tasks

#### Discovery
- [ ] Find `cipher-runner` references
- [ ] Identify test file `src/agents/sisyphus-junior.test.ts`
- [ ] Identify hook docs (`cipher-runner-notepad` references)

#### Test (RED)
- [ ] Add test for `dark-runner` registration
- [ ] Confirm failure pre-update

#### Update (GREEN)
- [ ] Rename agent file
- [ ] Update mapping and schema
- [ ] Update `sisyphus-junior.test.ts`
- [ ] Update docs where needed

#### Refactor/Verify
- [ ] Run `sisyphus-junior` tests
- [ ] `typecheck` clean
- [ ] No `cipher-runner` references remain

### Acceptance Criteria
- [ ] TypeScript compiles without `cipher-runner` errors
- [ ] No `cipher-runner` string references remain

---

# Compound Agent Renaming Plan

## Overview

Extend agent naming to use `<type>.<action>` structure for compound agents. This follows the neopunk void Japanese minimalist style while maintaining clarity. These phases are explicitly **fine-grained** and scoped to compound agent mappings only.

## Current → Proposed Names

| Current | Proposed | Type | Action |
|---------|----------|------|--------|
| `grid:void-rails` | `void.review-rails` | void | review-rails |
| `grid:void-python` | `void.review-python` | void | review-python |
| `grid:void-ts` | `void.review-ts` | void | review-ts |
| `grid:zen-rails` | `zen.review-rails` | zen | review-rails |
| `grid:mono-review` | `mono.review` | mono | review |
| `grid:docs-scan` | `docs.scan` | docs | scan |
| `grid:learnings-scan` | `learnings.scan` | learnings | scan |
| `grid:best-practices-scan` | `best-practices.scan` | best-practices | scan |
| `grid:git-scan` | `git.scan` | git | scan |
| `grid:figma-sync` | `figma.sync` | figma | sync |
| `grid:design-check` | `design.check` | design | check |
| `grid:design-loop` | `design.loop` | design | loop |
| `grid:ui-build` | `ui.build` | ui | build |
| `grid:flow-check` | `flow.check` | flow | check |
| `grid:agent-arch` | `agent.arch` | agent | arch |
| `grid:deploy-check` | `deploy.check` | deploy | check |
| `grid:readme-write` | `docs.write-readme` | docs | write-readme |
| `grid:style-edit` | `docs.edit-style` | docs | edit-style |
| `grid:gem-write` | `docs.write-gem` | docs | write-gem |

---

# Phase 11: Review Compound Agents

### Scope (Old → New)
- `grid:void-rails` → `void.review-rails`
- `grid:void-python` → `void.review-python`
- `grid:void-ts` → `void.review-ts`
- `grid:zen-rails` → `zen.review-rails`
- `grid:mono-review` → `mono.review`

### Fine-Grained Tasks

#### Discovery
- [ ] Locate all `grid:void-*` and `grid:zen-rails` references
- [ ] Find compound mapping definitions in `src/agents/compound/index.ts`
- [ ] Identify tests referencing review compounds
- [ ] Check config schema enumerations

#### Test (RED)
- [ ] Add test cases ensuring new compound names resolve correctly
- [ ] Confirm failures for each old name

#### Update (GREEN)
- [ ] Update `COMPOUND_AGENT_MAPPINGS`
- [ ] Update config schema if compound names are enumerated
- [ ] Update tests and fixtures
- [ ] Update docs if compound names are listed

#### Refactor/Verify
- [ ] Run compound agent tests
- [ ] `typecheck` clean
- [ ] No old review compound names remain

### Acceptance Criteria
- [ ] No old review compound names remain
- [ ] Tests pass for review compounds
- [ ] TypeScript compiles

---

# Phase 12: Research Compound Agents

### Scope (Old → New)
- `grid:docs-scan` → `docs.scan`
- `grid:learnings-scan` → `learnings.scan`
- `grid:best-practices-scan` → `best-practices.scan`
- `grid:git-scan` → `git.scan`

### Fine-Grained Tasks

#### Discovery
- [ ] Locate all research compound references
- [ ] Identify any doc or config references

#### Test (RED)
- [ ] Add test cases for each new research compound name
- [ ] Confirm failures pre-update

#### Update (GREEN)
- [ ] Update compound mappings
- [ ] Update config schema enumerations
- [ ] Update tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] Ensure no old research names remain

### Acceptance Criteria
- [ ] No old research compound names remain
- [ ] Tests pass for research compounds
- [ ] TypeScript compiles

---

# Phase 13: Design Compound Agents

### Scope (Old → New)
- `grid:figma-sync` → `figma.sync`
- `grid:design-check` → `design.check`
- `grid:design-loop` → `design.loop`
- `grid:ui-build` → `ui.build`

### Fine-Grained Tasks

#### Discovery
- [ ] Locate all design compound references
- [ ] Identify any UI or design tooling configs

#### Test (RED)
- [ ] Add tests for each new design compound name
- [ ] Confirm failures pre-update

#### Update (GREEN)
- [ ] Update compound mappings
- [ ] Update config schema enumerations
- [ ] Update tests and doc references

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No old design names remain

### Acceptance Criteria
- [ ] No old design compound names remain
- [ ] Tests pass for design compounds
- [ ] TypeScript compiles

---

# Phase 14: Workflow Compound Agents

### Scope (Old → New)
- `grid:flow-check` → `flow.check`
- `grid:agent-arch` → `agent.arch`
- `grid:deploy-check` → `deploy.check`

### Fine-Grained Tasks

#### Discovery
- [ ] Locate workflow compound references
- [ ] Identify any hook or workflow docs using old names

#### Test (RED)
- [ ] Add tests for `flow.check`, `agent.arch`, `deploy.check`
- [ ] Confirm failures pre-update

#### Update (GREEN)
- [ ] Update compound mappings
- [ ] Update schema enumerations
- [ ] Update tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No old workflow names remain

### Acceptance Criteria
- [ ] No old workflow compound names remain
- [ ] Tests pass for workflow compounds
- [ ] TypeScript compiles

---

# Phase 15: Documentation Compound Agents

### Scope (Old → New)
- `grid:readme-write` → `docs.write-readme`
- `grid:style-edit` → `docs.edit-style`
- `grid:gem-write` → `docs.write-gem`

### Fine-Grained Tasks

#### Discovery
- [ ] Locate documentation compound references
- [ ] Identify doc-related templates or examples

#### Test (RED)
- [ ] Add tests for new doc compound names
- [ ] Confirm failures pre-update

#### Update (GREEN)
- [ ] Update compound mappings
- [ ] Update schema enumerations
- [ ] Update tests and docs

#### Refactor/Verify
- [ ] Run targeted tests
- [ ] `typecheck` clean
- [ ] No old documentation names remain

### Acceptance Criteria
- [ ] No old documentation compound names remain
- [ ] Tests pass for documentation compounds
- [ ] TypeScript compiles

---

# Final Validation (After Phase 15)

- [ ] `bun run typecheck` passes
- [ ] `bun test` passes (or only known pre-existing failures remain)
- [ ] No old agent names remain in project-wide grep
- [ ] Documentation updated (`AGENTS.md`, if applicable)
- [ ] Schema outputs regenerated (`assets/*`, `dist/*`)
- [ ] Phase notes compiled into a final summary

---

# Rollback Plan

If issues arise in a specific phase:

1. Revert the phase branch only
2. Re-run targeted tests
3. Re-run `typecheck`
4. Identify the specific reference that caused issues
5. Re-apply only the necessary change(s)

---

# Dependencies

- Phase 1 must complete before others (types updated)
- Phase 2 depends on Phase 1 (grid-sync uses new types)
- Compound phases can be executed independently once core names are stable
