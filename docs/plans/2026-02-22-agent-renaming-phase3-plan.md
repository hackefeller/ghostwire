## Phase 3 — Research & Analysis Agent Renaming

### Goal
Rename the research, discovery, and media-analysis agents to the `researcher-*` and `analyzer-*` pattern so their roles are obvious. This phase also includes updating docs and tests that expect the legacy names.

### Scope
- `docs-scan.ts` → `researcher-docs.ts`
- `learnings-scan.ts` → `researcher-learnings.ts`
- `best-practices-scan.ts` → `researcher-practices.ts`
- `git-scan.ts` → `researcher-git.ts`
- `design-check.ts` → `analyzer-design.ts`
- `eye-scan.ts` → `analyzer-media.ts`
- Update metadata, docs, and tests referencing these agents

### Non-goals
- Renaming design or advisory agents (will happen in later phases)
- Changing the functionality of these agents beyond naming

### Dependencies
- Tests in `src/orchestration/agents/` referencing these agents must be updated concurrently
- Documentation (AGENTS.md, README) should refer to the new names after the rename is complete

### Steps
1. Rename the six files and update their exports/constants to use the new `researcher-*`/`analyzer-*` IDs
2. Update `docs/agents.yml`, `AGENTS.md`, and any prompt documentation
3. Run targeted tests, especially those covering analytics agents or search helpers
4. Verify legacy aliases (e.g., `docs-scan`, `eye-scan`, `archive-researcher`, `optic-analyst`) continue to resolve

### Verification
- `bun test src/orchestration/agents/eye-scan.ts` (if applicable)
- Run `rg "docs-scan"` to ensure no leftovers; repeat for each legacy name
