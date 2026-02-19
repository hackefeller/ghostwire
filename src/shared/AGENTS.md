# SHARED UTILITIES KNOWLEDGE BASE

## OVERVIEW
`src/shared` is utility-pure. It must only contain domain-agnostic primitives (logging, parsing, string/object transforms, file helpers, generic runtime helpers).

OpenCode- and Claude-specific modules were moved to explicit platform/domain layers:
- `src/platform/opencode/*`
- `src/platform/claude/*`
- `src/agents/*` (model policy/resolution)
- `src/config/*` (migration/permission-compat)

## STRUCTURE
```
shared/
├── tmux/                # Generic tmux helpers/types/constants
├── logger.ts            # Runtime logging
├── dynamic-truncator.ts # Token-aware truncation primitives
├── jsonc-parser.ts      # JSONC parsing
├── frontmatter.ts       # YAML frontmatter parsing
├── data-path.ts         # Generic XDG/data path helpers
├── deep-merge.ts        # Recursive merge utilities
├── case-insensitive.ts  # Case-insensitive lookup helpers
├── session-cursor.ts    # Session cursor primitives
├── system-directive.ts  # System directive formatting/parsing
├── command-executor.ts  # Shell command execution helper
└── index.ts             # Utility-only barrel export
```

## STRICT TOPOLOGY RULES
- Do not add OpenCode/Claude/platform-specific modules to `src/shared`.
- Do not import forbidden symbols from `src/shared` barrel:
  - `getOpenCodeConfigDir`, `getOpenCodeConfigPaths`, `getOpenCodeVersion`, `isOpenCodeVersionAtLeast`
  - `detectExternalNotificationPlugin`, `getNotificationConflictWarning`
  - `getClaudeConfigDir`, `isHookDisabled`
  - `fetchAvailableModels`, `isModelAvailable`, `resolveModelWithFallback`, `AGENT_MODEL_REQUIREMENTS`
  - `migrateAgentConfig`, `migrateConfigFile`, `migrateAgentConfigToCategory`
  - `getAgentToolRestrictions`
- CI enforces this via `bun run check:topology`.
