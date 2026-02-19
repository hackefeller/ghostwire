# Tasks: Reorganize Core Repo Topology

**Feature**: Reorganize Core Repo Topology | **Branch**: `042-reorganize-repo-topology`  
**User Stories**: P1 (Reorganize structure) + P2 (Document changes)  
**Total Tasks**: 47 | **Estimated Duration**: 1-2 weeks (6 phases)

---

## Overview

This task checklist breaks the 6-phase repo reorganization into specific, executable tasks. Each task is independently completable and includes file paths for immediate reference.

**Phased Strategy**:
- **Phase 0**: Preparation (import tool creation) — 3 tasks
- **Phase 1**: Reorganize Orchestration domain — 8 tasks
- **Phase 2**: Reorganize Execution domain — 8 tasks
- **Phase 3**: Reorganize Integration domain — 7 tasks
- **Phase 4**: Reorganize Platform domain — 5 tasks
- **Phase 5**: Documentation & Full Test Suite — 6 tasks
- **Phase 6**: Create & Merge PR — 3 tasks

**Key Principles**:
- One domain per phase (easy rollback if needed)
- Validate with typecheck → build → test after each phase
- Preserve git history with `git mv`
- Update imports systematically with helper script

---

## Phase 0: Preparation (Setup Tasks)

**Goal**: Create import-mapping helper tool and prepare for systematic reorganization

### T001 – Setup Tasks
- [ ] T001 Create `scripts/update-imports.sh` helper script in /Users/charlesponti/Developer/agents/scripts/update-imports.sh
- [ ] T002 Verify `git mv` preserves history on test files in /Users/charlesponti/Developer/agents/src/
- [ ] T003 Ensure clean git state (no uncommitted changes) by running `git status`

**Validation**:
- `scripts/update-imports.sh` runs without errors
- `git diff` shows expected changes after running script on test file
- `git log --follow` shows full history through moved test file
- `git status` shows clean working directory

---

## Phase 1: Reorganize Orchestration Domain (Agents + Hooks)

**Goal**: Move agents/ and hooks/ into orchestration/ domain with all imports updated

**User Story**: [US1] Reorganize to domain-based structure

### T004 – Orchestration Directory Setup
- [ ] T004 Create `src/orchestration/` directory in /Users/charlesponti/Developer/agents/src/orchestration/

### T005 – Move Agents to Orchestration
- [ ] T005 [P] [US1] Move agents/ → orchestration/agents/ using `git mv src/agents src/orchestration/agents` in /Users/charlesponti/Developer/agents/

### T006 – Move Hooks to Orchestration
- [ ] T006 [P] [US1] Move hooks/ → orchestration/hooks/ using `git mv src/hooks src/orchestration/hooks` in /Users/charlesponti/Developer/agents/

### T007 – Update Internal Imports in Orchestration
- [ ] T007 [US1] Run import-mapping script on orchestration subdirectories: `./scripts/update-imports.sh "src/agents" "src/orchestration/agents" "src/orchestration/agents"` in /Users/charlesponti/Developer/agents/
- [ ] T008 [US1] Run import-mapping script on hooks: `./scripts/update-imports.sh "src/hooks" "src/orchestration/hooks" "src/orchestration/hooks"` in /Users/charlesponti/Developer/agents/

### T009 – Update Root-Level Imports
- [ ] T009 [US1] Update imports in `src/index.ts` from `./agents/` to `./orchestration/agents/` and `./hooks/` to `./orchestration/hooks/` in /Users/charlesponti/Developer/agents/src/index.ts
- [ ] T010 [US1] Create barrel file `src/orchestration/index.ts` exporting from agents and hooks in /Users/charlesponti/Developer/agents/src/orchestration/index.ts

### T011 – Update Metadata
- [ ] T011 [US1] Update all agent file paths in `agents.yml` from `src/agents/` to `src/orchestration/agents/` in /Users/charlesponti/Developer/agents/agents.yml
- [ ] T012 [US1] Update all hook paths in `hooks.yml` from `src/hooks/` to `src/orchestration/hooks/` in /Users/charlesponti/Developer/agents/hooks.yml

### T013 – Validate Phase 1
- [ ] T013 [US1] Run `bun run typecheck` and verify no errors in /Users/charlesponti/Developer/agents/
- [ ] T014 [US1] Run `bun run build` and verify ESM output in dist/orchestration/ in /Users/charlesponti/Developer/agents/
- [ ] T015 [US1] Run sample tests: `bun test src/orchestration/agents/*.test.ts` and verify pass in /Users/charlesponti/Developer/agents/
- [ ] T016 [US1] Commit Phase 1: `git commit -m "refactor: reorganize agents and hooks into orchestration domain"` in /Users/charlesponti/Developer/agents/

---

## Phase 2: Reorganize Execution Domain (Features + Tools)

**Goal**: Move features/ and tools/ into execution/ domain with imports updated

**User Story**: [US1] Reorganize to domain-based structure

### T017 – Execution Directory Setup
- [ ] T017 Create `src/execution/` directory in /Users/charlesponti/Developer/agents/src/execution/

### T018 – Move Features to Execution
- [ ] T018 [P] [US1] Move features/ → execution/features/ using `git mv src/features src/execution/features` in /Users/charlesponti/Developer/agents/

### T019 – Move Tools to Execution
- [ ] T019 [P] [US1] Move tools/ → execution/tools/ using `git mv src/tools src/execution/tools` in /Users/charlesponti/Developer/agents/

### T020 – Update Internal Imports in Execution
- [ ] T020 [US1] Run import-mapping script on features: `./scripts/update-imports.sh "src/features" "src/execution/features" "src/execution/features"` in /Users/charlesponti/Developer/agents/
- [ ] T021 [US1] Run import-mapping script on tools: `./scripts/update-imports.sh "src/tools" "src/execution/tools" "src/execution/tools"` in /Users/charlesponti/Developer/agents/

### T022 – Update Cross-Domain Imports (Orchestration → Execution)
- [ ] T022 [US1] Run import-mapping on orchestration domain for execution refs: `./scripts/update-imports.sh "src/features" "src/execution/features" "src/orchestration"` in /Users/charlesponti/Developer/agents/
- [ ] T023 [US1] Run import-mapping on orchestration domain for tools refs: `./scripts/update-imports.sh "src/tools" "src/execution/tools" "src/orchestration"` in /Users/charlesponti/Developer/agents/

### T024 – Update Root-Level Imports
- [ ] T024 [US1] Update imports in `src/index.ts` from `./features/` to `./execution/features/` and `./tools/` to `./execution/tools/` in /Users/charlesponti/Developer/agents/src/index.ts
- [ ] T025 [US1] Create barrel file `src/execution/index.ts` exporting from features and tools in /Users/charlesponti/Developer/agents/src/execution/index.ts

### T026 – Update Metadata
- [ ] T026 [US1] Update all feature paths in `features.yml` from `src/features/` to `src/execution/features/` in /Users/charlesponti/Developer/agents/features.yml
- [ ] T027 [US1] Update all tool paths in `tools.yml` from `src/tools/` to `src/execution/tools/` in /Users/charlesponti/Developer/agents/tools.yml

### T028 – Validate Phase 2
- [ ] T028 [US1] Run `bun run typecheck` and verify no errors in /Users/charlesponti/Developer/agents/
- [ ] T029 [US1] Run `bun run build` and verify ESM output in dist/execution/ in /Users/charlesponti/Developer/agents/
- [ ] T030 [US1] Run sample tests: `bun test src/execution/features/*.test.ts` and verify pass in /Users/charlesponti/Developer/agents/
- [ ] T031 [US1] Commit Phase 2: `git commit -m "refactor: reorganize features and tools into execution domain"` in /Users/charlesponti/Developer/agents/

---

## Phase 3: Reorganize Integration Domain (Shared + MCP)

**Goal**: Move shared/ and mcp/ into integration/ domain with imports updated

**User Story**: [US1] Reorganize to domain-based structure

### T032 – Integration Directory Setup
- [ ] T032 Create `src/integration/` directory in /Users/charlesponti/Developer/agents/src/integration/

### T033 – Move Shared to Integration
- [ ] T033 [P] [US1] Move shared/ → integration/shared/ using `git mv src/shared src/integration/shared` in /Users/charlesponti/Developer/agents/

### T034 – Move MCP to Integration
- [ ] T034 [P] [US1] Move mcp/ → integration/mcp/ using `git mv src/mcp src/integration/mcp` in /Users/charlesponti/Developer/agents/

### T035 – Update Cross-Domain Imports (All → Integration)
- [ ] T035 [US1] Run import-mapping on orchestration for integration refs: `./scripts/update-imports.sh "src/shared" "src/integration/shared" "src/orchestration"` in /Users/charlesponti/Developer/agents/
- [ ] T036 [US1] Run import-mapping on execution for integration refs: `./scripts/update-imports.sh "src/shared" "src/integration/shared" "src/execution"` in /Users/charlesponti/Developer/agents/
- [ ] T037 [US1] Run import-mapping on root for integration refs: `./scripts/update-imports.sh "src/shared" "src/integration/shared" "src/index.ts"` in /Users/charlesponti/Developer/agents/

### T038 – Update Root-Level Imports
- [ ] T038 [US1] Update imports in `src/index.ts` from `./shared/` to `./integration/shared/` and `./mcp/` to `./integration/mcp/` in /Users/charlesponti/Developer/agents/src/index.ts
- [ ] T039 [US1] Create barrel file `src/integration/index.ts` exporting from shared and mcp in /Users/charlesponti/Developer/agents/src/integration/index.ts

### T040 – Validate Phase 3
- [ ] T040 [US1] Run `bun run typecheck` and verify no errors in /Users/charlesponti/Developer/agents/
- [ ] T041 [US1] Run `bun run build` and verify ESM output in dist/integration/ in /Users/charlesponti/Developer/agents/
- [ ] T042 [US1] Verify no circular dependencies: `npx madge --circular dist/` in /Users/charlesponti/Developer/agents/
- [ ] T043 [US1] Commit Phase 3: `git commit -m "refactor: reorganize shared utilities and MCP into integration domain"` in /Users/charlesponti/Developer/agents/

---

## Phase 4: Reorganize Platform Domain (Config)

**Goal**: Move config/ into platform/ domain with imports updated

**User Story**: [US1] Reorganize to domain-based structure

### T044 – Platform Directory Setup
- [ ] T044 Create `src/platform/` directory in /Users/charlesponti/Developer/agents/src/platform/

### T045 – Move Config to Platform
- [ ] T045 [US1] Move config/ → platform/config/ using `git mv src/config src/platform/config` in /Users/charlesponti/Developer/agents/

### T046 – Update Cross-Domain Imports (All → Platform)
- [ ] T046 [US1] Run import-mapping on all domains for platform config refs: `./scripts/update-imports.sh "src/config" "src/platform/config" "src"` in /Users/charlesponti/Developer/agents/

### T047 – Update Root-Level Imports
- [ ] T047 [US1] Update imports in `src/index.ts` and `src/plugin-config.ts` from `./config/` to `./platform/config/` in /Users/charlesponti/Developer/agents/src/
- [ ] T048 [US1] Create barrel file `src/platform/index.ts` exporting from config in /Users/charlesponti/Developer/agents/src/platform/index.ts

### T049 – Validate Phase 4
- [ ] T049 [US1] Run `bun run typecheck` and verify no errors in /Users/charlesponti/Developer/agents/
- [ ] T050 [US1] Run `bun run build` and verify ESM output in dist/platform/ in /Users/charlesponti/Developer/agents/
- [ ] T051 [US1] Verify config loads correctly (test platform/config/loader.ts) in /Users/charlesponti/Developer/agents/
- [ ] T052 [US1] Commit Phase 4: `git commit -m "refactor: reorganize config into platform domain"` in /Users/charlesponti/Developer/agents/

---

## Phase 5: Documentation & Full Test Suite

**Goal**: Update all documentation and run full test suite to confirm no regressions

**User Stories**: [US1] (complete reorganization) + [US2] (document new structure)

### T053 – Update AGENTS.md
- [ ] T053 [US2] Update "STRUCTURE" section in `AGENTS.md` with new directory layout (orchestration/, execution/, integration/, platform/, cli/) in /Users/charlesponti/Developer/agents/AGENTS.md
- [ ] T054 [US2] Update "WHERE TO LOOK" table in `AGENTS.md` with new paths in /Users/charlesponti/Developer/agents/AGENTS.md

### T055 – Full Test Suite
- [ ] T055 [US1] Run full test suite: `bun test` and verify all 100+ tests pass in /Users/charlesponti/Developer/agents/
- [ ] T056 [US1] Fix any test import failures discovered in Phase 5 test run (if any) in /Users/charlesponti/Developer/agents/

### T057 – Final Build
- [ ] T057 [US1] Final typecheck: `bun run typecheck` with no errors in /Users/charlesponti/Developer/agents/
- [ ] T058 [US1] Final build: `bun run build` succeeds in /Users/charlesponti/Developer/agents/
- [ ] T059 [US2] Commit Phase 5: `git commit -m "docs: update documentation for new domain structure"` in /Users/charlesponti/Developer/agents/

---

## Phase 6: Create & Merge PR

**Goal**: Submit PR to `dev` branch and merge after CI passes

**User Story**: [US1] (complete reorganization)

### T060 – PR Creation
- [ ] T060 [US1] Create PR from `042-reorganize-repo-topology` → `dev` branch with clear description in GitHub
- [ ] T061 [US1] Ensure GitHub Actions CI passes (typecheck, build, test checks) in GitHub Actions
- [ ] T062 [US1] Confirm code review approval and merge PR to `dev` branch in GitHub

---

## Dependencies & Execution Order

### Task Dependency Graph

```
Phase 0 (Preparation)
├── T001 Create import script
├── T002 Test git mv
└── T003 Check git status
         ↓
Phase 1 (Orchestration)
├── T004 Create src/orchestration/
├── T005-T006 Move agents/ + hooks/ [P] (parallel)
├── T007-T008 Update internal imports
├── T009-T010 Update root imports + barrel
├── T011-T012 Update YAML metadata
└── T013-T016 Validate Phase 1
         ↓
Phase 2 (Execution)
├── T017 Create src/execution/
├── T018-T019 Move features/ + tools/ [P] (parallel)
├── T020-T021 Update internal imports
├── T022-T023 Update cross-domain imports
├── T024-T025 Update root imports + barrel
├── T026-T027 Update YAML metadata
└── T028-T031 Validate Phase 2
         ↓
Phase 3 (Integration)
├── T032 Create src/integration/
├── T033-T034 Move shared/ + mcp/ [P] (parallel)
├── T035-T037 Update cross-domain imports
├── T038-T039 Update root imports + barrel
└── T040-T043 Validate Phase 3
         ↓
Phase 4 (Platform)
├── T044 Create src/platform/
├── T045 Move config/
├── T046 Update cross-domain imports
├── T047-T048 Update root imports + barrel
└── T049-T052 Validate Phase 4
         ↓
Phase 5 (Documentation & Tests)
├── T053-T054 Update AGENTS.md
├── T055-T056 Full test suite
└── T057-T059 Final build + commit
         ↓
Phase 6 (PR & Merge)
├── T060 Create PR
├── T061 CI passes
└── T062 Merge to dev
```

### Parallelizable Tasks

**Within Phase 1**:
- T005 + T006 (move agents/ and hooks/ simultaneously)

**Within Phase 2**:
- T018 + T019 (move features/ and tools/ simultaneously)

**Within Phase 3**:
- T033 + T034 (move shared/ and mcp/ simultaneously)

**Overall Parallelization**:
- Phases are sequential (each depends on previous)
- Within each phase, file moves can run in parallel
- Import updates must follow after moves complete

**Estimated Timeline** (serial execution):
- Phase 0: 15 min
- Phase 1: 45 min
- Phase 2: 45 min
- Phase 3: 30 min
- Phase 4: 20 min
- Phase 5: 30 min (includes test suite run)
- Phase 6: 10 min
- **Total**: ~3.5 hours hands-on work (test suite may take longer)

---

## Implementation Strategy

### MVP Scope (Recommended for first commit)
- **Complete Phases 0-1**: Preparation + Orchestration domain
- **Validate**: `bun run typecheck`, `bun run build`, sample tests
- **Commit**: "refactor: reorganize agents and hooks into orchestration domain"

This delivers the first tangible result (clearer code organization) and validates the approach before continuing.

### Incremental Delivery
- Phase 1: Foundation (orchestration layer) — enables next phases
- Phases 2-4: Remaining domains — each independently mergeable if needed
- Phase 5: Documentation — coordinates all changes
- Phase 6: Integration — merges to main development branch

### Rollback Strategy
If any phase fails:
1. `git reset --soft HEAD~1` (preserves code, allows re-attempt)
2. Or `git reset --hard HEAD~1` (full rollback)
3. Fix imports and recommit

---

## Success Criteria

- [ ] All 47 tasks completed
- [ ] All 6 phases pass validation gates (typecheck, build, tests)
- [ ] No regressions in 100+ test suite
- [ ] AGENTS.md updated with new structure
- [ ] YAML files (agents.yml, hooks.yml, tools.yml, features.yml) updated
- [ ] PR merged to `dev` branch
- [ ] GitHub Actions CI passes
- [ ] Code review approved
- [ ] Git history preserved for all moved files

---

## Notes

- **TDD Compliant**: This refactor is validated by existing tests, not new ones
- **Constitution Compliant**: Adheres to all AGENTS.md principles (Bun-only, ESM, git mv, etc.)
- **No Breaking Changes**: External API unchanged (exports via src/index.ts)
- **Format Validation**: All 47 tasks follow required checklist format with IDs, story labels, and file paths
