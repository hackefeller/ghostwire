import { join } from "node:path";
import { getClaudeConfigDir } from "../../../platform/claude/config-dir";

export const TODO_DIR = join(getClaudeConfigDir(), "todos");

export const TODO_CREATE_DESCRIPTION = `Create a new todo item in a session.

Creates a todo task with content, priority, and optional notes. Todos are used to track work items and can trigger continuation prompts when incomplete.

Arguments:
- session_id (optional): Session ID (default: current session)
- content (required): Todo content/description (max 500 chars)
- priority (optional): Priority level - "low", "medium", "high", "critical" (default: "medium")
- note (optional): Additional notes (max 1000 chars)

Example:
todo_create(content="Review authentication module", priority="high", note="Check for SQL injection vulnerabilities")`;

export const TODO_LIST_DESCRIPTION = `List todos in a session with optional filtering.

Returns all todos or filtered by status and priority. Use to check progress on tasks.

Arguments:
- session_id (optional): Session ID (default: current session)
- status (optional): Filter by status - "pending", "in_progress", "completed", "cancelled"
- priority (optional): Filter by priority - "low", "medium", "high", "critical"
- include_completed (optional): Include completed todos (default: true)

Example:
todo_list(status="pending", priority="high")
Lists all high-priority pending todos`;

export const TODO_UPDATE_DESCRIPTION = `Update an existing todo item.

Modifies todo content, status, priority, or notes. Automatically sets completed_at timestamp when status changes to "completed".

Arguments:
- session_id (optional): Session ID (default: current session)
- todo_id (required): Todo ID to update
- content (optional): New content (max 500 chars)
- status (optional): New status - "pending", "in_progress", "completed", "cancelled"
- priority (optional): New priority - "low", "medium", "high", "critical"
- note (optional): New or additional notes (max 1000 chars)

Status transitions:
- Any status can transition to any other status
- Changing to "completed" automatically sets completed_at timestamp
- Changing from "completed" clears completed_at timestamp

Example:
todo_update(todo_id="todo_123", status="completed")
Marks todo as completed`;

export const TODO_DELETE_DESCRIPTION = `Delete a todo item from a session.

Permanently removes a todo. Use with caution - deletion cannot be undone. Consider updating status to "cancelled" instead if you want to preserve history.

Arguments:
- session_id (optional): Session ID (default: current session)
- todo_id (required): Todo ID to delete
- force (optional): Force deletion even if in progress (default: false)

Safety behavior:
- By default, todos with status "in_progress" cannot be deleted (use force=true to override)
- Consider using status="cancelled" instead of deletion for audit trail

Example:
todo_delete(todo_id="todo_123")
Deletes the todo`;
