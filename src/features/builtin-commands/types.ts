import type { CommandDefinition } from "../claude-code-command-loader"

export type BuiltinCommandName =
  | "init-deep"
  | "overclock-loop"
  | "cancel-overclock"
  | "ulw-overclock"
  | "refactor"
  | "jack-in-work"
  | "stop-continuation"
  | "grid:workflows:plan"
  | "grid:workflows:create"
  | "grid:workflows:status"
  | "grid:workflows:complete"
  | "grid:code:refactor"
  | "grid:code:review"
  | "grid:code:optimize"
  | "grid:code:format"
  | "grid:git:smart-commit"
  | "grid:git:branch"
  | "grid:git:merge"
  | "grid:git:cleanup"
  | "grid:project:init"
  | "grid:project:build"
  | "grid:project:deploy"
  | "grid:project:test"
  | "grid:util:clean"
  | "grid:util:backup"
  | "grid:util:restore"
  | "grid:util:doctor"
  | "grid:docs:deploy-docs"
  | "grid:docs:release-docs"
  | "grid:docs:feature-video"
  | "grid:docs:test-browser"

export interface BuiltinCommandConfig {
  disabled_commands?: BuiltinCommandName[]
}

export type BuiltinCommands = Record<string, CommandDefinition>
