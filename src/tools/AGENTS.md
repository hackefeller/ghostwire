# TOOLS KNOWLEDGE BASE

## OVERVIEW

20+ tools: LSP (6), AST-Grep (2), Search (2), Session (7), Todo (4), Agent delegation (4), System (2), Skill (3).

## STRUCTURE

```
tools/
├── [tool-name]/
│   ├── index.ts      # Barrel export
│   ├── tools.ts      # ToolDefinition or factory
│   ├── types.ts      # Zod schemas
│   └── constants.ts  # Fixed values
├── lsp/              # 6 tools: definition, references, symbols, diagnostics, rename (client.ts 596 lines)
├── ast-grep/         # 2 tools: search, replace (25 languages)
├── delegate-task/    # Category-based routing (1070 lines)
├── session-manager/  # 7 tools: list, read, search, info, create, update, delete
├── todo-manager/     # 4 tools: create, list, update, delete
├── grep/             # Custom grep with timeout (60s, 10MB)
├── glob/             # 60s timeout, 100 file limit
├── interactive-bash/ # Tmux session management
├── look-at/          # Multimodal PDF/image
├── skill/            # Skill execution
├── skill-mcp/        # Skill MCP operations
├── slashcommand/     # Slash command dispatch
├── call-grid-agent/   # Direct agent invocation
└── background-task/  # background_output, background_cancel
```

## TOOL CATEGORIES

| Category | Tools | Pattern |
|----------|-------|---------|
| LSP | lsp_goto_definition, lsp_find_references, lsp_symbols, lsp_diagnostics, lsp_prepare_rename, lsp_rename | Direct |
| Search | ast_grep_search, ast_grep_replace, grep, glob | Direct |
| Session | session_list, session_read, session_search, session_info, session_create, session_update, session_delete | Direct |
| Todo | todo_create, todo_list, todo_update, todo_delete | Direct |
| Agent | delegate_task, call_grid_agent | Factory |
| Background | background_output, background_cancel | Factory |
| System | interactive_bash, look_at | Mixed |
| Skill | skill, skill_mcp, slashcommand | Factory |

## HOW TO ADD

1. Create `src/tools/[name]/` with standard files
2. Use `tool()` from `@opencode-ai/plugin/tool`
3. Export from `src/tools/index.ts`
4. Static tools → `builtinTools`, Factory → separate export

## TOOL PATTERNS

**Direct ToolDefinition**:
```typescript
export const grep: ToolDefinition = tool({
  description: "...",
  args: { pattern: tool.schema.string() },
  execute: async (args) => result,
})
```

**Factory Function** (context-dependent):
```typescript
export function createDelegateTask(ctx, manager): ToolDefinition {
  return tool({ execute: async (args) => { /* uses ctx */ } })
}
```

## NAMING

- **Tool names**: snake_case (`lsp_goto_definition`)
- **Functions**: camelCase (`createDelegateTask`)
- **Directories**: kebab-case (`delegate-task/`)

## SESSION CRUD OPERATIONS

Ghostwire provides full CRUD (Create, Read, Update, Delete) operations for OpenCode sessions, enabling agents to programmatically manage their workspace.

### Session Create

Creates a new session with optional parent-child relationship:

```typescript
const result = await session_create({
  title: "Security audit - auth module",
  description: "Analyze authentication flows",
  parent_session_id: "ses_parent123",  // Optional: creates child session
})
```

### Session Update

Updates session metadata:

```typescript
const result = await session_update({
  session_id: "ses_abc123",
  title: "Updated: Security audit",
  description: "Enhanced analysis scope",
})
```

### Session Delete

Deletes session with configurable cascade behavior:

```typescript
// Safe delete - rejects if children exist
const result = await session_delete({
  session_id: "ses_abc123",
})

// Cascade delete - removes children recursively
const result = await session_delete({
  session_id: "ses_abc123",
  cascade: true,
  reason: "Analysis complete",
})
```

### Cascade Behavior

| Option | Default | Description |
|--------|---------|-------------|
| `cascade` | `false` | If true, recursively delete child sessions |
| `force` | `false` | If true, bypass safety checks |
| `archive_todos` | `true` | If true, archive todos instead of deleting |

### Events

Session CRUD operations emit events that hooks can listen to:

```typescript
import { onSessionEvent } from "./tools"

onSessionEvent((event) => {
  if (event.type === "session.created") {
    console.log(`Session ${event.session_id} created`)
  }
})
```

Event types: `session.created`, `session.updated`, `session.deleted`, `session.archived`

## TODO CRUD OPERATIONS

Ghostwire provides full CRUD operations for managing todo items within sessions. Todos track work items and integrate with the todo-continuation-enforcer hook.

### Todo Create

Creates a new todo item:

```typescript
const result = await todo_create({
  content: "Review authentication module",
  priority: "high",
  note: "Check for SQL injection vulnerabilities",
})
```

### Todo List

Lists todos with optional filtering:

```typescript
const result = await todo_list({
  status: "pending",
  priority: "high",
})
```

### Todo Update

Updates todo status, priority, or content:

```typescript
const result = await todo_update({
  todo_id: "todo_123",
  status: "completed",
  note: "Fixed the issue",
})
```

### Todo Delete

Deletes a todo (use with caution):

```typescript
const result = await todo_delete({
  todo_id: "todo_123",
  force: true,  // Required for in-progress todos
})
```

### Priority Levels

- `critical` - 🔴 Critical
- `high` - 🟠 High  
- `medium` - 🟡 Medium (default)
- `low` - 🟢 Low

### Status Values

- `pending` - Not started
- `in_progress` - Currently being worked on
- `completed` - Finished
- `cancelled` - Cancelled/abandoned

## SKILL CRUD OPERATIONS

Ghostwire provides CRUD operations for managing skills. Skills are stored as SKILL.md files in project or user directories.

### Skill List

Lists all available skills with filtering by scope:

```typescript
const result = await skill_list({ scope: "builtin" })
// scope: "builtin" | "project" | "user" | "all" (default)
```

### Skill Create

Creates a new skill from a template:

```typescript
const result = await skill_create({
  name: "security-audit",
  description: "Analyze code for security vulnerabilities",
  template: "analysis",  // "agent" | "tool" | "analysis" | "hook"
  scope: "project",     // or "user"
})
```

### Skill Update

Updates skill metadata or content:

```typescript
const result = await skill_update({
  skill_name: "security-audit",
  description: "Enhanced security analysis",
  append: "\n## Additional Checks\n- Check for XSS vulnerabilities",
})
```

### Skill Delete

Deletes a custom skill (builtin skills are protected):

```typescript
const result = await skill_delete({
  skill_name: "old-skill",
})
```

### Builtin Skills

The following skills are protected and cannot be modified or deleted:
- `playwright`, `agent-browser`, `git-master`
- Any skill with `builtin:` prefix

## ANTI-PATTERNS

- **Sequential bash**: Use `&&` or delegation
- **Raw file ops**: Never mkdir/touch in tool logic
- **Sleep**: Use polling loops
