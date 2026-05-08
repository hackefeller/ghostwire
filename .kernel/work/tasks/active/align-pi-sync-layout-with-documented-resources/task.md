---
id: align-pi-sync-layout-with-documented-resources
title: Align Pi sync layout with documented resources
status: active
goalId: simplify-command-surface
linkedKnowledgeIds:
  - pi-resource-discovery-and-sync-layout
createdAt: 2026-05-05T22:37:35.000Z
updatedAt: 2026-05-05T22:47:21.351Z
checklist:
  - id: stop-mirroring-skills
    title: Stop mirroring skills into `~/.pi` and keep `~/.agents/skills` as the
      canonical source
    done: true
    completedAt: 2026-05-05T22:42:55.820Z
  - id: route-pi-command-templates-to-pi-agent-prompts
    title: Route Pi command templates to `~/.pi/agent/prompts`
    done: true
    completedAt: 2026-05-05T22:46:36.365Z
  - id: clean-legacy-layout
    title: Remove stale `~/.pi/skills`, `~/.pi/commands`, and any obsolete
      Pi-specific mirrors from sync cleanup
    done: true
    completedAt: 2026-05-05T22:46:54.172Z
  - id: update-tests-and-docs
    title: Update sync tests and host documentation to reflect the supported Pi layout
    done: true
    completedAt: 2026-05-05T22:47:21.351Z
---

# Align Pi sync layout with documented resources

## Summary

Make Kernel sync match Pi’s documented discovery model: skills stay in `~/.agents/skills`, and any Pi-facing command surface moves to `~/.pi/agent/prompts` instead of `~/.pi/commands`.

## Context

Pi already discovers skills from `~/.agents/skills` and global resources from `~/.pi/agent/*`. The current sync output duplicates skills into `~/.pi/skills` and writes command templates into `~/.pi/commands`, which is not a documented Pi resource layout. This task removes the duplication and aligns the sync output with the official Pi docs by writing command templates to `~/.pi/agent/prompts`.

## Acceptance Criteria

- [ ] Pi does not need a mirrored `~/.pi/skills` tree to see Kernel skills.
- [ ] Any Pi-facing command templates are emitted to `~/.pi/agent/prompts`.
- [ ] Sync cleanup removes stale legacy Pi mirrors and leaves the canonical skill source intact.
- [ ] Tests and docs reflect the final host layout.

## Plan

- Update the Pi host adapter and sync renderer so skills are not duplicated into `~/.pi`.
- Emit command templates into `~/.pi/agent/prompts` instead of `~/.pi/commands`.
- Remove stale output paths during cleanup so old mirrors disappear after sync.
- Update tests to assert the new layout and keep the docs consistent with the supported discovery model.

## Checklist

- [x] Stop mirroring skills into `~/.pi` and keep `~/.agents/skills` as the canonical source
- [x] Route Pi command templates to `~/.pi/agent/prompts`
- [x] Remove stale `~/.pi/skills`, `~/.pi/commands`, and any obsolete Pi-specific mirrors from sync cleanup
- [x] Update sync tests and host documentation to reflect the supported Pi layout

## Linked Knowledge

- pi-resource-discovery-and-sync-layout

## Journal

- 2026-05-05T22:37:35.000Z: Created task `align-pi-sync-layout-with-documented-resources`.
- 2026-05-05T22:42:55.827Z: Completed checklist item: Stop mirroring skills into `~/.pi` and keep `~/.agents/skills` as the canonical source
- 2026-05-05T22:46:36.372Z: Completed checklist item: Route Pi command templates to `~/.pi/agent/prompts`
- 2026-05-05T22:46:54.181Z: Completed checklist item: Remove stale `~/.pi/skills`, `~/.pi/commands`, and any obsolete Pi-specific mirrors from sync cleanup
- 2026-05-05T22:47:21.359Z: Completed checklist item: Update sync tests and host documentation to reflect the supported Pi layout
