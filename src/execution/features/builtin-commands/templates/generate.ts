export const GENERATE_COMMAND_TEMPLATE = `# Generate:Command Command

Create a new custom slash command following conventions and best practices.

## Goal

#$ARGUMENTS

## Key Capabilities to Leverage

**File Operations:**
- Read, Edit, Write - modify files precisely
- Glob, Grep - search codebase
- MultiEdit - atomic multi-part changes

**Development:**
- Bash - run commands (git, tests, linters)
- Task - launch specialized agents for complex tasks
- TodoWrite - track progress with todo lists

**Web & APIs:**
- WebFetch, WebSearch - research documentation
- GitHub (gh cli) - PRs, issues, reviews

## Required: YAML Frontmatter

EVERY command MUST start with YAML frontmatter:

\`\`\`yaml
---
name: command-name
description: Brief description of what this command does (max 100 chars)
argument-hint: "[what arguments the command accepts]"
---
\`\`\`

## Structure

1. **Description**: What the command does
2. **Prerequisites**: What's needed before running
3. **Process**: Step-by-step instructions
4. **Examples**: Usage examples

## Output

Create the command file in the appropriate directory with proper formatting.
`;

export const HEAL_SKILL_TEMPLATE = `# Heal:Skill Command

Fix incorrect SKILL.md files when a skill has wrong instructions or outdated API references.

## Process

### Step 1: Detect Skill

Identify the skill from conversation context:
- Look for skill invocation messages
- Check which SKILL.md was recently referenced
- Examine current task context

If unclear, ask the user.

### Step 2: Reflection and Analysis

Focus on what went wrong and how discovered the fix.

Determine:
- **What was wrong**: Quote specific sections from SKILL.md
- **Discovery method**: Context7, error messages, trial and error
- **Root cause**: Outdated API, incorrect parameters, wrong endpoint
- **Scope of impact**: Single section or multiple?
- **Proposed fix**: Which files, which sections

### Step 3: Present Proposed Changes

Present changes in this format:

\`\`\`
**Skill being healed:** [skill-name]
**Issue discovered:** [1-2 sentence summary]
**Root cause:** [brief explanation]
**Files affected:**
- [file1]
- [file2]

**Proposed changes:**
1. [change 1]
2. [change 2]
\`\`\`

### Step 4: Get Approval

Wait for user approval before making changes.

### Step 5: Apply Changes

Make the edits and optionally commit.
`;
