# Agent Renaming - Complete Documentation

**Last Updated**: 2026-02-20  
**Status**: ✅ COMPLETE (5 phases executed, 27 agents renamed, isPlanAgent fix applied)  
**Related Commits**: 72f8df8...c126c8d

---

## Executive Summary

All 27 agents in the Ghostwire repository have been successfully renamed from legacy metaphor-based names to clean, role-based names across 5 phases. The renaming eliminated inconsistent naming patterns and improved code clarity.

### Final Results
- ✅ **27/27 agents renamed** across 5 phases
- ✅ **1912 tests passing** (19 pre-existing failures unrelated to renaming)
- ✅ **Build successful** (2.7MB main bundle, 969KB CLI)
- ✅ **Zero orphaned references** in codebase
- ✅ **isPlanAgent function fixed** (word-boundary matching)

---

## Complete Agent Renaming Map

### Phase 1: Orchestration (4 agents)
| Old Name | New Name | Role | File |
|----------|----------|------|------|
| `void-runner` | `operator` | General purpose executor | `operator.ts` |
| `grid-sync` | `orchestrator` | Master orchestrator (delegates) | `orchestrator.ts` |
| `zen-planner` | `planner` | Strategic planning consultant | `planner.ts` |
| `dark-runner` | `executor` | Focused executor (no delegation) | `executor.ts` |

**Hooks Renamed**:
- `planner-md-only/` (from `zen-planner-md-only/`)
- `executor-notepad/` (from `dark-runner-notepad/`)
- `orchestrator/` (from `grid-sync/`)

### Phase 2: Code Review (5 agents)
| Old Name | New Name | Role | File |
|----------|----------|------|------|
| `void-review-rails` | `reviewer-rails` | Kieran Rails (DHH philosophy) | `reviewer-rails.ts` |
| `void-review-python` | `reviewer-python` | Kieran Python | `reviewer-python.ts` |
| `void-review-ts` | `reviewer-typescript` | Kieran TypeScript | `reviewer-typescript.ts` |
| `zen-review-rails` | `reviewer-rails-dh` | DHH Rails (architectural) | `reviewer-rails-dh.ts` |
| `mono-review` | `reviewer-simplicity` | Code Simplicity (YAGNI) | `reviewer-simplicity.ts` |

### Phase 3: Research (5 agents)
| Old Name | New Name | Role | File |
|----------|----------|------|------|
| `docs-scan` | `researcher-docs` | Framework Docs Researcher | `researcher-docs.ts` |
| `learnings-scan` | `researcher-learnings` | Learnings Researcher (institutional) | `researcher-learnings.ts` |
| `best-practices-scan` | `researcher-practices` | Best Practices Researcher | `researcher-practices.ts` |
| `git-scan` | `researcher-git` | Git History Analyzer | `researcher-git.ts` |
| `eye-scan` | `analyzer-media` | Multimodal Media Analyzer | `analyzer-media.ts` |

### Phase 4: Design (5 agents)
| Old Name | New Name | Role | File |
|----------|----------|------|------|
| `flow-check` | `designer-flow` | Spec Flow Analyzer | `designer-flow.ts` |
| `figma-sync` | `designer-sync` | Figma Design Sync | `designer-sync.ts` |
| `design-loop` | `designer-iterator` | Design Iterator (iterative refinement) | `designer-iterator.ts` |
| `design-check` | `analyzer-design` | Design Implementation Reviewer | `analyzer-design.ts` |
| `ui-build` | `designer-builder` | Frontend Design (production UI) | `designer-builder.ts` |

### Phase 5: Advisory/Architecture/Documentation (8 agents)
| Old Name | New Name | Role | File |
|----------|----------|------|------|
| `agent-arch` | `advisor-architecture` | Agent-Native Architecture | `advisor-architecture.ts` |
| `war-mind` | `advisor-strategy` | Tactician Strategist | `advisor-strategy.ts` |
| `eye-ops` | `advisor-plan` | Seer Advisor (architecture, debugging) | `advisor-plan.ts` |
| `null-audit` | `validator-audit` | Glitch Auditor (plan validation) | `validator-audit.ts` |
| `deploy-check` | `validator-deployment` | Deployment Verification | `validator-deployment.ts` |
| `docs-write-readme` | `writer-readme` | Ankane README Writer | `writer-readme.ts` |
| `docs-write-gem` | `writer-gem` | Andrew Kane Gem Writer | `compound/index.ts` |
| `docs-edit-style` | `editor-style` | Every Style Editor | `compound/index.ts` |

**Note**: Last 2 agents are compound agent placeholders in `src/orchestration/agents/compound/index.ts`

---

## Naming Convention

The new naming scheme follows **role-based prefixes**:

| Prefix | Meaning | Examples |
|--------|---------|----------|
| `reviewer-*` | Code review specialists | `reviewer-rails`, `reviewer-typescript` |
| `researcher-*` | Knowledge researchers | `researcher-docs`, `researcher-learnings` |
| `analyzer-*` | Analysis agents | `analyzer-media`, `analyzer-design` |
| `designer-*` | Design specialists | `designer-flow`, `designer-sync` |
| `advisor-*` | Strategic advisors | `advisor-architecture`, `advisor-strategy` |
| `validator-*` | Validation/audit agents | `validator-audit`, `validator-deployment` |
| `writer-*` | Documentation writers | `writer-readme`, `writer-gem` |
| `editor-*` | Content editors | `editor-style` |
| Simple names | Orchestration/execution | `operator`, `orchestrator`, `planner`, `executor` |

This replaces the old inconsistent patterns:
- ~~`void-*`~~ (4 agents)
- ~~`zen-*`~~ (2 agents)
- ~~`*-scan`~~ (6 agents)
- ~~`*-check`~~ (3 agents)
- ~~`eye-*`~~ (2 agents)
- ~~`*-ops`~~ (2 agents)

---

## Implementation Details

### What Changed

**For Each Agent Renamed:**

1. **Filename**: `old-name.ts` → `new-name.ts`
2. **Export function**: `createOldNameAgent` → `createNewNameAgent`
3. **Metadata constants**: `OLD_NAME_METADATA` → `NEW_NAME_METADATA`
4. **Compound mappings**: `"old.name"` → `"new-name"` in `compound/index.ts`
5. **Text references**: All imports and references throughout codebase
6. **Tests**: Agent factory tests updated with new paths
7. **Hooks**: Agent-specific hook directories renamed where applicable

### Unchanged

- Agent functionality and behavior
- Test coverage (maintained at 1912 passing tests)
- Metadata structure and exports
- Legacy alias mappings (for backward compatibility where needed)

---

## Bug Fix: isPlanAgent Word-Boundary Matching

**Issue**: The `isPlanAgent()` function used substring matching (`includes()`), which caused false positives. For example, `advisor-plan` incorrectly matched because it contains "plan".

**Fix**: Changed from substring matching to exact-match or prefix-match with word boundaries:

```typescript
// Before (broken):
return PLAN_AGENT_NAMES.some((name) => lowerName === name || lowerName.includes(name));

// After (fixed):
return PLAN_AGENT_NAMES.some((name) => {
  return lowerName === name || lowerName.startsWith(name + "-");
});
```

**Impact**: This allows agents like `planner` or `planner-md-only` to match, while preventing `advisor-plan` from incorrectly matching `plan`.

**Commit**: `c126c8d`

---

## Git History

```
c126c8d fix: isPlanAgent word-boundary matching to prevent false positives with advisor-plan
fd808ee build: update schema.json after agent renames
4c32b78 phase-5: rename advisory/architecture/documentation agents (8 agents)
4aff90a phase-4: rename design agents (5 agents)
1e9f06e phase-3: rename research agents (5 agents)
fbe56f2 phase-2: rename code review agents (5 agents)
72f8df8 phase-1: rename orchestration agents (4 agents)
```

All phases executed sequentially with `bun test` validation and git commits after each phase.

---

## Agent Artifacts

### Files Modified/Renamed

**Agent implementations**: `src/orchestration/agents/`
- 24 agent files directly renamed (one file per agent)
- 2 compound agent placeholders updated in `src/orchestration/agents/compound/index.ts`
- Hook directories: 3 renamed (`orchestrator/`, `planner-md-only/`, `executor-notepad/`)

**Integration/Configuration**:
- `src/integration/shared/agent-display-names.ts` - Legacy alias mappings
- `src/orchestration/agents/index.ts` - Updated exports
- `src/orchestration/hooks/index.ts` - Updated hook exports
- `src/platform/config/schema.ts` - Agent ID references
- `docs/agents.yml` - Agent metadata

**Tests**:
- `tests/foundation.test.ts` - Updated agent file paths
- `tests/compound/foundation.test.ts` - Updated agent file paths
- `src/execution/tools/delegate-task/constants.ts` - isPlanAgent function

---

## Verification Checklist

✅ All 27 agents renamed  
✅ Zero orphaned references  
✅ All exports updated  
✅ Hook directories renamed  
✅ Tests passing (1912 pass, 19 pre-existing failures)  
✅ Build successful  
✅ Schema generated  
✅ Git history clean  
✅ isPlanAgent function fixed  
✅ No backward compatibility issues identified  

---

## Legacy Agents NOT Renamed (Unclear Status)

Two agents were identified as potentially requiring renaming but were left out of the 5-phase project:

- `data-dive` (createLibrarianAgent) - Archive Researcher
- `scan-ops` (createExploreAgent) - Scout Recon

**Status**: These agents already exist with their "new" names and were not legacy names that needed renaming. However, they don't follow the new naming convention (should be `researcher-*` or `explorer-*`).

**Recommendation**: Consider if these should be renamed in a future phase to `researcher-data` and `explorer-codebase` to maintain naming consistency.

---

## Migration Patterns for Reference

If you need to rename additional agents in the future, use the `bulk-rename.sh` script as a template. The script generates all case variations and performs bulk text replacements.

### Key Files to Update When Renaming:
1. Filename: `old-name.ts` → `new-name.ts`
2. Export function: `createOldNameAgent` → `createNewNameAgent`
3. Metadata constant: `OLD_NAME_METADATA` → `NEW_NAME_METADATA`
4. Compound mappings: Update `compound/index.ts`
5. Hook directories: Rename if agent has hook-specific directory
6. Test file paths: Update in `tests/foundation.test.ts`
7. Imports: Update all files importing the agent

---

## References

### Related Files
- Agent implementations: `src/orchestration/agents/*.ts`
- Compound agents: `src/orchestration/agents/compound/index.ts`
- Agent types: `src/orchestration/agents/types.ts`
- Agent utilities: `src/orchestration/agents/utils.ts`
- Model requirements: `src/orchestration/agents/model-requirements.ts`
- Tool restrictions: `src/orchestration/agents/agent-tool-restrictions.ts`

### Test Files
- `src/execution/tools/delegate-task/tools.test.ts` - isPlanAgent tests
- `tests/foundation.test.ts` - Agent discovery tests
- `tests/compound/foundation.test.ts` - Compound agent tests

### Configuration
- `src/platform/config/schema.ts` - Agent ID schema
- `docs/agents.yml` - Agent metadata (source of truth)

---

## FAQ

**Q: Why were only 25 agents renamed (5 phases × 5 agents), not all 27?**  
A: The project completed 4 agents in Phase 1 and 8 agents in Phase 5, totaling 27 agents. Two agents (`data-dive`, `scan-ops`) were left out because they were already at their "final" names, though they don't follow the new naming convention.

**Q: What about backward compatibility?**  
A: The project renamed agents at the file/export level only. Legacy alias mappings exist in `agent-display-names.ts` for user-facing references (e.g., `"zen-planner": "planner"`).

**Q: Why did isPlanAgent break?**  
A: The function used substring matching, so "advisor-plan" matched because it contains "plan". The fix uses exact match or prefix match (`startsWith(name + "-")`).

**Q: Can I rename an agent myself?**  
A: Yes, use the `bulk-rename.sh` script as a template and follow the key files list above.

**Q: What tests are failing?**  
A: 19 pre-existing failures unrelated to agent renaming (tmux timeouts, OAuth, compaction-context-injector). All agent-related tests pass.

---

## For More Information

See individual agent implementation files in `src/orchestration/agents/` for detailed agent specifications, prompts, and metadata.
