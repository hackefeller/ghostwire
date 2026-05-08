---
name: kernel-task-plan
kind: command
tags: [workflow, planning]
description: "[Advanced] Refresh a task's markdown file to update acceptance criteria and context. This is an advanced escape hatch; use `kernel plan` for primary planning."
group: workflow
target: task plan
argumentHint: optional task id
backedBySkill: kernel-plan
---

Use this as an advanced escape hatch to directly refresh `.kernel/work/tasks/active/<task-id>/task.md` when the task already exists but needs refinement.

For primary planning workflows, use `kernel plan` instead.

The task file is the durable planning surface: summary, context, acceptance criteria, plan, linked knowledge, and journal.
