## Phase 5 — Advisory, Architecture, and Documentation Agents

### Goal
Rename the last set of agents so the advisory, validation, documentation, and editing helpers follow the `advisor-*`, `validator-*`, `writer-*`, and `editor-*` patterns established earlier.

### Scope
- `war-mind.ts` → `advisor-strategy.ts`
- `eye-ops.ts` → `advisor-plan.ts`
- `agent-arch.ts` → `advisor-architecture.ts`
- `null-audit.ts` → `validator-audit.ts`
- `deploy-check.ts` → `validator-deployment.ts`
- `docs-write-readme.ts` → `writer-readme.ts`
- `docs-write-gem.ts` → `writer-gem.ts`
- `docs-edit-style.ts` → `editor-style.ts`
- Update documentation, hooks, and tests referencing these agents

### Non-goals
- Affect other categories (orchestration, review, research, design)

### Dependencies
- Hooks referencing these agents must be renamed immediately after the agents are renamed
- Documentation describing validators or advisors must use the new prefixes

### Steps
1. Rename the eight files and ensure their exports/prompts use the new IDs
2. Update docs/agents.yml, AGENTS.md, and hook metadata
3. Update legacy alias mappings for these agent names
4. Run validation/advisor-specific tests

### Verification
- `rg "war-mind"` etc. should return no hits
- Run `bun test src/orchestration/agents/war-mind.test.ts` and relevant validator tests
