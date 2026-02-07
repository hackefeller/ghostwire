---
title: Remove compound-engineering-plugin references and archive directory
type: chore
date: 2026-02-07
---

# Remove compound-engineering-plugin References and Archive Directory

## Overview

Clean up references to the `compound-engineering-plugin` directory from the codebase since all 125 components have been successfully integrated directly into oh-my-opencode v3.2.0. The separate plugin directory is now redundant and can be archived/removed after updating documentation references.

## Problem Statement

After the true merge of compound-engineering into oh-my-opencode v3.2.0:

- ✅ All 125 components are natively available in oh-my-opencode
- ✅ No functional code depends on the separate plugin directory
- ❌ **But:** Documentation and example files still reference the old plugin directory
- ❌ **And:** The directory clutters the repository (17 directories, 544 bytes)

**Why this matters:**
- Reduces confusion for new users (single source of truth)
- Simplifies repository structure
- Cleaner git history without redundant directories
- Easier maintenance going forward

## Proposed Solution

**Two-phase approach:**

### Phase 1: Remove Documentation References
Update all references from compound-engineering-plugin to oh-my-opencode native components in:
- MIGRATION_GUIDE.md - Example imports and configuration
- Architecture documentation - References to source location
- Planning documents - Links to plugin source
- Integration documentation - Path references

### Phase 2: Archive/Remove Directory
- Create `archive/` directory to preserve historical reference
- Move `compound-engineering-plugin/` to `archive/compound-engineering-plugin/`
- Update .gitignore if needed
- Single commit for the cleanup

## Technical Considerations

### What's Safe to Remove
- ✅ The plugin source code (all integrated)
- ✅ Plugin documentation (covered by oh-my-opencode docs)
- ✅ Plugin package.json (superseded by oh-my-opencode)
- ✅ Plugin tests (covered by oh-my-opencode tests)

### What Needs Updating
- ⚠️ Documentation that references it as source
- ⚠️ Architecture guides that explain the integration
- ⚠️ Migration guides that reference the old structure
- ⚠️ Example code showing old plugin imports

### References Found (24 total)

**Critical references to update:**
1. `MIGRATION_GUIDE.md` - 2 references (example configs and imports)
2. `oh-my-opencode/docs/plans/2026-02-07-feat-phase2-core-integration-compound-engineering-plan.md` - 2 references
3. `oh-my-opencode/docs/plans/2026-02-06-feat-unified-opencode-plugin-architecture-plan-deepened.md` - 5 references
4. `oh-my-opencode/docs/plans/2026-02-06-feat-true-merge-compound-engineering-plan.md` - 3 references (includes "Remove compound-engineering-plugin directory" checklist item)
5. `oh-my-opencode/docs/plans/2026-02-06-configuration-migration-system.md` - 2 references (example paths)
6. `oh-my-opencode/docs/architecture-unified-plugin.md` - 2 references
7. `oh-my-opencode/docs/unified-plugin-guide.md` - 2 references
8. `oh-my-opencode/src/features/imports/claude/migration.ts` - 1 reference (docstring)
9. `oh-my-opencode/src/features/bundles/compound-engineering/index.ts` - 1 reference (docstring)
10. `compound-engineering-plugin/plugins/compound-engineering/commands/report-bug.md` - 2 references (internal to plugin, will be archived)

## Acceptance Criteria

### Phase 1: Documentation Updates
- [ ] Update MIGRATION_GUIDE.md - remove old plugin import examples, clarify it's now integrated
- [ ] Update oh-my-opencode/docs/plans/*.md files - remove plugin source references
- [ ] Update oh-my-opencode/docs/architecture-unified-plugin.md - update overview
- [ ] Update oh-my-opencode/docs/unified-plugin-guide.md - update integration explanation
- [ ] Update source code docstrings - reference oh-my-opencode instead of compound-engineering-plugin
- [ ] Verify no broken links or references remain
- [ ] All documentation reads smoothly with plugin references removed

### Phase 2: Directory Cleanup
- [ ] Create `archive/` directory at repo root
- [ ] Move `compound-engineering-plugin/` to `archive/compound-engineering-plugin/`
- [ ] Update `.gitignore` if needed
- [ ] Run `git status` to verify move completed cleanly
- [ ] Create single commit: `chore: Archive compound-engineering-plugin after v3.2.0 integration`
- [ ] Verify directory is properly archived in git

### Testing & Validation
- [ ] No broken links in documentation
- [ ] No compilation errors or missing imports
- [ ] Git history shows clean archive operation
- [ ] Repository size reduced
- [ ] All tests still pass (should be 59/59 compound tests)

## Success Metrics

- ✅ All references updated or removed (24 → 0 in non-archived files)
- ✅ Documentation is clear and accurate
- ✅ Repository is cleaner and easier to navigate
- ✅ No functional impact on oh-my-opencode
- ✅ Archive preserves historical reference

## Files to Modify

### Documentation Files (Update References)

1. **MIGRATION_GUIDE.md**
   - Lines with old plugin imports: `from "compound-engineering-plugin"`
   - Lines with old plugin paths
   - Update to show new compound: namespace usage only

2. **oh-my-opencode/docs/plans/2026-02-07-feat-phase2-core-integration-compound-engineering-plan.md**
   - Remove source location references
   - Change "Remove compound-engineering-plugin directory" from checklist to completed note

3. **oh-my-opencode/docs/plans/2026-02-06-feat-unified-opencode-plugin-architecture-plan-deepened.md**
   - Update "Overview" to reflect it's now integrated
   - Remove "compound-engineering-plugin: Claude Code compatibility layer" reference
   - Change to "Integrated compound-engineering components"

4. **oh-my-opencode/docs/plans/2026-02-06-feat-true-merge-compound-engineering-plan.md**
   - Change checklist item status from "[ ]" to "[x]"

5. **oh-my-opencode/docs/plans/2026-02-06-configuration-migration-system.md**
   - Update example paths to use oh-my-opencode instead

6. **oh-my-opencode/docs/architecture-unified-plugin.md**
   - Update description of compound-engineering integration
   - Change from "separate plugin" to "integrated components"

7. **oh-my-opencode/docs/unified-plugin-guide.md**
   - Update migration instructions
   - Clarify that compound-engineering is now native to oh-my-opencode

### Source Code Files (Update Docstrings)

1. **oh-my-opencode/src/features/imports/claude/migration.ts**
   - Update docstring that references compound-engineering-plugin

2. **oh-my-opencode/src/features/bundles/compound-engineering/index.ts**
   - Update docstring/comments that reference plugin

## Implementation Plan

### Step 1: Documentation Updates (15-20 min)
```bash
# Update each documentation file
# - Find compound-engineering-plugin references
# - Replace with appropriate oh-my-opencode reference
# - Ensure context makes sense
```

### Step 2: Source Code Updates (5-10 min)
```bash
# Update docstrings in source files
# - Maintain helpful context
# - Remove plugin-specific references
```

### Step 3: Archive Directory (2-3 min)
```bash
# Create archive and move plugin directory
mkdir -p archive
git mv compound-engineering-plugin/ archive/
git commit -m "chore: Archive compound-engineering-plugin after v3.2.0 integration"
```

### Step 4: Verification (5 min)
```bash
# Verify no remaining references
grep -r "compound-engineering-plugin" . --include="*.md" --include="*.ts" --exclude-dir=archive 2>/dev/null

# Verify tests still pass
npm run test -- tests/compound/
```

## Dependencies & Risks

### Dependencies
- ✅ No external dependencies
- ✅ No other features depend on plugin directory
- ✅ Migration system already complete

### Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Broken documentation links | Medium | Comprehensive grep search before & after |
| Incomplete reference removal | Medium | Automated grep for "compound-engineering-plugin" |
| Users still reference old paths | Low | Clear migration guide prevents new references |

## Alternative Approaches Considered

### Keep the Directory
- ❌ Clutters repository
- ❌ Confuses users (two sources)
- ❌ Suggests components aren't fully integrated

### Delete Immediately
- ⚠️ Loses historical reference
- ⚠️ Git history harder to understand
- ✅ Cleaner repository

### Archive (Chosen)
- ✅ Preserves historical reference
- ✅ Clearly separated from active code
- ✅ Can be removed later if needed
- ✅ Clean git history

## Resource Requirements

- **Time estimate:** 30-45 minutes total
- **Effort:** Single developer
- **Tools needed:** Text editor, git, bash
- **Risk level:** Low (mostly documentation, reversible with git)

## Future Considerations

### If Plugin Needs Reference Again
- Archived in `archive/compound-engineering-plugin/`
- Easily accessible for historical understanding
- Can be restored if needed

### For Similar Integrations
- This cleanup pattern works for any fully-integrated plugin
- Archive + update references = clean integration story

## Documentation to Update

**User-facing changes:**
- MIGRATION_GUIDE.md - main user reference

**Internal documentation:**
- Architecture guides
- Planning documents
- Source code docstrings

**No changes needed to:**
- Release notes (don't reference old plugin)
- Component reference (no plugin references)
- README files

## Related Issues/PRs

- Part of v3.2.0 release cleanup
- Follows Phase 2E completion (Testing & Validation)
- Unblocks: Future repository cleanup tasks

## Checklist

### Before Starting
- [ ] Review all 24 references found
- [ ] Backup critical docs (git handles this)
- [ ] Verify tests passing baseline: `npm run test -- tests/compound/`

### Phase 1: Documentation
- [ ] MIGRATION_GUIDE.md updated
- [ ] All planning docs updated
- [ ] Architecture docs updated
- [ ] Source docstrings updated
- [ ] Grep confirms no remaining references (outside archive)

### Phase 2: Cleanup
- [ ] archive/ directory created
- [ ] compound-engineering-plugin/ moved to archive/
- [ ] git status shows clean operation
- [ ] Single commit created

### Verification
- [ ] Tests passing: `npm run test -- tests/compound/` → 59/59 ✅
- [ ] No broken internal links
- [ ] Git log shows clean history
- [ ] Repository size reduced

## Summary

**Scope:** Remove all references to compound-engineering-plugin from active codebase and archive the directory

**Impact:** Documentation cleanup with zero functional impact

**Effort:** 30-45 minutes, one developer

**Risk:** Low (documentation + reversible git operation)

**Benefit:** Cleaner repository, single source of truth, easier for new users

**Status:** Ready to implement post-v3.2.0 release
