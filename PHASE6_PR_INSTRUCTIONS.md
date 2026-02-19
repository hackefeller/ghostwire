# Phase 6: PR Creation Instructions

## Current Status

✅ **All Phases 0-5 Complete**
- Feature branch: `042-reorganize-repo-topology`
- Base branch: `dev` (exists locally)
- Commits ready: 14 commits for full reorganization

## Before Creating PR

### 1. Add GitHub Remote (if not already configured)

```bash
# If using HTTPS:
git remote add origin https://github.com/YOUR_ORG/ghostwire.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_ORG/ghostwire.git

# Verify:
git remote -v
```

### 2. Push Feature Branch to Remote

```bash
git push -u origin 042-reorganize-repo-topology
```

### 3. Ensure Dev Branch Exists on Remote

If dev branch doesn't exist on remote:
```bash
git push -u origin dev
```

## Create PR via GitHub UI

1. Navigate to: https://github.com/YOUR_ORG/ghostwire
2. Click "Compare & pull request" button (should appear for your pushed branch)
3. Set:
   - Base branch: `dev`
   - Head branch: `042-reorganize-repo-topology`
   - Title: "refactor: reorganize repository into domain-based structure (Phases 0-5)"
4. Copy description from PHASE6_PR_BODY.md
5. Create PR

## Or Create PR via gh CLI

Once remote is configured:
```bash
gh pr create \
  --base dev \
  --head 042-reorganize-repo-topology \
  --title "refactor: reorganize repository into domain-based structure (Phases 0-5)" \
  --body "$(cat PHASE6_PR_BODY.md)"
```

## After PR Creation

### Verify CI Passes

GitHub Actions should run:
- ✅ `bun run typecheck` (0 errors)
- ✅ `bun run build` (ESM + declarations)
- ✅ `bun test` (1928 pass, pre-existing failures)

### Merge Decision

Once CI passes and code review is approved:
1. Use "Create a merge commit" (to preserve all 14 commits for history)
2. DO NOT squash (we want full phase history)
3. Delete feature branch after merge

## Commits Included

- `48a89b2` - Phase 1: Orchestration domain reorganization
- `9ed258b` - Phase 2: Execution domain reorganization  
- `2a0a0dc` - Phase 3: Integration domain reorganization
- `50f43c2` - Phase 4: Platform domain reorganization
- `ccdaecd` - Phase 5: Documentation update
- `a2cd82e` - Phase 5: Task tracking update

Plus supporting commits for spec, plan, and import tools.

## Troubleshooting

**Q: CI fails with import errors**
A: All imports have been tested. If failures appear, verify:
- Typecheck passed locally: `bun run typecheck`
- Build succeeded locally: `bun run build`
- Tests passed locally: `bun test`

**Q: Merge conflicts on dev**
A: Should not occur if dev hasn't diverged. If so:
- Checkout 042-reorganize-repo-topology
- Rebase on latest dev: `git rebase origin/dev`
- Resolve conflicts
- Force push: `git push -f origin 042-reorganize-repo-topology`

**Q: Want to revert this PR**
A: Single commit reverts all changes (due to git mv):
```bash
git revert -m 1 <merge-commit-hash>
```
