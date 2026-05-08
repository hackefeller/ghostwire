---
name: kernel-goal-plan
kind: command
tags: [workflow, planning]
description: "[Advanced] Refresh a goal's markdown file to update context and success criteria. This is an advanced escape hatch; use `kernel plan` for primary planning."
group: workflow
target: goal plan
argumentHint: optional goal id
backedBySkill: kernel-plan
---

Use this as an advanced escape hatch to directly refresh `.kernel/work/goals/<goal-id>/goal.md` when the goal already exists but needs refinement.

For primary planning workflows, use `kernel plan` instead.

Keep the goal file as the full human-readable record: context, success criteria, task groups, linked knowledge, and journal.
