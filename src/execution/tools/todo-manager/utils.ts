import type { Todo, TodoPriority } from "./types";

export function generateTodoId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function validateTodoContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: "Content cannot be empty" };
  }

  if (content.length > 500) {
    return { valid: false, error: "Content exceeds maximum length of 500 characters" };
  }

  return { valid: true };
}

export function formatTodo(todo: Todo): string {
  let result = `Status: ${todo.status}\nPriority: ${todo.priority}`;

  if (todo.note) {
    result += `\nNote: ${todo.note}`;
  }

  if (todo.completed_at) {
    const completedDate = new Date(todo.completed_at);
    result += `\nCompleted: ${completedDate.toISOString()}`;
  }

  return result;
}

export function formatTodoList(todos: Todo[], sessionID: string): string {
  if (todos.length === 0) {
    return `No todos found for session ${sessionID}`;
  }

  let result = `Todos for session ${sessionID}:\n\n`;

  const priorityEmoji: Record<TodoPriority, string> = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🟢",
  };

  const statusEmoji: Record<string, string> = {
    pending: "○",
    in_progress: "◐",
    completed: "●",
    cancelled: "✕",
  };

  for (const todo of todos) {
    const priorityMark = priorityEmoji[todo.priority] || "○";
    const statusMark = statusEmoji[todo.status] || "○";

    result += `[${statusMark}] ${priorityMark} ${todo.id}\n`;
    result += `  ${todo.content}\n`;

    if (todo.note) {
      result += `  Note: ${todo.note}\n`;
    }

    if (todo.completed_at) {
      const completedDate = new Date(todo.completed_at);
      result += `  Completed: ${completedDate.toLocaleDateString()}\n`;
    }

    result += "\n";
  }

  // Summary
  const pending = todos.filter((t) => t.status === "pending").length;
  const inProgress = todos.filter((t) => t.status === "in_progress").length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const cancelled = todos.filter((t) => t.status === "cancelled").length;

  result += `---\n`;
  result += `Total: ${todos.length} | Pending: ${pending} | In Progress: ${inProgress} | Completed: ${completed} | Cancelled: ${cancelled}`;

  return result;
}
