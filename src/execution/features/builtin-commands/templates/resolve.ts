export const RESOLVE_PARALLEL_TEMPLATE = `# Resolve:Parallel Command

Resolve all TODO comments using parallel processing.

## Process

### 1. Analyze

Gather all TODO comments from the codebase:
- Search for TODO, FIXME, HACK comments
- Group by file and type
- Identify dependencies between items

### 2. Plan

Create a TodoWrite list of all unresolved items grouped by type.

Make sure to look at dependencies that might occur and prioritize the ones needed by others.

Output a mermaid flow diagram showing how we can do this:
- Can we do everything in parallel?
- Do we need to do one first that leads to others in parallel?

### 3. Implement (PARALLEL)

Spawn a resolver-pr agent for each unresolved item in parallel.

If there are 3 comments, spawn 3 resolver-pr agents in parallel:
1. Task resolver-pr(comment1)
2. Task resolver-pr(comment2)
3. Task resolver-pr(comment3)

### 4. Commit & Resolve

- Commit changes
- Push to remote
`;

export const RESOLVE_PR_PARALLEL_TEMPLATE = `# Resolve:PR Command

Resolve all PR comments using parallel processing.

## Prerequisites

Claude Code automatically detects and understands your git context:
- Current branch detection
- Associated PR context
- All PR comments and review threads
- Can work with any PR by specifying the PR number, or ask it.

## Process

### 1. Analyze

Get all unresolved comments for the PR:
\`\`\`bash
gh pr status
gh pr view [PR_NUMBER] --comments
\`\`\`

### 2. Plan

Create a TodoWrite list of all unresolved items grouped by type.

### 3. Implement (PARALLEL)

Spawn a resolver-pr agent for each unresolved item in parallel:

1. Task resolver-pr(comment1)
2. Task resolver-pr(comment2)
3. Task resolver-pr(comment3)

Always run all in parallel subagents/Tasks for each comment.

### 4. Commit & Resolve

- Commit changes with descriptive message
- Push to remote
- Mark PR threads as resolved (if using GitHub)

Last, verify all comments are resolved. If not, repeat the process.
`;

export const RESOLVE_TODO_PARALLEL_TEMPLATE = `# Resolve:TODO Command

Resolve all pending CLI todos using parallel processing.

## Process

### 1. Analyze

Get all unresolved TODOs from the todo system:
- Check for pending TODO items in todos/ directory
- Read each todo file for context

### 2. Plan

Create a TodoWrite list of all unresolved items grouped by type.

Make sure to look at dependencies that might occur and prioritize the ones needed by others.

Output a mermaid flow diagram showing how we can do this.

### 3. Implement (PARALLEL)

Spawn a resolver-pr agent for each unresolved item in parallel.

### 4. Commit & Resolve

- Commit changes
- Mark TODO as resolved in the todo file
- Push to remote
`;
