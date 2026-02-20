## Phase 1 — Orchestration Agent Renaming

### Goal
Rename the core orchestration agents so their filenames, exports, prompts, and documentation all use the new `operator`, `orchestrator`, `planner`, and `executor` names. Ensure hooks and legacy aliases follow suit, then document the migration path before touching other categories.

### Scope
- `src/orchestration/agents/void-runner.ts` → `operator.ts`
- `src/orchestration/agents/grid-sync.ts` → `orchestrator.ts`
- `src/orchestration/agents/zen-planner.ts` → `planner.ts`
- `src/orchestration/agents/dark-runner.ts` → `executor.ts`
- Update exports in `src/orchestration/agents/index.ts`
- Update `docs/agents.yml`, `src/integration/shared/agent-display-names.ts`, hooks, and tests that reference these four agents
- Add legacy alias mappings for backwards compatibility (e.g., `cipher-operator`, `void-runner`, `nexus-orchestrator`, `grid-sync`)

### Non-goals
- Renaming agents outside of the orchestration category
- Running the full test suite before Phase 1 changes are complete

### Dependencies
- `docs/agents.yml` entries for the orchestrators need direct updates after renaming
- Hooks like `zen-planner-md-only` must be renamed to match the new agent names
- Legacy alias map in `agent-display-names.ts` must include new mapping for each removed legacy name

### Steps
1. Rename the four TypeScript files and adjust internal exports, constants, and prompts
2. Rename hooks tied to these agents (e.g., `zen-planner-md-only` → `planner-md-only`) and ensure hook metadata reflects the new IDs
3. Update documentation (`docs/agents.yml`, AGENTS.md references) and tests that refer to old names
4. Add legacy alias entries so old names still resolve to the new agents
5. Run targeted tests that cover orchestrator functionality (e.g., `src/orchestration/agents/model-requirements.test.ts`)

### Verification
- `bun test src/orchestration/agents/model-requirements.test.ts`
- Manual checks that hooks and docs refer to the new names
- Ensure legacy aliases load the renamed agents without breaking.
