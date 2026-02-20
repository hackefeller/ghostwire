export const TRIAGE_TEMPLATE = `# Triage Command

Triage and categorize findings for the CLI todo system.

## Process

### Step 1: Present Each Finding

Read all pending items and present each finding in this format:

\`\`\`
---
Issue #X: [Brief Title]

Severity: 🔴 P1 (CRITICAL) / 🟡 P2 (IMPORTANT) / 🔵 P3 (NICE-TO-HAVE)

Category: [Security/Performance/Architecture/Bug/Feature/etc.]

Description:
[Detailed explanation of the issue or improvement]

Location: [file_path:line_number]

Problem Scenario:
[Step by step what's wrong or could happen]

Proposed Solution:
[How to fix it]

Estimated Effort: [Small (< 2 hours) / Medium (2-8 hours) / Large (> 8 hours)]
---

Do you want to add this to the todo list?
1. yes - create todo file
2. next - skip this item
3. custom - modify before creating
\`\`\`

### Step 2: Handle User Decision

**When user says "yes":**
- Create or update todo file with proper YAML frontmatter
- Set status: ready
- Include all collected information

**When user says "next":**
- Move to next item

**When user says "custom":**
- Ask what modifications to make
- Then create/update the todo file
`;

export const PLAN_REVIEW_TEMPLATE = `# Plan:Review Command

Have multiple specialized agents review a plan in parallel.

## Process

### 1. Gather Plan Content

Read the plan file to understand what needs review.

### 2. Launch Parallel Review Agents

Run these agents in parallel:
1. Task reviewer-rails-dh(plan content)
2. Task reviewer-ruby(plan content)
3. Task reviewer-simplicity(plan content)

### 3. Synthesize Feedback

Combine all feedback into a coherent review summary with:
- Critical issues to address
- Suggestions for improvement
- Questions for clarification

### 4. Present to User

Show the synthesized review and ask what changes to make.
`;

export const LFG_TEMPLATE = `# LFG Command

Full autonomous engineering workflow - runs all steps in sequence.

## Workflow

Run these slash commands in order. Do not do anything else.

1. \`/ghostwire:resolve_pr_parallel\`
2. \`/ghostwire:resolve_todo_parallel --completion-promise "DONE"\`
3. \`/ghostwire:workflows:plan $ARGUMENTS\`
4. \`/ghostwire:workflows:create\`
5. \`/ghostwire:workflows:work\`
6. \`/ghostwire:workflows:review\`
7. \`/ghostwire:docs:test-browser\`
8. \`/ghostwire:docs:feature-video\`
9. Output \`<promise>DONE</promise>\` when video is in PR

Start with step 1 now.
`;
