---
name: kernel-goal-new
kind: command
tags: [workflow, planning]
description: "[Legacy] Create a strategic goal directly. For primary planning workflows, use `kernel plan` instead."
group: workflow
target: goal new
argumentHint: title
---

[Advanced] Create a goal directly without planning. For primary planning workflows, use `kernel plan` instead.

This creates `.kernel/work/goals/<goal-id>/goal.md` with frontmatter.
Use `--knowledge <ids>` to link existing knowledge records.
