export interface SessionMessage {
  id: string
  role: "user" | "assistant"
  agent?: string
  time?: {
    created: number
    updated?: number
  }
  parts: MessagePart[]
}

export interface MessagePart {
  id: string
  type: string
  text?: string
  thinking?: string
  tool?: string
  callID?: string
  input?: Record<string, unknown>
  output?: string
  error?: string
}

export interface SessionInfo {
  id: string
  message_count: number
  first_message?: Date
  last_message?: Date
  agents_used: string[]
  has_todos: boolean
  has_transcript: boolean
  todos?: TodoItem[]
  transcript_entries?: number
}

export interface TodoItem {
  id: string
  content: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority?: string
}

export interface SearchResult {
  session_id: string
  message_id: string
  role: string
  excerpt: string
  match_count: number
  timestamp?: number
}

export interface SessionMetadata {
  id: string
  version?: string
  projectID: string
  directory: string
  title?: string
  parentID?: string
  time: {
    created: number
    updated: number
  }
  summary?: {
    additions: number
    deletions: number
    files: number
  }
}

export interface SessionListArgs {
  limit?: number
  offset?: number
  from_date?: string
  to_date?: string
  project_path?: string
}

export interface SessionReadArgs {
  session_id: string
  include_todos?: boolean
  include_transcript?: boolean
  limit?: number
}

export interface SessionSearchArgs {
  query: string
  session_id?: string
  case_sensitive?: boolean
  limit?: number
}

export interface SessionInfoArgs {
  session_id: string
}

export interface SessionDeleteArgs {
  session_id: string
  cascade?: boolean
  force?: boolean
  archive_todos?: boolean
  reason?: string
}

/**
 * Authorization model for session CRUD operations
 * Implements owner-based access control with granular permissions
 */
export interface SessionPermissions {
  /** Agent identifier who created the session */
  owner: string
  /** Agent patterns with read access (supports wildcards like "agent:*") */
  read: string[]
  /** Agent patterns with write access */
  write: string[]
  /** Agent patterns with delete access */
  delete: string[]
}

/**
 * Extended session metadata with ownership and permission tracking
 */
export interface SessionMetadataExtended extends SessionMetadata {
  /** Who created this session */
  created_by: string
  /** Current permission settings */
  permissions: SessionPermissions
  /** Number of child sessions */
  child_count: number
  /** Number of todos in this session */
  todo_count: number
  /** Number of active background tasks */
  active_task_count: number
}

/**
 * Arguments for creating a new session
 */
export interface SessionCreateArgs {
  /** Session title */
  title: string
  /** Optional session description */
  description?: string
  /** Parent session ID (creates child session if provided) */
  parent_session_id?: string
  /** Initial prompt/message for the session */
  initial_prompt?: string
  /** Custom permissions (defaults to creator has full access) */
  permissions?: Partial<SessionPermissions>
}

/**
 * Arguments for updating a session
 */
export interface SessionUpdateArgs {
  /** Session ID to update */
  session_id: string
  /** New title (if updating) */
  title?: string
  /** New description (if updating) */
  description?: string
  /** Updated permissions */
  permissions?: Partial<SessionPermissions>
}

/**
 * Cascade behavior options for session deletion
 */
export enum CascadeBehavior {
  /** Reject delete if children exist (safest default) */
  REJECT_IF_CHILDREN = 'reject',
  /** Recursively delete all children */
  DELETE_CHILDREN = 'delete',
  /** Remove parent reference but keep children */
  ORPHAN_CHILDREN = 'orphan',
  /** Archive session instead of deleting */
  ARCHIVE_SESSION = 'archive'
}

/**
 * Event types for session lifecycle
 */
export enum SessionEventType {
  CREATED = 'session.created',
  UPDATED = 'session.updated',
  DELETED = 'session.deleted',
  ARCHIVED = 'session.archived'
}

/**
 * Session event payload
 */
export interface SessionEvent {
  type: SessionEventType | string
  session_id: string
  timestamp: Date
  actor: string
  metadata?: Record<string, unknown>
}
