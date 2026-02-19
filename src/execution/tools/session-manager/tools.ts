import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool"
import { existsSync } from "node:fs"
import { readFile, writeFile, unlink, readdir, rmdir } from "node:fs/promises"
import { readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import {
  SESSION_LIST_DESCRIPTION,
  SESSION_READ_DESCRIPTION,
  SESSION_SEARCH_DESCRIPTION,
  SESSION_INFO_DESCRIPTION,
  SESSION_CREATE_DESCRIPTION,
  SESSION_UPDATE_DESCRIPTION,
  SESSION_DELETE_DESCRIPTION,
} from "./constants"
import { getAllSessions, getMainSessions, getSessionInfo, readSessionMessages, readSessionTodos, sessionExists, getMessageDir } from "./storage"
import {
  filterSessionsByDate,
  formatSessionInfo,
  formatSessionList,
  formatSessionMessages,
  formatSearchResults,
  searchInSession,
} from "./utils"
import type { 
  SessionListArgs, 
  SessionReadArgs, 
  SessionSearchArgs, 
  SessionInfoArgs, 
  SessionCreateArgs,
  SessionUpdateArgs,
  SessionDeleteArgs,
  SearchResult,
  SessionMetadata,
  SessionEvent,
} from "./types"
import { SessionEventType } from "./types"
import { SESSION_STORAGE, MESSAGE_STORAGE, PART_STORAGE, TODO_DIR, TRANSCRIPT_DIR } from "./constants"

const SEARCH_TIMEOUT_MS = 60_000
const MAX_SESSIONS_TO_SCAN = 50

function withTimeout<T>(promise: Promise<T>, ms: number, operation: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)),
  ])
}

export const session_list: ToolDefinition = tool({
  description: SESSION_LIST_DESCRIPTION,
  args: {
    limit: tool.schema.number().optional().describe("Maximum number of sessions to return"),
    from_date: tool.schema.string().optional().describe("Filter sessions from this date (ISO 8601 format)"),
    to_date: tool.schema.string().optional().describe("Filter sessions until this date (ISO 8601 format)"),
    project_path: tool.schema.string().optional().describe("Filter sessions by project path (default: current working directory)"),
  },
  execute: async (args: SessionListArgs, _context) => {
    try {
      const directory = args.project_path ?? process.cwd()
      let sessions = await getMainSessions({ directory })
      let sessionIDs = sessions.map((s) => s.id)

      if (args.from_date || args.to_date) {
        sessionIDs = await filterSessionsByDate(sessionIDs, args.from_date, args.to_date)
      }

      if (args.limit && args.limit > 0) {
        sessionIDs = sessionIDs.slice(0, args.limit)
      }

      return await formatSessionList(sessionIDs)
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

export const session_read: ToolDefinition = tool({
  description: SESSION_READ_DESCRIPTION,
  args: {
    session_id: tool.schema.string().describe("Session ID to read"),
    include_todos: tool.schema.boolean().optional().describe("Include todo list if available (default: false)"),
    include_transcript: tool.schema.boolean().optional().describe("Include transcript log if available (default: false)"),
    limit: tool.schema.number().optional().describe("Maximum number of messages to return (default: all)"),
  },
  execute: async (args: SessionReadArgs, _context) => {
    try {
      if (!sessionExists(args.session_id)) {
        return `Session not found: ${args.session_id}`
      }

      let messages = await readSessionMessages(args.session_id)

      if (args.limit && args.limit > 0) {
        messages = messages.slice(0, args.limit)
      }

      const todos = args.include_todos ? await readSessionTodos(args.session_id) : undefined

      return formatSessionMessages(messages, args.include_todos, todos)
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

export const session_search: ToolDefinition = tool({
  description: SESSION_SEARCH_DESCRIPTION,
  args: {
    query: tool.schema.string().describe("Search query string"),
    session_id: tool.schema.string().optional().describe("Search within specific session only (default: all sessions)"),
    case_sensitive: tool.schema.boolean().optional().describe("Case-sensitive search (default: false)"),
    limit: tool.schema.number().optional().describe("Maximum number of results to return (default: 20)"),
  },
  execute: async (args: SessionSearchArgs, _context) => {
    try {
      const resultLimit = args.limit && args.limit > 0 ? args.limit : 20

      const searchOperation = async (): Promise<SearchResult[]> => {
        if (args.session_id) {
          return searchInSession(args.session_id, args.query, args.case_sensitive, resultLimit)
        }

        const allSessions = await getAllSessions()
        const sessionsToScan = allSessions.slice(0, MAX_SESSIONS_TO_SCAN)

        const allResults: SearchResult[] = []
        for (const sid of sessionsToScan) {
          if (allResults.length >= resultLimit) break

          const remaining = resultLimit - allResults.length
          const sessionResults = await searchInSession(sid, args.query, args.case_sensitive, remaining)
          allResults.push(...sessionResults)
        }

        return allResults.slice(0, resultLimit)
      }

      const results = await withTimeout(searchOperation(), SEARCH_TIMEOUT_MS, "Search")

      return formatSearchResults(results)
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

export const session_info: ToolDefinition = tool({
  description: SESSION_INFO_DESCRIPTION,
  args: {
    session_id: tool.schema.string().describe("Session ID to inspect"),
  },
  execute: async (args: SessionInfoArgs, _context) => {
    try {
      const info = await getSessionInfo(args.session_id)

      if (!info) {
        return `Session not found: ${args.session_id}`
      }

      return formatSessionInfo(info)
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

// Event emitter for session operations
const sessionEventListeners: Array<(event: SessionEvent) => void> = []

export function onSessionEvent(listener: (event: SessionEvent) => void): void {
  sessionEventListeners.push(listener)
}

export function emitSessionEvent(event: SessionEvent): void {
  for (const listener of sessionEventListeners) {
    try {
      listener(event)
    } catch {
      // Ignore listener errors
    }
  }
}

// Helper function to get session metadata file path
function getSessionMetadataPath(sessionID: string): string | null {
  if (!existsSync(SESSION_STORAGE)) return null

  try {
    const projectDirs = readdirSync(SESSION_STORAGE)
    for (const projectDir of projectDirs) {
      const projectPath = join(SESSION_STORAGE, projectDir)
      const sessionFile = join(projectPath, `${sessionID}.json`)
      if (existsSync(sessionFile)) {
        return sessionFile
      }
    }
  } catch {
    return null
  }

  return null
}

// Helper function to get all child sessions
async function getChildSessions(parentID: string): Promise<string[]> {
  const children: string[] = []
  
  if (!existsSync(SESSION_STORAGE)) return children

  try {
    const projectDirs = await readdir(SESSION_STORAGE, { withFileTypes: true })
    for (const projectDir of projectDirs) {
      if (!projectDir.isDirectory()) continue

      const projectPath = join(SESSION_STORAGE, projectDir.name)
      const sessionFiles = await readdir(projectPath)

      for (const file of sessionFiles) {
        if (!file.endsWith(".json")) continue

        try {
          const content = await readFile(join(projectPath, file), "utf-8")
          const meta = JSON.parse(content) as SessionMetadata

          if (meta.parentID === parentID) {
            children.push(meta.id)
          }
        } catch {
          continue
        }
      }
    }
  } catch {
    return children
  }

  return children
}

// Helper function to recursively delete a directory
async function deleteDirectoryRecursive(dirPath: string): Promise<void> {
  if (!existsSync(dirPath)) return

  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      if (entry.isDirectory()) {
        await deleteDirectoryRecursive(fullPath)
      } else {
        await unlink(fullPath)
      }
    }

    await rmdir(dirPath)
  } catch {
    // Ignore errors during cleanup
  }
}

export const session_create: ToolDefinition = tool({
  description: SESSION_CREATE_DESCRIPTION,
  args: {
    title: tool.schema.string().describe("Session title"),
    description: tool.schema.string().optional().describe("Session description"),
    parent_session_id: tool.schema.string().optional().describe("Parent session ID (creates child session)"),
    initial_prompt: tool.schema.string().optional().describe("Initial message/prompt for the session"),
  },
  execute: async (args: SessionCreateArgs, context) => {
    try {
      // Validate parent session if provided
      if (args.parent_session_id && !sessionExists(args.parent_session_id)) {
        return `Error: Parent session not found: ${args.parent_session_id}`
      }

      // Get directory from context or current working directory
      const directory = context.directory || process.cwd()

      // Use OpenCode client API to create session
      const client = (context as any).client
      if (!client?.session?.create) {
        return "Error: Session creation not available - client.session.create API not found"
      }

      const createResult = await client.session.create({
        body: {
          parentID: args.parent_session_id,
          title: args.title,
          permission: [
            { permission: "question", action: "deny" as const, pattern: "*" },
          ],
        },
        query: {
          directory,
        },
      })

      if (createResult.error) {
        return `Failed to create session: ${createResult.error}`
      }

      const sessionID = createResult.data.id

      // Emit event
      emitSessionEvent({
        type: SessionEventType.CREATED,
        session_id: sessionID,
        timestamp: new Date(),
        actor: "agent",
        metadata: {
          title: args.title,
          description: args.description,
          parent_id: args.parent_session_id,
        },
      })

      let result = `Created session ${sessionID}`
      if (args.parent_session_id) {
        result += ` (child of ${args.parent_session_id})`
      }
      if (args.title) {
        result += `\nTitle: ${args.title}`
      }

      return result
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

export const session_update: ToolDefinition = tool({
  description: SESSION_UPDATE_DESCRIPTION,
  args: {
    session_id: tool.schema.string().describe("Session ID to update"),
    title: tool.schema.string().optional().describe("New title"),
    description: tool.schema.string().optional().describe("New description"),
  },
  execute: async (args: SessionUpdateArgs, _context) => {
    try {
      // Find session metadata file
      const metadataPath = await getSessionMetadataPath(args.session_id)
      
      if (!metadataPath) {
        return `Error: Session not found: ${args.session_id}`
      }

      // Read current metadata
      const content = await readFile(metadataPath, "utf-8")
      const metadata = JSON.parse(content) as SessionMetadata

      // Track if any changes were made
      let updated = false

      // Update fields if provided
      if (args.title !== undefined && args.title !== metadata.title) {
        metadata.title = args.title
        updated = true
      }

      // Note: description is not part of SessionMetadata, but we could store it
      // in a separate file or extend the metadata. For now, we'll just update title.

      if (!updated) {
        return `No changes to apply to session ${args.session_id}`
      }

      // Update timestamp
      metadata.time.updated = Date.now()

      // Write back
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2))

      // Emit event
      emitSessionEvent({
        type: SessionEventType.UPDATED,
        session_id: args.session_id,
        timestamp: new Date(),
        actor: "agent",
        metadata: {
          title: args.title,
          description: args.description,
        },
      })

      return `Successfully updated session ${args.session_id}`
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})

export const session_delete: ToolDefinition = tool({
  description: SESSION_DELETE_DESCRIPTION,
  args: {
    session_id: tool.schema.string().describe("Session ID to delete"),
    cascade: tool.schema.boolean().optional().describe("If true, recursively delete child sessions (default: false)"),
    force: tool.schema.boolean().optional().describe("If true, bypass safety checks (default: false)"),
    archive_todos: tool.schema.boolean().optional().describe("If true, archive todos instead of deleting (default: true)"),
    reason: tool.schema.string().optional().describe("Reason for deletion (audit trail)"),
  },
  execute: async (args: SessionDeleteArgs, _context) => {
    try {
      const { session_id, cascade = false, force = false, archive_todos = true, reason } = args

      // Check if session exists
      if (!sessionExists(session_id)) {
        return `Error: Session not found: ${session_id}`
      }

      // Get child sessions
      const children = await getChildSessions(session_id)

      // Safety check: reject if children exist and cascade is false
      if (children.length > 0 && !cascade && !force) {
        return `Error: Session ${session_id} has ${children.length} child session(s). Use cascade=true to delete recursively or handle children first.`
      }

      // Delete children first if cascading
      if (cascade && children.length > 0) {
        for (const childID of children) {
          await session_delete.execute!({
            session_id: childID,
            cascade: true,
            force,
            archive_todos,
            reason: `Parent session ${session_id} deleted: ${reason || "Cascade delete"}`,
          }, _context)
        }
      }

      // Get directories to delete
      const messageDir = getMessageDir(session_id)
      const metadataPath = await getSessionMetadataPath(session_id)

      // Delete message directory
      if (messageDir) {
        await deleteDirectoryRecursive(messageDir)
      }

      // Delete parts for this session
      // Note: Parts are stored by message ID, so we'd need to find all messages first
      // For now, we'll skip this as orphaned parts will be cleaned up separately

      // Delete or archive todos
      if (existsSync(TODO_DIR)) {
        try {
          const todoFiles = await readdir(TODO_DIR)
          for (const file of todoFiles) {
            if (file.includes(session_id) && file.endsWith(".json")) {
              const todoPath = join(TODO_DIR, file)
              if (archive_todos) {
                // Rename to .archived.json instead of deleting
                const archivedPath = join(TODO_DIR, file.replace(".json", ".archived.json"))
                try {
                  await readFile(todoPath, "utf-8")
                    .then(content => writeFile(archivedPath, content))
                    .then(() => unlink(todoPath))
                } catch {
                  // Ignore archive errors
                }
              } else {
                await unlink(todoPath).catch(() => {})
              }
            }
          }
        } catch {
          // Ignore todo cleanup errors
        }
      }

      // Delete transcript
      if (existsSync(TRANSCRIPT_DIR)) {
        const transcriptPath = join(TRANSCRIPT_DIR, `${session_id}.jsonl`)
        if (existsSync(transcriptPath)) {
          await unlink(transcriptPath).catch(() => {})
        }
      }

      // Delete metadata file
      if (metadataPath) {
        await unlink(metadataPath)
      }

      // Emit event
      emitSessionEvent({
        type: SessionEventType.DELETED,
        session_id,
        timestamp: new Date(),
        actor: "agent",
        metadata: {
          reason,
          cascade,
          children_deleted: children.length,
        },
      })

      let result = `Successfully deleted session ${session_id}`
      if (children.length > 0 && cascade) {
        result += ` and ${children.length} child session(s)`
      }
      if (reason) {
        result += `\nReason: ${reason}`
      }

      return result
    } catch (e) {
      return `Error: ${e instanceof Error ? e.message : String(e)}`
    }
  },
})
