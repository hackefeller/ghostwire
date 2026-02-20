export const CHANGELOG_TEMPLATE = `# Changelog Command

Create engaging changelogs for recent merges to main branch.

## Time Period

- For daily changelogs: Look at PRs merged in the last 24 hours
- For weekly summaries: Look at PRs merged in the last 7 days
- Default: Get the latest changes from the last day from the main branch

## Process

### 1. Get PR Information

Analyze the provided GitHub changes:
\`\`\`bash
gh pr list --state merged --limit 20
gh pr view [PR_NUMBER] --json title,body,files,mergedAt
\`\`\`

### 2. Analyze Changes

Look for:
1. New features that have been added
2. Bug fixes that have been implemented
3. Any other significant changes or improvements
4. References to specific issues and their details
5. Names of contributors who made the changes
6. Check PR labels to identify feature type (feature, bug, chore, etc.)
7. Look for breaking changes and highlight them prominently
8. Include PR numbers for traceability
9. Check if PRs are linked to issues and include issue context

### 3. Content Priorities

1. Breaking changes (if any) - MUST be at the top
2. User-facing features
3. Critical bug fixes
4. Performance improvements
5. Developer experience improvements
6. Documentation updates

### 4. Formatting

- Keep it concise and to the point
- Highlight the most important changes first
- Group similar changes together
- Include issue references where applicable
- Mention the names of contributors
- Add a touch of humor or playfulness
- Use emojis sparingly
- Keep total message under 2000 characters
`;
