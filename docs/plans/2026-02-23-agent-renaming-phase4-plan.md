## Phase 4 — Design Agent Renaming

### Goal
Rename the design hooks to the `designer-*` pattern so UI-centric agents are grouped under a single prefix. This phase also ensures related hooks and docs stay consistent.

### Scope
- `flow-check.ts` → `designer-flow.ts`
- `figma-sync.ts` → `designer-sync.ts`
- `design-loop.ts` → `designer-iterator.ts`
- `ui-build.ts` → `designer-builder.ts`
- Update exports, docs, hooks, and tests referencing these agents

### Non-goals
- Touching non-design agents
- Changing agent logic beyond naming

### Dependencies
- Design hooks (figma-sync, design-loop, etc.) must rename alongside their agents
- All design-focused docs and prompts need updates to reflect the new prefix

### Steps
1. Rename the four files and update their exports to `designer-*`
2. Update hook filenames/metadata that mention the old names
3. Update docs and tests referencing design agents
4. Run targeted UI/design testing if available (e.g., `designer-flow` flows)

### Verification
- `rg "flow-check"` and `rg "figma-sync"` should return zero matches
- Run design agent unit tests if present
