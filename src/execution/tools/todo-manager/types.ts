export type TodoStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TodoPriority = "low" | "medium" | "high" | "critical";

export interface Todo {
  id: string;
  content: string;
  status: TodoStatus;
  priority: TodoPriority;
  note?: string;
  created_at: number;
  updated_at: number;
  completed_at?: number;
  session_id: string;
}

export interface TodoCreateArgs {
  session_id?: string;
  content: string;
  priority?: TodoPriority;
  note?: string;
}

export interface TodoListArgs {
  session_id?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  include_completed?: boolean;
}

export interface TodoUpdateArgs {
  session_id?: string;
  todo_id: string;
  content?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  note?: string;
}

export interface TodoDeleteArgs {
  session_id?: string;
  todo_id: string;
  force?: boolean;
}
