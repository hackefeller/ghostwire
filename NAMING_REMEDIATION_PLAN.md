# Naming Remediation Plan: Agent & Feature Name Alignment

**Status**: Planning Phase  
**Created**: 2026-02-19  
**Branch**: main (create feature branch before implementation)  
**Scope**: Fix 100+ naming inconsistencies across 35+ files  
**Estimated Duration**: 3-4 hours

---

## Executive Summary

The codebase underwent significant agent and feature renamings but old names persist in many locations, creating inconsistencies and confusion. This plan systematically remediates all occurrences across four severity tiers.

### Core Renamings
- `cipher-operator` → `void-runner`
- `nexus-orchestrator` → `grid-sync`
- `sisyphus-swarm` → `agent-swarm`
- `sisyphus-tasks` → `task-queue`
- Function names: `createSisyphusAgent` → `createVoidRunnerAgent`
- Schema types: `SisyphusAgentConfig` → `VoidRunnerConfig`, etc.

---

## Phase 1: Critical Function & Config Name Updates (BLOCKER)

**Priority**: MUST COMPLETE FIRST  
**Impact**: Core functionality correctness  
**Files Affected**: 8 critical files  
**Estimated Time**: 30-45 minutes

### 1.1 Function Renaming: `createSisyphusAgent` → `createVoidRunnerAgent`

#### Files to Update

**File**: `/src/orchestration/agents/void-runner.ts`
- **Line 422**: Function definition `function createSisyphusAgent()`
- **Line 454**: Property assignment `createSisyphusAgent.mode = MODE`
- **Action**: Rename to `createVoidRunnerAgent`

**File**: `/src/orchestration/agents/index.ts`
- **Line 4**: Export statement - `export { createSisyphusAgent }`
- **Action**: Change to `export { createVoidRunnerAgent }`

**File**: `/src/orchestration/agents/utils.ts`
- **Line 14**: Import statement - `import { createSisyphusAgent }`
- **Line 65**: Factory map entry - `"void-runner": createSisyphusAgent,`
- **Line 380**: Function call in orchestration logic
- **Action**: Update import and all references

**File**: `/src/index.ts`
- **Lines TBD**: Any references to old function name
- **Action**: Update to use `createVoidRunnerAgent`

**Verification**: After changes, grep should return zero matches for `createSisyphusAgent`

---

### 1.2 Config Key Renaming: `cipher_agent` → `void_runner`

#### Files to Update

**File**: `/src/platform/config/schema.ts`
- **Line 578**: Config schema key - `cipher_agent: SisyphusAgentConfigSchema`
- **Action**: Change to `void_runner: VoidRunnerConfigSchema` (depends on 1.3)

**File**: `/src/platform/config/migration.ts`
- **Line 185**: Migration logic checking `cipher_agent` key
- **Action**: Update to check for `void_runner` with fallback to `cipher_agent` for backwards compatibility

**File**: `/src/platform/opencode/config-composer.ts`
- **Lines 189-193**: Multiple references to `cipher_agent` (4 occurrences)
- **Action**: Update all to `void_runner`

**File**: `/src/index.ts`
- **Line 238**: Config access `cipher_agent?.disabled`
- **Action**: Change to `void_runner?.disabled`

**Verification**: After changes, grep should return zero matches for `cipher_agent` key (comments may remain)

---

### 1.3 Schema Type Renaming (Type Safety)

#### Files to Update

**File**: `/src/platform/config/schema.ts`
- **Line 333**: `SisyphusAgentConfigSchema` → `VoidRunnerConfigSchema`
- **Line 544**: `SisyphusTasksConfigSchema` → `TaskQueueConfigSchema`
- **Line 553**: `SisyphusSwarmConfigSchema` → `AgentSwarmConfigSchema`
- **Line 562**: `SisyphusConfigSchema` → `OpenCodeConfigSchema` (wrapper type)
- **Lines 600, 622, 623**: Type exports need renaming

**File**: `/src/platform/config/index.ts`
- **Line 9**: Re-export schema names
- **Lines 24+**: Type exports
- **Action**: Update all exports to use new names

**Verification**: `bun typecheck` should pass with no errors

---

### 1.4 Agent Registry Update

**File**: `/docs/agents.yml`
- **Line 16**: Agent definition - `- id: cipher-operator` → `- id: void-runner`
- **Line 36**: Agent definition - `- id: nexus-orchestrator` → `- id: grid-sync`
- **Line 275**: Comment about mapping (currently backwards, needs fixing)
- **Action**: Update agent IDs and fix mapping comment

**Verification**: YAML should parse without errors

---

### 1.5 Display Names Registry

**File**: `/src/integration/shared/agent-display-names.ts`
- **Line 22**: `"cipher-operator": "Cipher Operator..."` → `"void-runner": "Void Runner..."`
- **Line 23**: `"nexus-orchestrator": "Nexus Orchestrator..."` → `"grid-sync": "Grid Sync..."`
- **Action**: Update mapping keys

**Verification**: Types should align with agents.yml IDs

---

## Phase 2: JSON Schema Assets (High Priority)

**Priority**: HIGH (blocking schema validation)  
**Impact**: OpenCode config validation  
**Files Affected**: 1 large file  
**Estimated Time**: 15-20 minutes

### 2.1 Update `/assets/ruach.schema.json`

**Changes Required**:
- Replace all occurrences of `"cipher-operator"` with `"void-runner"`
- Replace all occurrences of `"nexus-orchestrator"` with `"grid-sync"`

**Locations**:
- **Line 23**: Agent enum (agents array)
- **Line 31**: Agent type enum
- **Line 184**: Agent type enum (second location)
- **Line 484**: Agent config object key
- **Line 1774**: Hook config object key
- **Line 2444**: Config section object key

**Verification**: JSON should validate successfully

---

## Phase 3: Test Files Update (High Priority)

**Priority**: HIGH (tests must pass)  
**Impact**: Test suite correctness  
**Files Affected**: 6 test files  
**Estimated Time**: 30-40 minutes

### 3.1 Primary Test Files

**File**: `/tests/regression.test.ts`
- **Lines 7, 19, 80**: Update `"cipher-operator"` → `"void-runner"` (3 occurrences)
- **Lines 7, 19, 80**: Update `"nexus-orchestrator"` → `"grid-sync"` (3 occurrences)
- **Lines 146, 153-154, 172, 183**: Config assertions using `agents["cipher-operator"]` (5 lines)
- **Line 193**: Disabled agents array
- **Action**: Replace all agent ID references

**File**: `/tests/compound/regression.test.ts`
- **Same changes as above** (appears to be duplicate/mirrored test file)
- **Estimated changes**: 14 occurrences

**File**: `/tests/foundation.test.ts`
- **Line 65**: Agent list - `'cipher-operator'` → `'void-runner'`

**File**: `/tests/compound/foundation.test.ts`
- **Line 65**: Agent list - `'cipher-operator'` → `'void-runner'`

**File**: `/src/orchestration/hooks/grid-sync/index.test.ts`
- **Lines 17, 55-56**: `SISYPHUS_DIR` constant → `VOID_RUNNER_DIR`

**File**: `/src/execution/features/boulder-state/storage.test.ts`
- **Lines 19, 25-26**: `SISYPHUS_DIR` constant → `VOID_RUNNER_DIR` (3 occurrences)

**Verification**: `bun test` should pass for all test files

---

## Phase 4: Documentation Updates (Medium Priority)

**Priority**: MEDIUM (user-facing content)  
**Impact**: Correctness of user-facing docs  
**Files Affected**: 12 documentation files  
**Estimated Time**: 45-60 minutes

### 4.1 README and Main Documentation

**File**: `/README.md`
- **Lines 14-15, 89, 117, 131, 184-226**: Multiple references to "Cipher Operator"
- **Action**: Replace with "Void Runner" or appropriate new terminology
- **Lines 19**: Image reference - update asset name if needed

**File**: `/CONTRIBUTING.md`
- **Line 142**: Path reference - `src/hooks/nexus-orchestrator/` → `src/orchestration/hooks/grid-sync/`

### 4.2 Reference Documentation

**File**: `/docs/reference/configurations.md`
- **Line 249**: Agent list in documentation
- **Lines 1027, 622, 635, 647**: Config examples using old keys
- **Action**: Update all references and examples

**File**: `/docs/reference/lifecycle-hooks.md`
- **Line 164**: Section heading - `### nexus-orchestrator` → `### grid-sync`

**File**: `/docs/reference/features.md`
- **Line 213**: Feature description mentioning `nexus-orchestrator`

### 4.3 Getting Started Documentation

**File**: `/docs/getting-started/overview.md`
- **Line 75**: Usage warning mentioning old agent name
- **Line 131**: Config example with old key

**File**: `/docs/getting-started/installation.md`
- **Line 66**: Warning text mentioning "SISYPHUS AGENT"

### 4.4 Architectural Documentation

**File**: `/docs/concepts/plugin-architecture.md`
- **Line 201**: Path - `src/hooks/nexus-orchestrator/` → correct new path

**File**: `/docs/concepts/system-deep-dive.md`
- **Line 137**: Path reference needing update

### 4.5 Plans and Specifications

**File**: `/docs/plans/2026-02-07-feat-phase2-core-integration-compound-engineering-plan.md`
- **Lines 216, 674**: Multiple old agent name references

**File**: `/docs/plans/2026-02-06-component-mapping-strategy.md`
- **Line 240**: Agent list in mapping strategy

**File**: `/specs/042-reorganize-repo-topology/quickstart.md`
- **Line 96**: Example showing old path

**File**: `/specs/042-reorganize-repo-topology/data-model.md`
- **Line 23**: Hook name examples

**File**: `/specs/042-reorganize-repo-topology/contracts/domain-mappings.md`
- **Lines 36, 102**: Domain mapping examples (2 occurrences)

**File**: `/system-prompt.md`
- **Lines 3, 493**: References to old agent names
- **Note**: Consider if this file is stale/should be regenerated

**Verification**: Manual review of changed sections

---

## Phase 5: Code Cleanup & Consistency (Low Priority)

**Priority**: LOW (code quality, not functionality)  
**Impact**: Code consistency and maintainability  
**Files Affected**: 15+ files  
**Estimated Time**: 30-45 minutes (optional phase)

### 5.1 Sisyphus-related Constants & Variables

**Files to Review**:
- `/src/orchestration/hooks/auto-update-checker/index.ts` (Lines 12, 246)
  - `SISYPHUS_SPINNER` → Consider renaming to descriptive name
- `/src/orchestration/agents/dark-runner.ts` (Multiple lines)
  - `SISYPHUS_JUNIOR_PROMPT`, `SISYPHUS_JUNIOR_DEFAULTS`
- `/src/execution/tools/delegate-task/tools.ts` (Line 56)
  - `SISYPHUS_JUNIOR_AGENT` constant
- `/src/execution/tools/delegate-task/constants.ts` (Line 437)
  - Comment mentioning `MOMUS REVIEW`

**Action**: Consider renaming for consistency (optional)

### 5.2 Mythical Name Constants (Optional Consistency)

**Current State**: Some agents have mythical names in constants:
- `MOMUS_SYSTEM_PROMPT` in `null-audit.ts`
- `ORACLE_SYSTEM_PROMPT` in `eye-ops.ts`
- `ATLAS_SYSTEM_PROMPT` in `grid-sync.ts`
- `METIS_SYSTEM_PROMPT` in `war-mind.ts`

**Decision Needed**: Keep mythical names or rename to descriptive names?
- Option A: Keep (internal consistency with agent mythology)
- Option B: Rename (full alignment with descriptive naming)

**Recommendation**: Keep for now (lower priority), as filenames are descriptive

### 5.3 Comment & Prompt Text Updates

**Files**: 
- `/src/integration/shared/case-insensitive.ts`
- Various system prompts using old names in text

**Action**: Update references in comments (low impact)

---

## Phase 6: Build Artifacts & Verification (Final)

**Priority**: CRITICAL (must validate all changes)  
**Impact**: Runtime correctness  
**Estimated Time**: 10-15 minutes

### 6.1 Rebuild Distribution

```bash
bun run rebuild
```

**Expected Outcome**: 
- `/dist/` folder updated with new names
- All TypeScript declarations correct
- No type errors

### 6.2 Type Checking

```bash
bun run typecheck
```

**Expected Outcome**: Zero errors

### 6.3 Test Execution

```bash
bun test
```

**Expected Outcome**: All 594 tests pass

### 6.4 Grep Verification

Run verification greps to confirm no old names remain:

```bash
# Should return ZERO results (excluding comments/docs):
grep -r "createSisyphusAgent" src/ --include="*.ts" --exclude-dir=node_modules

# Should return ZERO results in code:
grep -r '"cipher_agent"' src/ --include="*.ts" --exclude-dir=node_modules
grep -r '"cipher-operator"' src/ --include="*.ts" --exclude-dir=node_modules
grep -r '"nexus-orchestrator"' src/ --include="*.ts" --exclude-dir=node_modules
```

---

## Implementation Order & Dependencies

### Sequential Execution Required

```
Phase 1 (Functions & Config) ─┐
                              ├─→ Phase 6 (Rebuild & Verify)
Phase 2 (JSON Schema) ────────┤
                              ├─→ (Final Tests & Commit)
Phase 3 (Tests) ──────────────┤
                              │
Phase 4 (Documentation) ──────┴─→ (Optional: Document updates)
Phase 5 (Cleanup) ────────────→ (Optional: Code quality)
```

**Critical Path**: Phases 1 → 2 → 3 → 6 (MUST COMPLETE)  
**Optional Path**: Phase 4 → Phase 5 (can follow up)

---

## Git Workflow

### Branch Strategy

1. Create feature branch from `main`:
   ```bash
   git checkout -b refactor/rename-agents-and-configs
   ```

2. Commit by phase (atomic commits):
   ```bash
   # After Phase 1
   git commit -m "refactor: rename createSisyphusAgent to createVoidRunnerAgent"
   
   # After Phase 1.2
   git commit -m "refactor: rename config key cipher_agent to void_runner"
   
   # After Phase 1.3
   git commit -m "refactor: rename schema types (Sisyphus* to new names)"
   
   # After Phase 2
   git commit -m "refactor: update JSON schema with new agent IDs"
   
   # After Phase 3
   git commit -m "test: update test fixtures with new agent/config IDs"
   
   # After Phase 6
   git commit -m "build: rebuild dist artifacts with new names"
   ```

3. Create PR targeting `dev` branch (per AGENTS.md requirement):
   ```bash
   git push origin refactor/rename-agents-and-configs
   gh pr create --base dev --title "Refactor: Complete naming alignment for agents and configs"
   ```

---

## Success Criteria

- [ ] `bun run typecheck` passes with zero errors
- [ ] `bun run rebuild` succeeds and updates all artifacts
- [ ] `bun test` passes all 594 tests
- [ ] Zero matches for old function names in source code (grep verification)
- [ ] Zero matches for old config keys in source code (grep verification)
- [ ] All documentation updated with new names
- [ ] PR passes CI checks
- [ ] PR approved and merged to `dev`

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Import/export cycles broken | Medium | High | Run `bun typecheck` after Phase 1 |
| Tests fail after changes | Medium | High | Execute Phase 3 carefully, run `bun test` frequently |
| Missed occurrences remain | High | Medium | Use comprehensive grep verification in Phase 6 |
| Documentation inconsistency | Medium | Low | Have second person review doc changes |
| Config migration breaks | Low | High | Ensure migration.ts handles both old/new keys |

**Mitigation Strategy**: Frequent verification steps after each phase using `bun typecheck` and targeted `bun test`

---

## Estimated Timeline

| Phase | Duration | Blocker? |
|-------|----------|----------|
| Phase 1 (Functions & Config) | 30-45 min | **YES** |
| Phase 2 (JSON Schema) | 15-20 min | **YES** |
| Phase 3 (Tests) | 30-40 min | **YES** |
| Phase 6 (Rebuild & Verify) | 10-15 min | **YES** |
| **Critical Path Total** | **85-120 min** | — |
| Phase 4 (Documentation) | 45-60 min | NO |
| Phase 5 (Cleanup) | 30-45 min | NO |
| **Full Timeline** | **160-225 min** | — |

**Recommendation**: Complete critical path (Phases 1-3, 6) in one session (1.5-2 hours), then handle documentation separately.

---

## Next Steps

1. **Review this plan** - Confirm scope and timeline with team
2. **Create feature branch** - `refactor/rename-agents-and-configs`
3. **Execute Phase 1** - Start with function renaming
4. **Verify after each phase** - Use `bun typecheck` and `bun test`
5. **Track progress** - Update todo list as items complete
6. **Create PR** - When Phase 3 complete and tests pass
7. **Documentation** - Update Phase 4 docs after critical phases merge

---

## File Change Summary (for reference)

```
Core Implementation Files:        8 files
Configuration/Schema Files:       3 files
Test Files:                      6 files
Documentation Files:             12 files
JSON Schema Assets:              1 file
Total Files to Modify:          30+ files
Total Changes:                   100+ individual updates
```

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-19  
**Status**: Ready for Implementation
