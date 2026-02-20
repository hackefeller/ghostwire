## Phase 2 — Code Review Agent Renaming

### Goal
Rename all code-review agents so their names follow the `reviewer-*` pattern, with `reviewer-simplicity` replacing `mono-review`. This keeps reviewers grouped and ensures documentation clearly distinguishes language-specific reviewers.

### Scope
- `src/orchestration/agents/void-review-rails.ts` → `reviewer-rails.ts`
- `src/orchestration/agents/void-review-python.ts` → `reviewer-python.ts`
- `src/orchestration/agents/void-review-ts.ts` → `reviewer-typescript.ts`
- `src/orchestration/agents/zen-review-rails.ts` → `reviewer-rails-dh.ts`
- `src/orchestration/agents/mono-review.ts` → `reviewer-simplicity.ts`
- Update exports, docs, and tests referencing these agents
- Update legacy alias map for these reviewer names

### Non-goals
- Touching non-review agents
- Renaming hooks outside reviewer context

### Dependencies
- Tests referencing reviewer names (permutation tests, reviewer metadata) must update earliest in this phase
- Docs referencing `mono-review` need rewriting

### Steps
1. Rename files and exports, rewriting prompts and constants with the `reviewer-*` convention
2. Update `docs/agents.yml`, AGENTS.md, README references, and tests that depend on reviewer names
3. Ensure legacy aliases still resolve: e.g., `void-review-rails`, `zen-review-rails`, `mono-review`
4. Run reviewer-specific tests (files ending in `.review.ts` or relevant directories)

### Verification
- `bun test src/orchestration/agents/dark-runner.test.ts` (if relevant) + any reviewer test suites
- Search for old reviewer names to confirm no leftovers
