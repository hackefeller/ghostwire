import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import { existsSync } from "node:fs";
import { readFile, writeFile, unlink, readdir } from "node:fs/promises";
import { join } from "node:path";
import { TODO_DIR } from "./constants";
import type {
  Todo,
  TodoCreateArgs,
  TodoListArgs,
  TodoUpdateArgs,
  TodoDeleteArgs,
  TodoStatus,
  TodoPriority,
} from "./types";
import { generateTodoId, validateTodoContent, formatTodoList, formatTodo } from "./utils";
import { sessionExists } from "../session-manager/storage";

const VALID_STATUSES: TodoStatus[] = ["pending", "in_progress", "completed", "cancelled"];
const VALID_PRIORITIES: TodoPriority[] = ["low", "medium", "high", "critical"];

function isValidStatus(status: string): status is TodoStatus {
  return VALID_STATUSES.includes(status as TodoStatus);
}

function isValidPriority(priority: string): priority is TodoPriority {
  return VALID_PRIORITIES.includes(priority as TodoPriority);
}

// Helper to get todo file path
function getTodoFilePath(sessionID: string): string {
  return join(TODO_DIR, `${sessionID}.json`);
}

// Helper to read todos for a session
async function readTodos(sessionID: string): Promise<Todo[]> {
  const todoPath = getTodoFilePath(sessionID);

  if (!existsSync(todoPath)) {
    return [];
  }

  try {
    const content = await readFile(todoPath, "utf-8");
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      return data.map((item) => ({
        id: item.id || generateTodoId(),
        content: item.content || "",
        status: isValidStatus(item.status) ? item.status : "pending",
        priority: isValidPriority(item.priority) ? item.priority : "medium",
        note: item.note,
        created_at: item.created_at || Date.now(),
        updated_at: item.updated_at || Date.now(),
        completed_at: item.completed_at,
        session_id: sessionID,
      }));
    }
  } catch {
    // Return empty array on error
  }

  return [];
}

// Helper to write todos for a session
async function writeTodos(sessionID: string, todos: Todo[]): Promise<void> {
  if (!existsSync(TODO_DIR)) {
    return;
  }

  const todoPath = getTodoFilePath(sessionID);
  await writeFile(todoPath, JSON.stringify(todos, null, 2));
}

// Helper to find a todo by ID
async function findTodo(
  sessionID: string,
  todoID: string,
): Promise<{ todo: Todo | null; todos: Todo[]; index: number }> {
  const todos = await readTodos(sessionID);
  const index = todos.findIndex((t) => t.id === todoID);

  return {
    todo: index >= 0 ? todos[index] : null,
    todos,
    index,
  };
}

export const todo_create: ToolDefinition = tool({
  description: `Create a new todo item in a session.

Creates a todo task with content, priority, and optional notes. Todos are used to track work items and can trigger continuation prompts when incomplete.

Arguments:
- session_id (optional): Session ID (default: current session)
- content (required): Todo content/description (max 500 chars)
- priority (optional): Priority level - "low", "medium", "high", "critical" (default: "medium")
- note (optional): Additional notes (max 1000 chars)

Example:
todo_create(content="Review authentication module", priority="high", note="Check for SQL injection vulnerabilities")`,
  args: {
    session_id: tool.schema.string().optional().describe("Session ID (default: current session)"),
    content: tool.schema.string().describe("Todo content (max 500 characters)"),
    priority: tool.schema
      .enum(["low", "medium", "high", "critical"])
      .optional()
      .describe("Priority level (default: medium)"),
    note: tool.schema.string().optional().describe("Additional notes (max 1000 characters)"),
  },
  execute: async (args: TodoCreateArgs, context) => {
    try {
      const sessionID = args.session_id || context.sessionID;

      // Validate session exists
      if (!sessionExists(sessionID)) {
        return `Error: Session not found: ${sessionID}`;
      }

      // Validate content
      const contentValidation = validateTodoContent(args.content);
      if (!contentValidation.valid) {
        return `Error: ${contentValidation.error}`;
      }

      // Validate note length
      if (args.note && args.note.length > 1000) {
        return `Error: Note exceeds maximum length of 1000 characters`;
      }

      // Read existing todos
      const todos = await readTodos(sessionID);

      // Create new todo
      const newTodo: Todo = {
        id: generateTodoId(),
        content: args.content,
        status: "pending",
        priority: args.priority || "medium",
        note: args.note,
        created_at: Date.now(),
        updated_at: Date.now(),
        session_id: sessionID,
      };

      // Add to list
      todos.push(newTodo);

      // Write back
      await writeTodos(sessionID, todos);

      return `Created todo ${newTodo.id}\nContent: ${newTodo.content}\nPriority: ${newTodo.priority}\nStatus: ${newTodo.status}`;
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const todo_list: ToolDefinition = tool({
  description: `List todos in a session with optional filtering.

Returns all todos or filtered by status and priority. Use to check progress on tasks.

Arguments:
- session_id (optional): Session ID (default: current session)
- status (optional): Filter by status - "pending", "in_progress", "completed", "cancelled"
- priority (optional): Filter by priority - "low", "medium", "high", "critical"
- include_completed (optional): Include completed todos (default: true)

Example:
todo_list(status="pending", priority="high")
Lists all high-priority pending todos`,
  args: {
    session_id: tool.schema.string().optional().describe("Session ID (default: current session)"),
    status: tool.schema
      .enum(["pending", "in_progress", "completed", "cancelled"])
      .optional()
      .describe("Filter by status"),
    priority: tool.schema
      .enum(["low", "medium", "high", "critical"])
      .optional()
      .describe("Filter by priority"),
    include_completed: tool.schema
      .boolean()
      .optional()
      .describe("Include completed todos (default: true)"),
  },
  execute: async (args: TodoListArgs, context) => {
    try {
      const sessionID = args.session_id || context.sessionID;

      // Validate session exists
      if (!sessionExists(sessionID)) {
        return `Error: Session not found: ${sessionID}`;
      }

      // Read todos
      let todos = await readTodos(sessionID);

      // Apply filters
      if (args.status && isValidStatus(args.status)) {
        todos = todos.filter((t) => t.status === args.status);
      }

      if (args.priority && isValidPriority(args.priority)) {
        todos = todos.filter((t) => t.priority === args.priority);
      }

      if (args.include_completed === false) {
        todos = todos.filter((t) => t.status !== "completed" && t.status !== "cancelled");
      }

      // Sort by priority (high -> low) then creation time
      const priorityOrder: Record<TodoPriority, number> = {
        critical: 0,
        high: 1,
        medium: 2,
        low: 3,
      };
      todos.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.created_at - b.created_at;
      });

      return formatTodoList(todos, sessionID);
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const todo_update: ToolDefinition = tool({
  description: `Update an existing todo item.

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
Marks todo as completed`,
  args: {
    session_id: tool.schema.string().optional().describe("Session ID (default: current session)"),
    todo_id: tool.schema.string().describe("Todo ID to update"),
    content: tool.schema.string().optional().describe("New content (max 500 characters)"),
    status: tool.schema
      .enum(["pending", "in_progress", "completed", "cancelled"])
      .optional()
      .describe("New status"),
    priority: tool.schema
      .enum(["low", "medium", "high", "critical"])
      .optional()
      .describe("New priority"),
    note: tool.schema.string().optional().describe("New notes (max 1000 characters)"),
  },
  execute: async (args: TodoUpdateArgs, context) => {
    try {
      const sessionID = args.session_id || context.sessionID;

      // Validate session exists
      if (!sessionExists(sessionID)) {
        return `Error: Session not found: ${sessionID}`;
      }

      // Find todo
      const { todo, todos, index } = await findTodo(sessionID, args.todo_id);

      if (!todo) {
        return `Error: Todo not found: ${args.todo_id}`;
      }

      // Track if anything changed
      let updated = false;

      // Update content if provided
      if (args.content !== undefined && args.content !== todo.content) {
        const contentValidation = validateTodoContent(args.content);
        if (!contentValidation.valid) {
          return `Error: ${contentValidation.error}`;
        }
        todo.content = args.content;
        updated = true;
      }

      // Update status if provided
      if (args.status !== undefined && args.status !== todo.status) {
        if (!isValidStatus(args.status)) {
          return `Error: Invalid status: ${args.status}`;
        }

        const oldStatus = todo.status;
        todo.status = args.status;

        // Handle completed_at timestamp
        if (args.status === "completed" && oldStatus !== "completed") {
          todo.completed_at = Date.now();
        } else if (args.status !== "completed") {
          todo.completed_at = undefined;
        }

        updated = true;
      }

      // Update priority if provided
      if (args.priority !== undefined && args.priority !== todo.priority) {
        if (!isValidPriority(args.priority)) {
          return `Error: Invalid priority: ${args.priority}`;
        }
        todo.priority = args.priority;
        updated = true;
      }

      // Update note if provided
      if (args.note !== undefined && args.note !== todo.note) {
        if (args.note.length > 1000) {
          return `Error: Note exceeds maximum length of 1000 characters`;
        }
        todo.note = args.note;
        updated = true;
      }

      if (!updated) {
        return `No changes to apply to todo ${args.todo_id}`;
      }

      // Update timestamp
      todo.updated_at = Date.now();

      // Update in array
      todos[index] = todo;

      // Write back
      await writeTodos(sessionID, todos);

      return `Updated todo ${args.todo_id}\n${formatTodo(todo)}`;
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});

export const todo_delete: ToolDefinition = tool({
  description: `Delete a todo item from a session.

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
Deletes the todo`,
  args: {
    session_id: tool.schema.string().optional().describe("Session ID (default: current session)"),
    todo_id: tool.schema.string().describe("Todo ID to delete"),
    force: tool.schema
      .boolean()
      .optional()
      .describe("Force deletion even if in progress (default: false)"),
  },
  execute: async (args: TodoDeleteArgs, context) => {
    try {
      const sessionID = args.session_id || context.sessionID;
      const force = args.force || false;

      // Validate session exists
      if (!sessionExists(sessionID)) {
        return `Error: Session not found: ${sessionID}`;
      }

      // Find todo
      const { todo, todos, index } = await findTodo(sessionID, args.todo_id);

      if (!todo) {
        return `Error: Todo not found: ${args.todo_id}`;
      }

      // Safety check: don't delete in-progress todos without force
      if (todo.status === "in_progress" && !force) {
        return `Error: Cannot delete todo ${args.todo_id} - it is currently in progress. Use force=true to override or update status to "cancelled" instead.`;
      }

      // Remove from array
      todos.splice(index, 1);

      // Write back
      await writeTodos(sessionID, todos);

      return `Deleted todo ${args.todo_id}: ${todo.content}`;
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`;
    }
  },
});
