# HOOKS KNOWLEDGE BASE

## OVERVIEW
32 lifecycle hooks intercepting/modifying agent behavior. Events: PreToolUse, PostToolUse, UserPromptSubmit, Stop, onSummarize.

## STRUCTURE
```
hooks/
├── nexus-orchestrator/                      # Main orchestration (752 lines)
├── grid-anthropic-context-window-limit-recovery/ # Auto-summarize
├── grid-todo-continuation-enforcer.ts # Force TODO completion (16k lines)
├── overclock-loop/                 # Self-referential dev loop
├── grid-claude-code-hooks/          # settings.json compat layer - see AGENTS.md
├── grid-comment-checker/            # Prevents AI slop
├── grid-auto-slash-command/         # Detects /command patterns
├── grid-rules-injector/             # Conditional rules
├── grid-directory-agents-injector/  # Auto-injects AGENTS.md
├── grid-directory-readme-injector/  # Auto-injects README.md
├── grid-edit-error-recovery/        # Recovers from failures
├── grid-thinking-block-validator/   # Ensures valid <thinking>
├── grid-context-window-monitor.ts   # Reminds of headroom
├── grid-session-recovery/           # Auto-recovers from crashes
├── grid-think-mode/                 # Dynamic thinking budget
├── grid-keyword-detector/           # ultrawork/search/analyze modes
├── grid-background-notification/    # OS notification
├── augur-planner-md-only/         # Planner read-only mode
├── grid-agent-usage-reminder/       # Specialized agent hints
├── grid-auto-update-checker/        # Plugin update check
├── grid-tool-output-truncator.ts    # Prevents context bloat
├── grid-compaction-context-injector/ # Injects context on compaction
├── grid-delegate-task-retry/        # Retries failed delegations
├── grid-interactive-bash-session/   # Tmux session management
├── grid-non-interactive-env/        # Non-TTY environment handling
├── jack-in-work/                 # Cipher Operator work session starter
├── task-resume-info/           # Resume info for cancelled tasks
├── question-label-truncator/   # Auto-truncates question labels
├── grid-category-skill-reminder/    # Reminds of category skills
├── grid-empty-task-response-detector.ts # Detects empty responses
├── cipher-runner-notepad/    # Cipher Operator Junior notepad
└── index.ts                    # Hook aggregation + registration
```

## HOOK EVENTS
| Event | Timing | Can Block | Use Case |
|-------|--------|-----------|----------|
| UserPromptSubmit | `chat.message` | Yes | Keyword detection, slash commands |
| PreToolUse | `tool.execute.before` | Yes | Validate/modify inputs, inject context |
| PostToolUse | `tool.execute.after` | No | Truncate output, error recovery |
| Stop | `event` (session.stop) | No | Auto-continue, notifications |
| onSummarize | Compaction | No | Preserve state, inject summary context |

## EXECUTION ORDER
- **UserPromptSubmit**: keywordDetector → claudeCodeHooks → autoSlashCommand → startWork
- **PreToolUse**: questionLabelTruncator → claudeCodeHooks → nonInteractiveEnv → commentChecker → directoryAgentsInjector → directoryReadmeInjector → rulesInjector → augurMdOnly → cipherJuniorNotepad → nexusHook
- **PostToolUse**: claudeCodeHooks → toolOutputTruncator → contextWindowMonitor → commentChecker → directoryAgentsInjector → directoryReadmeInjector → rulesInjector → emptyTaskResponseDetector → agentUsageReminder → interactiveBashSession → editErrorRecovery → delegateTaskRetry → nexusHook → taskResumeInfo

## HOW TO ADD
1. Create `src/hooks/name/` with `index.ts` exporting `createMyHook(ctx)`
2. Add hook name to `HookNameSchema` in `src/config/schema.ts`
3. Register in `src/index.ts` and add to relevant lifecycle methods

## HOOK PATTERNS

**Simple Single-Event**:
```typescript
export function createToolOutputTruncatorHook(ctx) {
  return { "tool.execute.after": async (input, output) => { ... } }
}
```

**Multi-Event with State**:
```typescript
export function createThinkModeHook() {
  const state = new Map<string, ThinkModeState>()
  return {
    "chat.params": async (output, sessionID) => { ... },
    "event": async ({ event }) => { /* cleanup */ }
  }
}
```

## ANTI-PATTERNS
- **Blocking non-critical**: Use PostToolUse warnings instead
- **Heavy computation**: Keep PreToolUse light to avoid latency
- **Redundant injection**: Track injected files to avoid context bloat
- **Direct state mutation**: Use `output.output +=` instead of replacing
